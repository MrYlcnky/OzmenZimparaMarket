using System.Data;
using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;
using ClosedXML.Excel;
using Microsoft.EntityFrameworkCore;
using OzmenZimparaMarket.Application.DTOs.ExcelDtos;
using OzmenZimparaMarket.Application.DTOs.UrunDtos;
using OzmenZimparaMarket.Application.Interfaces;
using OzmenZimparaMarket.Application.Interfaces.Excel;
using OzmenZimparaMarket.Application.Istisnalar;
using OzmenZimparaMarket.Application.Validasyonlar.Ortak;
using OzmenZimparaMarket.Domain.Entityler;
using OzmenZimparaMarket.Domain.Enumlar;
using OzmenZimparaMarket.Infrastructure.Veritabani;

namespace OzmenZimparaMarket.Infrastructure.Servisler.Excel;

public class ExcelUrunImportServisi : IExcelUrunImportServisi
{
    private const string UrunSayfaAdi = "Ürünler";
    private const string OrnekSatirIsareti = "__ORNEK_SATIR__";
    private const string TeknikOzellikBaslikOnEki = "Özellik:";

    private static readonly string[] SabitBasliklar =
    {
        "Ürün Kodu",
        "Ürün Adı *",
        "Kategori Yolu *",
        "Satış Birimi *",
        "Kısa Açıklama",
        "Detaylı Açıklama",
        "Görsel Yolu",
        "SEO URL",
        "SEO Başlığı",
        "SEO Açıklaması",
        "Öne Çıkan",
        "Sıra No",
        "Aktif"
    };

    private static readonly StringComparer KategoriYoluKarsilastiricisi =
        StringComparer.Create(
            CultureInfo.GetCultureInfo("tr-TR"),
            true);

    private static readonly StringComparer TeknikDetayAdiKarsilastiricisi =
        StringComparer.Create(
            CultureInfo.GetCultureInfo("tr-TR"),
            true);

    private static readonly StringComparer UrunKoduKarsilastiricisi =
        StringComparer.OrdinalIgnoreCase;

    private static readonly StringComparer SeoUrlKarsilastiricisi =
        StringComparer.OrdinalIgnoreCase;

    private readonly OzmenZimparaMarketDbContext _dbContext;
    private readonly IUrunServisi _urunServisi;

    public ExcelUrunImportServisi(
        OzmenZimparaMarketDbContext dbContext,
        IUrunServisi urunServisi)
    {
        _dbContext = dbContext;
        _urunServisi = urunServisi;
    }

    public async Task<UrunExcelAnalizSonucDto> AnalizEtAsync(
        Stream dosyaAkisi,
        string dosyaAdi,
        CancellationToken cancellationToken = default)
    {
        DosyaBilgileriniDogrula(
            dosyaAkisi,
            dosyaAdi);

        cancellationToken.ThrowIfCancellationRequested();

        using var workbook =
            ExcelDosyasiniAc(
                dosyaAkisi);

        var sayfa =
            workbook.Worksheets
                .FirstOrDefault(x =>
                    string.Equals(
                        x.Name,
                        UrunSayfaAdi,
                        StringComparison.OrdinalIgnoreCase));

        if (sayfa is null)
        {
            throw new IsKuraliException(
                $"Excel dosyasında '{UrunSayfaAdi}' sayfası bulunamadı.");
        }

        var teknikDetayTanimlari =
            await _dbContext.UrunDetayTanimlari
                .AsNoTracking()
                .OrderBy(x => x.SiraNo)
                .ThenBy(x => x.DetayAdi)
                .ToListAsync(cancellationToken);

        var teknikKolonlar =
            BasliklariDogrula(
                sayfa,
                teknikDetayTanimlari);

        var okunanSatirlar =
            ExcelSatirlariniOku(
                sayfa,
                teknikKolonlar);

        if (okunanSatirlar.Count == 0)
        {
            return BosAnalizSonucuOlustur();
        }

        cancellationToken.ThrowIfCancellationRequested();

        var mevcutUrunler =
            await _dbContext.Urunler
                .AsNoTracking()
                .Select(x =>
                    new MevcutUrunKaydi
                    {
                        Id = x.Id,
                        UrunKodu = x.UrunKodu,
                        SeoUrl = x.SeoUrl,
                        SiraNo = x.SiraNo
                    })
                .ToListAsync(cancellationToken);

        var kategoriler =
            await _dbContext.Kategoriler
                .AsNoTracking()
                .ToListAsync(cancellationToken);

        var mevcutUrunKoduSozlugu =
            mevcutUrunler
                .Where(x =>
                    !string.IsNullOrWhiteSpace(
                        x.UrunKodu))
                .ToDictionary(
                    x => x.UrunKodu!,
                    UrunKoduKarsilastiricisi);

        var mevcutSeoUrlSozlugu =
            mevcutUrunler
                .Where(x =>
                    !string.IsNullOrWhiteSpace(
                        x.SeoUrl))
                .ToDictionary(
                    x => x.SeoUrl,
                    SeoUrlKarsilastiricisi);

        var kategoriIdSozlugu =
            kategoriler
                .ToDictionary(
                    x => x.Id);

        var kategoriYoluSozlugu =
            KategoriYollariOlustur(
                kategoriler);

        var tekrarEdenUrunKodlari =
            TekrarEdenUrunKodlariniGetir(
                okunanSatirlar);

        foreach (var satir in okunanSatirlar)
        {
            cancellationToken.ThrowIfCancellationRequested();

            var urunKodu =
                satir.Dto.UrunKodu;

            if (!string.IsNullOrWhiteSpace(
                    urunKodu) &&
                mevcutUrunKoduSozlugu.TryGetValue(
                    urunKodu,
                    out var mevcutUrun))
            {
                satir.Hatalar.Clear();

                satir.MevcutUrun =
                    mevcutUrun;

                if (tekrarEdenUrunKodlari.Contains(
                        urunKodu))
                {
                    satir.Hatalar.Add(
                        "Aynı ürün kodu Excel dosyasında birden fazla kez kullanılamaz.");
                }

                continue;
            }

            if (!string.IsNullOrWhiteSpace(
                    urunKodu) &&
                tekrarEdenUrunKodlari.Contains(
                    urunKodu))
            {
                satir.Hatalar.Add(
                    "Aynı ürün kodu Excel dosyasında birden fazla kez kullanılamaz.");
            }

            TemelSatirDogrulamasiniYap(
                satir);

            if (!string.IsNullOrWhiteSpace(
                    satir.Dto.KategoriYolu))
            {
                if (!kategoriYoluSozlugu.TryGetValue(
                        satir.Dto.KategoriYolu,
                        out var kategori))
                {
                    satir.Hatalar.Add(
                        $"Kategori bulunamadı: {satir.Dto.KategoriYolu}");
                }
                else
                {
                    satir.KategoriId =
                        kategori.Id;

                    var urunAktifMi =
                        satir.Dto.AktifMi ??
                        true;

                    if (urunAktifMi &&
                        !KategoriEtkinAktifMi(
                            kategori,
                            kategoriIdSozlugu))
                    {
                        satir.Hatalar.Add(
                            "Aktif bir ürün, kendisi veya üst kategorilerinden biri pasif olan kategoriye bağlanamaz.");
                    }
                }
            }

            if (satir.Hatalar.Count > 0)
                continue;

            try
            {
                var seoKaynak =
                    string.IsNullOrWhiteSpace(
                        satir.Dto.SeoUrl)
                        ? satir.Dto.UrunAdi
                        : satir.Dto.SeoUrl;

                var hesaplananSeoUrl =
                    SeoUrlOlustur(
                        seoKaynak!);

                satir.HesaplananSeoUrl =
                    hesaplananSeoUrl;

                /*
                 * Ürün kodu yoksa mevcut ürünün
                 * tespitinde SEO URL ikinci anahtar
                 * olarak kullanılır.
                 */
                if (string.IsNullOrWhiteSpace(
                        urunKodu) &&
                    mevcutSeoUrlSozlugu.TryGetValue(
                        hesaplananSeoUrl,
                        out var seoIleMevcutUrun))
                {
                    satir.MevcutUrun =
                        seoIleMevcutUrun;

                    continue;
                }

                /*
                 * Ürün kodu gönderilmiş fakat bu kod
                 * mevcut ürünle eşleşmemişse, kullanılan
                 * bir SEO URL yeni ürün için kullanılamaz.
                 */
                if (mevcutSeoUrlSozlugu.ContainsKey(
                        hesaplananSeoUrl))
                {
                    satir.Hatalar.Add(
                        "Bu SEO URL başka bir ürün tarafından kullanılıyor.");
                }
            }
            catch (IsKuraliException exception)
            {
                satir.Hatalar.Add(
                    exception.Message);
            }
        }

        TekrarEdenPlanlananSeoUrlleriDogrula(
            okunanSatirlar);

        SiraNumaralariniHesapla(
            okunanSatirlar,
            mevcutUrunler);

        var satirSonuclari =
            okunanSatirlar
                .OrderBy(x =>
                    x.Dto.SatirNo)
                .Select(
                    SatirAnalizSonucunuOlustur)
                .ToList();

        var hataliSatirSayisi =
            satirSonuclari.Count(
                x => !x.GecerliMi);

        var olusturulacakUrunSayisi =
            satirSonuclari.Count(
                x => x.OlusturulacakMi);

        return new UrunExcelAnalizSonucDto
        {
            ToplamSatirSayisi =
                satirSonuclari.Count,

            GecerliSatirSayisi =
                satirSonuclari.Count(
                    x => x.GecerliMi),

            HataliSatirSayisi =
                hataliSatirSayisi,

            MevcutUrunSayisi =
                satirSonuclari.Count(
                    x => x.MevcutMu),

            OlusturulacakUrunSayisi =
                olusturulacakUrunSayisi,

            AktarimaHazirMi =
                hataliSatirSayisi == 0 &&
                olusturulacakUrunSayisi > 0,

            Satirlar =
                satirSonuclari
        };
    }

    public async Task<UrunExcelAktarimSonucDto> AktarAsync(
        Stream dosyaAkisi,
        string dosyaAdi,
        CancellationToken cancellationToken = default)
    {
        DosyaBilgileriniDogrula(
            dosyaAkisi,
            dosyaAdi);

        cancellationToken.ThrowIfCancellationRequested();

        byte[] dosyaIcerigi;

        using (var memoryStream = new MemoryStream())
        {
            if (dosyaAkisi.CanSeek)
                dosyaAkisi.Position = 0;

            await dosyaAkisi.CopyToAsync(
                memoryStream,
                cancellationToken);

            dosyaIcerigi =
                memoryStream.ToArray();
        }

        if (dosyaIcerigi.Length == 0)
        {
            throw new IsKuraliException(
                "Excel dosyası boş.");
        }

        var executionStrategy =
            _dbContext.Database
                .CreateExecutionStrategy();

        return await executionStrategy.ExecuteAsync(
            async () =>
            {
                await using var transaction =
                    await _dbContext.Database
                        .BeginTransactionAsync(
                            IsolationLevel.Serializable,
                            cancellationToken);

                try
                {
                    await using var analizAkisi =
                        new MemoryStream(
                            dosyaIcerigi,
                            writable: false);

                    var analizSonucu =
                        await AnalizEtAsync(
                            analizAkisi,
                            dosyaAdi,
                            cancellationToken);

                    if (analizSonucu.HataliSatirSayisi > 0)
                    {
                        throw new IsKuraliException(
                            "Excel dosyasında hatalı ürün satırları bulunduğu için aktarım yapılamaz.");
                    }

                    if (analizSonucu.OlusturulacakUrunSayisi == 0)
                    {
                        await transaction.CommitAsync(
                            cancellationToken);

                        return new UrunExcelAktarimSonucDto
                        {
                            ToplamSatirSayisi =
                                analizSonucu.ToplamSatirSayisi,

                            EklenenUrunSayisi =
                                0,

                            MevcutUrunSayisi =
                                analizSonucu.MevcutUrunSayisi,

                            EklenenTeknikDetaySayisi =
                                0,

                            EklenenUrunKodlari =
                                new List<string>()
                        };
                    }

                    await using var okumaAkisi =
                        new MemoryStream(
                            dosyaIcerigi,
                            writable: false);

                    using var workbook =
                        ExcelDosyasiniAc(
                            okumaAkisi);

                    var sayfa =
                        workbook.Worksheets
                            .FirstOrDefault(x =>
                                string.Equals(
                                    x.Name,
                                    UrunSayfaAdi,
                                    StringComparison.OrdinalIgnoreCase));

                    if (sayfa is null)
                    {
                        throw new IsKuraliException(
                            $"Excel dosyasında '{UrunSayfaAdi}' sayfası bulunamadı.");
                    }

                    var teknikDetayTanimlari =
                        await _dbContext.UrunDetayTanimlari
                            .AsNoTracking()
                            .OrderBy(x => x.SiraNo)
                            .ThenBy(x => x.DetayAdi)
                            .ToListAsync(
                                cancellationToken);

                    var teknikKolonlar =
                        BasliklariDogrula(
                            sayfa,
                            teknikDetayTanimlari);

                    var excelSatirlari =
                        ExcelSatirlariniOku(
                            sayfa,
                            teknikKolonlar);

                    var kategoriler =
                        await _dbContext.Kategoriler
                            .AsNoTracking()
                            .ToListAsync(
                                cancellationToken);

                    var kategoriYoluSozlugu =
                        KategoriYollariOlustur(
                            kategoriler);

                    var analizSatiriSozlugu =
                        analizSonucu.Satirlar
                            .ToDictionary(
                                x => x.SatirNo);

                    var eklenenUrunKodlari =
                        new List<string>();

                    var eklenenUrunSayisi =
                        0;

                    var eklenenTeknikDetaySayisi =
                        0;

                    foreach (var satir in
                             excelSatirlari.OrderBy(
                                 x => x.Dto.SatirNo))
                    {
                        cancellationToken.ThrowIfCancellationRequested();

                        if (!analizSatiriSozlugu.TryGetValue(
                                satir.Dto.SatirNo,
                                out var analizSatiri))
                        {
                            continue;
                        }

                        if (!analizSatiri.OlusturulacakMi)
                            continue;

                        if (!kategoriYoluSozlugu.TryGetValue(
                                satir.Dto.KategoriYolu,
                                out var kategori))
                        {
                            throw new IsKuraliException(
                                $"Kategori bulunamadı: {satir.Dto.KategoriYolu}");
                        }

                        if (!satir.Dto.SatisBirimi.HasValue)
                        {
                            throw new IsKuraliException(
                                $"{satir.Dto.SatirNo}. Excel satırında geçerli satış birimi bulunamadı.");
                        }

                        if (!analizSatiri.HesaplananSiraNo.HasValue)
                        {
                            throw new IsKuraliException(
                                $"{satir.Dto.SatirNo}. Excel satırı için sıra numarası hesaplanamadı.");
                        }

                        if (string.IsNullOrWhiteSpace(
                                analizSatiri.HesaplananSeoUrl))
                        {
                            throw new IsKuraliException(
                                $"{satir.Dto.SatirNo}. Excel satırı için SEO URL hesaplanamadı.");
                        }

                        var teknikDetaylar =
                            satir.Dto.TeknikDetaylar
                                .SelectMany(
                                    teknikDetay =>
                                        teknikDetay.Degerler
                                            .Select(
                                                (deger, index) =>
                                                    new UrunTeknikDetayKaydetDto
                                                    {
                                                        UrunDetayTanimiId =
                                                            teknikDetay.UrunDetayTanimiId,

                                                        DetayDegeri =
                                                            deger,

                                                        SiraNo =
                                                            index,

                                                        AktifMi =
                                                            true
                                                    }))
                                .ToList();

                        await _urunServisi.EkleAsync(
                            new UrunEkleDto
                            {
                                KategoriId =
                                    kategori.Id,

                                UrunAdi =
                                    satir.Dto.UrunAdi,

                                UrunKodu =
                                    satir.Dto.UrunKodu,

                                KisaAciklama =
                                    satir.Dto.KisaAciklama,

                                DetayliAciklama =
                                    satir.Dto.DetayliAciklama,

                                GorselYolu =
                                    satir.Dto.GorselYolu,

                                SatisBirimi =
                                    satir.Dto.SatisBirimi.Value,

                                SeoUrl =
                                    analizSatiri.HesaplananSeoUrl,

                                SeoBasligi =
                                    satir.Dto.SeoBasligi,

                                SeoAciklamasi =
                                    satir.Dto.SeoAciklamasi,

                                OneCikanMi =
                                    satir.Dto.OneCikanMi ??
                                    false,

                                SiraNo =
                                    analizSatiri.HesaplananSiraNo.Value,

                                AktifMi =
                                    satir.Dto.AktifMi ??
                                    true,

                                TeknikDetaylar =
                                    teknikDetaylar
                            },
                            cancellationToken);

                        eklenenUrunSayisi++;

                        if (!string.IsNullOrWhiteSpace(
                                satir.Dto.UrunKodu))
                        {
                            eklenenUrunKodlari.Add(
                                satir.Dto.UrunKodu!);
                        }

                        eklenenTeknikDetaySayisi +=
                            teknikDetaylar.Count;
                    }

                    await transaction.CommitAsync(
                        cancellationToken);

                    return new UrunExcelAktarimSonucDto
                    {
                        ToplamSatirSayisi =
                            analizSonucu.ToplamSatirSayisi,

                        EklenenUrunSayisi =
                            eklenenUrunSayisi,

                        MevcutUrunSayisi =
                            analizSonucu.MevcutUrunSayisi,

                        EklenenTeknikDetaySayisi =
                            eklenenTeknikDetaySayisi,

                        EklenenUrunKodlari =
                            eklenenUrunKodlari
                    };
                }
                catch
                {
                    await transaction.RollbackAsync(
                        cancellationToken);

                    throw;
                }
            });
    }

    private static void DosyaBilgileriniDogrula(
        Stream dosyaAkisi,
        string dosyaAdi)
    {
        if (dosyaAkisi is null ||
            !dosyaAkisi.CanRead)
        {
            throw new IsKuraliException(
                "Excel dosyası okunamadı.");
        }

        if (string.IsNullOrWhiteSpace(
                dosyaAdi))
        {
            throw new IsKuraliException(
                "Excel dosya adı bulunamadı.");
        }

        if (!string.Equals(
                Path.GetExtension(
                    dosyaAdi),
                ".xlsx",
                StringComparison.OrdinalIgnoreCase))
        {
            throw new IsKuraliException(
                "Yalnızca .xlsx uzantılı Excel dosyaları kullanılabilir.");
        }
    }

    private static XLWorkbook ExcelDosyasiniAc(
        Stream dosyaAkisi)
    {
        try
        {
            if (dosyaAkisi.CanSeek)
                dosyaAkisi.Position = 0;

            return new XLWorkbook(
                dosyaAkisi);
        }
        catch (Exception exception)
            when (exception is not OperationCanceledException)
        {
            throw new IsKuraliException(
                "Excel dosyası açılamadı. Dosyanın geçerli bir .xlsx dosyası olduğundan emin olun.");
        }
    }

    private static List<TeknikKolon> BasliklariDogrula(
        IXLWorksheet sayfa,
        IReadOnlyList<UrunDetayTanimi> teknikDetayTanimlari)
    {
        for (var kolon = 0;
             kolon < SabitBasliklar.Length;
             kolon++)
        {
            var bulunanBaslik =
                sayfa.Cell(
                        1,
                        kolon + 1)
                    .GetString()
                    .Trim();

            var beklenenBaslik =
                SabitBasliklar[kolon];

            if (string.Equals(
                    bulunanBaslik,
                    beklenenBaslik,
                    StringComparison.Ordinal))
            {
                continue;
            }

            throw new IsKuraliException(
                $"Excel şablonu geçersiz. {kolon + 1}. kolon başlığı '{beklenenBaslik}' olmalıdır.");
        }

        var teknikDetaySozlugu =
            teknikDetayTanimlari
                .ToDictionary(
                    x => x.DetayAdi,
                    TeknikDetayAdiKarsilastiricisi);

        var sonuc =
            new List<TeknikKolon>();

        var bulunanDetayTanimiIdleri =
            new HashSet<int>();

        var sonKolon =
            sayfa.LastColumnUsed()?
                .ColumnNumber() ??
            SabitBasliklar.Length;

        for (var kolon =
                 SabitBasliklar.Length + 1;
             kolon <= sonKolon;
             kolon++)
        {
            var baslik =
                sayfa.Cell(
                        1,
                        kolon)
                    .GetString()
                    .Trim();

            if (string.IsNullOrWhiteSpace(
                    baslik))
            {
                continue;
            }

            if (!baslik.StartsWith(
                    TeknikOzellikBaslikOnEki,
                    StringComparison.Ordinal))
            {
                throw new IsKuraliException(
                    $"Excel şablonu geçersiz. {kolon}. kolondaki '{baslik}' başlığı tanınmıyor.");
            }

            var detayAdi =
                baslik[
                    TeknikOzellikBaslikOnEki.Length..]
                    .Trim();

            if (string.IsNullOrWhiteSpace(
                    detayAdi))
            {
                throw new IsKuraliException(
                    $"{kolon}. kolondaki ürün özelliği adı boş olamaz.");
            }

            if (!teknikDetaySozlugu.TryGetValue(
                    detayAdi,
                    out var detayTanimi))
            {
                throw new IsKuraliException(
                    $"Excel şablonundaki '{detayAdi}' ürün özelliği sistemde bulunamadı. Güncel ürün şablonunu indirip tekrar deneyin.");
            }

            if (!bulunanDetayTanimiIdleri.Add(
                    detayTanimi.Id))
            {
                throw new IsKuraliException(
                    $"'{detayTanimi.DetayAdi}' ürün özelliği Excel dosyasında birden fazla kolon olarak kullanılamaz.");
            }

            sonuc.Add(
                new TeknikKolon
                {
                    KolonNo =
                        kolon,

                    Tanim =
                        detayTanimi
                });
        }

        return sonuc;
    }

    private static List<OkunanUrunSatiri> ExcelSatirlariniOku(
        IXLWorksheet sayfa,
        IReadOnlyList<TeknikKolon> teknikKolonlar)
    {
        var sonuc =
            new List<OkunanUrunSatiri>();

        var sonSatir =
            sayfa.LastRowUsed()?
                .RowNumber() ??
            1;

        var sonKolon =
            sayfa.LastColumnUsed()?
                .ColumnNumber() ??
            SabitBasliklar.Length;

        for (var satirNo = 2;
             satirNo <= sonSatir;
             satirNo++)
        {
            var satir =
                sayfa.Row(
                    satirNo);

            if (OrnekSatirMi(
                    satir,
                    sonKolon))
            {
                continue;
            }

            if (SatirTamamenBosMu(
                    satir,
                    teknikKolonlar))
            {
                continue;
            }

            var okunanSatir =
                new OkunanUrunSatiri
                {
                    Dto =
                        new UrunExcelSatirDto
                        {
                            SatirNo =
                                satirNo,

                            UrunKodu =
                                Temizle(
                                    satir.Cell(1)
                                        .GetString()),

                            UrunAdi =
                                satir.Cell(2)
                                    .GetString()
                                    .Trim(),

                            KategoriYolu =
                                KategoriYolunuNormalizeEt(
                                    satir.Cell(3)
                                        .GetString())
                                ?? string.Empty,

                            KisaAciklama =
                                Temizle(
                                    satir.Cell(5)
                                        .GetString()),

                            DetayliAciklama =
                                Temizle(
                                    satir.Cell(6)
                                        .GetString()),

                            GorselYolu =
                                Temizle(
                                    satir.Cell(7)
                                        .GetString()),

                            SeoUrl =
                                Temizle(
                                    satir.Cell(8)
                                        .GetString()),

                            SeoBasligi =
                                Temizle(
                                    satir.Cell(9)
                                        .GetString()),

                            SeoAciklamasi =
                                Temizle(
                                    satir.Cell(10)
                                        .GetString())
                        }
                };

            SatisBirimiOku(
                satir.Cell(4),
                okunanSatir);

            BoolDegeriOku(
                satir.Cell(11),
                "Öne Çıkan",
                okunanSatir,
                deger =>
                    okunanSatir.Dto.OneCikanMi =
                        deger);

            SiraNoOku(
                satir.Cell(12),
                okunanSatir);

            BoolDegeriOku(
                satir.Cell(13),
                "Aktif",
                okunanSatir,
                deger =>
                    okunanSatir.Dto.AktifMi =
                        deger);

            TeknikDetaylariOku(
                satir,
                teknikKolonlar,
                okunanSatir);

            sonuc.Add(
                okunanSatir);
        }

        return sonuc;
    }

    private static void SatisBirimiOku(
        IXLCell hucre,
        OkunanUrunSatiri satir)
    {
        var metin =
            hucre.GetString()
                .Trim();

        if (string.IsNullOrWhiteSpace(
                metin))
        {
            satir.Dto.SatisBirimi =
                null;

            return;
        }

        if (Enum.TryParse<SatisBirimi>(
                metin,
                true,
                out var satisBirimi) &&
            Enum.IsDefined(
                satisBirimi))
        {
            satir.Dto.SatisBirimi =
                satisBirimi;

            return;
        }

        satir.Hatalar.Add(
            $"Satış Birimi geçersizdir. Geçerli değerler: {string.Join(", ", Enum.GetNames<SatisBirimi>())}.");
    }

    private static void BoolDegeriOku(
        IXLCell hucre,
        string alanAdi,
        OkunanUrunSatiri satir,
        Action<bool?> degerAta)
    {
        var metin =
            hucre.GetString()
                .Trim();

        if (string.IsNullOrWhiteSpace(
                metin))
        {
            degerAta(
                null);

            return;
        }

        if (string.Equals(
                metin,
                "Evet",
                StringComparison.OrdinalIgnoreCase) ||
            string.Equals(
                metin,
                "True",
                StringComparison.OrdinalIgnoreCase) ||
            metin == "1")
        {
            degerAta(
                true);

            return;
        }

        if (string.Equals(
                metin,
                "Hayır",
                StringComparison.OrdinalIgnoreCase) ||
            string.Equals(
                metin,
                "Hayir",
                StringComparison.OrdinalIgnoreCase) ||
            string.Equals(
                metin,
                "False",
                StringComparison.OrdinalIgnoreCase) ||
            metin == "0")
        {
            degerAta(
                false);

            return;
        }

        satir.Hatalar.Add(
            $"{alanAdi} alanı yalnızca Evet veya Hayır olabilir.");

        degerAta(
            null);
    }

    private static void SiraNoOku(
        IXLCell hucre,
        OkunanUrunSatiri satir)
    {
        var metin =
            hucre.GetString()
                .Trim();

        if (string.IsNullOrWhiteSpace(
                metin))
        {
            satir.Dto.SiraNo =
                null;

            return;
        }

        if (!int.TryParse(
                metin,
                NumberStyles.Integer,
                CultureInfo.InvariantCulture,
                out var siraNo) &&
            !int.TryParse(
                metin,
                out siraNo))
        {
            satir.Hatalar.Add(
                "Sıra No alanı tam sayı olmalıdır.");

            return;
        }

        if (siraNo < 0)
        {
            satir.Hatalar.Add(
                "Sıra numarası negatif olamaz.");

            return;
        }

        satir.Dto.SiraNo =
            siraNo;
    }

    private static void TeknikDetaylariOku(
        IXLRow excelSatiri,
        IReadOnlyList<TeknikKolon> teknikKolonlar,
        OkunanUrunSatiri satir)
    {
        foreach (var teknikKolon in
                 teknikKolonlar)
        {
            var hamDeger =
                excelSatiri.Cell(
                        teknikKolon.KolonNo)
                    .GetString()
                    .Trim();

            if (string.IsNullOrWhiteSpace(
                    hamDeger))
            {
                continue;
            }

            var hamParcalar =
                hamDeger
                    .Split(
                        '|',
                        StringSplitOptions.None)
                    .Select(x =>
                        x.Trim())
                    .ToList();

            if (hamParcalar.Any(
                    string.IsNullOrWhiteSpace))
            {
                satir.Hatalar.Add(
                    $"'{teknikKolon.Tanim.DetayAdi}' ürün özelliğinde | karakterleri arasında boş değer bulunamaz.");
            }

            var degerler =
                hamParcalar
                    .Where(x =>
                        !string.IsNullOrWhiteSpace(x))
                    .ToList();

            if (degerler.Count == 0)
                continue;

            if (!teknikKolon.Tanim.AktifMi)
            {
                satir.Hatalar.Add(
                    $"'{teknikKolon.Tanim.DetayAdi}' ürün özelliği pasiftir. Yeni ürüne değer eklenemez.");
            }

            if (!teknikKolon.Tanim.CokluDegerMi &&
                degerler.Count > 1)
            {
                satir.Hatalar.Add(
                    $"'{teknikKolon.Tanim.DetayAdi}' ürün özelliği birden fazla değer kabul etmemektedir.");
            }

            var tekrarEdenDegerVarMi =
                degerler
                    .GroupBy(
                        x => x,
                        StringComparer.OrdinalIgnoreCase)
                    .Any(x =>
                        x.Count() > 1);

            if (tekrarEdenDegerVarMi)
            {
                satir.Hatalar.Add(
                    $"'{teknikKolon.Tanim.DetayAdi}' ürün özelliğinde aynı değer birden fazla kez kullanılamaz.");
            }

            foreach (var deger in
                     degerler)
            {
                if (deger.Length <= 500)
                    continue;

                satir.Hatalar.Add(
                    $"'{teknikKolon.Tanim.DetayAdi}' ürün özelliğinin her değeri en fazla 500 karakter olabilir.");

                break;
            }

            satir.Dto.TeknikDetaylar.Add(
                new UrunExcelTeknikDetaySatirDto
                {
                    UrunDetayTanimiId =
                        teknikKolon.Tanim.Id,

                    DetayAdi =
                        teknikKolon.Tanim.DetayAdi,

                    Degerler =
                        degerler
                });
        }
    }

    private static void TemelSatirDogrulamasiniYap(
        OkunanUrunSatiri satir)
    {
        var dto =
            satir.Dto;

        if (!string.IsNullOrWhiteSpace(
                dto.UrunKodu) &&
            dto.UrunKodu.Length > 100)
        {
            satir.Hatalar.Add(
                "Ürün kodu en fazla 100 karakter olabilir.");
        }

        if (string.IsNullOrWhiteSpace(
                dto.UrunAdi))
        {
            satir.Hatalar.Add(
                "Ürün adı zorunludur.");
        }
        else if (dto.UrunAdi.Length > 200)
        {
            satir.Hatalar.Add(
                "Ürün adı en fazla 200 karakter olabilir.");
        }

        if (string.IsNullOrWhiteSpace(
                dto.KategoriYolu))
        {
            satir.Hatalar.Add(
                "Kategori Yolu zorunludur.");
        }

        if (!dto.SatisBirimi.HasValue)
        {
            satir.Hatalar.Add(
                "Satış Birimi zorunludur.");
        }

        if (dto.KisaAciklama?.Length > 1000)
        {
            satir.Hatalar.Add(
                "Kısa açıklama en fazla 1000 karakter olabilir.");
        }

        if (dto.DetayliAciklama?.Length > 10000)
        {
            satir.Hatalar.Add(
                "Detaylı açıklama en fazla 10000 karakter olabilir.");
        }

        if (dto.GorselYolu?.Length > 500)
        {
            satir.Hatalar.Add(
                "Görsel yolu en fazla 500 karakter olabilir.");
        }
        else if (!GorselYoluDogrulama
                     .UrunGorselYoluGecerliMi(
                         dto.GorselYolu))
        {
            satir.Hatalar.Add(
                "Ürün görsel yolu geçersizdir.");
        }

        if (dto.SeoUrl?.Length > 250)
        {
            satir.Hatalar.Add(
                "SEO URL en fazla 250 karakter olabilir.");
        }

        if (dto.SeoBasligi?.Length > 250)
        {
            satir.Hatalar.Add(
                "SEO başlığı en fazla 250 karakter olabilir.");
        }

        if (dto.SeoAciklamasi?.Length > 500)
        {
            satir.Hatalar.Add(
                "SEO açıklaması en fazla 500 karakter olabilir.");
        }
    }

    private static HashSet<string> TekrarEdenUrunKodlariniGetir(
        IEnumerable<OkunanUrunSatiri> satirlar)
    {
        return satirlar
            .Where(x =>
                !string.IsNullOrWhiteSpace(
                    x.Dto.UrunKodu))
            .GroupBy(
                x => x.Dto.UrunKodu!,
                UrunKoduKarsilastiricisi)
            .Where(x =>
                x.Count() > 1)
            .Select(x =>
                x.Key)
            .ToHashSet(
                UrunKoduKarsilastiricisi);
    }

    private static void TekrarEdenPlanlananSeoUrlleriDogrula(
        IEnumerable<OkunanUrunSatiri> satirlar)
    {
        var tekrarEdenSeoUrller =
            satirlar
                .Where(x =>
                    x.MevcutUrun is null &&
                    x.Hatalar.Count == 0 &&
                    !string.IsNullOrWhiteSpace(
                        x.HesaplananSeoUrl))
                .GroupBy(
                    x => x.HesaplananSeoUrl!,
                    SeoUrlKarsilastiricisi)
                .Where(x =>
                    x.Count() > 1)
                .Select(x =>
                    x.Key)
                .ToHashSet(
                    SeoUrlKarsilastiricisi);

        foreach (var satir in
                 satirlar)
        {
            if (string.IsNullOrWhiteSpace(
                    satir.HesaplananSeoUrl) ||
                !tekrarEdenSeoUrller.Contains(
                    satir.HesaplananSeoUrl))
            {
                continue;
            }

            satir.Hatalar.Add(
                "Aynı SEO URL Excel dosyasında birden fazla yeni ürün için oluşuyor.");
        }
    }

    private static void SiraNumaralariniHesapla(
        IEnumerable<OkunanUrunSatiri> satirlar,
        IReadOnlyCollection<MevcutUrunKaydi> mevcutUrunler)
    {
        var enBuyukSiraNo =
            mevcutUrunler.Count == 0
                ? -1
                : mevcutUrunler.Max(
                    x => x.SiraNo);

        foreach (var satir in
                 satirlar
                     .Where(x =>
                         x.MevcutUrun is null &&
                         x.Hatalar.Count == 0)
                     .OrderBy(x =>
                         x.Dto.SatirNo))
        {
            if (satir.Dto.SiraNo.HasValue)
            {
                satir.HesaplananSiraNo =
                    satir.Dto.SiraNo.Value;

                enBuyukSiraNo =
                    Math.Max(
                        enBuyukSiraNo,
                        satir.Dto.SiraNo.Value);

                continue;
            }

            enBuyukSiraNo++;

            satir.HesaplananSiraNo =
                enBuyukSiraNo;
        }
    }

    private static UrunExcelAnalizSatirDto SatirAnalizSonucunuOlustur(
        OkunanUrunSatiri satir)
    {
        var teknikDetaySayisi =
            satir.Dto.TeknikDetaylar
                .Sum(x =>
                    x.Degerler.Count);

        if (satir.Hatalar.Count > 0)
        {
            return new UrunExcelAnalizSatirDto
            {
                SatirNo =
                    satir.Dto.SatirNo,

                UrunKodu =
                    satir.Dto.UrunKodu,

                UrunAdi =
                    satir.Dto.UrunAdi,

                KategoriYolu =
                    satir.Dto.KategoriYolu,

                Durum =
                    "Hatalı",

                GecerliMi =
                    false,

                MevcutMu =
                    false,

                OlusturulacakMi =
                    false,

                HesaplananSiraNo =
                    satir.HesaplananSiraNo,

                HesaplananSeoUrl =
                    satir.HesaplananSeoUrl,

                TeknikDetaySayisi =
                    teknikDetaySayisi,

                Hatalar =
                    satir.Hatalar
                        .Distinct()
                        .ToList()
            };
        }

        if (satir.MevcutUrun is not null)
        {
            return new UrunExcelAnalizSatirDto
            {
                SatirNo =
                    satir.Dto.SatirNo,

                UrunKodu =
                    satir.Dto.UrunKodu,

                UrunAdi =
                    satir.Dto.UrunAdi,

                KategoriYolu =
                    satir.Dto.KategoriYolu,

                Durum =
                    "Mevcut",

                GecerliMi =
                    true,

                MevcutMu =
                    true,

                OlusturulacakMi =
                    false,

                HesaplananSiraNo =
                    satir.MevcutUrun.SiraNo,

                HesaplananSeoUrl =
                    satir.MevcutUrun.SeoUrl,

                TeknikDetaySayisi =
                    teknikDetaySayisi
            };
        }

        return new UrunExcelAnalizSatirDto
        {
            SatirNo =
                satir.Dto.SatirNo,

            UrunKodu =
                satir.Dto.UrunKodu,

            UrunAdi =
                satir.Dto.UrunAdi,

            KategoriYolu =
                satir.Dto.KategoriYolu,

            Durum =
                "Yeni",

            GecerliMi =
                true,

            MevcutMu =
                false,

            OlusturulacakMi =
                true,

            HesaplananSiraNo =
                satir.HesaplananSiraNo,

            HesaplananSeoUrl =
                satir.HesaplananSeoUrl,

            TeknikDetaySayisi =
                teknikDetaySayisi
        };
    }

    private static UrunExcelAnalizSonucDto BosAnalizSonucuOlustur()
    {
        return new UrunExcelAnalizSonucDto
        {
            ToplamSatirSayisi = 0,
            GecerliSatirSayisi = 0,
            HataliSatirSayisi = 0,
            MevcutUrunSayisi = 0,
            OlusturulacakUrunSayisi = 0,
            AktarimaHazirMi = false,
            Satirlar = new List<UrunExcelAnalizSatirDto>()
        };
    }

    private static Dictionary<string, Kategori> KategoriYollariOlustur(
        IReadOnlyCollection<Kategori> kategoriler)
    {
        var kategoriIdSozlugu =
            kategoriler.ToDictionary(
                x => x.Id);

        var kategoriYoluOnbellegi =
            new Dictionary<int, string>();

        string KategoriYoluGetir(
            int kategoriId,
            HashSet<int> ziyaretEdilenler)
        {
            if (kategoriYoluOnbellegi.TryGetValue(
                    kategoriId,
                    out var onbellektekiYol))
            {
                return onbellektekiYol;
            }

            if (!kategoriIdSozlugu.TryGetValue(
                    kategoriId,
                    out var kategori))
            {
                return string.Empty;
            }

            if (!ziyaretEdilenler.Add(
                    kategoriId))
            {
                return kategori.KategoriAdi.Trim();
            }

            string yol;

            if (kategori.UstKategoriId.HasValue &&
                kategoriIdSozlugu.ContainsKey(
                    kategori.UstKategoriId.Value))
            {
                var ustYol =
                    KategoriYoluGetir(
                        kategori.UstKategoriId.Value,
                        ziyaretEdilenler);

                yol =
                    string.IsNullOrWhiteSpace(
                        ustYol)
                        ? kategori.KategoriAdi.Trim()
                        : $"{ustYol} / {kategori.KategoriAdi.Trim()}";
            }
            else
            {
                yol =
                    kategori.KategoriAdi.Trim();
            }

            ziyaretEdilenler.Remove(
                kategoriId);

            var normalizeYol =
                KategoriYolunuNormalizeEt(
                    yol) ??
                yol;

            kategoriYoluOnbellegi[
                kategoriId] =
                normalizeYol;

            return normalizeYol;
        }

        var sonuc =
            new Dictionary<string, Kategori>(
                KategoriYoluKarsilastiricisi);

        foreach (var kategori in
                 kategoriler)
        {
            var yol =
                KategoriYoluGetir(
                    kategori.Id,
                    new HashSet<int>());

            sonuc[yol] =
                kategori;
        }

        return sonuc;
    }

    private static bool KategoriEtkinAktifMi(
        Kategori kategori,
        IReadOnlyDictionary<int, Kategori> kategoriIdSozlugu)
    {
        var ziyaretEdilenler =
            new HashSet<int>();

        var mevcutKategori =
            kategori;

        while (true)
        {
            if (!ziyaretEdilenler.Add(
                    mevcutKategori.Id))
            {
                return false;
            }

            if (!mevcutKategori.AktifMi)
                return false;

            if (!mevcutKategori.UstKategoriId.HasValue)
                return true;

            if (!kategoriIdSozlugu.TryGetValue(
                    mevcutKategori.UstKategoriId.Value,
                    out var ustKategori))
            {
                return false;
            }

            mevcutKategori =
                ustKategori;
        }
    }

    private static bool OrnekSatirMi(
        IXLRow satir,
        int sonKolon)
    {
        for (var kolon = 1;
             kolon <= sonKolon;
             kolon++)
        {
            if (string.Equals(
                    satir.Cell(kolon)
                        .GetString()
                        .Trim(),
                    OrnekSatirIsareti,
                    StringComparison.Ordinal))
            {
                return true;
            }
        }

        return false;
    }

    private static bool SatirTamamenBosMu(
        IXLRow satir,
        IReadOnlyCollection<TeknikKolon> teknikKolonlar)
    {
        for (var kolon = 1;
             kolon <= SabitBasliklar.Length;
             kolon++)
        {
            if (!string.IsNullOrWhiteSpace(
                    satir.Cell(kolon)
                        .GetString()))
            {
                return false;
            }
        }

        foreach (var teknikKolon in
                 teknikKolonlar)
        {
            if (!string.IsNullOrWhiteSpace(
                    satir.Cell(
                            teknikKolon.KolonNo)
                        .GetString()))
            {
                return false;
            }
        }

        return true;
    }

    private static string? KategoriYolunuNormalizeEt(
        string? kategoriYolu)
    {
        if (string.IsNullOrWhiteSpace(
                kategoriYolu))
        {
            return null;
        }

        var parcalar =
            kategoriYolu
                .Split(
                    '/',
                    StringSplitOptions.RemoveEmptyEntries |
                    StringSplitOptions.TrimEntries)
                .Where(x =>
                    !string.IsNullOrWhiteSpace(x))
                .Select(x =>
                    x.Trim())
                .ToList();

        if (parcalar.Count == 0)
            return null;

        return string.Join(
            " / ",
            parcalar);
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
            Regex.Replace(
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

    private static string? Temizle(
        string? deger)
    {
        return string.IsNullOrWhiteSpace(
                deger)
            ? null
            : deger.Trim();
    }

    private sealed class OkunanUrunSatiri
    {
        public UrunExcelSatirDto Dto { get; set; } =
            new();

        public List<string> Hatalar { get; set; } =
            new();

        public MevcutUrunKaydi? MevcutUrun { get; set; }

        public int? KategoriId { get; set; }

        public int? HesaplananSiraNo { get; set; }

        public string? HesaplananSeoUrl { get; set; }
    }

    private sealed class MevcutUrunKaydi
    {
        public int Id { get; set; }

        public string? UrunKodu { get; set; }

        public string SeoUrl { get; set; } =
            string.Empty;

        public int SiraNo { get; set; }
    }

    private sealed class TeknikKolon
    {
        public int KolonNo { get; set; }

        public UrunDetayTanimi Tanim { get; set; } =
            null!;
    }
}