namespace OzmenZimparaMarket.Application.Validasyonlar.Ortak;

public static class GorselYoluDogrulama
{
    private static readonly string[] IzinVerilenUzantilar =
    [
        ".jpg",
        ".jpeg",
        ".png",
        ".webp"
    ];

    public static bool UrunGorselYoluGecerliMi(string? gorselYolu)
    {
        return GecerliMi(gorselYolu, "/uploads/urunler/");
    }

    public static bool KategoriGorselYoluGecerliMi(string? gorselYolu)
    {
        return GecerliMi(gorselYolu, "/uploads/kategoriler/");
    }

    private static bool GecerliMi(string? gorselYolu, string beklenenKlasor)
    {
        if (string.IsNullOrWhiteSpace(gorselYolu)) return true;

        var yol = gorselYolu.Trim();

        if (!yol.StartsWith(beklenenKlasor, StringComparison.OrdinalIgnoreCase)) return false;
        if (yol.Contains("..", StringComparison.Ordinal)) return false;
        if (yol.Contains('\\')) return false;
        if (yol.Contains('?') || yol.Contains('#')) return false;
        if (Uri.TryCreate(yol, UriKind.Absolute, out _)) return false;

        var dosyaAdi = Path.GetFileName(yol);

        if (string.IsNullOrWhiteSpace(dosyaAdi)) return false;

        var uzanti = Path.GetExtension(dosyaAdi);

        return IzinVerilenUzantilar.Contains(uzanti, StringComparer.OrdinalIgnoreCase);
    }
}