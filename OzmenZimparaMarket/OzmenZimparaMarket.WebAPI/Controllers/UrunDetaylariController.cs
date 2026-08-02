using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OzmenZimparaMarket.Application.DTOs.UrunDetayiDtos;
using OzmenZimparaMarket.Application.Interfaces;

namespace OzmenZimparaMarket.WebAPI.Controllers;

[ApiController]
[Authorize]
[Route("api/urun-detaylari")]
public class UrunDetaylariController : ControllerBase
{
    private readonly IUrunDetayiServisi _urunDetayiServisi;

    public UrunDetaylariController(IUrunDetayiServisi urunDetayiServisi)
    {
        _urunDetayiServisi = urunDetayiServisi;
    }

    [HttpGet("listele")]
    public async Task<IActionResult> Listele(CancellationToken cancellationToken)
    {
        var detaylar = await _urunDetayiServisi.TumunuGetirAsync(false, cancellationToken);

        return Ok(detaylar);
    }

    [HttpGet("urune-gore/{urunId:int}")]
    public async Task<IActionResult> UruneGoreGetir(int urunId, CancellationToken cancellationToken)
    {
        var detaylar = await _urunDetayiServisi.UruneGoreGetirAsync(urunId, false, cancellationToken);

        return Ok(detaylar);
    }

    [HttpGet("detay/{id:int}")]
    public async Task<IActionResult> Detay(int id, CancellationToken cancellationToken)
    {
        var detay = await _urunDetayiServisi.IdIleGetirAsync(id, cancellationToken);

        if (detay is null) throw new KeyNotFoundException("Ürün detay değeri bulunamadı.");

        return Ok(detay);
    }

    [HttpPost("ekle")]
    public async Task<IActionResult> Ekle(UrunDetayiEkleDto dto, CancellationToken cancellationToken)
    {
        var detay = await _urunDetayiServisi.EkleAsync(dto, cancellationToken);

        return Ok(detay);
    }

    [HttpPut("guncelle/{id:int}")]
    public async Task<IActionResult> Guncelle(int id, UrunDetayiGuncelleDto dto, CancellationToken cancellationToken)
    {
        var detay = await _urunDetayiServisi.GuncelleAsync(id, dto, cancellationToken);

        return Ok(detay);
    }

    [HttpPatch("durum-degistir/{id:int}")]
    public async Task<IActionResult> DurumDegistir(int id, [FromQuery] bool aktifMi, CancellationToken cancellationToken)
    {
        var detay = await _urunDetayiServisi.DurumDegistirAsync(id, aktifMi, cancellationToken);

        return Ok(detay);
    }

    [HttpDelete("sil/{id:int}")]
    public async Task<IActionResult> Sil(int id, CancellationToken cancellationToken)
    {
        await _urunDetayiServisi.SilAsync(id, cancellationToken);

        return NoContent();
    }
}