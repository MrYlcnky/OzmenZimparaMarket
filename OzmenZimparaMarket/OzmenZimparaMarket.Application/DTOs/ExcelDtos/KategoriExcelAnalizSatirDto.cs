namespace OzmenZimparaMarket.Application.DTOs.ExcelDtos;

public class KategoriExcelAnalizSatirDto
{
    public int SatirNo { get; set; }

    public string KategoriAdi { get; set; } = string.Empty;

    public string KategoriYolu { get; set; } = string.Empty;

    public string Durum { get; set; } = string.Empty;

    public bool GecerliMi { get; set; }

    public bool MevcutMu { get; set; }

    public bool OlusturulacakMi { get; set; }

    public int? HesaplananSiraNo { get; set; }

    public string? HesaplananSeoUrl { get; set; }

    public List<string> Hatalar { get; set; } = new();
}