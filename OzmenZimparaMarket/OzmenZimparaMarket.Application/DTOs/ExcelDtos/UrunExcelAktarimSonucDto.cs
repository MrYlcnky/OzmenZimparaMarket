namespace OzmenZimparaMarket.Application.DTOs.ExcelDtos;

public class UrunExcelAktarimSonucDto
{
    public int ToplamSatirSayisi { get; set; }

    public int EklenenUrunSayisi { get; set; }

    public int MevcutUrunSayisi { get; set; }

    public int EklenenTeknikDetaySayisi { get; set; }

    public List<string> EklenenUrunKodlari { get; set; } = new();
}