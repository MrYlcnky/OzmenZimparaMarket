namespace OzmenZimparaMarket.WebAPI.Modeller;

public class ApiHataCevabi
{
    public bool Basarili { get; set; } = false;

    public int DurumKodu { get; set; }

    public string Mesaj { get; set; } = string.Empty;

    public string? TakipKodu { get; set; }

    public Dictionary<string, string[]>? Hatalar { get; set; }
}