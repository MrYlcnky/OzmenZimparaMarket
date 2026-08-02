namespace OzmenZimparaMarket.Application.DTOs.DosyaDtos;

public class DosyaYukleDto
{
    public Stream DosyaAkisi { get; set; } = Stream.Null;

    public string DosyaAdi { get; set; } = string.Empty;

    public string IcerikTuru { get; set; } = string.Empty;

    public long DosyaBoyutu { get; set; }
}