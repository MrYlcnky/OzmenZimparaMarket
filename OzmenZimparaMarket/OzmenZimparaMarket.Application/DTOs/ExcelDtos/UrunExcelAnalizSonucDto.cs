namespace OzmenZimparaMarket.Application.DTOs.ExcelDtos;

public class UrunExcelAnalizSonucDto
{
    public int ToplamSatirSayisi { get; set; }

    public int GecerliSatirSayisi { get; set; }

    public int HataliSatirSayisi { get; set; }

    public int MevcutUrunSayisi { get; set; }

    public int OlusturulacakUrunSayisi { get; set; }

    public bool AktarimaHazirMi { get; set; }

    public List<UrunExcelAnalizSatirDto> Satirlar { get; set; } = new();
}