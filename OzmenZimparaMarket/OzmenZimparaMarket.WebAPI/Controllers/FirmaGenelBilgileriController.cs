using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OzmenZimparaMarket.Application.DTOs.FirmaGenelBilgisiDtos;
using OzmenZimparaMarket.Application.Interfaces;

namespace OzmenZimparaMarket.WebAPI.Controllers;

[ApiController]
[Route("api/firma-genel-bilgileri")]
public class FirmaGenelBilgileriController : ControllerBase
{
    private readonly IFirmaGenelBilgisiServisi _firmaGenelBilgisiServisi;

    public FirmaGenelBilgileriController(IFirmaGenelBilgisiServisi firmaGenelBilgisiServisi)
    {
        _firmaGenelBilgisiServisi = firmaGenelBilgisiServisi;
    }

    [AllowAnonymous]
    [HttpGet("getir")]
    public async Task<IActionResult> Getir(CancellationToken cancellationToken)
    {
        var firmaBilgisi = await _firmaGenelBilgisiServisi.GetirAsync(cancellationToken);

        return Ok(firmaBilgisi);
    }

    [Authorize]
    [HttpPut("guncelle")]
    public async Task<IActionResult> Guncelle(FirmaGenelBilgisiGuncelleDto dto, CancellationToken cancellationToken)
    {
        var firmaBilgisi = await _firmaGenelBilgisiServisi.GuncelleAsync(dto, cancellationToken);

        return Ok(firmaBilgisi);
    }
}