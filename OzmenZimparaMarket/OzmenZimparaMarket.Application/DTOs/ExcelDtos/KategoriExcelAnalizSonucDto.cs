namespace OzmenZimparaMarket.Application.DTOs.ExcelDtos;

public class KategoriExcelAnalizSonucDto
{
    public int ToplamSatirSayisi { get; set; }

    public int GecerliSatirSayisi { get; set; }

    public int HataliSatirSayisi { get; set; }

    public int MevcutKategoriSayisi { get; set; }

    public int OlusturulacakKategoriSayisi { get; set; }

    public bool AktarimaHazirMi { get; set; }

    public List<KategoriExcelAnalizSatirDto> Satirlar { get; set; } = new();
}