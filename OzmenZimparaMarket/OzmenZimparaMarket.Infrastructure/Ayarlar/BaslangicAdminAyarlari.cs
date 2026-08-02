namespace OzmenZimparaMarket.Infrastructure.Ayarlar;

public class BaslangicAdminAyarlari
{
    public const string BolumAdi = "BaslangicAdmin";

    public string KullaniciAdi { get; set; } = string.Empty;

    public string Sifre { get; set; } = string.Empty;

    public string AdSoyad { get; set; } = string.Empty;

    public bool AktifMi { get; set; }
}