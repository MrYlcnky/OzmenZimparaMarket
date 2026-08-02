namespace OzmenZimparaMarket.Domain.Entityler;

public class UrunDetayTanimi
{
    public int Id { get; set; }

    public string DetayAdi { get; set; } = string.Empty;

    public bool CokluDegerMi { get; set; }

    public bool FiltredeGosterilsinMi { get; set; }

    public bool SepetteSecilebilirMi { get; set; }

    public int SiraNo { get; set; }

    public bool AktifMi { get; set; } 
    public ICollection<UrunDetayi> UrunDetaylari { get; set; } = new List<UrunDetayi>();
}