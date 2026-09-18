namespace OzmenZimparaMarket.Application.DTOs.ExcelDtos;

public class UrunExcelTeknikDetaySatirDto
{
    public int UrunDetayTanimiId { get; set; }

    public string DetayAdi { get; set; } = string.Empty;

    public List<string> Degerler { get; set; } = new();
}