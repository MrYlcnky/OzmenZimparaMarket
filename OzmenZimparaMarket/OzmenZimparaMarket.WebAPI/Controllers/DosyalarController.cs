using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OzmenZimparaMarket.Application.DTOs.DosyaDtos;
using OzmenZimparaMarket.Application.Interfaces;
using OzmenZimparaMarket.Application.Istisnalar;

namespace OzmenZimparaMarket.WebAPI.Controllers;

[ApiController]
[Authorize]
[Route("api/dosyalar")]
public class DosyalarController : ControllerBase
{
    private readonly IDosyaServisi _dosyaServisi;
    private readonly IValidator<DosyaYukleDto> _dosyaYukleValidator;

    public DosyalarController(IDosyaServisi dosyaServisi, IValidator<DosyaYukleDto> dosyaYukleValidator)
    {
        _dosyaServisi = dosyaServisi;
        _dosyaYukleValidator = dosyaYukleValidator;
    }

    [HttpPost("urun-gorseli-yukle")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UrunGorseliYukle(IFormFile dosya, CancellationToken cancellationToken)
    {
        DosyayiDogrula(dosya);

        await using var dosyaAkisi = dosya.OpenReadStream();

        var dto = DosyaDtoOlustur(dosya, dosyaAkisi);

        await _dosyaYukleValidator.ValidateAndThrowAsync(dto, cancellationToken);

        var sonuc = await _dosyaServisi.UrunGorseliYukleAsync(dto, cancellationToken);

        return Ok(sonuc);
    }

    [HttpPost("kategori-gorseli-yukle")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> KategoriGorseliYukle(IFormFile dosya, CancellationToken cancellationToken)
    {
        DosyayiDogrula(dosya);

        await using var dosyaAkisi = dosya.OpenReadStream();

        var dto = DosyaDtoOlustur(dosya, dosyaAkisi);

        await _dosyaYukleValidator.ValidateAndThrowAsync(dto, cancellationToken);

        var sonuc = await _dosyaServisi.KategoriGorseliYukleAsync(dto, cancellationToken);

        return Ok(sonuc);
    }

    [HttpPost("urun-gorseline-kopyala")]
    public async Task<IActionResult> UrunGorselineKopyala(
    [FromQuery] string dosyaYolu,
    CancellationToken cancellationToken)
    {
        var sonuc = await _dosyaServisi.UrunGorselineKopyalaAsync(
            dosyaYolu,
            cancellationToken);

        return Ok(sonuc);
    }

    [HttpGet("urun-gorselleri")]
    public async Task<IActionResult> UrunGorselleriniGetir(CancellationToken cancellationToken)
    {
        var sonuc = await _dosyaServisi.UrunGorselleriniGetirAsync(cancellationToken);

        return Ok(sonuc);
    }

    [HttpDelete("sil")]
    public async Task<IActionResult> Sil([FromQuery] string dosyaYolu, CancellationToken cancellationToken)
    {
        await _dosyaServisi.SilAsync(dosyaYolu, cancellationToken);

        return NoContent();
    }

    private static void DosyayiDogrula(IFormFile? dosya)
    {
        if (dosya is null)
            throw new IsKuraliException("Yüklenecek dosya bulunamadı.");

        if (dosya.Length <= 0)
            throw new IsKuraliException("Boş dosya yüklenemez.");
    }

    private static DosyaYukleDto DosyaDtoOlustur(IFormFile dosya, Stream dosyaAkisi)
    {
        return new DosyaYukleDto
        {
            DosyaAdi = dosya.FileName,
            IcerikTuru = dosya.ContentType,
            DosyaBoyutu = dosya.Length,
            DosyaAkisi = dosyaAkisi
        };
    }
}