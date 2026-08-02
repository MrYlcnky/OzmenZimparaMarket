namespace OzmenZimparaMarket.Application.DTOs.UrunDtos;

public class UrunFiltreGrubuDto
{
    public int UrunDetayTanimiId { get; set; }

    public string DetayAdi { get; set; } = string.Empty;

    public bool CokluDegerMi { get; set; }

    public int SiraNo { get; set; }

    public List<UrunFiltreSecenegiDto> Secenekler { get; set; } = [];
}