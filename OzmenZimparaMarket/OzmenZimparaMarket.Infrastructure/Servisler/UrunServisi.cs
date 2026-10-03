using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using OzmenZimparaMarket.Application.DTOs.OrtakDtos;
using OzmenZimparaMarket.Application.DTOs.UrunDtos;
using OzmenZimparaMarket.Application.Enumlar;
using OzmenZimparaMarket.Application.Interfaces;
using OzmenZimparaMarket.Application.Istisnalar;
using OzmenZimparaMarket.Domain.Entityler;
using OzmenZimparaMarket.Infrastructure.Veritabani;

namespace OzmenZimparaMarket.Infrastructure.Servisler;

public class UrunServisi : IUrunServisi
{
    private readonly OzmenZimparaMarketDbContext _dbContext;
    private readonly IHtmlTemizlemeServisi _htmlTemizlemeServisi;
    private readonly IDosyaServisi _dosyaServisi;
    private readonly ILogger<UrunServisi> _logger;

    public UrunServisi(
        OzmenZimparaMarketDbContext dbContext,
        IHtmlTemizlemeServisi htmlTemizlemeServisi,
        IDosyaServisi dosyaServisi,
        ILogger<UrunServisi> logger)
    {
        _dbContext = dbContext;
        _htmlTemizlemeServisi = htmlTemizlemeServisi;
        _dosyaServisi = dosyaServisi;
        _logger = logger;
    }

    public async Task<IReadOnlyList<UrunListeDto>> TumunuGetirAsync(
        bool sadeceAktifler = false,
        CancellationToken cancellationToken = default)
    {
        var sorgu = _dbContext.Urunler
            .AsNoTracking()
            .AsQueryable();

        if (sadeceAktifler)
        {
            var etkinAktifKategoriIdleri =
                await EtkinAktifKategoriIdleriniGetirAsync(
                    cancellationToken);

            sorgu = sorgu.Where(x =>
                x.AktifMi &&
                etkinAktifKategoriIdleri.Contains(
                    x.KategoriId));
        }

        var urunler = await sorgu
            .OrderBy(x => x.SiraNo)
            .ThenBy(x => x.UrunAdi)
            .Select(x => new UrunListeDto
            {
                Id = x.Id,
                KategoriId = x.KategoriId,
                KategoriAdi = x.Kategori.KategoriAdi,
                UrunAdi = x.UrunAdi,
                UrunKodu = x.UrunKodu,
                KisaAciklama = x.KisaAciklama,
                DetayliAciklama = x.DetayliAciklama,
                GorselYolu = x.GorselYolu,
                SatisBirimi = x.SatisBirimi,
                SeoUrl = x.SeoUrl,
                SeoBasligi = x.SeoBasligi,
                SeoAciklamasi = x.SeoAciklamasi,
                OneCikanMi = x.OneCikanMi,
                SiraNo = x.SiraNo,
                AktifMi = x.AktifMi,
                TeknikDetaySayisi = x.UrunDetaylari.Count,
                OlusturmaTarihi = x.OlusturmaTarihi,
                GuncellemeTarihi = x.GuncellemeTarihi
            })
            .ToListAsync(cancellationToken);

        SatisBirimiAdlariniDoldur(
            urunler);

        return urunler;
    }

    public async Task<SayfaliSonucDto<UrunListeDto>> FiltreleAsync(
        UrunFiltreDto filtre,
        CancellationToken cancellationToken = default)
    {
        var sorgu = _dbContext.Urunler
            .AsNoTracking()
            .AsQueryable();

        if (filtre.KategoriId.HasValue)
        {
            if (filtre.AltKategorilerDahilMi)
            {
                var kategoriIdleri =
                    await KategoriVeAltKategoriIdleriniGetirAsync(
                        filtre.KategoriId.Value,
                        filtre.AktifMi == true,
                        cancellationToken);

                sorgu = sorgu.Where(x =>
                    kategoriIdleri.Contains(
                        x.KategoriId));
            }
            else
            {
                sorgu = sorgu.Where(x =>
                    x.KategoriId ==
                    filtre.KategoriId.Value);
            }
        }

        if (!string.IsNullOrWhiteSpace(
                filtre.AramaMetni))
        {
            var aramaMetni =
                filtre.AramaMetni.Trim();

            sorgu = sorgu.Where(x =>
                x.UrunAdi.Contains(aramaMetni) ||
                (x.UrunKodu != null &&
                 x.UrunKodu.Contains(aramaMetni)) ||
                (x.KisaAciklama != null &&
                 x.KisaAciklama.Contains(aramaMetni)) ||
                (x.DetayliAciklama != null &&
                 x.DetayliAciklama.Contains(aramaMetni)) ||
                x.UrunDetaylari.Any(y =>
                    y.DetayDegeri.Contains(
                        aramaMetni)));
        }

        if (filtre.AktifMi.HasValue)
        {
            sorgu = sorgu.Where(x =>
                x.AktifMi ==
                filtre.AktifMi.Value);

            if (filtre.AktifMi.Value)
            {
                var etkinAktifKategoriIdleri =
                    await EtkinAktifKategoriIdleriniGetirAsync(
                        cancellationToken);

                sorgu = sorgu.Where(x =>
                    etkinAktifKategoriIdleri.Contains(
                        x.KategoriId));
            }
        }

        if (filtre.OneCikanMi.HasValue)
        {
            sorgu = sorgu.Where(x =>
                x.OneCikanMi ==
                filtre.OneCikanMi.Value);
        }

        if (filtre.SatisBirimi.HasValue)
        {
            sorgu = sorgu.Where(x =>
                x.SatisBirimi ==
                filtre.SatisBirimi.Value);
        }

        foreach (var teknikFiltre in
                 filtre.TeknikDetayFiltreleri)
        {
            var detayTanimiId =
                teknikFiltre.UrunDetayTanimiId;

            var degerler =
                teknikFiltre.Degerler
                    .Where(x =>
                        !string.IsNullOrWhiteSpace(x))
                    .Select(x =>
                        x.Trim())
                    .Distinct(
                        StringComparer.OrdinalIgnoreCase)
                    .ToList();

            if (degerler.Count == 0)
                continue;

            sorgu = sorgu.Where(x =>
                x.UrunDetaylari.Any(y =>
                    y.UrunDetayTanimiId ==
                    detayTanimiId &&
                    y.AktifMi &&
                    y.UrunDetayTanimi.AktifMi &&
                    degerler.Contains(
                        y.DetayDegeri)));
        }

        var toplamKayitSayisi =
            await sorgu.CountAsync(
                cancellationToken);

        sorgu =
            SiralamaUygula(
                sorgu,
                filtre.Siralama);

        var urunler = await sorgu
            .Skip(
                (filtre.SayfaNo - 1) *
                filtre.SayfaBoyutu)
            .Take(
                filtre.SayfaBoyutu)
            .Select(x => new UrunListeDto
            {
                Id = x.Id,
                KategoriId = x.KategoriId,
                KategoriAdi = x.Kategori.KategoriAdi,
                UrunAdi = x.UrunAdi,
                UrunKodu = x.UrunKodu,
                KisaAciklama = x.KisaAciklama,
                DetayliAciklama = x.DetayliAciklama,
                GorselYolu = x.GorselYolu,
                SatisBirimi = x.SatisBirimi,
                SeoUrl = x.SeoUrl,
                SeoBasligi = x.SeoBasligi,
                SeoAciklamasi = x.SeoAciklamasi,
                OneCikanMi = x.OneCikanMi,
                SiraNo = x.SiraNo,
                AktifMi = x.AktifMi,
                TeknikDetaySayisi =
                    x.UrunDetaylari.Count,
                OlusturmaTarihi =
                    x.OlusturmaTarihi,
                GuncellemeTarihi =
                    x.GuncellemeTarihi
            })
            .ToListAsync(
                cancellationToken);

        SatisBirimiAdlariniDoldur(
            urunler);

        await UrunListeTeknikDetaylariniDoldurAsync(
            urunler,
            cancellationToken);

        return new SayfaliSonucDto<UrunListeDto>
        {
            Kayitlar =
                urunler,

            SayfaNo =
                filtre.SayfaNo,

            SayfaBoyutu =
                filtre.SayfaBoyutu,

            ToplamKayitSayisi =
                toplamKayitSayisi,

            ToplamSayfaSayisi =
                (int)Math.Ceiling(
                    toplamKayitSayisi /
                    (double)filtre.SayfaBoyutu)
        };
    }

    public async Task<UrunDetayGoruntuleDto?> IdIleGetirAsync(
        int id,
        CancellationToken cancellationToken = default)
    {
        var sorgu = _dbContext.Urunler
            .AsNoTracking()
            .Where(x =>
                x.Id == id);

        return await UrunDetayiniGetirAsync(
            sorgu,
            false,
            cancellationToken);
    }

    public async Task<UrunDetayGoruntuleDto?> SeoUrlIleGetirAsync(
        string seoUrl,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(
                seoUrl))
        {
            return null;
        }

        var temizSeoUrl =
            seoUrl
                .Trim()
                .ToLowerInvariant();

        var etkinAktifKategoriIdleri =
            await EtkinAktifKategoriIdleriniGetirAsync(
                cancellationToken);

        var sorgu = _dbContext.Urunler
            .AsNoTracking()
            .Where(x =>
                x.SeoUrl == temizSeoUrl &&
                x.AktifMi &&
                etkinAktifKategoriIdleri.Contains(
                    x.KategoriId));

        return await UrunDetayiniGetirAsync(
            sorgu,
            true,
            cancellationToken);
    }

    public async Task<IReadOnlyList<UrunListeDto>> OneCikanlariGetirAsync( int adet = 8, CancellationToken cancellationToken = default)
    {
        if (adet <= 0)
        {
            throw new IsKuraliException(
                "Ürün adedi sıfırdan büyük olmalıdır.");
        }

        if (adet > 50)
            adet = 50;

        var etkinAktifKategoriIdleri =
            await EtkinAktifKategoriIdleriniGetirAsync(
                cancellationToken);

        var urunler =
            await _dbContext.Urunler
                .AsNoTracking()
                .Where(x =>
                    x.OneCikanMi &&
                    x.AktifMi &&
                    etkinAktifKategoriIdleri.Contains(
                        x.KategoriId))
                .OrderBy(x =>
                    x.SiraNo)
                .ThenBy(x =>
                    x.UrunAdi)
                .Take(adet)
                .Select(x => new UrunListeDto
                {
                    Id = x.Id,
                    KategoriId = x.KategoriId,
                    KategoriAdi = x.Kategori.KategoriAdi,
                    UrunAdi = x.UrunAdi,
                    UrunKodu = x.UrunKodu,
                    KisaAciklama = x.KisaAciklama,
                    DetayliAciklama = x.DetayliAciklama,
                    GorselYolu = x.GorselYolu,
                    SatisBirimi = x.SatisBirimi,
                    SeoUrl = x.SeoUrl,
                    SeoBasligi = x.SeoBasligi,
                    SeoAciklamasi = x.SeoAciklamasi,
                    OneCikanMi = x.OneCikanMi,
                    SiraNo = x.SiraNo,
                    AktifMi = x.AktifMi,
                    TeknikDetaySayisi =
                        x.UrunDetaylari.Count,
                    OlusturmaTarihi =
                        x.OlusturmaTarihi,
                    GuncellemeTarihi =
                        x.GuncellemeTarihi
                })
                .ToListAsync(
                    cancellationToken);

        SatisBirimiAdlariniDoldur(
            urunler);

        return urunler;
    }

    public async Task<UrunListeDto> EkleAsync( UrunEkleDto dto, CancellationToken cancellationToken = default)
    {
        await KategoriyiDogrulaAsync(
            dto.KategoriId,
            dto.AktifMi,
            cancellationToken);

        var urunAdi =
            dto.UrunAdi.Trim();

        var urunKodu =
            Temizle(
                dto.UrunKodu);

        var seoUrl =
            SeoUrlOlustur(
                string.IsNullOrWhiteSpace(
                    dto.SeoUrl)
                    ? urunAdi
                    : dto.SeoUrl);

        if (await UrunKoduKullaniliyorMuAsync(
                urunKodu,
                null,
                cancellationToken))
        {
            throw new CakismaException(
                "Bu ürün kodu daha önce kullanılmıştır.");
        }

        if (await SeoUrlKullaniliyorMuAsync(
                seoUrl,
                null,
                cancellationToken))
        {
            throw new CakismaException(
                "Bu SEO URL başka bir ürün tarafından kullanılıyor.");
        }

        await YeniUrunTeknikDetaylariniDogrulaAsync(
            dto.TeknikDetaylar,
            cancellationToken);

        var urun =
            new Urun
            {
                KategoriId =
                    dto.KategoriId,

                UrunAdi =
                    urunAdi,

                UrunKodu =
                    urunKodu,

                KisaAciklama =
                    Temizle(
                        dto.KisaAciklama),

                DetayliAciklama =
                    _htmlTemizlemeServisi.Temizle(
                        dto.DetayliAciklama),

                GorselYolu =
                    Temizle(
                        dto.GorselYolu),

                SatisBirimi =
                    dto.SatisBirimi,

                SeoUrl =
                    seoUrl,

                SeoBasligi =
                    await SeoBasligiOlusturAsync(
                        urunAdi,
                        dto.SeoBasligi,
                        cancellationToken),

                SeoAciklamasi =
                    SeoAciklamasiOlustur(
                        dto.SeoAciklamasi,
                        dto.KisaAciklama),

                OneCikanMi =
                    dto.OneCikanMi,

                SiraNo =
                    dto.SiraNo,

                AktifMi =
                    dto.AktifMi,

                OlusturmaTarihi =
                    DateTime.UtcNow
            };

        foreach (var teknikDetay in
                 dto.TeknikDetaylar)
        {
            urun.UrunDetaylari.Add(
                new UrunDetayi
                {
                    UrunDetayTanimiId =
                        teknikDetay.UrunDetayTanimiId,

                    DetayDegeri =
                        teknikDetay.DetayDegeri.Trim(),

                    SiraNo =
                        teknikDetay.SiraNo,

                    AktifMi =
                        teknikDetay.AktifMi
                });
        }

        await _dbContext.Urunler.AddAsync(
            urun,
            cancellationToken);

        await _dbContext.SaveChangesAsync(
            cancellationToken);

        return await ListeDtoGetirAsync(
                   urun.Id,
                   cancellationToken)
               ?? throw new InvalidOperationException(
                   "Eklenen ürün getirilemedi.");
    }

    public async Task<UrunListeDto> GuncelleAsync( int id, UrunGuncelleDto dto, CancellationToken cancellationToken = default)
    {
        var urun =
            await _dbContext.Urunler
                .Include(x =>
                    x.UrunDetaylari)
                .FirstOrDefaultAsync(
                    x => x.Id == id,
                    cancellationToken);

        if (urun is null)
        {
            throw new KaynakBulunamadiException(
                "Güncellenecek ürün bulunamadı.");
        }

        var eskiGorselYolu =
            urun.GorselYolu;

        var yeniGorselYolu =
            Temizle(
                dto.GorselYolu);

        await KategoriyiDogrulaAsync(
            dto.KategoriId,
            dto.AktifMi,
            cancellationToken);

        var urunAdi =
            dto.UrunAdi.Trim();

        var urunKodu =
            Temizle(
                dto.UrunKodu);

        var seoUrl =
            SeoUrlOlustur(
                string.IsNullOrWhiteSpace(
                    dto.SeoUrl)
                    ? urunAdi
                    : dto.SeoUrl);

        if (await UrunKoduKullaniliyorMuAsync(
                urunKodu,
                id,
                cancellationToken))
        {
            throw new CakismaException(
                "Bu ürün kodu başka bir ürün tarafından kullanılıyor.");
        }

        if (await SeoUrlKullaniliyorMuAsync(
                seoUrl,
                id,
                cancellationToken))
        {
            throw new CakismaException(
                "Bu SEO URL başka bir ürün tarafından kullanılıyor.");
        }

        await GuncellenecekUrunTeknikDetaylariniDogrulaAsync(
            urun,
            dto.TeknikDetaylar,
            cancellationToken);

        urun.KategoriId =
            dto.KategoriId;

        urun.UrunAdi =
            urunAdi;

        urun.UrunKodu =
            urunKodu;

        urun.KisaAciklama =
            Temizle(
                dto.KisaAciklama);

        urun.DetayliAciklama =
            _htmlTemizlemeServisi.Temizle(
                dto.DetayliAciklama);

        urun.GorselYolu =
            yeniGorselYolu;

        urun.SatisBirimi =
            dto.SatisBirimi;

        urun.SeoUrl =
            seoUrl;

        urun.SeoBasligi =
            await SeoBasligiOlusturAsync(
                urunAdi,
                dto.SeoBasligi,
                cancellationToken);

        urun.SeoAciklamasi =
            SeoAciklamasiOlustur(
                dto.SeoAciklamasi,
                dto.KisaAciklama);

        urun.OneCikanMi =
            dto.OneCikanMi;

        urun.SiraNo =
            dto.SiraNo;

        urun.AktifMi =
            dto.AktifMi;

        urun.GuncellemeTarihi =
            DateTime.UtcNow;

        UrunTeknikDetaylariniGuncelle(
            urun,
            dto.TeknikDetaylar);

        await _dbContext.SaveChangesAsync(
            cancellationToken);

        if (!string.Equals(
                eskiGorselYolu,
                yeniGorselYolu,
                StringComparison.OrdinalIgnoreCase))
        {
            await KullanilmayanUrunGorseliniSilAsync(
                eskiGorselYolu);
        }

        return await ListeDtoGetirAsync(
                   urun.Id,
                   cancellationToken)
               ?? throw new InvalidOperationException(
                   "Güncellenen ürün getirilemedi.");
    }

    public async Task<UrunTopluSilSonucDto> TopluSilAsync( UrunTopluSilDto dto, CancellationToken cancellationToken = default)
    {
        if (dto.IdListesi is null ||
            dto.IdListesi.Count == 0)
        {
            throw new IsKuraliException(
                "Silinecek en az bir ürün seçilmelidir.");
        }

        if (dto.IdListesi.Any(x =>
                x <= 0))
        {
            throw new IsKuraliException(
                "Ürün ID değerleri pozitif tam sayı olmalıdır.");
        }

        var istenenIdler =
            dto.IdListesi
                .Distinct()
                .ToList();

        var sonuc =
            new UrunTopluSilSonucDto
            {
                IstenenKayitSayisi =
                    istenenIdler.Count
            };

        var urunler =
            await _dbContext.Urunler
                .Where(x =>
                    istenenIdler.Contains(
                        x.Id))
                .ToListAsync(
                    cancellationToken);

        var urunSozlugu =
            urunler.ToDictionary(
                x => x.Id);

        foreach (var id in
                 istenenIdler)
        {
            if (urunSozlugu.ContainsKey(
                    id))
            {
                continue;
            }

            sonuc.Hatalar.Add(
                new UrunTopluSilHataDto
                {
                    Id =
                        id,

                    UrunAdi =
                        null,

                    UrunKodu =
                        null,

                    Mesaj =
                        "Silinecek ürün bulunamadı."
                });
        }

        var silinenUrunGorselYollari =
            urunler
                .Select(x =>
                    x.GorselYolu)
                .Where(x =>
                    !string.IsNullOrWhiteSpace(x))
                .Select(x =>
                    x!)
                .Distinct(
                    StringComparer.OrdinalIgnoreCase)
                .ToList();

        var silinenIdler =
            urunler
                .Select(x =>
                    x.Id)
                .ToList();

        if (urunler.Count > 0)
        {
            _dbContext.Urunler.RemoveRange(
                urunler);

            await _dbContext.SaveChangesAsync(
                cancellationToken);
        }

        foreach (var gorselYolu in
                 silinenUrunGorselYollari)
        {
            cancellationToken.ThrowIfCancellationRequested();

            await KullanilmayanUrunGorseliniSilAsync(
                gorselYolu);
        }

        sonuc.SilinenIdler =
            silinenIdler;

        sonuc.SilinenKayitSayisi =
            silinenIdler.Count;

        sonuc.SilinemeyenKayitSayisi =
            sonuc.IstenenKayitSayisi -
            sonuc.SilinenKayitSayisi;

        return sonuc;
    }

    public async Task SilAsync( int id, CancellationToken cancellationToken = default)
    {
        var urun =
            await _dbContext.Urunler
                .FirstOrDefaultAsync(
                    x => x.Id == id,
                    cancellationToken);

        if (urun is null)
        {
            throw new KaynakBulunamadiException(
                "Silinecek ürün bulunamadı.");
        }

        var eskiGorselYolu =
            urun.GorselYolu;

        _dbContext.Urunler.Remove(
            urun);

        await _dbContext.SaveChangesAsync(
            cancellationToken);

        await KullanilmayanUrunGorseliniSilAsync(
            eskiGorselYolu);
    }

    public async Task<UrunListeDto> DurumDegistirAsync( int id, bool aktifMi, CancellationToken cancellationToken = default)
    {
        var urun =
            await _dbContext.Urunler
                .FirstOrDefaultAsync(
                    x => x.Id == id,
                    cancellationToken);

        if (urun is null)
        {
            throw new KaynakBulunamadiException(
                "Ürün bulunamadı.");
        }

        if (aktifMi)
        {
            await KategoriyiDogrulaAsync(
                urun.KategoriId,
                true,
                cancellationToken);
        }

        urun.AktifMi =
            aktifMi;

        urun.GuncellemeTarihi =
            DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(
            cancellationToken);

        return await ListeDtoGetirAsync(
                   urun.Id,
                   cancellationToken)
               ?? throw new InvalidOperationException(
                   "Ürün getirilemedi.");
    }

    public async Task<UrunListeDto> OneCikanDurumDegistirAsync( int id, bool oneCikanMi, CancellationToken cancellationToken = default)
    {
        var urun =
            await _dbContext.Urunler
                .FirstOrDefaultAsync(
                    x => x.Id == id,
                    cancellationToken);

        if (urun is null)
        {
            throw new KaynakBulunamadiException(
                "Ürün bulunamadı.");
        }

        urun.OneCikanMi =
            oneCikanMi;

        urun.GuncellemeTarihi =
            DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(
            cancellationToken);

        return await ListeDtoGetirAsync(
                   urun.Id,
                   cancellationToken)
               ?? throw new InvalidOperationException(
                   "Ürün getirilemedi.");
    }

    public async Task<IReadOnlyList<UrunFiltreGrubuDto>> FiltreSecenekleriniGetirAsync( int? kategoriId = null, bool altKategorilerDahilMi = true, CancellationToken cancellationToken = default)
    {
        var etkinAktifKategoriIdleri =
            await EtkinAktifKategoriIdleriniGetirAsync(
                cancellationToken);

        List<int>? kategoriIdleri =
            null;

        if (kategoriId.HasValue)
        {
            if (altKategorilerDahilMi)
            {
                kategoriIdleri =
                    await KategoriVeAltKategoriIdleriniGetirAsync(
                        kategoriId.Value,
                        true,
                        cancellationToken);
            }
            else
            {
                var kategoriVarMi =
                    await _dbContext.Kategoriler
                        .AsNoTracking()
                        .AnyAsync(
                            x =>
                                x.Id ==
                                kategoriId.Value,
                            cancellationToken);

                if (!kategoriVarMi)
                {
                    throw new KaynakBulunamadiException(
                        "Seçilen kategori bulunamadı.");
                }

                kategoriIdleri =
                    etkinAktifKategoriIdleri.Contains(
                        kategoriId.Value)
                        ? [kategoriId.Value]
                        : [];
            }
        }

        var sorgu =
            _dbContext.UrunDetaylari
                .AsNoTracking()
                .Where(x =>
                    x.AktifMi &&
                    x.Urun.AktifMi &&
                    etkinAktifKategoriIdleri.Contains(
                        x.Urun.KategoriId) &&
                    x.UrunDetayTanimi.AktifMi &&
                    x.UrunDetayTanimi.FiltredeGosterilsinMi);

        if (kategoriIdleri is not null)
        {
            sorgu = sorgu.Where(x =>
                kategoriIdleri.Contains(
                    x.Urun.KategoriId));
        }

        var detaylar =
            await sorgu
                .Select(x => new
                {
                    x.UrunId,
                    x.UrunDetayTanimiId,
                    x.UrunDetayTanimi.DetayAdi,
                    x.UrunDetayTanimi.CokluDegerMi,

                    DetayTanimiSiraNo =
                        x.UrunDetayTanimi.SiraNo,

                    x.DetayDegeri,

                    DetayDegeriSiraNo =
                        x.SiraNo
                })
                .ToListAsync(
                    cancellationToken);

        var filtreGruplari =
            detaylar
                .GroupBy(x => new
                {
                    x.UrunDetayTanimiId,
                    x.DetayAdi,
                    x.CokluDegerMi,
                    x.DetayTanimiSiraNo
                })
                .OrderBy(x =>
                    x.Key.DetayTanimiSiraNo)
                .ThenBy(x =>
                    x.Key.DetayAdi)
                .Select(grup =>
                    new UrunFiltreGrubuDto
                    {
                        UrunDetayTanimiId =
                            grup.Key.UrunDetayTanimiId,

                        DetayAdi =
                            grup.Key.DetayAdi,

                        CokluDegerMi =
                            grup.Key.CokluDegerMi,

                        SiraNo =
                            grup.Key.DetayTanimiSiraNo,

                        Secenekler =
                            grup
                                .GroupBy(
                                    x =>
                                        x.DetayDegeri.Trim(),
                                    StringComparer.OrdinalIgnoreCase)
                                .OrderBy(x =>
                                    x.Min(y =>
                                        y.DetayDegeriSiraNo))
                                .ThenBy(x =>
                                    x.Key)
                                .Select(x =>
                                    new UrunFiltreSecenegiDto
                                    {
                                        Deger =
                                            x.Key,

                                        UrunSayisi =
                                            x.Select(y =>
                                                    y.UrunId)
                                                .Distinct()
                                                .Count()
                                    })
                                .ToList()
                    })
                .Where(x =>
                    x.Secenekler.Count > 0)
                .ToList();

        return filtreGruplari;
    }

    private async Task UrunListeTeknikDetaylariniDoldurAsync(
        List<UrunListeDto> urunler,
        CancellationToken cancellationToken)
    {
        if (urunler.Count == 0)
            return;

        var urunIdleri =
            urunler
                .Select(x =>
                    x.Id)
                .ToList();

        var detaylar =
            await _dbContext.UrunDetaylari
                .AsNoTracking()
                .Where(x =>
                    urunIdleri.Contains(
                        x.UrunId) &&
                    x.AktifMi &&
                    x.UrunDetayTanimi.AktifMi)
                .Select(x => new
                {
                    x.UrunId,

                    UrunDetayiId =
                        x.Id,

                    x.UrunDetayTanimiId,
                    x.UrunDetayTanimi.DetayAdi,
                    x.UrunDetayTanimi.CokluDegerMi,
                    x.UrunDetayTanimi.FiltredeGosterilsinMi,
                    x.UrunDetayTanimi.SepetteSecilebilirMi,

                    DetayTanimiSiraNo =
                        x.UrunDetayTanimi.SiraNo,

                    x.DetayDegeri,

                    DetayDegeriSiraNo =
                        x.SiraNo
                })
                .ToListAsync(
                    cancellationToken);

        var urunDetaylari =
            detaylar
                .GroupBy(x =>
                    x.UrunId)
                .ToDictionary(
                    urunGrubu =>
                        urunGrubu.Key,

                    urunGrubu =>
                        urunGrubu
                            .GroupBy(x => new
                            {
                                x.UrunDetayTanimiId,
                                x.DetayAdi,
                                x.CokluDegerMi,
                                x.FiltredeGosterilsinMi,
                                x.SepetteSecilebilirMi,
                                x.DetayTanimiSiraNo
                            })
                            .OrderBy(x =>
                                x.Key.DetayTanimiSiraNo)
                            .ThenBy(x =>
                                x.Key.DetayAdi)
                            .Select(grup =>
                                new UrunTeknikDetayGrubuDto
                                {
                                    UrunDetayTanimiId =
                                        grup.Key.UrunDetayTanimiId,

                                    DetayAdi =
                                        grup.Key.DetayAdi,

                                    CokluDegerMi =
                                        grup.Key.CokluDegerMi,

                                    FiltredeGosterilsinMi =
                                        grup.Key.FiltredeGosterilsinMi,

                                    SepetteSecilebilirMi =
                                        grup.Key.SepetteSecilebilirMi,

                                    SiraNo =
                                        grup.Key.DetayTanimiSiraNo,

                                    Degerler =
                                        grup
                                            .OrderBy(x =>
                                                x.DetayDegeriSiraNo)
                                            .ThenBy(x =>
                                                x.DetayDegeri)
                                            .Select(x =>
                                                new UrunTeknikDetayDegeriDto
                                                {
                                                    UrunDetayiId =
                                                        x.UrunDetayiId,

                                                    DetayDegeri =
                                                        x.DetayDegeri,

                                                    SiraNo =
                                                        x.DetayDegeriSiraNo,

                                                    AktifMi =
                                                        true
                                                })
                                            .ToList()
                                })
                            .ToList());

        foreach (var urun in
                 urunler)
        {
            urun.TeknikDetaylar =
                urunDetaylari.TryGetValue(
                    urun.Id,
                    out var teknikDetaylar)
                    ? teknikDetaylar
                    : [];
        }
    }

    private async Task<UrunDetayGoruntuleDto?> UrunDetayiniGetirAsync(
        IQueryable<Urun> sorgu,
        bool sadeceAktifDetaylar,
        CancellationToken cancellationToken)
    {
        var urun =
            await sorgu
                .Select(x =>
                    new UrunDetayGoruntuleDto
                    {
                        Id =
                            x.Id,

                        KategoriId =
                            x.KategoriId,

                        KategoriAdi =
                            x.Kategori.KategoriAdi,

                        KategoriSeoUrl =
                            x.Kategori.SeoUrl,

                        UrunAdi =
                            x.UrunAdi,

                        UrunKodu =
                            x.UrunKodu,

                        KisaAciklama =
                            x.KisaAciklama,

                        DetayliAciklama =
                            x.DetayliAciklama,

                        GorselYolu =
                            x.GorselYolu,

                        SatisBirimi =
                            x.SatisBirimi,

                        SeoUrl =
                            x.SeoUrl,

                        SeoBasligi =
                            x.SeoBasligi,

                        SeoAciklamasi =
                            x.SeoAciklamasi,

                        OneCikanMi =
                            x.OneCikanMi,

                        SiraNo =
                            x.SiraNo,

                        AktifMi =
                            x.AktifMi
                    })
                .FirstOrDefaultAsync(
                    cancellationToken);

        if (urun is null)
            return null;

        urun.SatisBirimiAdi =
            urun.SatisBirimi.ToString();

        var detaySorgusu =
            _dbContext.UrunDetaylari
                .AsNoTracking()
                .Where(x =>
                    x.UrunId ==
                    urun.Id);

        if (sadeceAktifDetaylar)
        {
            detaySorgusu =
                detaySorgusu.Where(x =>
                    x.AktifMi &&
                    x.UrunDetayTanimi.AktifMi);
        }

        var detaylar =
            await detaySorgusu
                .OrderBy(x =>
                    x.UrunDetayTanimi.SiraNo)
                .ThenBy(x =>
                    x.SiraNo)
                .ThenBy(x =>
                    x.DetayDegeri)
                .Select(x => new
                {
                    x.Id,
                    x.UrunDetayTanimiId,
                    x.UrunDetayTanimi.DetayAdi,
                    x.UrunDetayTanimi.CokluDegerMi,
                    x.UrunDetayTanimi.FiltredeGosterilsinMi,
                    x.UrunDetayTanimi.SepetteSecilebilirMi,

                    DetayTanimiSiraNo =
                        x.UrunDetayTanimi.SiraNo,

                    x.DetayDegeri,
                    x.SiraNo,
                    x.AktifMi
                })
                .ToListAsync(
                    cancellationToken);

        urun.TeknikDetaylar =
            detaylar
                .GroupBy(x => new
                {
                    x.UrunDetayTanimiId,
                    x.DetayAdi,
                    x.CokluDegerMi,
                    x.FiltredeGosterilsinMi,
                    x.SepetteSecilebilirMi,
                    x.DetayTanimiSiraNo
                })
                .OrderBy(x =>
                    x.Key.DetayTanimiSiraNo)
                .Select(x =>
                    new UrunTeknikDetayGrubuDto
                    {
                        UrunDetayTanimiId =
                            x.Key.UrunDetayTanimiId,

                        DetayAdi =
                            x.Key.DetayAdi,

                        CokluDegerMi =
                            x.Key.CokluDegerMi,

                        FiltredeGosterilsinMi =
                            x.Key.FiltredeGosterilsinMi,

                        SepetteSecilebilirMi =
                            x.Key.SepetteSecilebilirMi,

                        SiraNo =
                            x.Key.DetayTanimiSiraNo,

                        Degerler =
                            x
                                .OrderBy(y =>
                                    y.SiraNo)
                                .ThenBy(y =>
                                    y.DetayDegeri)
                                .Select(y =>
                                    new UrunTeknikDetayDegeriDto
                                    {
                                        UrunDetayiId =
                                            y.Id,

                                        DetayDegeri =
                                            y.DetayDegeri,

                                        SiraNo =
                                            y.SiraNo,

                                        AktifMi =
                                            y.AktifMi
                                    })
                                .ToList()
                    })
                .ToList();

        return urun;
    }

    private async Task YeniUrunTeknikDetaylariniDogrulaAsync(
        IReadOnlyCollection<UrunTeknikDetayKaydetDto> teknikDetaylar,
        CancellationToken cancellationToken)
    {
        if (teknikDetaylar.Count == 0)
            return;

        if (teknikDetaylar.Any(x =>
                x.UrunDetayiId.HasValue))
        {
            throw new IsKuraliException(
                "Yeni ürün oluşturulurken ürün detayı ID değeri gönderilemez.");
        }

        await TeknikDetayListeKurallariniDogrulaAsync(
            teknikDetaylar,
            null,
            cancellationToken);
    }

    private async Task GuncellenecekUrunTeknikDetaylariniDogrulaAsync(
        Urun urun,
        IReadOnlyCollection<UrunTeknikDetayKaydetDto> teknikDetaylar,
        CancellationToken cancellationToken)
    {
        var gonderilenDetayIdleri =
            teknikDetaylar
                .Where(x =>
                    x.UrunDetayiId.HasValue)
                .Select(x =>
                    x.UrunDetayiId!.Value)
                .ToList();

        if (gonderilenDetayIdleri.Count !=
            gonderilenDetayIdleri.Distinct().Count())
        {
            throw new CakismaException(
                "Aynı ürün detayı birden fazla kez gönderilemez.");
        }

        var mevcutDetayIdleri =
            urun.UrunDetaylari
                .Select(x =>
                    x.Id)
                .ToHashSet();

        var baskaUruneAitDetayVarMi =
            gonderilenDetayIdleri.Any(x =>
                !mevcutDetayIdleri.Contains(x));

        if (baskaUruneAitDetayVarMi)
        {
            throw new IsKuraliException(
                "Gönderilen teknik detaylardan biri bu ürüne ait değildir.");
        }

        await TeknikDetayListeKurallariniDogrulaAsync(
            teknikDetaylar,
            urun.UrunDetaylari.ToList(),
            cancellationToken);
    }

    private async Task TeknikDetayListeKurallariniDogrulaAsync(
        IReadOnlyCollection<UrunTeknikDetayKaydetDto> teknikDetaylar,
        IReadOnlyCollection<UrunDetayi>? mevcutDetaylar,
        CancellationToken cancellationToken)
    {
        if (teknikDetaylar.Count == 0)
            return;

        var detayTanimiIdleri =
            teknikDetaylar
                .Select(x =>
                    x.UrunDetayTanimiId)
                .Distinct()
                .ToList();

        var detayTanimlari =
            await _dbContext.UrunDetayTanimlari
                .AsNoTracking()
                .Where(x =>
                    detayTanimiIdleri.Contains(
                        x.Id))
                .ToListAsync(
                    cancellationToken);

        if (detayTanimlari.Count !=
            detayTanimiIdleri.Count)
        {
            throw new KaynakBulunamadiException(
                "Gönderilen ürün özelliklerinden biri bulunamadı.");
        }

        var detayTanimiSozlugu =
            detayTanimlari.ToDictionary(
                x => x.Id);

        var mevcutDetaySozlugu =
            mevcutDetaylar?
                .ToDictionary(
                    x => x.Id)
            ?? new Dictionary<int, UrunDetayi>();

        foreach (var teknikDetay in
                 teknikDetaylar)
        {
            var detayTanimi =
                detayTanimiSozlugu[
                    teknikDetay.UrunDetayTanimiId];

            UrunDetayi? mevcutDetay =
                null;

            if (teknikDetay.UrunDetayiId.HasValue)
            {
                mevcutDetaySozlugu.TryGetValue(
                    teknikDetay.UrunDetayiId.Value,
                    out mevcutDetay);
            }

            if (detayTanimi.AktifMi)
                continue;

            if (mevcutDetay is null)
            {
                throw new IsKuraliException(
                    $"'{detayTanimi.DetayAdi}' ürün özelliği pasiftir. Bu özelliğe yeni değer eklenemez.");
            }

            var degisiklikVarMi =
                mevcutDetay.UrunDetayTanimiId !=
                teknikDetay.UrunDetayTanimiId ||
                !string.Equals(
                    mevcutDetay.DetayDegeri.Trim(),
                    teknikDetay.DetayDegeri.Trim(),
                    StringComparison.Ordinal) ||
                mevcutDetay.SiraNo !=
                teknikDetay.SiraNo ||
                mevcutDetay.AktifMi !=
                teknikDetay.AktifMi;

            if (degisiklikVarMi)
            {
                throw new IsKuraliException(
                    $"'{detayTanimi.DetayAdi}' ürün özelliği pasiftir. Mevcut değer değiştirilemez.");
            }
        }

        foreach (var grup in
                 teknikDetaylar.GroupBy(
                     x =>
                         x.UrunDetayTanimiId))
        {
            var detayTanimi =
                detayTanimiSozlugu[
                    grup.Key];

            if (!detayTanimi.CokluDegerMi &&
                grup.Count() > 1)
            {
                throw new IsKuraliException(
                    $"'{detayTanimi.DetayAdi}' ürün özelliği birden fazla değer kabul etmemektedir.");
            }

            var normalizeDegerler =
                grup
                    .Select(x =>
                        x.DetayDegeri.Trim())
                    .ToList();

            var ayniDegerVarMi =
                normalizeDegerler
                    .GroupBy(
                        x => x,
                        StringComparer.OrdinalIgnoreCase)
                    .Any(x =>
                        x.Count() > 1);

            if (ayniDegerVarMi)
            {
                throw new CakismaException(
                    $"'{detayTanimi.DetayAdi}' ürün özelliğinde aynı değer birden fazla kez kullanılamaz.");
            }
        }
    }

    private void UrunTeknikDetaylariniGuncelle(
        Urun urun,
        IReadOnlyCollection<UrunTeknikDetayKaydetDto> teknikDetaylar)
    {
        var mevcutDetaySozlugu =
            urun.UrunDetaylari
                .ToDictionary(
                    x => x.Id);

        var korunacakDetayIdleri =
            teknikDetaylar
                .Where(x =>
                    x.UrunDetayiId.HasValue)
                .Select(x =>
                    x.UrunDetayiId!.Value)
                .ToHashSet();

        var silinecekDetaylar =
            urun.UrunDetaylari
                .Where(x =>
                    !korunacakDetayIdleri.Contains(
                        x.Id))
                .ToList();

        if (silinecekDetaylar.Count > 0)
        {
            _dbContext.UrunDetaylari.RemoveRange(
                silinecekDetaylar);
        }

        foreach (var teknikDetay in
                 teknikDetaylar)
        {
            if (teknikDetay.UrunDetayiId.HasValue)
            {
                var mevcutDetay =
                    mevcutDetaySozlugu[
                        teknikDetay.UrunDetayiId.Value];

                mevcutDetay.UrunDetayTanimiId =
                    teknikDetay.UrunDetayTanimiId;

                mevcutDetay.DetayDegeri =
                    teknikDetay.DetayDegeri.Trim();

                mevcutDetay.SiraNo =
                    teknikDetay.SiraNo;

                mevcutDetay.AktifMi =
                    teknikDetay.AktifMi;

                continue;
            }

            urun.UrunDetaylari.Add(
                new UrunDetayi
                {
                    UrunDetayTanimiId =
                        teknikDetay.UrunDetayTanimiId,

                    DetayDegeri =
                        teknikDetay.DetayDegeri.Trim(),

                    SiraNo =
                        teknikDetay.SiraNo,

                    AktifMi =
                        teknikDetay.AktifMi
                });
        }
    }

    private async Task<List<int>> KategoriVeAltKategoriIdleriniGetirAsync(
        int kategoriId,
        bool sadeceAktifKategoriler,
        CancellationToken cancellationToken)
    {
        var kategoriler =
            await KategoriDurumlariniGetirAsync(
                cancellationToken);

        var secilenKategori =
            kategoriler.FirstOrDefault(x =>
                x.Id == kategoriId);

        if (secilenKategori is null)
        {
            throw new KaynakBulunamadiException(
                "Seçilen kategori bulunamadı.");
        }

        HashSet<int>? etkinAktifKategoriIdleri =
            null;

        if (sadeceAktifKategoriler)
        {
            etkinAktifKategoriIdleri =
                EtkinAktifKategoriIdleriniHesapla(
                    kategoriler);

            if (!etkinAktifKategoriIdleri.Contains(
                    kategoriId))
            {
                return [];
            }
        }

        var sonuc =
            new List<int>();

        var ziyaretEdilenler =
            new HashSet<int>();

        var kuyruk =
            new Queue<int>();

        kuyruk.Enqueue(
            kategoriId);

        while (kuyruk.Count > 0)
        {
            var mevcutKategoriId =
                kuyruk.Dequeue();

            if (!ziyaretEdilenler.Add(
                    mevcutKategoriId))
            {
                continue;
            }

            sonuc.Add(
                mevcutKategoriId);

            var altKategoriler =
                kategoriler.Where(x =>
                    x.UstKategoriId ==
                    mevcutKategoriId &&
                    (!sadeceAktifKategoriler ||
                     etkinAktifKategoriIdleri!.Contains(
                         x.Id)));

            foreach (var altKategori in
                     altKategoriler)
            {
                if (!ziyaretEdilenler.Contains(
                        altKategori.Id))
                {
                    kuyruk.Enqueue(
                        altKategori.Id);
                }
            }
        }

        return sonuc;
    }

    private async Task KategoriyiDogrulaAsync(
        int kategoriId,
        bool urunAktifOlacakMi,
        CancellationToken cancellationToken)
    {
        var kategoriVarMi =
            await _dbContext.Kategoriler
                .AsNoTracking()
                .AnyAsync(
                    x => x.Id == kategoriId,
                    cancellationToken);

        if (!kategoriVarMi)
        {
            throw new KaynakBulunamadiException(
                "Seçilen kategori bulunamadı.");
        }

        if (!urunAktifOlacakMi)
            return;

        var etkinAktifKategoriIdleri =
            await EtkinAktifKategoriIdleriniGetirAsync(
                cancellationToken);

        if (!etkinAktifKategoriIdleri.Contains(
                kategoriId))
        {
            throw new IsKuraliException(
                "Aktif bir ürün, kendisi veya üst kategorilerinden biri pasif olan kategoriye bağlanamaz.");
        }
    }

    private async Task<List<int>> EtkinAktifKategoriIdleriniGetirAsync(
        CancellationToken cancellationToken)
    {
        var kategoriler =
            await KategoriDurumlariniGetirAsync(
                cancellationToken);

        return EtkinAktifKategoriIdleriniHesapla(
                kategoriler)
            .ToList();
    }

    private async Task<List<KategoriDurumu>> KategoriDurumlariniGetirAsync(
        CancellationToken cancellationToken)
    {
        return await _dbContext.Kategoriler
            .AsNoTracking()
            .Select(x =>
                new KategoriDurumu
                {
                    Id =
                        x.Id,

                    UstKategoriId =
                        x.UstKategoriId,

                    AktifMi =
                        x.AktifMi
                })
            .ToListAsync(
                cancellationToken);
    }

    private static HashSet<int> EtkinAktifKategoriIdleriniHesapla(
        IReadOnlyCollection<KategoriDurumu> kategoriler)
    {
        var kategoriSozlugu =
            kategoriler.ToDictionary(
                x => x.Id);

        var etkinAktifKategoriIdleri =
            new HashSet<int>();

        foreach (var kategori in
                 kategoriler)
        {
            if (!kategori.AktifMi)
                continue;

            var ziyaretEdilenler =
                new HashSet<int>();

            var mevcutKategori =
                kategori;

            var etkinAktifMi =
                true;

            while (true)
            {
                if (!ziyaretEdilenler.Add(
                        mevcutKategori.Id))
                {
                    etkinAktifMi =
                        false;

                    break;
                }

                if (!mevcutKategori.AktifMi)
                {
                    etkinAktifMi =
                        false;

                    break;
                }

                if (!mevcutKategori.UstKategoriId.HasValue)
                    break;

                if (!kategoriSozlugu.TryGetValue(
                        mevcutKategori.UstKategoriId.Value,
                        out var ustKategori))
                {
                    etkinAktifMi =
                        false;

                    break;
                }

                mevcutKategori =
                    ustKategori;
            }

            if (etkinAktifMi)
            {
                etkinAktifKategoriIdleri.Add(
                    kategori.Id);
            }
        }

        return etkinAktifKategoriIdleri;
    }

    private async Task KullanilmayanUrunGorseliniSilAsync(
        string? gorselYolu)
    {
        if (string.IsNullOrWhiteSpace(
                gorselYolu))
        {
            return;
        }

        try
        {
            var baskaUrundeKullaniliyorMu =
                await _dbContext.Urunler
                    .AsNoTracking()
                    .AnyAsync(
                        x =>
                            x.GorselYolu ==
                            gorselYolu,
                        CancellationToken.None);

            if (baskaUrundeKullaniliyorMu)
                return;

            await _dosyaServisi.SilAsync(
                gorselYolu,
                CancellationToken.None);
        }
        catch (Exception exception)
        {
            _logger.LogError(
                exception,
                "Kullanılmayan ürün görseli silinemedi. Görsel yolu: {GorselYolu}",
                gorselYolu);
        }
    }

    private async Task<bool> UrunKoduKullaniliyorMuAsync(
        string? urunKodu,
        int? haricUrunId,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(
                urunKodu))
        {
            return false;
        }

        var temizUrunKodu =
            urunKodu.Trim();

        var sorgu =
            _dbContext.Urunler
                .AsNoTracking()
                .Where(x =>
                    x.UrunKodu ==
                    temizUrunKodu);

        if (haricUrunId.HasValue)
        {
            sorgu = sorgu.Where(x =>
                x.Id !=
                haricUrunId.Value);
        }

        return await sorgu.AnyAsync(
            cancellationToken);
    }

    private async Task<bool> SeoUrlKullaniliyorMuAsync(
        string seoUrl,
        int? haricUrunId,
        CancellationToken cancellationToken)
    {
        var sorgu =
            _dbContext.Urunler
                .AsNoTracking()
                .Where(x =>
                    x.SeoUrl ==
                    seoUrl);

        if (haricUrunId.HasValue)
        {
            sorgu = sorgu.Where(x =>
                x.Id !=
                haricUrunId.Value);
        }

        return await sorgu.AnyAsync(
            cancellationToken);
    }

    private async Task<string> SeoBasligiOlusturAsync(
        string urunAdi,
        string? seoBasligi,
        CancellationToken cancellationToken)
    {
        if (!string.IsNullOrWhiteSpace(
                seoBasligi))
        {
            return seoBasligi.Trim();
        }

        var sirketAdi =
            await _dbContext.FirmaGenelBilgileri
                .AsNoTracking()
                .Where(x =>
                    x.Id == 1)
                .Select(x =>
                    x.SirketAdi)
                .FirstOrDefaultAsync(
                    cancellationToken);

        return string.IsNullOrWhiteSpace(
            sirketAdi)
            ? urunAdi
            : $"{urunAdi} | {sirketAdi}";
    }

    private async Task<UrunListeDto?> ListeDtoGetirAsync(
        int id,
        CancellationToken cancellationToken)
    {
        var urun =
            await _dbContext.Urunler
                .AsNoTracking()
                .Where(x =>
                    x.Id == id)
                .Select(x =>
                    new UrunListeDto
                    {
                        Id =
                            x.Id,

                        KategoriId =
                            x.KategoriId,

                        KategoriAdi =
                            x.Kategori.KategoriAdi,

                        UrunAdi =
                            x.UrunAdi,

                        UrunKodu =
                            x.UrunKodu,

                        KisaAciklama =
                            x.KisaAciklama,

                        DetayliAciklama =
                            x.DetayliAciklama,

                        GorselYolu =
                            x.GorselYolu,

                        SatisBirimi =
                            x.SatisBirimi,

                        SeoUrl =
                            x.SeoUrl,

                        SeoBasligi =
                            x.SeoBasligi,

                        SeoAciklamasi =
                            x.SeoAciklamasi,

                        OneCikanMi =
                            x.OneCikanMi,

                        SiraNo =
                            x.SiraNo,

                        AktifMi =
                            x.AktifMi,

                        TeknikDetaySayisi =
                            x.UrunDetaylari.Count,

                        OlusturmaTarihi =
                            x.OlusturmaTarihi,

                        GuncellemeTarihi =
                            x.GuncellemeTarihi
                    })
                .FirstOrDefaultAsync(
                    cancellationToken);

        if (urun is not null)
        {
            urun.SatisBirimiAdi =
                urun.SatisBirimi.ToString();
        }

        return urun;
    }

    private static IQueryable<Urun> SiralamaUygula(
        IQueryable<Urun> sorgu,
        UrunSiralamaTuru siralama)
    {
        return siralama switch
        {
            UrunSiralamaTuru.SiraNoAzalan =>
                sorgu
                    .OrderByDescending(x =>
                        x.SiraNo)
                    .ThenBy(x =>
                        x.UrunAdi),

            UrunSiralamaTuru.UrunAdiArtan =>
                sorgu.OrderBy(x =>
                    x.UrunAdi),

            UrunSiralamaTuru.UrunAdiAzalan =>
                sorgu.OrderByDescending(x =>
                    x.UrunAdi),

            UrunSiralamaTuru.YeniEklenenler =>
                sorgu.OrderByDescending(x =>
                    x.OlusturmaTarihi),

            UrunSiralamaTuru.EskiEklenenler =>
                sorgu.OrderBy(x =>
                    x.OlusturmaTarihi),

            _ =>
                sorgu
                    .OrderBy(x =>
                        x.SiraNo)
                    .ThenBy(x =>
                        x.UrunAdi)
        };
    }

    private static string SeoUrlOlustur(
        string metin)
    {
        var duzenlenmisMetin =
            metin
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
                .Normalize(
                    NormalizationForm.FormD);

        var sonuc =
            new StringBuilder();

        foreach (var karakter in
                 duzenlenmisMetin)
        {
            if (CharUnicodeInfo.GetUnicodeCategory(
                    karakter) !=
                UnicodeCategory.NonSpacingMark)
            {
                sonuc.Append(
                    karakter);
            }
        }

        var seoUrl =
            Regex
                .Replace(
                    sonuc
                        .ToString()
                        .Normalize(
                            NormalizationForm.FormC),
                    @"[^a-z0-9]+",
                    "-")
                .Trim('-');

        if (string.IsNullOrWhiteSpace(
                seoUrl))
        {
            throw new IsKuraliException(
                "Ürün için geçerli bir SEO URL oluşturulamadı.");
        }

        return seoUrl;
    }

    private static string? SeoAciklamasiOlustur(
        string? seoAciklamasi,
        string? kisaAciklama)
    {
        if (!string.IsNullOrWhiteSpace(
                seoAciklamasi))
        {
            return seoAciklamasi.Trim();
        }

        return Temizle(
            kisaAciklama);
    }

    private static string? Temizle(
        string? deger)
    {
        return string.IsNullOrWhiteSpace(
                deger)
            ? null
            : deger.Trim();
    }

    private static void SatisBirimiAdlariniDoldur(
        IEnumerable<UrunListeDto> urunler)
    {
        foreach (var urun in
                 urunler)
        {
            urun.SatisBirimiAdi =
                urun.SatisBirimi.ToString();
        }
    }

    private sealed class KategoriDurumu
    {
        public int Id { get; init; }

        public int? UstKategoriId { get; init; }

        public bool AktifMi { get; init; }
    }
}