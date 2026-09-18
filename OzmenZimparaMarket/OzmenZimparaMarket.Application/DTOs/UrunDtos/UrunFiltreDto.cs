using OzmenZimparaMarket.Application.DTOs.OrtakDtos;
using OzmenZimparaMarket.Application.Enumlar;
using OzmenZimparaMarket.Domain.Enumlar;

namespace OzmenZimparaMarket.Application.DTOs.UrunDtos;

public class UrunFiltreDto : SayfalamaDto
{
    public int? KategoriId { get; set; }

    public bool AltKategorilerDahilMi { get; set; }

    public string? AramaMetni { get; set; }

    public bool? AktifMi { get; set; }

    public bool? OneCikanMi { get; set; }

    public SatisBirimi? SatisBirimi { get; set; }

    public List<UrunTeknikDetayFiltreDto> TeknikDetayFiltreleri { get; set; } = [];

    public UrunSiralamaTuru Siralama { get; set; } = UrunSiralamaTuru.SiraNoArtan;
}