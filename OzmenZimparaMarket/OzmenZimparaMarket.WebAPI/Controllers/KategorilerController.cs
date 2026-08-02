using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OzmenZimparaMarket.Application.DTOs.KategoriDtos;
using OzmenZimparaMarket.Application.Interfaces;

namespace OzmenZimparaMarket.WebAPI.Controllers;

[ApiController]
[Route("api/kategoriler")]
public class KategorilerController : ControllerBase
{
    private readonly IKategoriServisi _kategoriServisi;

    public KategorilerController(IKategoriServisi kategoriServisi)
    {
        _kategoriServisi = kategoriServisi;
    }

    [AllowAnonymous]
    [HttpGet("listele")]
    public async Task<IActionResult> Listele(CancellationToken cancellationToken)
    {
        var kategoriler = await _kategoriServisi.TumunuGetirAsync(true, cancellationToken);

        return Ok(kategoriler);
    }

    [AllowAnonymous]
    [HttpGet("agac")]
    public async Task<IActionResult> Agac(CancellationToken cancellationToken)
    {
        var kategoriler = await _kategoriServisi.AgaciGetirAsync(true, cancellationToken);

        return Ok(kategoriler);
    }

    [AllowAnonymous]
    [HttpGet("seo-url/{seoUrl}")]
    public async Task<IActionResult> SeoUrlIleGetir(string seoUrl, CancellationToken cancellationToken)
    {
        var kategori = await _kategoriServisi.SeoUrlIleGetirAsync(seoUrl, cancellationToken);

        if (kategori is null) throw new KeyNotFoundException("Kategori bulunamadı.");

        return Ok(kategori);
    }

    [Authorize]
    [HttpGet("yonetim-listele")]
    public async Task<IActionResult> YonetimListele(CancellationToken cancellationToken)
    {
        var kategoriler = await _kategoriServisi.TumunuGetirAsync(false, cancellationToken);

        return Ok(kategoriler);
    }

    [Authorize]
    [HttpGet("detay/{id:int}")]
    public async Task<IActionResult> Detay(int id, CancellationToken cancellationToken)
    {
        var kategori = await _kategoriServisi.IdIleGetirAsync(id, cancellationToken);

        if (kategori is null) throw new KeyNotFoundException("Kategori bulunamadı.");

        return Ok(kategori);
    }

    [Authorize]
    [HttpPost("ekle")]
    public async Task<IActionResult> Ekle(KategoriEkleDto dto, CancellationToken cancellationToken)
    {
        var kategori = await _kategoriServisi.EkleAsync(dto, cancellationToken);

        return Ok(kategori);
    }

    [Authorize]
    [HttpPut("guncelle/{id:int}")]
    public async Task<IActionResult> Guncelle(int id, KategoriGuncelleDto dto, CancellationToken cancellationToken)
    {
        var kategori = await _kategoriServisi.GuncelleAsync(id, dto, cancellationToken);

        return Ok(kategori);
    }

    [Authorize]
    [HttpPatch("durum-degistir/{id:int}")]
    public async Task<IActionResult> DurumDegistir(int id, [FromQuery] bool aktifMi, CancellationToken cancellationToken)
    {
        var kategori = await _kategoriServisi.DurumDegistirAsync(id, aktifMi, cancellationToken);

        return Ok(kategori);
    }

    [Authorize]
    [HttpDelete("sil/{id:int}")]
    public async Task<IActionResult> Sil(int id, CancellationToken cancellationToken)
    {
        await _kategoriServisi.SilAsync(id, cancellationToken);

        return NoContent();
    }
}