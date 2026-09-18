namespace OzmenZimparaMarket.Application.DTOs.ExcelDtos;

public class KategoriExcelAktarimSonucDto
{
    public int ToplamSatirSayisi { get; set; }

    public int EklenenKategoriSayisi { get; set; }

    public int ExcelSatirindanEklenenKategoriSayisi { get; set; }

    public int OtomatikOlusturulanUstKategoriSayisi { get; set; }

    public int MevcutKategoriSayisi { get; set; }

    public List<string> OlusturulanKategoriYollari { get; set; } = new();
}