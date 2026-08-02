namespace OzmenZimparaMarket.Domain.Entityler;

public class FirmaGenelBilgisi
{
    public int Id { get; set; }

    public string SirketAdi { get; set; } = string.Empty;

    public string Hakkimizda { get; set; } = string.Empty;

    public string Vizyonumuz { get; set; } = string.Empty;

    public string Misyonumuz { get; set; } = string.Empty;

    public string Stratejimiz { get; set; } = string.Empty;

    public string KalitePolitikamiz { get; set; } = string.Empty;

    public string Kvkk { get; set; } = string.Empty;

    public string IletisimNo { get; set; } = string.Empty;

    public string WhatsappNo { get; set; } = string.Empty;

    public string Eposta { get; set; } = string.Empty;

    public string AcikAdres { get; set; } = string.Empty;

    public string Il { get; set; } = string.Empty;

    public string Ilce { get; set; } = string.Empty;

    public string GoogleHaritaBaglantisi { get; set; } = string.Empty;

    public string GoogleHaritaGommeBaglantisi { get; set; } = string.Empty;

    public DateTime GuncellemeTarihi { get; set; }
}