namespace OzmenZimparaMarket.Application.DTOs.UrunDtos;

public class UrunTeknikDetayGrubuDto
{
    public int UrunDetayTanimiId { get; set; }

    public string DetayAdi { get; set; } = string.Empty;

    public bool CokluDegerMi { get; set; }

    public bool FiltredeGosterilsinMi { get; set; }

    public bool SepetteSecilebilirMi { get; set; }

    public int SiraNo { get; set; }

    public List<UrunTeknikDetayDegeriDto> Degerler { get; set; } = [];
}