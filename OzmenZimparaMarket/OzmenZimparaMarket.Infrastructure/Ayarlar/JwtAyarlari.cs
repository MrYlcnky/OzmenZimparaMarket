namespace OzmenZimparaMarket.Infrastructure.Ayarlar;

public class JwtAyarlari
{
    public const string BolumAdi = "Jwt";

    public string GizliAnahtar { get; set; } = string.Empty;

    public string Issuer { get; set; } = string.Empty;

    public string Audience { get; set; } = string.Empty;

    public int TokenSuresiDakika { get; set; }
}