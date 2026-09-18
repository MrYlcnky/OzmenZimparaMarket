namespace OzmenZimparaMarket.Application.DTOs.UrunDtos;

public class UrunTeknikDetayKaydetDto
{
    public int? UrunDetayiId { get; set; }

    public int UrunDetayTanimiId { get; set; }

    public string DetayDegeri { get; set; } = string.Empty;

    public int SiraNo { get; set; }

    public bool AktifMi { get; set; } = true;
}