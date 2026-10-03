using OzmenZimparaMarket.Domain.Enumlar;

namespace OzmenZimparaMarket.Application.DTOs.ExcelDtos;

public class UrunExcelSatirDto
{
    public int SatirNo { get; set; }

    public string? UrunKodu { get; set; }

    public string UrunAdi { get; set; } = string.Empty;

    public string KategoriYolu { get; set; } = string.Empty;

    public SatisBirimi? SatisBirimi { get; set; }

    public string? KisaAciklama { get; set; }

    public string? DetayliAciklama { get; set; }

    public string? GorselYolu { get; set; }

    public string? SeoUrl { get; set; }

    public string? SeoBasligi { get; set; }

    public string? SeoAciklamasi { get; set; }

    public bool? OneCikanMi { get; set; }

    public int? SiraNo { get; set; }

    public bool? AktifMi { get; set; }

    public List<UrunExcelTeknikDetaySatirDto> TeknikDetaylar { get; set; } = new();
}