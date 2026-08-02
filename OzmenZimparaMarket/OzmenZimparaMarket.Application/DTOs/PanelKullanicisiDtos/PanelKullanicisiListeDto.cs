namespace OzmenZimparaMarket.Application.DTOs.PanelKullanicisiDtos;

public class PanelKullanicisiListeDto
{
    public int Id { get; set; }

    public string KullaniciAdi { get; set; } = string.Empty;

    public string AdSoyad { get; set; } = string.Empty;

    public bool AktifMi { get; set; }

    public DateTime OlusturmaTarihi { get; set; }

    public DateTime? GuncellemeTarihi { get; set; }
}