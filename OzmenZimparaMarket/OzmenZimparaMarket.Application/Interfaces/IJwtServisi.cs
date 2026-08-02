using OzmenZimparaMarket.Application.DTOs.AuthDtos;

namespace OzmenZimparaMarket.Application.Interfaces;

public interface IJwtServisi
{
    JwtTokenSonucDto TokenOlustur(int kullaniciId, string kullaniciAdi, string adSoyad);
}