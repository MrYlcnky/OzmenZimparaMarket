namespace OzmenZimparaMarket.Application.DTOs.ExcelDtos;

public class ExcelDosyaDto
{
    public string DosyaAdi { get; set; } = string.Empty;

    public string IcerikTuru { get; set; } =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    public byte[] Icerik { get; set; } = Array.Empty<byte>();
}