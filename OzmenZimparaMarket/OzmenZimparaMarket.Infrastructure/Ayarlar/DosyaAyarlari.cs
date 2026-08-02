namespace OzmenZimparaMarket.Infrastructure.Ayarlar;

public class DosyaAyarlari
{
    public const string BolumAdi = "Dosya";

    public long MaksimumDosyaBoyutu { get; set; }

    public string UrunGorselleriKlasoru { get; set; } = string.Empty;

    public string KategoriGorselleriKlasoru { get; set; } = string.Empty;

    public string[] IzinVerilenUzantilar { get; set; } = [];

    public string[] IzinVerilenIcerikTurleri { get; set; } = [];
    public string KokDizin { get; set; } = string.Empty;
}