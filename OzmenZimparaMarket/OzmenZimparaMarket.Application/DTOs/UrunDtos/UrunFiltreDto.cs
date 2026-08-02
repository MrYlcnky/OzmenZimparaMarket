using OzmenZimparaMarket.Application.Enumlar;
using OzmenZimparaMarket.Domain.Enumlar;

namespace OzmenZimparaMarket.Application.DTOs.UrunDtos;

public class UrunFiltreDto
{
    public int? KategoriId { get; set; }

    public bool AltKategorilerDahilMi { get; set; }

    public string? AramaMetni { get; set; }

    public bool? AktifMi { get; set; }

    public bool? OneCikanMi { get; set; }

    public SatisBirimi? SatisBirimi { get; set; }

    public List<UrunTeknikDetayFiltreDto> TeknikDetayFiltreleri { get; set; } = [];

    public int SayfaNo { get; set; } = 1;

    public int SayfaBoyutu { get; set; } = 20;

    public UrunSiralamaTuru Siralama { get; set; } = UrunSiralamaTuru.SiraNoArtan;
}