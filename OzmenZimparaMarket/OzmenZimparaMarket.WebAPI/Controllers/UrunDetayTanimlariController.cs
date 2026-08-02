using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OzmenZimparaMarket.Application.DTOs.UrunDetayTanimiDtos;
using OzmenZimparaMarket.Application.Interfaces;

namespace OzmenZimparaMarket.WebAPI.Controllers;

[ApiController]
[Route("api/urun-detay-tanimlari")]
public class UrunDetayTanimlariController : ControllerBase
{
    private readonly IUrunDetayTanimiServisi _urunDetayTanimiServisi;

    public UrunDetayTanimlariController(IUrunDetayTanimiServisi urunDetayTanimiServisi)
    {
        _urunDetayTanimiServisi = urunDetayTanimiServisi;
    }

    [AllowAnonymous]
    [HttpGet("listele")]
    public async Task<IActionResult> Listele(CancellationToken cancellationToken)
    {
        var detayTanimlari = await _urunDetayTanimiServisi.TumunuGetirAsync(true, cancellationToken);

        return Ok(detayTanimlari);
    }

    [Authorize]
    [HttpGet("yonetim-listele")]
    public async Task<IActionResult> YonetimListele(CancellationToken cancellationToken)
    {
        var detayTanimlari = await _urunDetayTanimiServisi.TumunuGetirAsync(false, cancellationToken);

        return Ok(detayTanimlari);
    }

    [Authorize]
    [HttpGet("detay/{id:int}")]
    public async Task<IActionResult> Detay(int id, CancellationToken cancellationToken)
    {
        var detayTanimi = await _urunDetayTanimiServisi.IdIleGetirAsync(id, cancellationToken);

        if (detayTanimi is null) throw new KeyNotFoundException("Ürün detay tanımı bulunamadı.");

        return Ok(detayTanimi);
    }

    [Authorize]
    [HttpPost("ekle")]
    public async Task<IActionResult> Ekle(UrunDetayTanimiEkleDto dto, CancellationToken cancellationToken)
    {
        var detayTanimi = await _urunDetayTanimiServisi.EkleAsync(dto, cancellationToken);

        return Ok(detayTanimi);
    }

    [Authorize]
    [HttpPut("guncelle/{id:int}")]
    public async Task<IActionResult> Guncelle(int id, UrunDetayTanimiGuncelleDto dto, CancellationToken cancellationToken)
    {
        var detayTanimi = await _urunDetayTanimiServisi.GuncelleAsync(id, dto, cancellationToken);

        return Ok(detayTanimi);
    }

    [Authorize]
    [HttpPatch("durum-degistir/{id:int}")]
    public async Task<IActionResult> DurumDegistir(int id, [FromQuery] bool aktifMi, CancellationToken cancellationToken)
    {
        var detayTanimi = await _urunDetayTanimiServisi.DurumDegistirAsync(id, aktifMi, cancellationToken);

        return Ok(detayTanimi);
    }

    [Authorize]
    [HttpDelete("sil/{id:int}")]
    public async Task<IActionResult> Sil(int id, CancellationToken cancellationToken)
    {
        await _urunDetayTanimiServisi.SilAsync(id, cancellationToken);

        return NoContent();
    }
}