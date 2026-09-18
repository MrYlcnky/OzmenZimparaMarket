using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using OzmenZimparaMarket.Application.DTOs.KategoriDtos;
using OzmenZimparaMarket.Application.Interfaces;
using OzmenZimparaMarket.Application.Istisnalar;
using OzmenZimparaMarket.Domain.Entityler;
using OzmenZimparaMarket.Infrastructure.Veritabani;

namespace OzmenZimparaMarket.Infrastructure.Servisler;

public class KategoriServisi : IKategoriServisi
{
    private readonly OzmenZimparaMarketDbContext _dbContext;
    private readonly IHtmlTemizlemeServisi _htmlTemizlemeServisi;
    private readonly IDosyaServisi _dosyaServisi;
    private readonly ILogger<KategoriServisi> _logger;

    public KategoriServisi(
        OzmenZimparaMarketDbContext dbContext,
        IHtmlTemizlemeServisi htmlTemizlemeServisi,
        IDosyaServisi dosyaServisi,
        ILogger<KategoriServisi> logger)
    {
        _dbContext = dbContext;
        _htmlTemizlemeServisi = htmlTemizlemeServisi;
        _dosyaServisi = dosyaServisi;
        _logger = logger;
    }

    public async Task<IReadOnlyList<KategoriListeDto>> TumunuGetirAsync(bool sadeceAktifler = false, CancellationToken cancellationToken = default)
    {
        var sorgu = _dbContext.Kategoriler.AsNoTracking().AsQueryable();

        if (sadeceAktifler)
        {
            var etkinAktifKategoriIdleri = await EtkinAktifKategoriIdleriniGetirAsync(cancellationToken);
            sorgu = sorgu.Where(x => etkinAktifKategoriIdleri.Contains(x.Id));
        }

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

        if (sadeceAktifler)
        {
            var etkinAktifKategoriIdleri = await EtkinAktifKategoriIdleriniGetirAsync(cancellationToken);
            sorgu = sorgu.Where(x => etkinAktifKategoriIdleri.Contains(x.Id));
        }

        var kategoriler = await sorgu
            .OrderBy(x => x.SiraNo)
            .ThenBy(x => x.KategoriAdi)
            .ToListAsync(cancellationToken);

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
        var kategori = await _dbContext.Kategoriler
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        return kategori is null ? null : DtoyaDonustur(kategori);
    }

    public async Task<KategoriListeDto?> SeoUrlIleGetirAsync(string seoUrl, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(seoUrl)) return null;

        var temizSeoUrl = seoUrl.Trim().ToLowerInvariant();
        var etkinAktifKategoriIdleri = await EtkinAktifKategoriIdleriniGetirAsync(cancellationToken);

        var kategori = await _dbContext.Kategoriler
            .AsNoTracking()
            .FirstOrDefaultAsync(
                x => x.SeoUrl == temizSeoUrl && etkinAktifKategoriIdleri.Contains(x.Id),
                cancellationToken);

        return kategori is null ? null : DtoyaDonustur(kategori);
    }

    public async Task<KategoriListeDto?> SeoYoluIleGetirAsync(string seoYolu, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(seoYolu))
            return null;

        var seoParcalari = seoYolu
            .Split('/', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .Select(x => x.ToLowerInvariant())
            .ToArray();

        if (seoParcalari.Length == 0)
            return null;

        if (seoParcalari.Any(x => string.IsNullOrWhiteSpace(x) || x.Length > 250))
            return null;

        var kategoriler = await _dbContext.Kategoriler
            .AsNoTracking()
            .Where(x => x.AktifMi && seoParcalari.Contains(x.SeoUrl))
            .ToListAsync(cancellationToken);

        int? ustKategoriId = null;
        Kategori? bulunanKategori = null;

        foreach (var seoParcasi in seoParcalari)
        {
            bulunanKategori = kategoriler.FirstOrDefault(x =>
                x.UstKategoriId == ustKategoriId &&
                x.SeoUrl == seoParcasi);

            if (bulunanKategori is null)
                return null;

            ustKategoriId = bulunanKategori.Id;
        }

        return bulunanKategori is null
            ? null
            : DtoyaDonustur(bulunanKategori);
    }

    public async Task<KategoriListeDto> EkleAsync(KategoriEkleDto dto, CancellationToken cancellationToken = default)
    {
        await UstKategoriyiDogrulaAsync(dto.UstKategoriId, cancellationToken);

        var kategoriAdi = dto.KategoriAdi.Trim();
        var seoUrl = SeoUrlOlustur(string.IsNullOrWhiteSpace(dto.SeoUrl) ? kategoriAdi : dto.SeoUrl);

        if (await SeoUrlKullaniliyorMuAsync(seoUrl, null, cancellationToken))
            throw new CakismaException("Bu SEO URL başka bir kategori tarafından kullanılıyor.");

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
        var kategori = await _dbContext.Kategoriler
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        if (kategori is null)
            throw new KaynakBulunamadiException("Güncellenecek kategori bulunamadı.");

        var eskiGorselYolu = kategori.GorselYolu;
        var yeniGorselYolu = Temizle(dto.GorselYolu);

        if (dto.UstKategoriId == id)
            throw new IsKuraliException("Bir kategori kendisinin üst kategorisi olamaz.");

        await UstKategoriyiDogrulaAsync(dto.UstKategoriId, cancellationToken);

        if (await KategoriDongusuOlusurMuAsync(id, dto.UstKategoriId, cancellationToken))
            throw new IsKuraliException("Bu üst kategori seçimi kategori ağacında döngü oluşturur.");

        var kategoriAdi = dto.KategoriAdi.Trim();
        var seoUrl = SeoUrlOlustur(string.IsNullOrWhiteSpace(dto.SeoUrl) ? kategoriAdi : dto.SeoUrl);

        if (await SeoUrlKullaniliyorMuAsync(seoUrl, id, cancellationToken))
            throw new CakismaException("Bu SEO URL başka bir kategori tarafından kullanılıyor.");

        kategori.UstKategoriId = dto.UstKategoriId;
        kategori.KategoriAdi = kategoriAdi;
        kategori.Aciklama = _htmlTemizlemeServisi.Temizle(dto.Aciklama);
        kategori.GorselYolu = yeniGorselYolu;
        kategori.SeoUrl = seoUrl;
        kategori.SeoBasligi = await SeoBasligiOlusturAsync(kategoriAdi, dto.SeoBasligi, cancellationToken);
        kategori.SeoAciklamasi = SeoAciklamasiOlustur(dto.SeoAciklamasi, dto.Aciklama);
        kategori.AnaSayfadaGosterilsinMi = dto.AnaSayfadaGosterilsinMi;
        kategori.SiraNo = dto.SiraNo;
        kategori.AktifMi = dto.AktifMi;
        kategori.GuncellemeTarihi = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);

        if (!string.Equals(eskiGorselYolu, yeniGorselYolu, StringComparison.OrdinalIgnoreCase))
            await KullanilmayanKategoriGorseliniSilAsync(eskiGorselYolu);

        return DtoyaDonustur(kategori);
    }

    public async Task<KategoriTopluSilSonucDto> TopluSilAsync( KategoriTopluSilDto dto, CancellationToken cancellationToken = default)
    {
        if (dto.IdListesi is null || dto.IdListesi.Count == 0)
            throw new IsKuraliException("Silinecek en az bir kategori seçilmelidir.");

        if (dto.IdListesi.Any(x => x <= 0))
            throw new IsKuraliException("Kategori ID değerleri pozitif tam sayı olmalıdır.");

        var istenenIdler = dto.IdListesi
            .Distinct()
            .ToList();

        var sonuc = new KategoriTopluSilSonucDto
        {
            IstenenKayitSayisi = istenenIdler.Count
        };

        /*
         * Bütün kategori ağacını alıyoruz.
         *
         * Bunun nedeni sadece seçilen kategorileri değil,
         * seçilmemiş alt kategorileri de görebilmek.
         */
        var tumKategoriler = await _dbContext.Kategoriler
            .ToListAsync(cancellationToken);

        var kategoriSozlugu = tumKategoriler
            .ToDictionary(x => x.Id);

        var seciliKategoriIdleri = istenenIdler
            .Where(kategoriSozlugu.ContainsKey)
            .ToHashSet();

        /*
         * İstenen fakat veritabanında bulunmayan
         * kayıtları sonuçta bildiriyoruz.
         */
        foreach (var id in istenenIdler)
        {
            if (kategoriSozlugu.ContainsKey(id))
                continue;

            sonuc.Hatalar.Add(
                new KategoriTopluSilHataDto
                {
                    Id = id,
                    KategoriAdi = null,
                    Mesaj = "Silinecek kategori bulunamadı."
                });
        }

        /*
         * Seçilen kategoriler arasında ürün barındıranları
         * tek sorguyla tespit ediyoruz.
         */
        var urunluKategoriIdListesi = await _dbContext.Urunler
            .AsNoTracking()
            .Where(x => seciliKategoriIdleri.Contains(x.KategoriId))
            .Select(x => x.KategoriId)
            .Distinct()
            .ToListAsync(cancellationToken);

        var urunluKategoriIdleri = urunluKategoriIdListesi
            .ToHashSet();

        /*
         * Parent -> Child ilişkilerini çıkarıyoruz.
         */
        var altKategoriSozlugu = tumKategoriler
            .Where(x => x.UstKategoriId.HasValue)
            .GroupBy(x => x.UstKategoriId!.Value)
            .ToDictionary(
                x => x.Key,
                x => x
                    .Select(kategori => kategori.Id)
                    .ToList());

        /*
         * Her seçili kategori için silinebilir / silinemez
         * bilgisini tutacağız.
         *
         * En derindeki kategoriden yukarı çıkacağımız için
         * parent kategori değerlendirilirken children sonucu
         * daha önceden hesaplanmış olacak.
         */
        var silinebilirlikDurumlari = new Dictionary<int, bool>();

        var siraliSeciliKategoriler = seciliKategoriIdleri
            .Select(id => kategoriSozlugu[id])
            .OrderByDescending(kategori =>
                KategoriDerinliginiGetir(
                    kategori,
                    kategoriSozlugu))
            .ThenBy(x => x.Id)
            .ToList();

        foreach (var kategori in siraliSeciliKategoriler)
        {
            cancellationToken.ThrowIfCancellationRequested();

            /*
             * Mevcut tekli SilAsync kuralı:
             * Ürünü olan kategori silinemez.
             */
            if (urunluKategoriIdleri.Contains(kategori.Id))
            {
                silinebilirlikDurumlari[kategori.Id] = false;

                sonuc.Hatalar.Add(
                    new KategoriTopluSilHataDto
                    {
                        Id = kategori.Id,
                        KategoriAdi = kategori.KategoriAdi,
                        Mesaj = "Ürünleri bulunan kategori silinemez. Önce ürünleri başka kategoriye taşıyın veya kategoriyi pasife alın."
                    });

                continue;
            }

            if (!altKategoriSozlugu.TryGetValue(
                    kategori.Id,
                    out var altKategoriIdleri))
            {
                silinebilirlikDurumlari[kategori.Id] = true;

                continue;
            }

            /*
             * Bir alt kategori:
             *
             * - seçilmediyse
             * - veya seçilmiş fakat silinemiyorsa
             *
             * parent kategori de silinemez.
             */
            var kalanAltKategoriVarMi = altKategoriIdleri.Any(
                altKategoriId =>
                {
                    if (!seciliKategoriIdleri.Contains(altKategoriId))
                        return true;

                    return !silinebilirlikDurumlari.TryGetValue(
                               altKategoriId,
                               out var altKategoriSilinebilirMi) ||
                           !altKategoriSilinebilirMi;
                });

            if (kalanAltKategoriVarMi)
            {
                silinebilirlikDurumlari[kategori.Id] = false;

                sonuc.Hatalar.Add(
                    new KategoriTopluSilHataDto
                    {
                        Id = kategori.Id,
                        KategoriAdi = kategori.KategoriAdi,
                        Mesaj = "Alt kategorileri bulunan kategori silinemez. Tüm alt kategorileri seçin ve alt kategorilerin de silinebilir olduğundan emin olun."
                    });

                continue;
            }

            silinebilirlikDurumlari[kategori.Id] = true;
        }

        var silinecekIdler = istenenIdler
            .Where(id =>
                silinebilirlikDurumlari.TryGetValue(
                    id,
                    out var silinebilirMi) &&
                silinebilirMi)
            .ToList();

        var silinecekKategoriler = silinecekIdler
            .Select(id => kategoriSozlugu[id])
            .ToList();

        /*
         * Görselleri DB kaydını silmeden önce saklıyoruz.
         */
        var silinenKategoriGorselYollari = silinecekKategoriler
            .Select(x => x.GorselYolu)
            .Where(x => !string.IsNullOrWhiteSpace(x))
            .Select(x => x!)
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        if (silinecekKategoriler.Count > 0)
        {
            _dbContext.Kategoriler.RemoveRange(
                silinecekKategoriler);

            /*
             * EF Core FK bağımlılıklarını dikkate alarak
             * delete komutlarını uygun sırada yürütür.
             *
             * SaveChanges tek transaction içinde gerçekleşir.
             */
            await _dbContext.SaveChangesAsync(
                cancellationToken);
        }

        /*
         * DB işlemi başarılı olduktan sonra kullanılmayan
         * fiziksel kategori görsellerini temizliyoruz.
         *
         * Dosya silme hatası kategori silme işlemini bozmaz;
         * mevcut helper zaten hatayı logluyor.
         */
        foreach (var gorselYolu in silinenKategoriGorselYollari)
        {
            await KullanilmayanKategoriGorseliniSilAsync(
                gorselYolu);
        }

        sonuc.SilinenIdler = silinecekIdler;

        sonuc.SilinenKayitSayisi =
            silinecekIdler.Count;

        sonuc.SilinemeyenKayitSayisi =
            sonuc.IstenenKayitSayisi -
            sonuc.SilinenKayitSayisi;

        return sonuc;
    }

    public async Task SilAsync(int id, CancellationToken cancellationToken = default)
    {
        var kategori = await _dbContext.Kategoriler
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        if (kategori is null)
            throw new KaynakBulunamadiException("Silinecek kategori bulunamadı.");

        var altKategoriVarMi = await _dbContext.Kategoriler
            .AsNoTracking()
            .AnyAsync(x => x.UstKategoriId == id, cancellationToken);

        if (altKategoriVarMi)
            throw new IsKuraliException("Alt kategorileri bulunan kategori silinemez. Önce alt kategorileri kaldırın veya kategoriyi pasife alın.");

        var urunVarMi = await _dbContext.Urunler
            .AsNoTracking()
            .AnyAsync(x => x.KategoriId == id, cancellationToken);

        if (urunVarMi)
            throw new IsKuraliException("Ürünleri bulunan kategori silinemez. Önce ürünleri başka kategoriye taşıyın veya kategoriyi pasife alın.");

        var eskiGorselYolu = kategori.GorselYolu;

        _dbContext.Kategoriler.Remove(kategori);

        await _dbContext.SaveChangesAsync(cancellationToken);

        await KullanilmayanKategoriGorseliniSilAsync(eskiGorselYolu);
    }

    public async Task<KategoriListeDto> DurumDegistirAsync(int id, bool aktifMi, CancellationToken cancellationToken = default)
    {
        var kategori = await _dbContext.Kategoriler
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        if (kategori is null)
            throw new KaynakBulunamadiException("Kategori bulunamadı.");

        kategori.AktifMi = aktifMi;
        kategori.GuncellemeTarihi = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);

        return DtoyaDonustur(kategori);
    }

    private static int KategoriDerinliginiGetir( Kategori kategori, IReadOnlyDictionary<int, Kategori> kategoriSozlugu)
    {
        var derinlik = 0;

        var ziyaretEdilenKategoriIdleri =
            new HashSet<int>
            {
            kategori.Id
            };

        var ustKategoriId =
            kategori.UstKategoriId;

        while (ustKategoriId.HasValue)
        {
            if (!ziyaretEdilenKategoriIdleri.Add(
                    ustKategoriId.Value))
            {
                break;
            }

            if (!kategoriSozlugu.TryGetValue(
                    ustKategoriId.Value,
                    out var ustKategori))
            {
                break;
            }

            derinlik++;

            ustKategoriId =
                ustKategori.UstKategoriId;
        }

        return derinlik;
    }

    private async Task UstKategoriyiDogrulaAsync(int? ustKategoriId, CancellationToken cancellationToken)
    {
        if (!ustKategoriId.HasValue) return;

        var kategoriVarMi = await _dbContext.Kategoriler
            .AsNoTracking()
            .AnyAsync(x => x.Id == ustKategoriId.Value, cancellationToken);

        if (!kategoriVarMi)
            throw new KaynakBulunamadiException("Seçilen üst kategori bulunamadı.");
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

    private async Task<List<int>> EtkinAktifKategoriIdleriniGetirAsync(CancellationToken cancellationToken)
    {
        var kategoriler = await _dbContext.Kategoriler
            .AsNoTracking()
            .Select(x => new
            {
                x.Id,
                x.UstKategoriId,
                x.AktifMi
            })
            .ToListAsync(cancellationToken);

        var kategoriSozlugu = kategoriler.ToDictionary(
            x => x.Id,
            x => new
            {
                x.UstKategoriId,
                x.AktifMi
            });

        var etkinAktifKategoriIdleri = new List<int>();

        foreach (var kategori in kategoriler)
        {
            if (!kategori.AktifMi) continue;

            var ziyaretEdilenler = new HashSet<int>();
            var mevcutKategoriId = kategori.Id;
            var etkinAktifMi = true;

            while (true)
            {
                if (!ziyaretEdilenler.Add(mevcutKategoriId))
                {
                    etkinAktifMi = false;
                    break;
                }

                if (!kategoriSozlugu.TryGetValue(mevcutKategoriId, out var mevcutKategori))
                {
                    etkinAktifMi = false;
                    break;
                }

                if (!mevcutKategori.AktifMi)
                {
                    etkinAktifMi = false;
                    break;
                }

                if (!mevcutKategori.UstKategoriId.HasValue)
                    break;

                mevcutKategoriId = mevcutKategori.UstKategoriId.Value;
            }

            if (etkinAktifMi)
                etkinAktifKategoriIdleri.Add(kategori.Id);
        }

        return etkinAktifKategoriIdleri;
    }

    private async Task KullanilmayanKategoriGorseliniSilAsync(string? gorselYolu)
    {
        if (string.IsNullOrWhiteSpace(gorselYolu)) return;

        try
        {
            var baskaKategorideKullaniliyorMu = await _dbContext.Kategoriler
                .AsNoTracking()
                .AnyAsync(x => x.GorselYolu == gorselYolu, CancellationToken.None);

            if (baskaKategorideKullaniliyorMu) return;

            await _dosyaServisi.SilAsync(gorselYolu, CancellationToken.None);
        }
        catch (Exception exception)
        {
            _logger.LogError(
                exception,
                "Kullanılmayan kategori görseli silinemedi. Görsel yolu: {GorselYolu}",
                gorselYolu);
        }
    }

    private async Task<bool> SeoUrlKullaniliyorMuAsync(string seoUrl, int? haricKategoriId, CancellationToken cancellationToken)
    {
        var sorgu = _dbContext.Kategoriler
            .AsNoTracking()
            .Where(x => x.SeoUrl == seoUrl);

        if (haricKategoriId.HasValue)
            sorgu = sorgu.Where(x => x.Id != haricKategoriId.Value);

        return await sorgu.AnyAsync(cancellationToken);
    }

    private async Task<string> SeoBasligiOlusturAsync(string kategoriAdi, string? seoBasligi, CancellationToken cancellationToken)
    {
        if (!string.IsNullOrWhiteSpace(seoBasligi))
            return seoBasligi.Trim();

        var sirketAdi = await _dbContext.FirmaGenelBilgileri
            .AsNoTracking()
            .Where(x => x.Id == 1)
            .Select(x => x.SirketAdi)
            .FirstOrDefaultAsync(cancellationToken);

        return string.IsNullOrWhiteSpace(sirketAdi)
            ? kategoriAdi
            : $"{kategoriAdi} | {sirketAdi}";
    }

    private static string? SeoAciklamasiOlustur(string? seoAciklamasi, string? aciklama)
    {
        if (!string.IsNullOrWhiteSpace(seoAciklamasi))
            return seoAciklamasi.Trim();

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
            if (CharUnicodeInfo.GetUnicodeCategory(karakter) != UnicodeCategory.NonSpacingMark)
                sonuc.Append(karakter);
        }

        var seoUrl = Regex
            .Replace(sonuc.ToString().Normalize(NormalizationForm.FormC), @"[^a-z0-9]+", "-")
            .Trim('-');

        if (string.IsNullOrWhiteSpace(seoUrl))
            throw new IsKuraliException("Kategori için geçerli bir SEO URL oluşturulamadı.");

        return seoUrl;
    }

    private static string? Temizle(string? deger)
    {
        return string.IsNullOrWhiteSpace(deger)
            ? null
            : deger.Trim();
    }

    private static void AltKategorileriSirala(List<KategoriListeDto> kategoriler)
    {
        kategoriler.Sort((sol, sag) =>
        {
            var siraKarsilastirmasi = sol.SiraNo.CompareTo(sag.SiraNo);

            return siraKarsilastirmasi != 0
                ? siraKarsilastirmasi
                : string.Compare(sol.KategoriAdi, sag.KategoriAdi, StringComparison.CurrentCultureIgnoreCase);
        });

        foreach (var kategori in kategoriler)
            AltKategorileriSirala(kategori.AltKategoriler);
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