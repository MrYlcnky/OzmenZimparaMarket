namespace OzmenZimparaMarket.Application.DTOs.AuthDtos;

public class GirisSonucDto
{
    public string Token { get; set; } = string.Empty;

    public DateTime TokenBitisTarihi { get; set; }

    public int KullaniciId { get; set; }

    public string KullaniciAdi { get; set; } = string.Empty;

    public string AdSoyad { get; set; } = string.Empty;
}