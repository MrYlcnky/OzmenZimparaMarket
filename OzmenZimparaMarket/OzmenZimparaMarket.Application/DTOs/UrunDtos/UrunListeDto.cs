using OzmenZimparaMarket.Domain.Enumlar;

namespace OzmenZimparaMarket.Application.DTOs.UrunDtos;

public class UrunListeDto
{
    public int Id { get; set; }

    public int KategoriId { get; set; }

    public string KategoriAdi { get; set; } = string.Empty;

    public string UrunAdi { get; set; } = string.Empty;

    public string UrunKodu { get; set; } = string.Empty;

    public string? KisaAciklama { get; set; }

    public string? DetayliAciklama { get; set; }

    public string? GorselYolu { get; set; }

    public SatisBirimi SatisBirimi { get; set; }

    public string SatisBirimiAdi { get; set; } = string.Empty;

    public string SeoUrl { get; set; } = string.Empty;

    public string? SeoBasligi { get; set; }

    public string? SeoAciklamasi { get; set; }

    public bool OneCikanMi { get; set; }

    public int SiraNo { get; set; }

    public bool AktifMi { get; set; }

    public int TeknikDetaySayisi { get; set; }

    public DateTime OlusturmaTarihi { get; set; }

    public DateTime? GuncellemeTarihi { get; set; }
}