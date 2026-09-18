namespace OzmenZimparaMarket.Application.DTOs.YonetimPaneliDtos;

public class YonetimPaneliOzetDto
{
    public YonetimPaneliKategoriOzetDto Kategoriler { get; set; } = new();

    public YonetimPaneliUrunOzetDto Urunler { get; set; } = new();

    public YonetimPaneliTemelOzetDto TeknikOzellikler { get; set; } = new();

    public YonetimPaneliTemelOzetDto Kullanicilar { get; set; } = new();

    public List<YonetimPaneliSonUrunDto> SonEklenenUrunler { get; set; } = new();
}