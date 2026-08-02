namespace OzmenZimparaMarket.Domain.Entityler;

public class UrunDetayi
{
    public int Id { get; set; }

    public int UrunId { get; set; }

    public int UrunDetayTanimiId { get; set; }

    public string DetayDegeri { get; set; } = string.Empty;

    public int SiraNo { get; set; }

    public bool AktifMi { get; set; }

    public Urun Urun { get; set; } = null!;

    public UrunDetayTanimi UrunDetayTanimi { get; set; } = null!;
}