using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using OzmenZimparaMarket.Application.DTOs.AuthDtos;
using OzmenZimparaMarket.Application.Interfaces;
using OzmenZimparaMarket.WebAPI.Uzantilar;
using OzmenZimparaMarket.Application.Istisnalar;

namespace OzmenZimparaMarket.WebAPI.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthServisi _authServisi;

    public AuthController(IAuthServisi authServisi)
    {
        _authServisi = authServisi;
    }

    [AllowAnonymous]
    [EnableRateLimiting("GirisPolitikasi")]
    [HttpPost("giris")]
    public async Task<IActionResult> Giris(GirisDto dto, CancellationToken cancellationToken)
    {
        var sonuc = await _authServisi.GirisAsync(dto, cancellationToken);

        return Ok(sonuc);
    }

    [Authorize]
    [HttpGet("mevcut-kullanici")]
    public async Task<IActionResult> MevcutKullanici(CancellationToken cancellationToken)
    {
        var kullaniciId = User.KullaniciIdGetir();

        var kullanici = await _authServisi.MevcutKullaniciyiGetirAsync(kullaniciId, cancellationToken);

        if (kullanici is null) throw new YetkisizErisimException("Oturum sahibi kullanıcı bulunamadı veya kullanıcı pasif durumdadır.");

        return Ok(kullanici);
    }
}