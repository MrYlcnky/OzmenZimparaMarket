using OzmenZimparaMarket.Domain.Enumlar;

namespace OzmenZimparaMarket.Application.DTOs.UrunDtos;

public class UrunEkleDto
{
    public int KategoriId { get; set; }

    public string UrunAdi { get; set; } = string.Empty;

    public string UrunKodu { get; set; } = string.Empty;

    public string? KisaAciklama { get; set; }

    public string? DetayliAciklama { get; set; }

    public string? GorselYolu { get; set; }

    public SatisBirimi SatisBirimi { get; set; }

    public string? SeoUrl { get; set; }

    public string? SeoBasligi { get; set; }

    public string? SeoAciklamasi { get; set; }

    public bool OneCikanMi { get; set; }

    public int SiraNo { get; set; }

    public bool AktifMi { get; set; }

    public List<UrunTeknikDetayKaydetDto> TeknikDetaylar { get; set; } = [];
}