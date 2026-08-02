using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;
using OzmenZimparaMarket.Application.DTOs.KategoriDtos;
using OzmenZimparaMarket.Application.Interfaces;
using OzmenZimparaMarket.Domain.Entityler;
using OzmenZimparaMarket.Infrastructure.Veritabani;

namespace OzmenZimparaMarket.Infrastructure.Servisler;

public class KategoriServisi : IKategoriServisi
{
    private readonly OzmenZimparaMarketDbContext _dbContext;
    private readonly IHtmlTemizlemeServisi _htmlTemizlemeServisi;

    public KategoriServisi(OzmenZimparaMarketDbContext dbContext, IHtmlTemizlemeServisi htmlTemizlemeServisi)
    {
        _dbContext = dbContext;
        _htmlTemizlemeServisi = htmlTemizlemeServisi;
    }

    public async Task<IReadOnlyList<KategoriListeDto>> TumunuGetirAsync(bool sadeceAktifler = false, CancellationToken cancellationToken = default)
    {
        var sorgu = _dbContext.Kategoriler.AsNoTracking().AsQueryable();

        if (sadeceAktifler) sorgu = sorgu.Where(x => x.AktifMi);

        return await sorgu
            .OrderBy(x => x.SiraNo)
            .ThenBy(x => x.KategoriAdi)
            .Select(x => new KategoriListeDto
            {
                Id = x.Id,
                UstKategoriId = x.UstKategoriId,
                KategoriAdi = x.KategoriAdi,
                Aciklama = x.Aciklama,
                GorselYolu = x.GorselYolu,
                SeoUrl = x.SeoUrl,
                SeoBasligi = x.SeoBasligi,
                SeoAciklamasi = x.SeoAciklamasi,
                AnaSayfadaGosterilsinMi = x.AnaSayfadaGosterilsinMi,
                SiraNo = x.SiraNo,
                AktifMi = x.AktifMi,
                OlusturmaTarihi = x.OlusturmaTarihi,
                GuncellemeTarihi = x.GuncellemeTarihi
            })
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<KategoriListeDto>> AgaciGetirAsync(bool sadeceAktifler = true, CancellationToken cancellationToken = default)
    {
        var sorgu = _dbContext.Kategoriler.AsNoTracking().AsQueryable();

        if (sadeceAktifler) sorgu = sorgu.Where(x => x.AktifMi);

        var kategoriler = await sorgu.OrderBy(x => x.SiraNo).ThenBy(x => x.KategoriAdi).ToListAsync(cancellationToken);
        var dtoSozlugu = kategoriler.ToDictionary(x => x.Id, DtoyaDonustur);

        foreach (var kategori in kategoriler)
        {
            if (!kategori.UstKategoriId.HasValue) continue;
            if (!dtoSozlugu.TryGetValue(kategori.UstKategoriId.Value, out var ustKategoriDto)) continue;

            ustKategoriDto.AltKategoriler.Add(dtoSozlugu[kategori.Id]);
        }

        var kokKategoriler = kategoriler
            .Where(x => !x.UstKategoriId.HasValue)
            .OrderBy(x => x.SiraNo)
            .ThenBy(x => x.KategoriAdi)
            .Select(x => dtoSozlugu[x.Id])
            .ToList();

        AltKategorileriSirala(kokKategoriler);

        return kokKategoriler;
    }

    public async Task<KategoriListeDto?> IdIleGetirAsync(int id, CancellationToken cancellationToken = default)
    {
        var kategori = await _dbContext.Kategoriler.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        return kategori is null ? null : DtoyaDonustur(kategori);
    }

    public async Task<KategoriListeDto?> SeoUrlIleGetirAsync(string seoUrl, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(seoUrl)) return null;

        var temizSeoUrl = seoUrl.Trim().ToLowerInvariant();

        var kategori = await _dbContext.Kategoriler
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.SeoUrl == temizSeoUrl && x.AktifMi, cancellationToken);

        return kategori is null ? null : DtoyaDonustur(kategori);
    }

    public async Task<KategoriListeDto> EkleAsync(KategoriEkleDto dto, CancellationToken cancellationToken = default)
    {
        await UstKategoriyiDogrulaAsync(dto.UstKategoriId, cancellationToken);

        var kategoriAdi = dto.KategoriAdi.Trim();
        var seoUrl = SeoUrlOlustur(string.IsNullOrWhiteSpace(dto.SeoUrl) ? kategoriAdi : dto.SeoUrl);

        if (await SeoUrlKullaniliyorMuAsync(seoUrl, null, cancellationToken)) throw new InvalidOperationException("Bu SEO URL başka bir kategori tarafından kullanılıyor.");

        var kategori = new Kategori
        {
            UstKategoriId = dto.UstKategoriId,
            KategoriAdi = kategoriAdi,
            Aciklama = _htmlTemizlemeServisi.Temizle(dto.Aciklama),
            GorselYolu = Temizle(dto.GorselYolu),
            SeoUrl = seoUrl,
            SeoBasligi = await SeoBasligiOlusturAsync(kategoriAdi, dto.SeoBasligi, cancellationToken),
            SeoAciklamasi = SeoAciklamasiOlustur(dto.SeoAciklamasi, dto.Aciklama),
            AnaSayfadaGosterilsinMi = dto.AnaSayfadaGosterilsinMi,
            SiraNo = dto.SiraNo,
            AktifMi = dto.AktifMi,
            OlusturmaTarihi = DateTime.UtcNow
        };

        await _dbContext.Kategoriler.AddAsync(kategori, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return DtoyaDonustur(kategori);
    }

    public async Task<KategoriListeDto> GuncelleAsync(int id, KategoriGuncelleDto dto, CancellationToken cancellationToken = default)
    {
        var kategori = await _dbContext.Kategoriler.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        if (kategori is null) throw new KeyNotFoundException("Güncellenecek kategori bulunamadı.");
        if (dto.UstKategoriId == id) throw new InvalidOperationException("Bir kategori kendisinin üst kategorisi olamaz.");

        await UstKategoriyiDogrulaAsync(dto.UstKategoriId, cancellationToken);

        if (await KategoriDongusuOlusurMuAsync(id, dto.UstKategoriId, cancellationToken)) throw new InvalidOperationException("Bu üst kategori seçimi kategori ağacında döngü oluşturur.");

        var kategoriAdi = dto.KategoriAdi.Trim();
        var seoUrl = SeoUrlOlustur(string.IsNullOrWhiteSpace(dto.SeoUrl) ? kategoriAdi : dto.SeoUrl);

        if (await SeoUrlKullaniliyorMuAsync(seoUrl, id, cancellationToken)) throw new InvalidOperationException("Bu SEO URL başka bir kategori tarafından kullanılıyor.");

        kategori.UstKategoriId = dto.UstKategoriId;
        kategori.KategoriAdi = kategoriAdi;
        kategori.Aciklama = _htmlTemizlemeServisi.Temizle(dto.Aciklama);
        kategori.GorselYolu = Temizle(dto.GorselYolu);
        kategori.SeoUrl = seoUrl;
        kategori.SeoBasligi = await SeoBasligiOlusturAsync(kategoriAdi, dto.SeoBasligi, cancellationToken);
        kategori.SeoAciklamasi = SeoAciklamasiOlustur(dto.SeoAciklamasi, dto.Aciklama);
        kategori.AnaSayfadaGosterilsinMi = dto.AnaSayfadaGosterilsinMi;
        kategori.SiraNo = dto.SiraNo;
        kategori.AktifMi = dto.AktifMi;
        kategori.GuncellemeTarihi = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);

        return DtoyaDonustur(kategori);
    }

    public async Task SilAsync(int id, CancellationToken cancellationToken = default)
    {
        var kategori = await _dbContext.Kategoriler.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        if (kategori is null) throw new KeyNotFoundException("Silinecek kategori bulunamadı.");

        var altKategoriVarMi = await _dbContext.Kategoriler.AsNoTracking().AnyAsync(x => x.UstKategoriId == id, cancellationToken);
        if (altKategoriVarMi) throw new InvalidOperationException("Alt kategorileri bulunan kategori silinemez. Önce alt kategorileri kaldırın veya kategoriyi pasife alın.");

        var urunVarMi = await _dbContext.Urunler.AsNoTracking().AnyAsync(x => x.KategoriId == id, cancellationToken);
        if (urunVarMi) throw new InvalidOperationException("Ürünleri bulunan kategori silinemez. Önce ürünleri başka kategoriye taşıyın veya kategoriyi pasife alın.");

        _dbContext.Kategoriler.Remove(kategori);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task<KategoriListeDto> DurumDegistirAsync(int id, bool aktifMi, CancellationToken cancellationToken = default)
    {
        var kategori = await _dbContext.Kategoriler.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        if (kategori is null) throw new KeyNotFoundException("Kategori bulunamadı.");

        kategori.AktifMi = aktifMi;
        kategori.GuncellemeTarihi = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);

        return DtoyaDonustur(kategori);
    }

    private async Task UstKategoriyiDogrulaAsync(int? ustKategoriId, CancellationToken cancellationToken)
    {
        if (!ustKategoriId.HasValue) return;

        var kategoriVarMi = await _dbContext.Kategoriler.AsNoTracking().AnyAsync(x => x.Id == ustKategoriId.Value, cancellationToken);

        if (!kategoriVarMi) throw new KeyNotFoundException("Seçilen üst kategori bulunamadı.");
    }

    private async Task<bool> KategoriDongusuOlusurMuAsync(int kategoriId, int? yeniUstKategoriId, CancellationToken cancellationToken)
    {
        if (!yeniUstKategoriId.HasValue) return false;

        var kategoriBaglantilari = await _dbContext.Kategoriler
            .AsNoTracking()
            .Select(x => new { x.Id, x.UstKategoriId })
            .ToDictionaryAsync(x => x.Id, x => x.UstKategoriId, cancellationToken);

        var ziyaretEdilenler = new HashSet<int>();
        var mevcutKategoriId = yeniUstKategoriId;

        while (mevcutKategoriId.HasValue)
        {
            if (mevcutKategoriId.Value == kategoriId) return true;
            if (!ziyaretEdilenler.Add(mevcutKategoriId.Value)) return true;
            if (!kategoriBaglantilari.TryGetValue(mevcutKategoriId.Value, out var sonrakiUstKategoriId)) break;

            mevcutKategoriId = sonrakiUstKategoriId;
        }

        return false;
    }

    private async Task<bool> SeoUrlKullaniliyorMuAsync(string seoUrl, int? haricKategoriId, CancellationToken cancellationToken)
    {
        var sorgu = _dbContext.Kategoriler.AsNoTracking().Where(x => x.SeoUrl == seoUrl);

        if (haricKategoriId.HasValue) sorgu = sorgu.Where(x => x.Id != haricKategoriId.Value);

        return await sorgu.AnyAsync(cancellationToken);
    }

    private async Task<string> SeoBasligiOlusturAsync(string kategoriAdi, string? seoBasligi, CancellationToken cancellationToken)
    {
        if (!string.IsNullOrWhiteSpace(seoBasligi)) return seoBasligi.Trim();

        var sirketAdi = await _dbContext.FirmaGenelBilgileri
            .AsNoTracking()
            .Where(x => x.Id == 1)
            .Select(x => x.SirketAdi)
            .FirstOrDefaultAsync(cancellationToken);

        return string.IsNullOrWhiteSpace(sirketAdi) ? kategoriAdi : $"{kategoriAdi} | {sirketAdi}";
    }

    private static string? SeoAciklamasiOlustur(string? seoAciklamasi, string? aciklama)
    {
        if (!string.IsNullOrWhiteSpace(seoAciklamasi)) return seoAciklamasi.Trim();
        return Temizle(aciklama);
    }

    private static string SeoUrlOlustur(string metin)
    {
        var turkceKarakterleriDuzenlenmisMetin = metin
            .Trim()
            .Replace("ı", "i")
            .Replace("İ", "i")
            .Replace("ş", "s")
            .Replace("Ş", "s")
            .Replace("ğ", "g")
            .Replace("Ğ", "g")
            .Replace("ü", "u")
            .Replace("Ü", "u")
            .Replace("ö", "o")
            .Replace("Ö", "o")
            .Replace("ç", "c")
            .Replace("Ç", "c")
            .ToLowerInvariant()
            .Normalize(NormalizationForm.FormD);

        var sonuc = new StringBuilder();

        foreach (var karakter in turkceKarakterleriDuzenlenmisMetin)
        {
            if (CharUnicodeInfo.GetUnicodeCategory(karakter) != UnicodeCategory.NonSpacingMark) sonuc.Append(karakter);
        }

        var seoUrl = Regex.Replace(sonuc.ToString().Normalize(NormalizationForm.FormC), @"[^a-z0-9]+", "-").Trim('-');

        if (string.IsNullOrWhiteSpace(seoUrl)) throw new InvalidOperationException("Kategori için geçerli bir SEO URL oluşturulamadı.");

        return seoUrl;
    }

    private static string? Temizle(string? deger)
    {
        return string.IsNullOrWhiteSpace(deger) ? null : deger.Trim();
    }

    private static void AltKategorileriSirala(List<KategoriListeDto> kategoriler)
    {
        kategoriler.Sort((sol, sag) =>
        {
            var siraKarsilastirmasi = sol.SiraNo.CompareTo(sag.SiraNo);
            return siraKarsilastirmasi != 0 ? siraKarsilastirmasi : string.Compare(sol.KategoriAdi, sag.KategoriAdi, StringComparison.CurrentCultureIgnoreCase);
        });

        foreach (var kategori in kategoriler) AltKategorileriSirala(kategori.AltKategoriler);
    }

    private static KategoriListeDto DtoyaDonustur(Kategori kategori)
    {
        return new KategoriListeDto
        {
            Id = kategori.Id,
            UstKategoriId = kategori.UstKategoriId,
            KategoriAdi = kategori.KategoriAdi,
            Aciklama = kategori.Aciklama,
            GorselYolu = kategori.GorselYolu,
            SeoUrl = kategori.SeoUrl,
            SeoBasligi = kategori.SeoBasligi,
            SeoAciklamasi = kategori.SeoAciklamasi,
            AnaSayfadaGosterilsinMi = kategori.AnaSayfadaGosterilsinMi,
            SiraNo = kategori.SiraNo,
            AktifMi = kategori.AktifMi,
            OlusturmaTarihi = kategori.OlusturmaTarihi,
            GuncellemeTarihi = kategori.GuncellemeTarihi
        };
    }
}