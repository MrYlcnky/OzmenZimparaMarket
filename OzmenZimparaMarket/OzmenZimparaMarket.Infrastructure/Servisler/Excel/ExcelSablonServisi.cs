using ClosedXML.Excel;
using OzmenZimparaMarket.Application.DTOs.ExcelDtos;
using OzmenZimparaMarket.Application.DTOs.KategoriDtos;
using OzmenZimparaMarket.Application.DTOs.UrunDetayTanimiDtos;
using OzmenZimparaMarket.Application.Interfaces;
using OzmenZimparaMarket.Application.Interfaces.Excel;
using OzmenZimparaMarket.Domain.Enumlar;

namespace OzmenZimparaMarket.Infrastructure.Servisler.Excel;

public class ExcelSablonServisi : IExcelSablonServisi
{
    private readonly IKategoriServisi _kategoriServisi;
    private readonly IUrunDetayTanimiServisi _urunDetayTanimiServisi;

    public ExcelSablonServisi(
        IKategoriServisi kategoriServisi,
        IUrunDetayTanimiServisi urunDetayTanimiServisi)
    {
        _kategoriServisi = kategoriServisi;
        _urunDetayTanimiServisi = urunDetayTanimiServisi;
    }

    public Task<ExcelDosyaDto> KategoriSablonuOlusturAsync(
        CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();

        using var workbook = new XLWorkbook();

        KategoriSayfasiniOlustur(workbook);

        KategoriBilgilendirmeSayfasiniOlustur(workbook);

        using var memoryStream = new MemoryStream();

        workbook.SaveAs(memoryStream);

        return Task.FromResult(
            new ExcelDosyaDto
            {
                DosyaAdi = "ozmen-zimpara-market-kategori-sablonu.xlsx",
                Icerik = memoryStream.ToArray()
            });
    }

    public async Task<ExcelDosyaDto> UrunSablonuOlusturAsync(
        CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();

        var kategoriler = await _kategoriServisi
            .TumunuGetirAsync(
                false,
                cancellationToken);

        var teknikOzellikler = await _urunDetayTanimiServisi
            .TumunuGetirAsync(
                true,
                cancellationToken);

        using var workbook = new XLWorkbook();

        UrunSayfasiniOlustur(
            workbook,
            teknikOzellikler);

        UrunBilgilendirmeSayfasiniOlustur(
            workbook,
            teknikOzellikler);

        KategoriReferansSayfasiniOlustur(
            workbook,
            kategoriler);

        TeknikOzellikReferansSayfasiniOlustur(
            workbook,
            teknikOzellikler);

        using var memoryStream = new MemoryStream();

        workbook.SaveAs(memoryStream);

        return new ExcelDosyaDto
        {
            DosyaAdi = "ozmen-zimpara-market-urun-sablonu.xlsx",
            Icerik = memoryStream.ToArray()
        };
    }

    private static void KategoriSayfasiniOlustur(
        XLWorkbook workbook)
    {
        var sayfa = workbook.Worksheets.Add("Kategoriler");

        var basliklar = new[]
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

        for (var kolon = 0; kolon < basliklar.Length; kolon++)
        {
            sayfa.Cell(1, kolon + 1).Value = basliklar[kolon];
        }

        var baslikAraligi =
            sayfa.Range(
                1,
                1,
                1,
                basliklar.Length);

        baslikAraligi.Style.Font.Bold = true;
        baslikAraligi.Style.Font.FontColor = XLColor.White;
        baslikAraligi.Style.Fill.BackgroundColor =
            XLColor.FromHtml("#1E293B");

        baslikAraligi.Style.Alignment.Vertical =
            XLAlignmentVerticalValues.Center;

        sayfa.Row(1).Height = 28;

        sayfa.SheetView.FreezeRows(1);

        sayfa.Range(
                1,
                1,
                1000,
                basliklar.Length)
            .SetAutoFilter();

        sayfa.Column(1).Width = 28;
        sayfa.Column(2).Width = 42;
        sayfa.Column(3).Width = 45;
        sayfa.Column(4).Width = 38;
        sayfa.Column(5).Width = 32;
        sayfa.Column(6).Width = 40;
        sayfa.Column(7).Width = 50;
        sayfa.Column(8).Width = 24;
        sayfa.Column(9).Width = 14;
        sayfa.Column(10).Width = 14;

        EvetHayirDogrulamasiEkle(
            sayfa.Range("H2:H1000"));

        EvetHayirDogrulamasiEkle(
            sayfa.Range("J2:J1000"));

        KategoriOrnekSatiriEkle(sayfa);
    }

    private static void KategoriOrnekSatiriEkle(
        IXLWorksheet sayfa)
    {
        sayfa.Cell("A2").Value =
            "Flap Diskler";

        sayfa.Cell("B2").Value =
            "Zımparalar / Disk Zımparalar";

        sayfa.Cell("C2").Value =
            "Profesyonel flap disk ürünleri";

        sayfa.Cell("E2").Value = "";
        sayfa.Cell("F2").Value = "";
        sayfa.Cell("G2").Value = "";

        sayfa.Cell("H2").Value =
            "Hayır";

        sayfa.Cell("J2").Value =
            "Evet";

        sayfa.Cell("K2").Value =
            "__ORNEK_SATIR__";

        sayfa.Column("K").Hide();

        var ornekAraligi =
            sayfa.Range("A2:J2");

        OrnekSatirStiliUygula(
            ornekAraligi);
    }

    private static void UrunSayfasiniOlustur(
        XLWorkbook workbook,
        IReadOnlyList<UrunDetayTanimiListeDto> teknikOzellikler)
    {
        var sayfa =
            workbook.Worksheets.Add("Ürünler");

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

        for (var kolon = 0; kolon < sabitBasliklar.Length; kolon++)
        {
            sayfa.Cell(
                    1,
                    kolon + 1)
                .Value =
                sabitBasliklar[kolon];
        }

        for (var index = 0;
             index < teknikOzellikler.Count;
             index++)
        {
            var kolon =
                sabitBasliklar.Length +
                index +
                1;

            sayfa.Cell(
                    1,
                    kolon)
                .Value =
                $"Özellik: {teknikOzellikler[index].DetayAdi}";
        }

        var toplamGorunenKolon =
            sabitBasliklar.Length +
            teknikOzellikler.Count;

        var sabitBaslikAraligi =
            sayfa.Range(
                1,
                1,
                1,
                sabitBasliklar.Length);

        sabitBaslikAraligi.Style.Font.Bold =
            true;

        sabitBaslikAraligi.Style.Font.FontColor =
            XLColor.White;

        sabitBaslikAraligi.Style.Fill.BackgroundColor =
            XLColor.FromHtml("#1E293B");

        if (teknikOzellikler.Count > 0)
        {
            var teknikBaslikAraligi =
                sayfa.Range(
                    1,
                    sabitBasliklar.Length + 1,
                    1,
                    toplamGorunenKolon);

            teknikBaslikAraligi.Style.Font.Bold =
                true;

            teknikBaslikAraligi.Style.Font.FontColor =
                XLColor.White;

            teknikBaslikAraligi.Style.Fill.BackgroundColor =
                XLColor.FromHtml("#6D28D9");
        }

        sayfa.Range(
                1,
                1,
                1,
                toplamGorunenKolon)
            .Style.Alignment.Vertical =
            XLAlignmentVerticalValues.Center;

        sayfa.Range(
                1,
                1,
                1,
                toplamGorunenKolon)
            .Style.Alignment.WrapText =
            true;

        sayfa.Row(1).Height = 32;

        sayfa.SheetView.FreezeRows(1);

        sayfa.Range(
                1,
                1,
                1000,
                toplamGorunenKolon)
            .SetAutoFilter();

        sayfa.Column(1).Width = 24;
        sayfa.Column(2).Width = 34;
        sayfa.Column(3).Width = 50;
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

        for (var kolon =
                 sabitBasliklar.Length + 1;
             kolon <= toplamGorunenKolon;
             kolon++)
        {
            sayfa.Column(kolon).Width = 28;
        }

        SatisBirimiDogrulamasiEkle(
            sayfa.Range("D2:D1000"));

        EvetHayirDogrulamasiEkle(
            sayfa.Range("K2:K1000"));

        EvetHayirDogrulamasiEkle(
            sayfa.Range("M2:M1000"));

        UrunOrnekSatiriEkle(
            sayfa,
            toplamGorunenKolon);
    }

    private static void UrunOrnekSatiriEkle(
        IXLWorksheet sayfa,
        int toplamGorunenKolon)
    {
        sayfa.Cell("A2").Value =
            "FD-125-P60";

        sayfa.Cell("B2").Value =
            "Flap Disk 125 mm P60";

        sayfa.Cell("C2").Value =
            "Zımparalar / Disk Zımparalar / Flap Diskler";

        sayfa.Cell("D2").Value =
            SatisBirimi.Adet.ToString();

        sayfa.Cell("E2").Value =
            "Profesyonel yüzey işleme uygulamaları için flap disk.";

        sayfa.Cell("F2").Value =
            "";

        sayfa.Cell("G2").Value =
            "";

        sayfa.Cell("H2").Value =
            "";

        sayfa.Cell("I2").Value =
            "";

        sayfa.Cell("J2").Value =
            "";

        sayfa.Cell("K2").Value =
            "Hayır";

        sayfa.Cell("L2").Value =
            "";

        sayfa.Cell("M2").Value =
            "Evet";

        var isaretKolonu =
            toplamGorunenKolon + 1;

        sayfa.Cell(
                2,
                isaretKolonu)
            .Value =
            "__ORNEK_SATIR__";

        sayfa.Column(
                isaretKolonu)
            .Hide();

        var ornekAraligi =
            sayfa.Range(
                2,
                1,
                2,
                toplamGorunenKolon);

        OrnekSatirStiliUygula(
            ornekAraligi);
    }

    private static void KategoriBilgilendirmeSayfasiniOlustur(
        XLWorkbook workbook)
    {
        var sayfa =
            workbook.Worksheets.Add("Bilgilendirme");

        sayfa.Cell("A1").Value =
            "Özmen Zımpara Market - Kategori Excel Şablonu";

        sayfa.Cell("A1").Style.Font.Bold =
            true;

        sayfa.Cell("A1").Style.Font.FontSize =
            16;

        sayfa.Cell("A3").Value =
            "* işaretli alanlar zorunludur.";

        sayfa.Cell("A5").Value =
            "Kategori Adı";

        sayfa.Cell("B5").Value =
            "Zorunludur.";

        sayfa.Cell("A6").Value =
            "Üst Kategori Yolu";

        sayfa.Cell("B6").Value =
            "Boş bırakılırsa ana kategori oluşturulur. Örnek: Zımparalar / Disk Zımparalar";

        sayfa.Cell("A7").Value =
            "SEO URL";

        sayfa.Cell("B7").Value =
            "Boş bırakılırsa kategori adından otomatik oluşturulur.";

        sayfa.Cell("A8").Value =
            "SEO Başlığı";

        sayfa.Cell("B8").Value =
            "Boş bırakılırsa kategori adı ve firma adı kullanılır.";

        sayfa.Cell("A9").Value =
            "SEO Açıklaması";

        sayfa.Cell("B9").Value =
            "Boş bırakılırsa kategori açıklaması kullanılır.";

        sayfa.Cell("A10").Value =
            "Sıra No";

        sayfa.Cell("B10").Value =
            "Boş bırakılırsa aynı seviyedeki kategorilere göre otomatik belirlenir.";

        sayfa.Cell("A11").Value =
            "Aktif";

        sayfa.Cell("B11").Value =
            "Boş bırakılırsa Evet kabul edilir.";

        sayfa.Cell("A12").Value =
            "Ana Sayfada Göster";

        sayfa.Cell("B12").Value =
            "Boş bırakılırsa Hayır kabul edilir.";

        sayfa.Cell("A13").Value =
            "Görsel Yolu";

        sayfa.Cell("B13").Value =
            "Opsiyoneldir. Sunucuda mevcut geçerli bir kategori görsel yolu kullanılabilir.";

        sayfa.Column("A").Width = 28;
        sayfa.Column("B").Width = 90;

        sayfa.RowsUsed()
            .Style.Alignment.WrapText =
            true;

        sayfa.SheetView.FreezeRows(1);
    }

    private static void UrunBilgilendirmeSayfasiniOlustur(
        XLWorkbook workbook,
        IReadOnlyList<UrunDetayTanimiListeDto> teknikOzellikler)
    {
        var sayfa =
            workbook.Worksheets.Add("Ürün Bilgilendirme");

        sayfa.Cell("A1").Value =
            "Özmen Zımpara Market - Ürün Excel Şablonu";

        sayfa.Cell("A1").Style.Font.Bold =
            true;

        sayfa.Cell("A1").Style.Font.FontSize =
            16;

        sayfa.Cell("A3").Value =
            "* işaretli alanlar zorunludur.";

        sayfa.Cell("A5").Value =
            "Ürün Kodu";

        sayfa.Cell("B5").Value =
            "Zorunludur ve benzersiz olmalıdır. Sistemde mevcut ürün kodları yeni ürün olarak eklenmez.";

        sayfa.Cell("A6").Value =
            "Ürün Adı";

        sayfa.Cell("B6").Value =
            "Zorunludur. En fazla 200 karakter olabilir.";

        sayfa.Cell("A7").Value =
            "Kategori Yolu";

        sayfa.Cell("B7").Value =
            "Zorunludur. Kategori sistemde mevcut olmalıdır. Ürün aktarımı eksik kategori oluşturmaz. Tam yol kullanılmalıdır. Örnek: Zımparalar / Disk Zımparalar / Flap Diskler";

        sayfa.Cell("A8").Value =
            "Satış Birimi";

        sayfa.Cell("B8").Value =
            $"Geçerli değerler: {string.Join(", ", Enum.GetNames<SatisBirimi>())}";

        sayfa.Cell("A9").Value =
            "SEO URL";

        sayfa.Cell("B9").Value =
            "Boş bırakılırsa ürün adından otomatik oluşturulur.";

        sayfa.Cell("A10").Value =
            "SEO Başlığı";

        sayfa.Cell("B10").Value =
            "Boş bırakılırsa ürün adı ve firma adı kullanılır.";

        sayfa.Cell("A11").Value =
            "SEO Açıklaması";

        sayfa.Cell("B11").Value =
            "Boş bırakılırsa kısa açıklama kullanılır.";

        sayfa.Cell("A12").Value =
            "Öne Çıkan";

        sayfa.Cell("B12").Value =
            "Evet veya Hayır. Boş bırakılırsa Hayır kabul edilir.";

        sayfa.Cell("A13").Value =
            "Sıra No";

        sayfa.Cell("B13").Value =
            "Boş bırakılırsa aktarım sırasında otomatik belirlenir.";

        sayfa.Cell("A14").Value =
            "Aktif";

        sayfa.Cell("B14").Value =
            "Evet veya Hayır. Boş bırakılırsa Evet kabul edilir.";

        sayfa.Cell("A15").Value =
            "Görsel Yolu";

        sayfa.Cell("B15").Value =
            "Opsiyoneldir. Geçerli ürün görsel yolu /uploads/urunler/ altında .jpg, .jpeg, .png veya .webp olmalıdır.";

        sayfa.Cell("A16").Value =
            "Teknik Özellikler";

        sayfa.Cell("B16").Value =
            "Aktif ürün özellikleri Ürünler sayfasına dinamik kolon olarak eklenir.";

        sayfa.Cell("A17").Value =
            "Çoklu Teknik Değer";

        sayfa.Cell("B17").Value =
            "Çoklu değer kabul eden özelliklerde değerleri | karakteri ile ayırın. Örnek: Metal | Paslanmaz | Alüminyum";

        sayfa.Cell("A18").Value =
            "Tek Değerli Özellik";

        sayfa.Cell("B18").Value =
            "Çoklu değer kabul etmeyen bir özellikte | ile birden fazla değer kullanılamaz.";

        sayfa.Cell("A20").Value =
            "Aktif Teknik Özellik Sayısı";

        sayfa.Cell("B20").Value =
            teknikOzellikler.Count;

        sayfa.Column("A").Width = 30;
        sayfa.Column("B").Width = 100;

        sayfa.RowsUsed()
            .Style.Alignment.WrapText =
            true;

        sayfa.SheetView.FreezeRows(1);
    }

    private static void KategoriReferansSayfasiniOlustur(
        XLWorkbook workbook,
        IReadOnlyList<KategoriListeDto> kategoriler)
    {
        var sayfa =
            workbook.Worksheets.Add("Kategori Referansı");

        sayfa.Cell("A1").Value =
            "Kategori Yolu";

        sayfa.Cell("B1").Value =
            "Durum";

        var baslikAraligi =
            sayfa.Range("A1:B1");

        baslikAraligi.Style.Font.Bold =
            true;

        baslikAraligi.Style.Font.FontColor =
            XLColor.White;

        baslikAraligi.Style.Fill.BackgroundColor =
            XLColor.FromHtml("#1E293B");

        var kategoriMap =
            kategoriler.ToDictionary(
                x => x.Id);

        var kategoriSatirlari =
            kategoriler
                .Select(kategori => new
                {
                    Kategori = kategori,
                    Yol = KategoriYoluOlustur(
                        kategori,
                        kategoriMap)
                })
                .OrderBy(
                    x => x.Yol,
                    StringComparer.CurrentCultureIgnoreCase)
                .ToList();

        for (var index = 0;
             index < kategoriSatirlari.Count;
             index++)
        {
            var satir =
                index + 2;

            sayfa.Cell(
                    satir,
                    1)
                .Value =
                kategoriSatirlari[index].Yol;

            sayfa.Cell(
                    satir,
                    2)
                .Value =
                kategoriSatirlari[index]
                    .Kategori
                    .AktifMi
                    ? "Aktif"
                    : "Pasif";
        }

        sayfa.Column("A").Width = 70;
        sayfa.Column("B").Width = 16;

        sayfa.SheetView.FreezeRows(1);

        if (kategoriSatirlari.Count > 0)
        {
            sayfa.Range(
                    1,
                    1,
                    kategoriSatirlari.Count + 1,
                    2)
                .SetAutoFilter();
        }
    }

    private static void TeknikOzellikReferansSayfasiniOlustur(
        XLWorkbook workbook,
        IReadOnlyList<UrunDetayTanimiListeDto> teknikOzellikler)
    {
        var sayfa =
            workbook.Worksheets.Add("Teknik Özellik Referansı");

        var basliklar = new[]
        {
            "Özellik Adı",
            "Çoklu Değer",
            "Filtrede Göster",
            "Sepette Seçilebilir",
            "Sıra No"
        };

        for (var index = 0;
             index < basliklar.Length;
             index++)
        {
            sayfa.Cell(
                    1,
                    index + 1)
                .Value =
                basliklar[index];
        }

        var baslikAraligi =
            sayfa.Range(
                1,
                1,
                1,
                basliklar.Length);

        baslikAraligi.Style.Font.Bold =
            true;

        baslikAraligi.Style.Font.FontColor =
            XLColor.White;

        baslikAraligi.Style.Fill.BackgroundColor =
            XLColor.FromHtml("#6D28D9");

        for (var index = 0;
             index < teknikOzellikler.Count;
             index++)
        {
            var satir =
                index + 2;

            var ozellik =
                teknikOzellikler[index];

            sayfa.Cell(satir, 1).Value =
                ozellik.DetayAdi;

            sayfa.Cell(satir, 2).Value =
                ozellik.CokluDegerMi
                    ? "Evet"
                    : "Hayır";

            sayfa.Cell(satir, 3).Value =
                ozellik.FiltredeGosterilsinMi
                    ? "Evet"
                    : "Hayır";

            sayfa.Cell(satir, 4).Value =
                ozellik.SepetteSecilebilirMi
                    ? "Evet"
                    : "Hayır";

            sayfa.Cell(satir, 5).Value =
                ozellik.SiraNo;
        }

        sayfa.Column(1).Width = 32;
        sayfa.Column(2).Width = 18;
        sayfa.Column(3).Width = 20;
        sayfa.Column(4).Width = 24;
        sayfa.Column(5).Width = 14;

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

    private static string KategoriYoluOlustur(
        KategoriListeDto kategori,
        IReadOnlyDictionary<int, KategoriListeDto> kategoriMap)
    {
        var yol =
            new List<string>
            {
                kategori.KategoriAdi
            };

        var ziyaretEdilenler =
            new HashSet<int>
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

            if (!kategoriMap.TryGetValue(
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

    private static void EvetHayirDogrulamasiEkle(
        IXLRange aralik)
    {
        var dogrulama =
            aralik.CreateDataValidation();

        dogrulama.List(
            "\"Evet,Hayır\"");
    }

    private static void SatisBirimiDogrulamasiEkle(
        IXLRange aralik)
    {
        var satisBirimleri =
            string.Join(
                ",",
                Enum.GetNames<SatisBirimi>());

        var dogrulama =
            aralik.CreateDataValidation();

        dogrulama.List(
            $"\"{satisBirimleri}\"");
    }

    private static void OrnekSatirStiliUygula(
        IXLRange aralik)
    {
        aralik.Style.Fill.BackgroundColor =
            XLColor.FromHtml("#F8FAFC");

        aralik.Style.Font.FontColor =
            XLColor.FromHtml("#64748B");

        aralik.Style.Font.Italic =
            true;

        aralik.Style.Border.BottomBorder =
            XLBorderStyleValues.Thin;

        aralik.Style.Border.BottomBorderColor =
            XLColor.FromHtml("#CBD5E1");
    }
}