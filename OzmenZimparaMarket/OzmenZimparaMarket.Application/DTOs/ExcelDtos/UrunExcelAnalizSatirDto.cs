namespace OzmenZimparaMarket.Application.DTOs.ExcelDtos;

public class UrunExcelAnalizSatirDto
{
    public int SatirNo { get; set; }

    public string UrunKodu { get; set; } = string.Empty;

    public string UrunAdi { get; set; } = string.Empty;

    public string KategoriYolu { get; set; } = string.Empty;

    public string Durum { get; set; } = string.Empty;

    public bool GecerliMi { get; set; }

    public bool MevcutMu { get; set; }

    public bool OlusturulacakMi { get; set; }

    public int? HesaplananSiraNo { get; set; }

    public string? HesaplananSeoUrl { get; set; }

    public int TeknikDetaySayisi { get; set; }

    public List<string> Hatalar { get; set; } = new();
}