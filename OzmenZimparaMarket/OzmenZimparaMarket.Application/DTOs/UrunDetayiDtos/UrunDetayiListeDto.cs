namespace OzmenZimparaMarket.Application.DTOs.UrunDetayiDtos;

public class UrunDetayiListeDto
{
    public int Id { get; set; }

    public int UrunId { get; set; }

    public string UrunAdi { get; set; } = string.Empty;

    public string? UrunKodu { get; set; } 

    public int UrunDetayTanimiId { get; set; }

    public string DetayAdi { get; set; } = string.Empty;

    public string DetayDegeri { get; set; } = string.Empty;

    public int SiraNo { get; set; }

    public bool AktifMi { get; set; }
}