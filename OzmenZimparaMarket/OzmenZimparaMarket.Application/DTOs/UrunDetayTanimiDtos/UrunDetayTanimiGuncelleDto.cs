namespace OzmenZimparaMarket.Application.DTOs.UrunDetayTanimiDtos;

public class UrunDetayTanimiGuncelleDto
{
    public string DetayAdi { get; set; } = string.Empty;

    public bool CokluDegerMi { get; set; }

    public bool FiltredeGosterilsinMi { get; set; }

    public bool SepetteSecilebilirMi { get; set; }

    public int SiraNo { get; set; }

    public bool AktifMi { get; set; }
}