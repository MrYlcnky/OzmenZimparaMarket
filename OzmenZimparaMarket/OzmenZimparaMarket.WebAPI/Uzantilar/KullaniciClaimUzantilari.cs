using OzmenZimparaMarket.Application.Istisnalar;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace OzmenZimparaMarket.WebAPI.Uzantilar;

public static class KullaniciClaimUzantilari
{
    public static int KullaniciIdGetir(this ClaimsPrincipal kullanici)
    {
        var kullaniciIdDegeri = kullanici.FindFirst(JwtRegisteredClaimNames.Sub)?.Value
                               ?? kullanici.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (!int.TryParse(kullaniciIdDegeri, out var kullaniciId) || kullaniciId <= 0) throw new YetkisizErisimException("Oturum bilgisi geçersizdir.");

        return kullaniciId;
    }
}