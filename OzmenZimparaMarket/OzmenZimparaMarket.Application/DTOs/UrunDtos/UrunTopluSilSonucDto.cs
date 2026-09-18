namespace OzmenZimparaMarket.Application.DTOs.UrunDtos;

public class UrunTopluSilSonucDto
{
    public int IstenenKayitSayisi { get; set; }

    public int SilinenKayitSayisi { get; set; }

    public int SilinemeyenKayitSayisi { get; set; }

    public List<int> SilinenIdler { get; set; } = new();

    public List<UrunTopluSilHataDto> Hatalar { get; set; } = new();
}