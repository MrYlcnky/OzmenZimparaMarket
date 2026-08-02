namespace OzmenZimparaMarket.Application.DTOs.UrunDetayiDtos;

public class UrunDetayiGuncelleDto
{
    public int UrunId { get; set; }

    public int UrunDetayTanimiId { get; set; }

    public string DetayDegeri { get; set; } = string.Empty;

    public int SiraNo { get; set; }

    public bool AktifMi { get; set; }
}