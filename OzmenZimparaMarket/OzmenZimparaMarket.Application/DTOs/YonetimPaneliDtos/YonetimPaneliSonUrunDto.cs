namespace OzmenZimparaMarket.Application.DTOs.YonetimPaneliDtos;

public class YonetimPaneliSonUrunDto
{
    public int Id { get; set; }

    public string UrunAdi { get; set; } = string.Empty;

    public string UrunKodu { get; set; } = string.Empty;

    public string KategoriAdi { get; set; } = string.Empty;

    public string? GorselYolu { get; set; }

    public bool AktifMi { get; set; }

    public bool OneCikanMi { get; set; }

    public DateTime OlusturmaTarihi { get; set; }
}