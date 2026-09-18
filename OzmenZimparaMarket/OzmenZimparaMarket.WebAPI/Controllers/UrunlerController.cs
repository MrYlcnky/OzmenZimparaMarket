using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OzmenZimparaMarket.Application.DTOs.UrunDtos;
using OzmenZimparaMarket.Application.Interfaces;
using OzmenZimparaMarket.Application.Istisnalar;

namespace OzmenZimparaMarket.WebAPI.Controllers;

[ApiController]
[Route("api/urunler")]
public class UrunlerController : ControllerBase
{
    private readonly IUrunServisi _urunServisi;

    public UrunlerController(IUrunServisi urunServisi)
    {
        _urunServisi = urunServisi;
    }

    [AllowAnonymous]
    [HttpPost("filtrele")]
    public async Task<IActionResult> Filtrele(UrunFiltreDto filtre, CancellationToken cancellationToken)
    {
        filtre.AktifMi = true;

        var sonuc = await _urunServisi.FiltreleAsync(filtre, cancellationToken);

        return Ok(sonuc);
    }

    [AllowAnonymous]
    [HttpGet("seo-url/{seoUrl}")]
    public async Task<IActionResult> SeoUrlIleGetir(string seoUrl, CancellationToken cancellationToken)
    {
        var urun = await _urunServisi.SeoUrlIleGetirAsync(seoUrl, cancellationToken);

        if (urun is null)
            throw new KaynakBulunamadiException("Ürün bulunamadı.");

        return Ok(urun);
    }

    [AllowAnonymous]
    [HttpGet("one-cikanlar")]
    public async Task<IActionResult> OneCikanlar([FromQuery] int adet = 8, CancellationToken cancellationToken = default)
    {
        var urunler = await _urunServisi.OneCikanlariGetirAsync(adet, cancellationToken);

        return Ok(urunler);
    }

    [AllowAnonymous]
    [HttpGet("filtre-secenekleri")]
    public async Task<IActionResult> FiltreSecenekleri(
        [FromQuery] int? kategoriId = null,
        [FromQuery] bool altKategorilerDahilMi = true,
        CancellationToken cancellationToken = default)
    {
        var filtreSecenekleri = await _urunServisi.FiltreSecenekleriniGetirAsync(
            kategoriId,
            altKategorilerDahilMi,
            cancellationToken);

        return Ok(filtreSecenekleri);
    }

    [Authorize]
    [HttpPost("yonetim-filtrele")]
    public async Task<IActionResult> YonetimFiltrele(UrunFiltreDto filtre, CancellationToken cancellationToken)
    {
        var sonuc = await _urunServisi.FiltreleAsync(filtre, cancellationToken);

        return Ok(sonuc);
    }

    [Authorize]
    [HttpGet("detay/{id:int}")]
    public async Task<IActionResult> Detay(int id, CancellationToken cancellationToken)
    {
        var urun = await _urunServisi.IdIleGetirAsync(id, cancellationToken);

        if (urun is null)
            throw new KaynakBulunamadiException("Ürün bulunamadı.");

        return Ok(urun);
    }

    [Authorize]
    [HttpPost("ekle")]
    public async Task<IActionResult> Ekle(UrunEkleDto dto, CancellationToken cancellationToken)
    {
        var urun = await _urunServisi.EkleAsync(dto, cancellationToken);

        return Ok(urun);
    }

    [Authorize]
    [HttpPut("guncelle/{id:int}")]
    public async Task<IActionResult> Guncelle(int id, UrunGuncelleDto dto, CancellationToken cancellationToken)
    {
        var urun = await _urunServisi.GuncelleAsync(id, dto, cancellationToken);

        return Ok(urun);
    }

    [Authorize]
    [HttpPatch("durum-degistir/{id:int}")]
    public async Task<IActionResult> DurumDegistir(int id, [FromQuery] bool? aktifMi, CancellationToken cancellationToken)
    {
        if (!aktifMi.HasValue)
            throw new IsKuraliException("Aktiflik durumu belirtilmelidir.");

        var urun = await _urunServisi.DurumDegistirAsync(id, aktifMi.Value, cancellationToken);

        return Ok(urun);
    }

    [Authorize]
    [HttpPost("toplu-sil")]
    public async Task<IActionResult> TopluSil( UrunTopluSilDto dto, CancellationToken cancellationToken)
    {
        var sonuc =
            await _urunServisi.TopluSilAsync(
                dto,
                cancellationToken);

        return Ok(sonuc);
    }

    [Authorize]
    [HttpDelete("sil/{id:int}")]
    public async Task<IActionResult> Sil(int id, CancellationToken cancellationToken)
    {
        await _urunServisi.SilAsync(id, cancellationToken);

        return NoContent();
    }
}