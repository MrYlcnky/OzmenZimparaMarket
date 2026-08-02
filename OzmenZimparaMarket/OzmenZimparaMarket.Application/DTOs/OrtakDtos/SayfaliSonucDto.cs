namespace OzmenZimparaMarket.Application.DTOs.OrtakDtos;

public class SayfaliSonucDto<T>
{
    public IReadOnlyList<T> Kayitlar { get; set; } = [];

    public int SayfaNo { get; set; }

    public int SayfaBoyutu { get; set; }

    public int ToplamKayitSayisi { get; set; }

    public int ToplamSayfaSayisi { get; set; }

    public bool OncekiSayfaVarMi => SayfaNo > 1;

    public bool SonrakiSayfaVarMi => SayfaNo < ToplamSayfaSayisi;
}