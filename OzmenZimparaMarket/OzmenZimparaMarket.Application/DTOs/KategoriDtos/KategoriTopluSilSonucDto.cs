namespace OzmenZimparaMarket.Application.DTOs.KategoriDtos;

public class KategoriTopluSilSonucDto
{
    public int IstenenKayitSayisi { get; set; }

    public int SilinenKayitSayisi { get; set; }

    public int SilinemeyenKayitSayisi { get; set; }

    public List<int> SilinenIdler { get; set; } = new();

    public List<KategoriTopluSilHataDto> Hatalar { get; set; } = new();
}