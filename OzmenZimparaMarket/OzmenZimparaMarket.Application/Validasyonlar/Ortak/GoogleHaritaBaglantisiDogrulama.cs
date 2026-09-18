namespace OzmenZimparaMarket.Application.Validasyonlar.Ortak;

public static class GoogleHaritaBaglantisiDogrulama
{
    private static readonly HashSet<string> NormalBaglantiHostlari = new(StringComparer.OrdinalIgnoreCase)
    {
        "google.com",
        "www.google.com",
        "maps.google.com",
        "maps.app.goo.gl",
        "goo.gl"
    };

    private static readonly HashSet<string> GommeBaglantisiHostlari = new(StringComparer.OrdinalIgnoreCase)
    {
        "google.com",
        "www.google.com",
        "maps.google.com"
    };

    public static bool NormalBaglantiGecerliMi(string? baglanti)
    {
        if (string.IsNullOrWhiteSpace(baglanti)) return true;

        if (!Uri.TryCreate(baglanti.Trim(), UriKind.Absolute, out var uri)) return false;
        if (!string.Equals(uri.Scheme, Uri.UriSchemeHttps, StringComparison.OrdinalIgnoreCase)) return false;
        if (!NormalBaglantiHostlari.Contains(uri.Host)) return false;

        if (uri.Host.Equals("maps.app.goo.gl", StringComparison.OrdinalIgnoreCase)) return true;

        if (uri.Host.Equals("goo.gl", StringComparison.OrdinalIgnoreCase))
            return uri.AbsolutePath.StartsWith("/maps", StringComparison.OrdinalIgnoreCase);

        return uri.AbsolutePath.StartsWith("/maps", StringComparison.OrdinalIgnoreCase);
    }

    public static bool GommeBaglantisiGecerliMi(string? baglanti)
    {
        if (string.IsNullOrWhiteSpace(baglanti)) return true;

        if (!Uri.TryCreate(baglanti.Trim(), UriKind.Absolute, out var uri)) return false;
        if (!string.Equals(uri.Scheme, Uri.UriSchemeHttps, StringComparison.OrdinalIgnoreCase)) return false;
        if (!GommeBaglantisiHostlari.Contains(uri.Host)) return false;

        return uri.AbsolutePath.StartsWith("/maps/embed", StringComparison.OrdinalIgnoreCase);
    }
}