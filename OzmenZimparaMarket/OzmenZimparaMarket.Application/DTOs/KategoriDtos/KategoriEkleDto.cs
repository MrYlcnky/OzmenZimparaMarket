namespace OzmenZimparaMarket.Application.DTOs.KategoriDtos;

public class KategoriEkleDto
{
    public int? UstKategoriId { get; set; }

    public string KategoriAdi { get; set; } = string.Empty;

    public string? Aciklama { get; set; }

    public string? GorselYolu { get; set; }

    public string? SeoUrl { get; set; }

    public string? SeoBasligi { get; set; }

    public string? SeoAciklamasi { get; set; }

    public bool AnaSayfadaGosterilsinMi { get; set; }

    public int SiraNo { get; set; }

    public bool AktifMi { get; set; }
}