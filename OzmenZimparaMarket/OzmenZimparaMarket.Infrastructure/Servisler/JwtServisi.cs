using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using OzmenZimparaMarket.Application.DTOs.AuthDtos;
using OzmenZimparaMarket.Application.Interfaces;
using OzmenZimparaMarket.Infrastructure.Ayarlar;

namespace OzmenZimparaMarket.Infrastructure.Servisler;

public class JwtServisi : IJwtServisi
{
    private readonly JwtAyarlari _jwtAyarlari;

    public JwtServisi(IOptions<JwtAyarlari> jwtAyarlari)
    {
        _jwtAyarlari = jwtAyarlari.Value;
    }

    public JwtTokenSonucDto TokenOlustur(int kullaniciId, string kullaniciAdi, string adSoyad)
    {
        AyarlariDogrula();

        if (kullaniciId <= 0) throw new ArgumentException("Kullanıcı ID değeri sıfırdan büyük olmalıdır.", nameof(kullaniciId));
        if (string.IsNullOrWhiteSpace(kullaniciAdi)) throw new ArgumentException("Kullanıcı adı boş olamaz.", nameof(kullaniciAdi));
        if (string.IsNullOrWhiteSpace(adSoyad)) throw new ArgumentException("Ad soyad boş olamaz.", nameof(adSoyad));

        var simdi = DateTime.UtcNow;
        var tokenBitisTarihi = simdi.AddMinutes(_jwtAyarlari.TokenSuresiDakika);
        var anahtarBytes = Encoding.UTF8.GetBytes(_jwtAyarlari.GizliAnahtar);
        var guvenlikAnahtari = new SymmetricSecurityKey(anahtarBytes);
        var imzalamaBilgileri = new SigningCredentials(guvenlikAnahtari, SecurityAlgorithms.HmacSha256);

        var claimler = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, kullaniciId.ToString()),
            new("kullaniciAdi", kullaniciAdi),
            new("adSoyad", adSoyad),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var tokenTanimi = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claimler),
            Issuer = _jwtAyarlari.Issuer,
            Audience = _jwtAyarlari.Audience,
            IssuedAt = simdi,
            NotBefore = simdi,
            Expires = tokenBitisTarihi,
            SigningCredentials = imzalamaBilgileri
        };

        var tokenHandler = new JsonWebTokenHandler();
        var token = tokenHandler.CreateToken(tokenTanimi);

        return new JwtTokenSonucDto
        {
            Token = token,
            TokenBitisTarihi = tokenBitisTarihi
        };
    }

    private void AyarlariDogrula()
    {
        if (string.IsNullOrWhiteSpace(_jwtAyarlari.GizliAnahtar)) throw new InvalidOperationException("JWT gizli anahtarı tanımlanmamıştır.");
        if (Encoding.UTF8.GetByteCount(_jwtAyarlari.GizliAnahtar) < 32) throw new InvalidOperationException("JWT gizli anahtarı en az 32 byte uzunluğunda olmalıdır.");
        if (string.IsNullOrWhiteSpace(_jwtAyarlari.Issuer)) throw new InvalidOperationException("JWT Issuer bilgisi tanımlanmamıştır.");
        if (string.IsNullOrWhiteSpace(_jwtAyarlari.Audience)) throw new InvalidOperationException("JWT Audience bilgisi tanımlanmamıştır.");
        if (_jwtAyarlari.TokenSuresiDakika <= 0) throw new InvalidOperationException("JWT token süresi sıfırdan büyük olmalıdır.");
    }
}