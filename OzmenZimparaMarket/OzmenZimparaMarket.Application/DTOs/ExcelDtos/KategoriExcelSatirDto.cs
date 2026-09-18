namespace OzmenZimparaMarket.Application.DTOs.ExcelDtos;

public class KategoriExcelSatirDto
{
    public int SatirNo { get; set; }

    public string KategoriAdi { get; set; } = string.Empty;

    public string? UstKategoriYolu { get; set; }

    public string? Aciklama { get; set; }

    public string? GorselYolu { get; set; }

    public string? SeoUrl { get; set; }

    public string? SeoBasligi { get; set; }

    public string? SeoAciklamasi { get; set; }

    public bool? AnaSayfadaGosterilsinMi { get; set; }

    public int? SiraNo { get; set; }

    public bool? AktifMi { get; set; }
}