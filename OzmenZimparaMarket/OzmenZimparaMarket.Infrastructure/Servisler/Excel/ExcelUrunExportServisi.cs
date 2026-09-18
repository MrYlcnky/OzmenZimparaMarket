using ClosedXML.Excel;
using Microsoft.EntityFrameworkCore;
using OzmenZimparaMarket.Application.DTOs.ExcelDtos;
using OzmenZimparaMarket.Application.Interfaces.Excel;
using OzmenZimparaMarket.Domain.Entityler;
using OzmenZimparaMarket.Infrastructure.Veritabani;

namespace OzmenZimparaMarket.Infrastructure.Servisler.Excel;

public class ExcelUrunExportServisi : IExcelUrunExportServisi
{
    private readonly OzmenZimparaMarketDbContext _dbContext;

    public ExcelUrunExportServisi(OzmenZimparaMarketDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ExcelDosyaDto> DisariAktarAsync(CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();

        var kategoriler = await _dbContext.Kategoriler
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        var urunler = await _dbContext.Urunler
            .AsNoTracking()
            .OrderBy(x => x.SiraNo)
            .ThenBy(x => x.UrunAdi)
            .ToListAsync(cancellationToken);

        var teknikOzellikler = await _dbContext.UrunDetayTanimlari
            .AsNoTracking()
            .OrderBy(x => x.SiraNo)
            .ThenBy(x => x.DetayAdi)
            .ToListAsync(cancellationToken);

        var urunIdleri = urunler
            .Select(x => x.Id)
            .ToList();

        var teknikDetaylar = urunIdleri.Count == 0
            ? new List<UrunDetayi>()
            : await _dbContext.UrunDetaylari
                .AsNoTracking()
                .Where(x => urunIdleri.Contains(x.UrunId))
                .OrderBy(x => x.UrunId)
                .ThenBy(x => x.UrunDetayTanimiId)
                .ThenBy(x => x.SiraNo)
                .ThenBy(x => x.DetayDegeri)
                .ToListAsync(cancellationToken);

        var kategoriSozlugu = kategoriler
            .ToDictionary(x => x.Id);

        var teknikDetaySozlugu = teknikDetaylar
            .GroupBy(x => new
            {
                x.UrunId,
                x.UrunDetayTanimiId
            })
            .ToDictionary(
                x => (
                    UrunId: x.Key.UrunId,
                    TanimId: x.Key.UrunDetayTanimiId
                ),
                x => x
                    .OrderBy(y => y.SiraNo)
                    .ThenBy(y => y.DetayDegeri)
                    .ToList());

        cancellationToken.ThrowIfCancellationRequested();

        using var workbook = new XLWorkbook();

        UrunSayfasiniOlustur(
            workbook,
            urunler,
            teknikOzellikler,
            kategoriSozlugu,
            teknikDetaySozlugu,
            cancellationToken);

        KategoriReferansSayfasiniOlustur(
            workbook,
            kategoriler,
            cancellationToken);

        TeknikOzellikReferansSayfasiniOlustur(
            workbook,
            teknikOzellikler,
            cancellationToken);

        OzetSayfasiniOlustur(
            workbook,
            urunler,
            teknikOzellikler);

        cancellationToken.ThrowIfCancellationRequested();

        using var memoryStream = new MemoryStream();

        workbook.SaveAs(memoryStream);

        return new ExcelDosyaDto
        {
            DosyaAdi = $"ozmen-zimpara-market-urunler-{DateTime.UtcNow:yyyy-MM-dd}.xlsx",
            Icerik = memoryStream.ToArray()
        };
    }

    private static void UrunSayfasiniOlustur(
        XLWorkbook workbook,
        IReadOnlyList<Urun> urunler,
        IReadOnlyList<UrunDetayTanimi> teknikOzellikler,
        IReadOnlyDictionary<int, Kategori> kategoriSozlugu,
        IReadOnlyDictionary<(int UrunId, int TanimId), List<UrunDetayi>> teknikDetaySozlugu,
        CancellationToken cancellationToken)
    {
        var sayfa = workbook.Worksheets.Add("Ürünler");

        var sabitBasliklar = new[]
        {
            "Ürün Kodu *",
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

        for (var index = 0; index < sabitBasliklar.Length; index++)
        {
            sayfa.Cell(1, index + 1).Value = sabitBasliklar[index];
        }

        for (var index = 0; index < teknikOzellikler.Count; index++)
        {
            var kolon = sabitBasliklar.Length + index + 1;

            sayfa.Cell(1, kolon).Value =
                $"Özellik: {teknikOzellikler[index].DetayAdi}";
        }

        var toplamKolonSayisi =
            sabitBasliklar.Length + teknikOzellikler.Count;

        BaslikStiliniUygula(
            sayfa,
            sabitBasliklar.Length,
            teknikOzellikler,
            toplamKolonSayisi);

        for (var index = 0; index < urunler.Count; index++)
        {
            cancellationToken.ThrowIfCancellationRequested();

            var urun = urunler[index];
            var satir = index + 2;

            sayfa.Cell(satir, 1).Value =
                urun.UrunKodu;

            sayfa.Cell(satir, 2).Value =
                urun.UrunAdi;

            sayfa.Cell(satir, 3).Value =
                kategoriSozlugu.TryGetValue(
                    urun.KategoriId,
                    out var kategori)
                    ? KategoriYoluOlustur(
                        kategori,
                        kategoriSozlugu)
                    : $"Kategori ID: {urun.KategoriId}";

            sayfa.Cell(satir, 4).Value =
                urun.SatisBirimi.ToString();

            sayfa.Cell(satir, 5).Value =
                urun.KisaAciklama ?? "";

            sayfa.Cell(satir, 6).Value =
                urun.DetayliAciklama ?? "";

            sayfa.Cell(satir, 7).Value =
                urun.GorselYolu ?? "";

            sayfa.Cell(satir, 8).Value =
                urun.SeoUrl;

            sayfa.Cell(satir, 9).Value =
                urun.SeoBasligi ?? "";

            sayfa.Cell(satir, 10).Value =
                urun.SeoAciklamasi ?? "";

            sayfa.Cell(satir, 11).Value =
                urun.OneCikanMi
                    ? "Evet"
                    : "Hayır";

            sayfa.Cell(satir, 12).Value =
                urun.SiraNo;

            sayfa.Cell(satir, 13).Value =
                urun.AktifMi
                    ? "Evet"
                    : "Hayır";

            for (var teknikIndex = 0; teknikIndex < teknikOzellikler.Count; teknikIndex++)
            {
                var teknikOzellik = teknikOzellikler[teknikIndex];

                var kolon =
                    sabitBasliklar.Length +
                    teknikIndex +
                    1;

                if (!teknikDetaySozlugu.TryGetValue(
                        (
                            UrunId: urun.Id,
                            TanimId: teknikOzellik.Id
                        ),
                        out var detaylar))
                {
                    continue;
                }

                var deger = string.Join(
                    " | ",
                    detaylar
                        .Select(x => x.DetayDegeri.Trim())
                        .Where(x => !string.IsNullOrWhiteSpace(x)));

                sayfa.Cell(satir, kolon).Value =
                    deger;
            }
        }

        sayfa.SheetView.FreezeRows(1);

        sayfa.Range(
                1,
                1,
                Math.Max(urunler.Count + 1, 2),
                toplamKolonSayisi)
            .SetAutoFilter();

        KolonGenislikleriniAyarla(
            sayfa,
            sabitBasliklar.Length,
            toplamKolonSayisi);

        if (urunler.Count > 0)
        {
            var veriAraligi = sayfa.Range(
                2,
                1,
                urunler.Count + 1,
                toplamKolonSayisi);

            veriAraligi.Style.Alignment.Vertical =
                XLAlignmentVerticalValues.Top;

            veriAraligi.Style.Alignment.WrapText =
                true;
        }
    }

    private static void BaslikStiliniUygula(
        IXLWorksheet sayfa,
        int sabitKolonSayisi,
        IReadOnlyList<UrunDetayTanimi> teknikOzellikler,
        int toplamKolonSayisi)
    {
        var sabitBaslikAraligi = sayfa.Range(
            1,
            1,
            1,
            sabitKolonSayisi);

        sabitBaslikAraligi.Style.Font.Bold =
            true;

        sabitBaslikAraligi.Style.Font.FontColor =
            XLColor.White;

        sabitBaslikAraligi.Style.Fill.BackgroundColor =
            XLColor.FromHtml("#1E293B");

        for (var index = 0; index < teknikOzellikler.Count; index++)
        {
            var kolon =
                sabitKolonSayisi +
                index +
                1;

            var hucre =
                sayfa.Cell(
                    1,
                    kolon);

            hucre.Style.Font.Bold =
                true;

            hucre.Style.Font.FontColor =
                XLColor.White;

            hucre.Style.Fill.BackgroundColor =
                teknikOzellikler[index].AktifMi
                    ? XLColor.FromHtml("#6D28D9")
                    : XLColor.FromHtml("#64748B");
        }

        var tumBaslikAraligi = sayfa.Range(
            1,
            1,
            1,
            toplamKolonSayisi);

        tumBaslikAraligi.Style.Alignment.Vertical =
            XLAlignmentVerticalValues.Center;

        tumBaslikAraligi.Style.Alignment.WrapText =
            true;

        sayfa.Row(1).Height =
            32;
    }

    private static void KolonGenislikleriniAyarla(
        IXLWorksheet sayfa,
        int sabitKolonSayisi,
        int toplamKolonSayisi)
    {
        sayfa.Column(1).Width = 24;
        sayfa.Column(2).Width = 34;
        sayfa.Column(3).Width = 55;
        sayfa.Column(4).Width = 20;
        sayfa.Column(5).Width = 42;
        sayfa.Column(6).Width = 55;
        sayfa.Column(7).Width = 38;
        sayfa.Column(8).Width = 32;
        sayfa.Column(9).Width = 40;
        sayfa.Column(10).Width = 50;
        sayfa.Column(11).Width = 16;
        sayfa.Column(12).Width = 14;
        sayfa.Column(13).Width = 14;

        for (var kolon = sabitKolonSayisi + 1;
             kolon <= toplamKolonSayisi;
             kolon++)
        {
            sayfa.Column(kolon).Width =
                30;
        }
    }

    private static void KategoriReferansSayfasiniOlustur(
        XLWorkbook workbook,
        IReadOnlyList<Kategori> kategoriler,
        CancellationToken cancellationToken)
    {
        var sayfa = workbook.Worksheets.Add(
            "Kategori Referansı");

        sayfa.Cell("A1").Value =
            "Kategori Yolu";

        sayfa.Cell("B1").Value =
            "Durum";

        var baslik = sayfa.Range(
            "A1:B1");

        baslik.Style.Font.Bold =
            true;

        baslik.Style.Font.FontColor =
            XLColor.White;

        baslik.Style.Fill.BackgroundColor =
            XLColor.FromHtml("#1E293B");

        var kategoriSozlugu =
            kategoriler.ToDictionary(
                x => x.Id);

        var satirlar = kategoriler
            .Select(x => new
            {
                Kategori = x,

                Yol = KategoriYoluOlustur(
                    x,
                    kategoriSozlugu)
            })
            .OrderBy(
                x => x.Yol,
                StringComparer.CurrentCultureIgnoreCase)
            .ToList();

        for (var index = 0; index < satirlar.Count; index++)
        {
            cancellationToken.ThrowIfCancellationRequested();

            var satir =
                index + 2;

            sayfa.Cell(
                    satir,
                    1)
                .Value =
                satirlar[index].Yol;

            sayfa.Cell(
                    satir,
                    2)
                .Value =
                satirlar[index]
                    .Kategori
                    .AktifMi
                    ? "Aktif"
                    : "Pasif";
        }

        sayfa.Column("A").Width =
            70;

        sayfa.Column("B").Width =
            16;

        sayfa.SheetView.FreezeRows(1);

        if (satirlar.Count > 0)
        {
            sayfa.Range(
                    1,
                    1,
                    satirlar.Count + 1,
                    2)
                .SetAutoFilter();
        }
    }

    private static void TeknikOzellikReferansSayfasiniOlustur(
        XLWorkbook workbook,
        IReadOnlyList<UrunDetayTanimi> teknikOzellikler,
        CancellationToken cancellationToken)
    {
        var sayfa = workbook.Worksheets.Add(
            "Teknik Özellik Referansı");

        var basliklar = new[]
        {
            "Özellik Adı",
            "Çoklu Değer",
            "Filtrede Göster",
            "Sepette Seçilebilir",
            "Sıra No",
            "Durum"
        };

        for (var index = 0; index < basliklar.Length; index++)
        {
            sayfa.Cell(
                    1,
                    index + 1)
                .Value =
                basliklar[index];
        }

        var baslik = sayfa.Range(
            1,
            1,
            1,
            basliklar.Length);

        baslik.Style.Font.Bold =
            true;

        baslik.Style.Font.FontColor =
            XLColor.White;

        baslik.Style.Fill.BackgroundColor =
            XLColor.FromHtml("#6D28D9");

        for (var index = 0; index < teknikOzellikler.Count; index++)
        {
            cancellationToken.ThrowIfCancellationRequested();

            var satir =
                index + 2;

            var teknikOzellik =
                teknikOzellikler[index];

            sayfa.Cell(satir, 1).Value =
                teknikOzellik.DetayAdi;

            sayfa.Cell(satir, 2).Value =
                teknikOzellik.CokluDegerMi
                    ? "Evet"
                    : "Hayır";

            sayfa.Cell(satir, 3).Value =
                teknikOzellik.FiltredeGosterilsinMi
                    ? "Evet"
                    : "Hayır";

            sayfa.Cell(satir, 4).Value =
                teknikOzellik.SepetteSecilebilirMi
                    ? "Evet"
                    : "Hayır";

            sayfa.Cell(satir, 5).Value =
                teknikOzellik.SiraNo;

            sayfa.Cell(satir, 6).Value =
                teknikOzellik.AktifMi
                    ? "Aktif"
                    : "Pasif";
        }

        sayfa.Column(1).Width = 32;
        sayfa.Column(2).Width = 18;
        sayfa.Column(3).Width = 20;
        sayfa.Column(4).Width = 24;
        sayfa.Column(5).Width = 14;
        sayfa.Column(6).Width = 14;

        sayfa.SheetView.FreezeRows(1);

        if (teknikOzellikler.Count > 0)
        {
            sayfa.Range(
                    1,
                    1,
                    teknikOzellikler.Count + 1,
                    basliklar.Length)
                .SetAutoFilter();
        }
    }

    private static void OzetSayfasiniOlustur(
        XLWorkbook workbook,
        IReadOnlyList<Urun> urunler,
        IReadOnlyList<UrunDetayTanimi> teknikOzellikler)
    {
        var sayfa =
            workbook.Worksheets.Add(
                "Özet");

        sayfa.Cell("A1").Value =
            "Özmen Zımpara Market - Ürün Excel Dışa Aktarımı";

        sayfa.Cell("A1").Style.Font.Bold =
            true;

        sayfa.Cell("A1").Style.Font.FontSize =
            16;

        sayfa.Cell("A3").Value =
            "Toplam Ürün";

        sayfa.Cell("B3").Value =
            urunler.Count;

        sayfa.Cell("A4").Value =
            "Aktif Ürün";

        sayfa.Cell("B4").Value =
            urunler.Count(x => x.AktifMi);

        sayfa.Cell("A5").Value =
            "Pasif Ürün";

        sayfa.Cell("B5").Value =
            urunler.Count(x => !x.AktifMi);

        sayfa.Cell("A6").Value =
            "Öne Çıkan Ürün";

        sayfa.Cell("B6").Value =
            urunler.Count(x => x.OneCikanMi);

        sayfa.Cell("A7").Value =
            "Teknik Özellik Tanımı";

        sayfa.Cell("B7").Value =
            teknikOzellikler.Count;

        sayfa.Cell("A9").Value =
            "Not";

        sayfa.Cell("B9").Value =
            "Teknik özelliklerde birden fazla değer bulunuyorsa değerler | karakteri ile ayrılmıştır.";

        sayfa.Cell("A10").Value =
            "Not";

        sayfa.Cell("B10").Value =
            "Pasif teknik özelliklerin başlıkları Ürünler sayfasında gri renkle gösterilir.";

        sayfa.Cell("A12").Value =
            "Oluşturulma Tarihi";

        sayfa.Cell("B12").Value =
            DateTime.Now.ToString("dd.MM.yyyy HH:mm");

        sayfa.Column("A").Width =
            30;

        sayfa.Column("B").Width =
            90;

        sayfa.RowsUsed()
            .Style.Alignment.WrapText =
            true;
    }

    private static string KategoriYoluOlustur(
        Kategori kategori,
        IReadOnlyDictionary<int, Kategori> kategoriSozlugu)
    {
        var yol = new List<string>
        {
            kategori.KategoriAdi
        };

        var ziyaretEdilenler = new HashSet<int>
        {
            kategori.Id
        };

        var ustKategoriId =
            kategori.UstKategoriId;

        while (ustKategoriId.HasValue)
        {
            if (!ziyaretEdilenler.Add(
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

            yol.Insert(
                0,
                ustKategori.KategoriAdi);

            ustKategoriId =
                ustKategori.UstKategoriId;
        }

        return string.Join(
            " / ",
            yol);
    }
}