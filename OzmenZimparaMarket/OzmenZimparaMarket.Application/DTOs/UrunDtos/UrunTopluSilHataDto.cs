namespace OzmenZimparaMarket.Application.DTOs.UrunDtos;

public class UrunTopluSilHataDto
{
    public int Id { get; set; }

    public string? UrunAdi { get; set; }

    public string? UrunKodu { get; set; }

    public string Mesaj { get; set; } = string.Empty;
}