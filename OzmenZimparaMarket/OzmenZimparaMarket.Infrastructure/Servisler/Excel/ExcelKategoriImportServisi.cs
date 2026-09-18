using ClosedXML.Excel;
using Microsoft.EntityFrameworkCore;
using OzmenZimparaMarket.Application.DTOs.ExcelDtos;
using OzmenZimparaMarket.Application.DTOs.KategoriDtos;
using OzmenZimparaMarket.Application.Interfaces;
using OzmenZimparaMarket.Application.Interfaces.Excel;
using OzmenZimparaMarket.Application.Istisnalar;
using OzmenZimparaMarket.Application.Validasyonlar.Ortak;
using OzmenZimparaMarket.Infrastructure.Veritabani;
using System.Data;
using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;

namespace OzmenZimparaMarket.Infrastructure.Servisler.Excel;

public class ExcelKategoriImportServisi : IExcelKategoriImportServisi
{
    private const string KategoriSayfaAdi = "Kategoriler";
    private const string OrnekSatirIsareti = "__ORNEK_SATIR__";

    private static readonly string[] BeklenenBasliklar =
    {
        "Kategori Adı *",
        "Üst Kategori Yolu",
        "Açıklama",
        "Görsel Yolu",
        "SEO URL",
        "SEO Başlığı",
        "SEO Açıklaması",
        "Ana Sayfada Göster",
        "Sıra No",
        "Aktif"
    };

    private static readonly StringComparer KategoriYoluKarsilastiricisi =
        StringComparer.Create(
            CultureInfo.GetCultureInfo("tr-TR"),
            true);

    private readonly OzmenZimparaMarketDbContext _dbContext;
    private readonly IKategoriServisi _kategoriServisi;

    public ExcelKategoriImportServisi(
        OzmenZimparaMarketDbContext dbContext,
        IKategoriServisi kategoriServisi)
    {
        _dbContext = dbContext;
        _kategoriServisi = kategoriServisi;
    }

    public async Task<KategoriExcelAnalizSonucDto> AnalizEtAsync(
        Stream dosyaAkisi,
        string dosyaAdi,
        CancellationToken cancellationToken = default)
    {
        if (dosyaAkisi is null || !dosyaAkisi.CanRead)
            throw new IsKuraliException("Excel dosyası okunamadı.");

        if (string.IsNullOrWhiteSpace(dosyaAdi))
            throw new IsKuraliException("Excel dosya adı bulunamadı.");

        if (!string.Equals(
                Path.GetExtension(dosyaAdi),
                ".xlsx",
                StringComparison.OrdinalIgnoreCase))
        {
            throw new IsKuraliException(
                "Yalnızca .xlsx uzantılı Excel dosyaları kullanılabilir.");
        }

        cancellationToken.ThrowIfCancellationRequested();

        using var workbook = ExcelDosyasiniAc(dosyaAkisi);

        var sayfa = workbook.Worksheets
            .FirstOrDefault(x =>
                string.Equals(
                    x.Name,
                    KategoriSayfaAdi,
                    StringComparison.OrdinalIgnoreCase));

        if (sayfa is null)
        {
            throw new IsKuraliException(
                $"Excel dosyasında '{KategoriSayfaAdi}' sayfası bulunamadı.");
        }

        BasliklariDogrula(sayfa);

        var okunanSatirlar = ExcelSatirlariniOku(sayfa);

        if (okunanSatirlar.Count == 0)
        {
            return new KategoriExcelAnalizSonucDto
            {
                ToplamSatirSayisi = 0,
                GecerliSatirSayisi = 0,
                HataliSatirSayisi = 0,
                MevcutKategoriSayisi = 0,
                OlusturulacakKategoriSayisi = 0,
                AktarimaHazirMi = false,
                Satirlar = new List<KategoriExcelAnalizSatirDto>()
            };
        }

        TekrarEdenKategoriYollariniDogrula(
            okunanSatirlar);

        var mevcutKategoriler = await _dbContext.Kategoriler
            .AsNoTracking()
            .Select(x => new MevcutKategoriKaydi
            {
                Id = x.Id,
                UstKategoriId = x.UstKategoriId,
                KategoriAdi = x.KategoriAdi,
                SeoUrl = x.SeoUrl,
                SiraNo = x.SiraNo
            })
            .ToListAsync(cancellationToken);

        cancellationToken.ThrowIfCancellationRequested();

        var mevcutKategoriYollari =
            MevcutKategoriYollariniOlustur(
                mevcutKategoriler);

        var mevcutSeoUrlSahipleri =
            mevcutKategoriler
                .Where(x => !string.IsNullOrWhiteSpace(x.SeoUrl))
                .ToDictionary(
                    x => x.SeoUrl,
                    x => x.Id,
                    StringComparer.OrdinalIgnoreCase);

        var enBuyukSiraNumaralari =
            EnBuyukSiraNumaralariniOlustur(
                mevcutKategoriler,
                mevcutKategoriYollari);

        var planlananKategoriler =
            new Dictionary<string, PlanlananKategori>(
                KategoriYoluKarsilastiricisi);

        var planlananSeoUrlSahipleri =
            new Dictionary<string, string>(
                StringComparer.OrdinalIgnoreCase);

        var hataliAcikKategoriYollari =
            okunanSatirlar
                .Where(x => x.Hatalar.Count > 0)
                .Select(x => x.KategoriYolu)
                .Where(x => !string.IsNullOrWhiteSpace(x))
                .ToHashSet(
                    KategoriYoluKarsilastiricisi);

        var islemSirasindakiHataliYollar =
            new HashSet<string>(
                KategoriYoluKarsilastiricisi);

        foreach (var satir in okunanSatirlar
                     .OrderBy(x => x.Seviye)
                     .ThenBy(x => x.Dto.SatirNo))
        {
            cancellationToken.ThrowIfCancellationRequested();

            if (satir.Hatalar.Count > 0)
            {
                islemSirasindakiHataliYollar.Add(
                    satir.KategoriYolu);

                continue;
            }

            if (mevcutKategoriYollari.ContainsKey(
                    satir.KategoriYolu))
            {
                continue;
            }

            var ustKategoriHazirMi =
                UstKategoriZinciriniHazirla(
                    satir,
                    mevcutKategoriYollari,
                    planlananKategoriler,
                    mevcutSeoUrlSahipleri,
                    planlananSeoUrlSahipleri,
                    enBuyukSiraNumaralari,
                    hataliAcikKategoriYollari,
                    islemSirasindakiHataliYollar);

            if (!ustKategoriHazirMi)
            {
                islemSirasindakiHataliYollar.Add(
                    satir.KategoriYolu);

                continue;
            }

            var kategoriOlusturulduMu =
                AcikKategoriPlanla(
                    satir,
                    planlananKategoriler,
                    mevcutSeoUrlSahipleri,
                    planlananSeoUrlSahipleri,
                    enBuyukSiraNumaralari);

            if (!kategoriOlusturulduMu)
            {
                islemSirasindakiHataliYollar.Add(
                    satir.KategoriYolu);
            }
        }

        var satirSonuclari =
            okunanSatirlar
                .OrderBy(x => x.Dto.SatirNo)
                .Select(satir =>
                    SatirAnalizSonucunuOlustur(
                        satir,
                        mevcutKategoriYollari,
                        planlananKategoriler))
                .ToList();

        var hataliSatirSayisi =
            satirSonuclari.Count(x => !x.GecerliMi);

        var sonuc = new KategoriExcelAnalizSonucDto
        {
            ToplamSatirSayisi =
                satirSonuclari.Count,

            GecerliSatirSayisi =
                satirSonuclari.Count - hataliSatirSayisi,

            HataliSatirSayisi =
                hataliSatirSayisi,

            MevcutKategoriSayisi =
                satirSonuclari.Count(x => x.MevcutMu),

            OlusturulacakKategoriSayisi =
                planlananKategoriler.Count,

            AktarimaHazirMi =
                hataliSatirSayisi == 0 &&
                planlananKategoriler.Count > 0,

            Satirlar =
                satirSonuclari
        };

        return sonuc;
    }

    public async Task<KategoriExcelAktarimSonucDto> AktarAsync(
        Stream dosyaAkisi,
        string dosyaAdi,
        CancellationToken cancellationToken = default)
    {
        if (dosyaAkisi is null || !dosyaAkisi.CanRead)
            throw new IsKuraliException("Excel dosyası okunamadı.");

        if (string.IsNullOrWhiteSpace(dosyaAdi))
            throw new IsKuraliException("Excel dosya adı bulunamadı.");

        if (!string.Equals(
                Path.GetExtension(dosyaAdi),
                ".xlsx",
                StringComparison.OrdinalIgnoreCase))
        {
            throw new IsKuraliException(
                "Yalnızca .xlsx uzantılı Excel dosyaları kullanılabilir.");
        }

        cancellationToken.ThrowIfCancellationRequested();

        byte[] dosyaIcerigi;

        using (var memoryStream = new MemoryStream())
        {
            if (dosyaAkisi.CanSeek)
                dosyaAkisi.Position = 0;

            await dosyaAkisi.CopyToAsync(
                memoryStream,
                cancellationToken);

            dosyaIcerigi = memoryStream.ToArray();
        }

        if (dosyaIcerigi.Length == 0)
            throw new IsKuraliException("Excel dosyası boş.");

        var executionStrategy =
            _dbContext.Database.CreateExecutionStrategy();

        return await executionStrategy.ExecuteAsync(
            async () =>
            {
                await using var transaction =
                    await _dbContext.Database.BeginTransactionAsync(
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
                            "Excel dosyasında hatalı satırlar bulunduğu için aktarım yapılamaz.");
                    }

                    await using var okumaAkisi =
                        new MemoryStream(
                            dosyaIcerigi,
                            writable: false);

                    using var workbook =
                        ExcelDosyasiniAc(okumaAkisi);

                    var sayfa =
                        workbook.Worksheets
                            .FirstOrDefault(x =>
                                string.Equals(
                                    x.Name,
                                    KategoriSayfaAdi,
                                    StringComparison.OrdinalIgnoreCase));

                    if (sayfa is null)
                    {
                        throw new IsKuraliException(
                            $"Excel dosyasında '{KategoriSayfaAdi}' sayfası bulunamadı.");
                    }

                    BasliklariDogrula(sayfa);

                    var excelSatirlari =
                        ExcelSatirlariniOku(sayfa);

                    var mevcutKategoriler =
                        await _dbContext.Kategoriler
                            .AsNoTracking()
                            .Select(x =>
                                new MevcutKategoriKaydi
                                {
                                    Id = x.Id,
                                    UstKategoriId =
                                        x.UstKategoriId,

                                    KategoriAdi =
                                        x.KategoriAdi,

                                    SeoUrl =
                                        x.SeoUrl,

                                    SiraNo =
                                        x.SiraNo
                                })
                            .ToListAsync(
                                cancellationToken);

                    var mevcutKategoriYollari =
                        MevcutKategoriYollariniOlustur(
                            mevcutKategoriler);

                    var kategoriIdleri =
                        new Dictionary<string, int>(
                            KategoriYoluKarsilastiricisi);

                    foreach (var kategori in
                             mevcutKategoriYollari)
                    {
                        kategoriIdleri[kategori.Key] =
                            kategori.Value.Id;
                    }

                    var enBuyukSiraNumaralari =
                        EnBuyukSiraNumaralariniOlustur(
                            mevcutKategoriler,
                            mevcutKategoriYollari);

                    var olusturulanKategoriYollari =
                        new List<string>();

                    var excelSatirindanEklenen =
                        0;

                    var otomatikOlusturulan =
                        0;

                    foreach (var satir in
                             excelSatirlari
                                 .OrderBy(x => x.Seviye)
                                 .ThenBy(x => x.Dto.SatirNo))
                    {
                        cancellationToken
                            .ThrowIfCancellationRequested();

                        if (satir.Hatalar.Count > 0)
                        {
                            throw new IsKuraliException(
                                $"{satir.Dto.SatirNo}. Excel satırı geçersiz.");
                        }

                        var otomatikEklenenSayisi =
                            await EksikUstKategorileriOlusturAsync(
                                satir,
                                kategoriIdleri,
                                enBuyukSiraNumaralari,
                                olusturulanKategoriYollari,
                                cancellationToken);

                        otomatikOlusturulan +=
                            otomatikEklenenSayisi;

                        if (kategoriIdleri.ContainsKey(
                                satir.KategoriYolu))
                        {
                            continue;
                        }

                        var ustKategoriYolu =
                            satir.Dto.UstKategoriYolu;

                        int? ustKategoriId =
                            null;

                        if (!string.IsNullOrWhiteSpace(
                                ustKategoriYolu))
                        {
                            if (!kategoriIdleri.TryGetValue(
                                    ustKategoriYolu,
                                    out var bulunanUstKategoriId))
                            {
                                throw new IsKuraliException(
                                    $"'{satir.KategoriYolu}' kategorisinin üst kategorisi bulunamadı.");
                            }

                            ustKategoriId =
                                bulunanUstKategoriId;
                        }

                        var siraNo =
                            satir.Dto.SiraNo ??
                            SonrakiSiraNoGetir(
                                ustKategoriYolu,
                                enBuyukSiraNumaralari);

                        var eklenenKategori =
                            await _kategoriServisi.EkleAsync(
                                new KategoriEkleDto
                                {
                                    UstKategoriId =
                                        ustKategoriId,

                                    KategoriAdi =
                                        satir.Dto.KategoriAdi,

                                    Aciklama =
                                        satir.Dto.Aciklama,

                                    GorselYolu =
                                        satir.Dto.GorselYolu,

                                    SeoUrl =
                                        satir.Dto.SeoUrl,

                                    SeoBasligi =
                                        satir.Dto.SeoBasligi,

                                    SeoAciklamasi =
                                        satir.Dto.SeoAciklamasi,

                                    AnaSayfadaGosterilsinMi =
                                        satir.Dto.AnaSayfadaGosterilsinMi
                                        ?? false,

                                    SiraNo =
                                        siraNo,

                                    AktifMi =
                                        satir.Dto.AktifMi
                                        ?? true
                                },
                                cancellationToken);

                        kategoriIdleri[
                            satir.KategoriYolu] =
                            eklenenKategori.Id;

                        EnBuyukSiraNoGuncelle(
                            ustKategoriYolu,
                            siraNo,
                            enBuyukSiraNumaralari);

                        olusturulanKategoriYollari.Add(
                            satir.KategoriYolu);

                        excelSatirindanEklenen++;
                    }

                    await transaction.CommitAsync(
                        cancellationToken);

                    return new KategoriExcelAktarimSonucDto
                    {
                        ToplamSatirSayisi =
                            analizSonucu.ToplamSatirSayisi,

                        EklenenKategoriSayisi =
                            excelSatirindanEklenen +
                            otomatikOlusturulan,

                        ExcelSatirindanEklenenKategoriSayisi =
                            excelSatirindanEklenen,

                        OtomatikOlusturulanUstKategoriSayisi =
                            otomatikOlusturulan,

                        MevcutKategoriSayisi =
                            analizSonucu.MevcutKategoriSayisi,

                        OlusturulanKategoriYollari =
                            olusturulanKategoriYollari
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

    private async Task<int> EksikUstKategorileriOlusturAsync(
        OkunanKategoriSatiri kaynakSatir,
        IDictionary<string, int> kategoriIdleri,
        IDictionary<string, int> enBuyukSiraNumaralari,
        ICollection<string> olusturulanKategoriYollari,
        CancellationToken cancellationToken)
    {
        var kategoriParcalari =
            KategoriYoluParcalariniGetir(
                kaynakSatir.Dto.UstKategoriYolu);

        if (kategoriParcalari.Count == 0)
            return 0;

        var eklenenKategoriSayisi =
            0;

        var mevcutYol =
            string.Empty;

        int? ustKategoriId =
            null;

        foreach (var kategoriAdi in
                 kategoriParcalari)
        {
            cancellationToken
                .ThrowIfCancellationRequested();

            var oncekiYol =
                mevcutYol;

            mevcutYol =
                KategoriTamYolunuOlustur(
                    mevcutYol,
                    kategoriAdi);

            if (kategoriIdleri.TryGetValue(
                    mevcutYol,
                    out var mevcutKategoriId))
            {
                ustKategoriId =
                    mevcutKategoriId;

                continue;
            }

            var siraNo =
                SonrakiSiraNoGetir(
                    oncekiYol,
                    enBuyukSiraNumaralari);

            var eklenenKategori =
                await _kategoriServisi.EkleAsync(
                    new KategoriEkleDto
                    {
                        UstKategoriId =
                            ustKategoriId,

                        KategoriAdi =
                            kategoriAdi,

                        Aciklama =
                            null,

                        GorselYolu =
                            null,

                        SeoUrl =
                            null,

                        SeoBasligi =
                            null,

                        SeoAciklamasi =
                            null,

                        AnaSayfadaGosterilsinMi =
                            false,

                        SiraNo =
                            siraNo,

                        AktifMi =
                            true
                    },
                    cancellationToken);

            kategoriIdleri[mevcutYol] =
                eklenenKategori.Id;

            EnBuyukSiraNoGuncelle(
                oncekiYol,
                siraNo,
                enBuyukSiraNumaralari);

            olusturulanKategoriYollari.Add(
                mevcutYol);

            ustKategoriId =
                eklenenKategori.Id;

            eklenenKategoriSayisi++;
        }

        return eklenenKategoriSayisi;
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

    private static void BasliklariDogrula(
        IXLWorksheet sayfa)
    {
        for (var kolon = 0;
             kolon < BeklenenBasliklar.Length;
             kolon++)
        {
            var bulunanBaslik =
                sayfa.Cell(
                        1,
                        kolon + 1)
                    .GetString()
                    .Trim();

            var beklenenBaslik =
                BeklenenBasliklar[kolon];

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
    }

    private static List<OkunanKategoriSatiri> ExcelSatirlariniOku(
        IXLWorksheet sayfa)
    {
        var sonuc =
            new List<OkunanKategoriSatiri>();

        var sonSatir =
            sayfa.LastRowUsed()?.RowNumber() ?? 1;

        for (var satirNo = 2;
             satirNo <= sonSatir;
             satirNo++)
        {
            var satir =
                sayfa.Row(satirNo);

            var teknikIsaret =
                satir.Cell(11)
                    .GetString()
                    .Trim();

            if (string.Equals(
                    teknikIsaret,
                    OrnekSatirIsareti,
                    StringComparison.Ordinal))
            {
                continue;
            }

            if (SatirTamamenBosMu(satir))
                continue;

            var okunanSatir =
                new OkunanKategoriSatiri
                {
                    Dto = new KategoriExcelSatirDto
                    {
                        SatirNo =
                            satirNo,

                        KategoriAdi =
                            satir.Cell(1)
                                .GetString()
                                .Trim(),

                        UstKategoriYolu =
                            Temizle(
                                satir.Cell(2)
                                    .GetString()),

                        Aciklama =
                            Temizle(
                                satir.Cell(3)
                                    .GetString()),

                        GorselYolu =
                            Temizle(
                                satir.Cell(4)
                                    .GetString()),

                        SeoUrl =
                            Temizle(
                                satir.Cell(5)
                                    .GetString()),

                        SeoBasligi =
                            Temizle(
                                satir.Cell(6)
                                    .GetString()),

                        SeoAciklamasi =
                            Temizle(
                                satir.Cell(7)
                                    .GetString())
                    }
                };

            BoolDegeriOku(
                satir.Cell(8),
                "Ana Sayfada Göster",
                okunanSatir,
                deger =>
                    okunanSatir.Dto
                        .AnaSayfadaGosterilsinMi =
                        deger);

            SiraNoOku(
                satir.Cell(9),
                okunanSatir);

            BoolDegeriOku(
                satir.Cell(10),
                "Aktif",
                okunanSatir,
                deger =>
                    okunanSatir.Dto.AktifMi =
                        deger);

            TemelSatirDogrulamasiniYap(
                okunanSatir);

            var normalizeUstKategoriYolu =
                KategoriYolunuNormalizeEt(
                    okunanSatir.Dto.UstKategoriYolu);

            okunanSatir.Dto.UstKategoriYolu =
                normalizeUstKategoriYolu;

            if (!string.IsNullOrWhiteSpace(
                    okunanSatir.Dto.KategoriAdi))
            {
                okunanSatir.KategoriYolu =
                    KategoriTamYolunuOlustur(
                        normalizeUstKategoriYolu,
                        okunanSatir.Dto.KategoriAdi);

                okunanSatir.Seviye =
                    KategoriYoluParcalariniGetir(
                            okunanSatir.KategoriYolu)
                        .Count;
            }

            sonuc.Add(
                okunanSatir);
        }

        return sonuc;
    }

    private static void TemelSatirDogrulamasiniYap(
        OkunanKategoriSatiri satir)
    {
        var dto =
            satir.Dto;

        if (string.IsNullOrWhiteSpace(
                dto.KategoriAdi))
        {
            satir.Hatalar.Add(
                "Kategori adı zorunludur.");
        }
        else if (dto.KategoriAdi.Length > 200)
        {
            satir.Hatalar.Add(
                "Kategori adı en fazla 200 karakter olabilir.");
        }

        if (dto.Aciklama?.Length > 2000)
        {
            satir.Hatalar.Add(
                "Kategori açıklaması en fazla 2000 karakter olabilir.");
        }

        if (dto.GorselYolu?.Length > 500)
        {
            satir.Hatalar.Add(
                "Görsel yolu en fazla 500 karakter olabilir.");
        }
        else if (!GorselYoluDogrulama
                     .KategoriGorselYoluGecerliMi(
                         dto.GorselYolu))
        {
            satir.Hatalar.Add(
                "Kategori görsel yolu geçersizdir.");
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

        var ustKategoriParcalari =
            KategoriYoluParcalariniGetir(
                dto.UstKategoriYolu);

        foreach (var kategoriAdi in
                 ustKategoriParcalari)
        {
            if (kategoriAdi.Length <= 200)
                continue;

            satir.Hatalar.Add(
                $"Üst kategori yolundaki '{kategoriAdi}' değeri 200 karakterden uzun olamaz.");
        }
    }

    private static void TekrarEdenKategoriYollariniDogrula(
        List<OkunanKategoriSatiri> satirlar)
    {
        var tekrarEdenYollar =
            satirlar
                .Where(x =>
                    !string.IsNullOrWhiteSpace(
                        x.KategoriYolu))
                .GroupBy(
                    x => x.KategoriYolu,
                    KategoriYoluKarsilastiricisi)
                .Where(x =>
                    x.Count() > 1)
                .Select(x =>
                    x.Key)
                .ToHashSet(
                    KategoriYoluKarsilastiricisi);

        foreach (var satir in
                 satirlar)
        {
            if (!tekrarEdenYollar.Contains(
                    satir.KategoriYolu))
            {
                continue;
            }

            satir.Hatalar.Add(
                "Aynı kategori yolu Excel dosyasında birden fazla kez tanımlanmış.");
        }
    }

    private static Dictionary<string, MevcutKategoriKaydi>
        MevcutKategoriYollariniOlustur(
            IReadOnlyList<MevcutKategoriKaydi> kategoriler)
    {
        var kategoriIdSozlugu =
            kategoriler.ToDictionary(
                x => x.Id);

        var kategoriYollari =
            new Dictionary<int, string>();

        string KategoriYoluGetir(
            int kategoriId,
            HashSet<int> ziyaretEdilenler)
        {
            if (kategoriYollari.TryGetValue(
                    kategoriId,
                    out var mevcutYol))
            {
                return mevcutYol;
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
                    KategoriTamYolunuOlustur(
                        ustYol,
                        kategori.KategoriAdi);
            }
            else
            {
                yol =
                    kategori.KategoriAdi.Trim();
            }

            ziyaretEdilenler.Remove(
                kategoriId);

            kategoriYollari[kategoriId] =
                KategoriYolunuNormalizeEt(
                    yol) ?? yol;

            return kategoriYollari[
                kategoriId];
        }

        foreach (var kategori in
                 kategoriler)
        {
            KategoriYoluGetir(
                kategori.Id,
                new HashSet<int>());
        }

        var sonuc =
            new Dictionary<string, MevcutKategoriKaydi>(
                KategoriYoluKarsilastiricisi);

        foreach (var kategori in
                 kategoriler)
        {
            var yol =
                kategoriYollari[
                    kategori.Id];

            kategori.KategoriYolu =
                yol;

            sonuc[yol] =
                kategori;
        }

        return sonuc;
    }

    private static Dictionary<string, int>
        EnBuyukSiraNumaralariniOlustur(
            IReadOnlyList<MevcutKategoriKaydi> kategoriler,
            IReadOnlyDictionary<string, MevcutKategoriKaydi> kategoriYollari)
    {
        var idYolSozlugu =
            kategoriYollari.Values
                .ToDictionary(
                    x => x.Id,
                    x => x.KategoriYolu);

        var sonuc =
            new Dictionary<string, int>(
                KategoriYoluKarsilastiricisi);

        foreach (var kategori in
                 kategoriler)
        {
            var ustKategoriYolu =
                kategori.UstKategoriId.HasValue &&
                idYolSozlugu.TryGetValue(
                    kategori.UstKategoriId.Value,
                    out var bulunanUstYol)
                    ? bulunanUstYol
                    : string.Empty;

            if (!sonuc.TryGetValue(
                    ustKategoriYolu,
                    out var mevcutEnBuyukSiraNo))
            {
                sonuc[ustKategoriYolu] =
                    kategori.SiraNo;

                continue;
            }

            sonuc[ustKategoriYolu] =
                Math.Max(
                    mevcutEnBuyukSiraNo,
                    kategori.SiraNo);
        }

        return sonuc;
    }

    private static bool UstKategoriZinciriniHazirla(
        OkunanKategoriSatiri kaynakSatir,
        IReadOnlyDictionary<string, MevcutKategoriKaydi> mevcutKategoriler,
        IDictionary<string, PlanlananKategori> planlananKategoriler,
        IReadOnlyDictionary<string, int> mevcutSeoUrlSahipleri,
        IDictionary<string, string> planlananSeoUrlSahipleri,
        IDictionary<string, int> enBuyukSiraNumaralari,
        IReadOnlySet<string> hataliAcikKategoriYollari,
        IReadOnlySet<string> islemSirasindakiHataliYollar)
    {
        var ustKategoriParcalari =
            KategoriYoluParcalariniGetir(
                kaynakSatir.Dto.UstKategoriYolu);

        var mevcutYol =
            string.Empty;

        foreach (var kategoriAdi in
                 ustKategoriParcalari)
        {
            var oncekiYol =
                mevcutYol;

            mevcutYol =
                KategoriTamYolunuOlustur(
                    mevcutYol,
                    kategoriAdi);

            if (mevcutKategoriler.ContainsKey(
                    mevcutYol))
            {
                continue;
            }

            if (planlananKategoriler.ContainsKey(
                    mevcutYol))
            {
                continue;
            }

            if (hataliAcikKategoriYollari.Contains(
                    mevcutYol) ||
                islemSirasindakiHataliYollar.Contains(
                    mevcutYol))
            {
                kaynakSatir.Hatalar.Add(
                    $"Üst kategori '{mevcutYol}' Excel dosyasında hatalı tanımlandığı için bu kategori işlenemiyor.");

                return false;
            }

            var seoUrl =
                SeoUrlOlustur(
                    kategoriAdi);

            if (SeoUrlCakisiyorMu(
                    seoUrl,
                    mevcutSeoUrlSahipleri,
                    planlananSeoUrlSahipleri))
            {
                kaynakSatir.Hatalar.Add(
                    $"Otomatik oluşturulacak üst kategori '{mevcutYol}' için '{seoUrl}' SEO URL değeri başka bir kategori tarafından kullanılıyor.");

                return false;
            }

            var siraNo =
                SonrakiSiraNoGetir(
                    oncekiYol,
                    enBuyukSiraNumaralari);

            var plan =
                new PlanlananKategori
                {
                    KategoriAdi =
                        kategoriAdi,

                    KategoriYolu =
                        mevcutYol,

                    UstKategoriYolu =
                        Temizle(
                            oncekiYol),

                    SeoUrl =
                        seoUrl,

                    SiraNo =
                        siraNo,

                    DolayliOlusturulduMu =
                        true
                };

            planlananKategoriler[
                mevcutYol] =
                plan;

            planlananSeoUrlSahipleri[
                seoUrl] =
                mevcutYol;

            EnBuyukSiraNoGuncelle(
                oncekiYol,
                siraNo,
                enBuyukSiraNumaralari);
        }

        return true;
    }

    private static bool AcikKategoriPlanla(
        OkunanKategoriSatiri satir,
        IDictionary<string, PlanlananKategori> planlananKategoriler,
        IReadOnlyDictionary<string, int> mevcutSeoUrlSahipleri,
        IDictionary<string, string> planlananSeoUrlSahipleri,
        IDictionary<string, int> enBuyukSiraNumaralari)
    {
        if (planlananKategoriler.ContainsKey(
                satir.KategoriYolu))
        {
            return true;
        }

        string seoUrl;

        try
        {
            seoUrl =
                SeoUrlOlustur(
                    string.IsNullOrWhiteSpace(
                        satir.Dto.SeoUrl)
                        ? satir.Dto.KategoriAdi
                        : satir.Dto.SeoUrl);
        }
        catch (IsKuraliException exception)
        {
            satir.Hatalar.Add(
                exception.Message);

            return false;
        }

        if (SeoUrlCakisiyorMu(
                seoUrl,
                mevcutSeoUrlSahipleri,
                planlananSeoUrlSahipleri))
        {
            satir.Hatalar.Add(
                $"'{seoUrl}' SEO URL değeri başka bir kategori tarafından kullanılıyor.");

            return false;
        }

        var ustKategoriYolu =
            satir.Dto.UstKategoriYolu ??
            string.Empty;

        var siraNo =
            satir.Dto.SiraNo ??
            SonrakiSiraNoGetir(
                ustKategoriYolu,
                enBuyukSiraNumaralari);

        var plan =
            new PlanlananKategori
            {
                KategoriAdi =
                    satir.Dto.KategoriAdi,

                KategoriYolu =
                    satir.KategoriYolu,

                UstKategoriYolu =
                    satir.Dto.UstKategoriYolu,

                SeoUrl =
                    seoUrl,

                SiraNo =
                    siraNo,

                DolayliOlusturulduMu =
                    false,

                KaynakSatirNo =
                    satir.Dto.SatirNo
            };

        planlananKategoriler[
            satir.KategoriYolu] =
            plan;

        planlananSeoUrlSahipleri[
            seoUrl] =
            satir.KategoriYolu;

        EnBuyukSiraNoGuncelle(
            ustKategoriYolu,
            siraNo,
            enBuyukSiraNumaralari);

        return true;
    }

    private static KategoriExcelAnalizSatirDto
        SatirAnalizSonucunuOlustur(
            OkunanKategoriSatiri satir,
            IReadOnlyDictionary<string, MevcutKategoriKaydi> mevcutKategoriler,
            IReadOnlyDictionary<string, PlanlananKategori> planlananKategoriler)
    {
        if (satir.Hatalar.Count > 0)
        {
            return new KategoriExcelAnalizSatirDto
            {
                SatirNo =
                    satir.Dto.SatirNo,

                KategoriAdi =
                    satir.Dto.KategoriAdi,

                KategoriYolu =
                    satir.KategoriYolu,

                Durum =
                    "Hatalı",

                GecerliMi =
                    false,

                MevcutMu =
                    false,

                OlusturulacakMi =
                    false,

                Hatalar =
                    satir.Hatalar
                        .Distinct()
                        .ToList()
            };
        }

        if (mevcutKategoriler.TryGetValue(
                satir.KategoriYolu,
                out var mevcutKategori))
        {
            return new KategoriExcelAnalizSatirDto
            {
                SatirNo =
                    satir.Dto.SatirNo,

                KategoriAdi =
                    satir.Dto.KategoriAdi,

                KategoriYolu =
                    satir.KategoriYolu,

                Durum =
                    "Mevcut",

                GecerliMi =
                    true,

                MevcutMu =
                    true,

                OlusturulacakMi =
                    false,

                HesaplananSiraNo =
                    mevcutKategori.SiraNo,

                HesaplananSeoUrl =
                    mevcutKategori.SeoUrl
            };
        }

        if (planlananKategoriler.TryGetValue(
                satir.KategoriYolu,
                out var planlananKategori))
        {
            return new KategoriExcelAnalizSatirDto
            {
                SatirNo =
                    satir.Dto.SatirNo,

                KategoriAdi =
                    satir.Dto.KategoriAdi,

                KategoriYolu =
                    satir.KategoriYolu,

                Durum =
                    "Yeni",

                GecerliMi =
                    true,

                MevcutMu =
                    false,

                OlusturulacakMi =
                    true,

                HesaplananSiraNo =
                    planlananKategori.SiraNo,

                HesaplananSeoUrl =
                    planlananKategori.SeoUrl
            };
        }

        return new KategoriExcelAnalizSatirDto
        {
            SatirNo =
                satir.Dto.SatirNo,

            KategoriAdi =
                satir.Dto.KategoriAdi,

            KategoriYolu =
                satir.KategoriYolu,

            Durum =
                "Hatalı",

            GecerliMi =
                false,

            MevcutMu =
                false,

            OlusturulacakMi =
                false,

            Hatalar = new List<string>
            {
                "Kategori analiz edilemedi."
            }
        };
    }

    private static bool SeoUrlCakisiyorMu(
        string seoUrl,
        IReadOnlyDictionary<string, int> mevcutSeoUrlSahipleri,
        IDictionary<string, string> planlananSeoUrlSahipleri)
    {
        return mevcutSeoUrlSahipleri.ContainsKey(
                   seoUrl) ||
               planlananSeoUrlSahipleri.ContainsKey(
                   seoUrl);
    }

    private static int SonrakiSiraNoGetir(
        string? ustKategoriYolu,
        IDictionary<string, int> enBuyukSiraNumaralari)
    {
        var anahtar =
            ustKategoriYolu ??
            string.Empty;

        if (!enBuyukSiraNumaralari.TryGetValue(
                anahtar,
                out var enBuyukSiraNo))
        {
            return 1;
        }

        return enBuyukSiraNo + 1;
    }

    private static void EnBuyukSiraNoGuncelle(
        string? ustKategoriYolu,
        int siraNo,
        IDictionary<string, int> enBuyukSiraNumaralari)
    {
        var anahtar =
            ustKategoriYolu ??
            string.Empty;

        if (!enBuyukSiraNumaralari.TryGetValue(
                anahtar,
                out var mevcutSiraNo))
        {
            enBuyukSiraNumaralari[
                anahtar] =
                siraNo;

            return;
        }

        enBuyukSiraNumaralari[
            anahtar] =
            Math.Max(
                mevcutSiraNo,
                siraNo);
    }

    private static void BoolDegeriOku(
        IXLCell hucre,
        string alanAdi,
        OkunanKategoriSatiri satir,
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
        OkunanKategoriSatiri satir)
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

    private static bool SatirTamamenBosMu(
        IXLRow satir)
    {
        for (var kolon = 1;
             kolon <= BeklenenBasliklar.Length;
             kolon++)
        {
            if (!string.IsNullOrWhiteSpace(
                    satir.Cell(kolon)
                        .GetString()))
            {
                return false;
            }
        }

        return true;
    }

    private static string KategoriTamYolunuOlustur(
        string? ustKategoriYolu,
        string kategoriAdi)
    {
        var temizKategoriAdi =
            kategoriAdi.Trim();

        if (string.IsNullOrWhiteSpace(
                ustKategoriYolu))
        {
            return temizKategoriAdi;
        }

        return
            $"{ustKategoriYolu.Trim()} / {temizKategoriAdi}";
    }

    private static string? KategoriYolunuNormalizeEt(
        string? kategoriYolu)
    {
        var parcalar =
            KategoriYoluParcalariniGetir(
                kategoriYolu);

        if (parcalar.Count == 0)
            return null;

        return string.Join(
            " / ",
            parcalar);
    }

    private static List<string> KategoriYoluParcalariniGetir(
        string? kategoriYolu)
    {
        if (string.IsNullOrWhiteSpace(
                kategoriYolu))
        {
            return new List<string>();
        }

        return kategoriYolu
            .Split(
                '/',
                StringSplitOptions.RemoveEmptyEntries |
                StringSplitOptions.TrimEntries)
            .Where(x =>
                !string.IsNullOrWhiteSpace(x))
            .Select(x =>
                x.Trim())
            .ToList();
    }

    private static string SeoUrlOlustur(
        string metin)
    {
        var turkceKarakterleriDuzenlenmisMetin =
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
                 turkceKarakterleriDuzenlenmisMetin)
        {
            if (CharUnicodeInfo
                    .GetUnicodeCategory(
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
                "Kategori için geçerli bir SEO URL oluşturulamadı.");
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

    private sealed class OkunanKategoriSatiri
    {
        public KategoriExcelSatirDto Dto { get; set; } =
            new();

        public string KategoriYolu { get; set; } =
            string.Empty;

        public int Seviye { get; set; }

        public List<string> Hatalar { get; set; } =
            new();
    }

    private sealed class MevcutKategoriKaydi
    {
        public int Id { get; set; }

        public int? UstKategoriId { get; set; }

        public string KategoriAdi { get; set; } =
            string.Empty;

        public string KategoriYolu { get; set; } =
            string.Empty;

        public string SeoUrl { get; set; } =
            string.Empty;

        public int SiraNo { get; set; }
    }

    private sealed class PlanlananKategori
    {
        public string KategoriAdi { get; set; } =
            string.Empty;

        public string KategoriYolu { get; set; } =
            string.Empty;

        public string? UstKategoriYolu { get; set; }

        public string SeoUrl { get; set; } =
            string.Empty;

        public int SiraNo { get; set; }

        public bool DolayliOlusturulduMu { get; set; }

        public int? KaynakSatirNo { get; set; }
    }
}