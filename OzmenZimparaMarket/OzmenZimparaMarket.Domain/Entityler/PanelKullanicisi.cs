namespace OzmenZimparaMarket.Domain.Entityler;

public class PanelKullanicisi
{
    public int Id { get; set; }

    public string KullaniciAdi { get; set; } = string.Empty;

    public string SifreHash { get; set; } = string.Empty;

    public string AdSoyad { get; set; } = string.Empty;

    public bool AktifMi { get; set; } 

    public DateTime OlusturmaTarihi { get; set; }

    public DateTime? GuncellemeTarihi { get; set; }
}