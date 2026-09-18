using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OzmenZimparaMarket.Application.Interfaces.Excel;
using OzmenZimparaMarket.Application.Istisnalar;

namespace OzmenZimparaMarket.WebAPI.Controllers;

[ApiController]
[Authorize]
[Route("api/excel")]
public class ExcelController : ControllerBase
{
    private readonly IExcelSablonServisi _excelSablonServisi;
    private readonly IExcelKategoriImportServisi _excelKategoriImportServisi;
    private readonly IExcelUrunExportServisi _excelUrunExportServisi;
    private readonly IExcelUrunImportServisi _excelUrunImportServisi;

    public ExcelController(
     IExcelSablonServisi excelSablonServisi,
     IExcelKategoriImportServisi excelKategoriImportServisi,
     IExcelUrunExportServisi excelUrunExportServisi,
     IExcelUrunImportServisi excelUrunImportServisi)
    {
        _excelSablonServisi =
            excelSablonServisi;

        _excelKategoriImportServisi =
            excelKategoriImportServisi;

        _excelUrunExportServisi =
            excelUrunExportServisi;

        _excelUrunImportServisi =
            excelUrunImportServisi;
    }

    [HttpGet("kategori-sablonu")]
    public async Task<IActionResult> KategoriSablonunuIndir(
        CancellationToken cancellationToken)
    {
        var dosya = await _excelSablonServisi
            .KategoriSablonuOlusturAsync(cancellationToken);

        return File(
            dosya.Icerik,
            dosya.IcerikTuru,
            dosya.DosyaAdi);
    }

    [HttpGet("urun-sablonu")]
    public async Task<IActionResult> UrunSablonunuIndir(
    CancellationToken cancellationToken)
    {
        var dosya = await _excelSablonServisi
            .UrunSablonuOlusturAsync(cancellationToken);

        return File(
            dosya.Icerik,
            dosya.IcerikTuru,
            dosya.DosyaAdi);
    }

    [HttpGet("urunler/disari-aktar")]
    public async Task<IActionResult> UrunleriDisariAktar(
    CancellationToken cancellationToken)
    {
        var dosya =
            await _excelUrunExportServisi
                .DisariAktarAsync(
                    cancellationToken);

        return File(
            dosya.Icerik,
            dosya.IcerikTuru,
            dosya.DosyaAdi);
    }

    [HttpPost("kategoriler/analiz")]
    public async Task<IActionResult> KategorileriAnalizEt(
     IFormFile dosya,
     CancellationToken cancellationToken)
    {
        if (dosya is null || dosya.Length == 0)
            throw new IsKuraliException("Analiz edilecek Excel dosyası seçilmelidir.");

        var uzanti = Path.GetExtension(dosya.FileName);

        if (!string.Equals(
                uzanti,
                ".xlsx",
                StringComparison.OrdinalIgnoreCase))
        {
            throw new IsKuraliException(
                "Yalnızca .xlsx uzantılı Excel dosyaları kullanılabilir.");
        }

        await using var dosyaAkisi = dosya.OpenReadStream();

        var sonuc = await _excelKategoriImportServisi.AnalizEtAsync(
            dosyaAkisi,
            dosya.FileName,
            cancellationToken);

        return Ok(sonuc);
    }

    [HttpPost("kategoriler/aktar")]
    public async Task<IActionResult> KategorileriAktar( IFormFile dosya, CancellationToken cancellationToken)
    {
        if (dosya is null || dosya.Length == 0)
        {
            throw new IsKuraliException(
                "İçe aktarılacak Excel dosyası seçilmelidir.");
        }

        var uzanti =
            Path.GetExtension(
                dosya.FileName);

        if (!string.Equals(
                uzanti,
                ".xlsx",
                StringComparison.OrdinalIgnoreCase))
        {
            throw new IsKuraliException(
                "Yalnızca .xlsx uzantılı Excel dosyaları kullanılabilir.");
        }

        await using var dosyaAkisi =
            dosya.OpenReadStream();

        var sonuc =
            await _excelKategoriImportServisi
                .AktarAsync(
                    dosyaAkisi,
                    dosya.FileName,
                    cancellationToken);

        return Ok(sonuc);
    }


    [HttpPost("urunler/analiz")]
    public async Task<IActionResult> UrunleriAnalizEt(
    IFormFile dosya,
    CancellationToken cancellationToken)
    {
        if (dosya is null ||
            dosya.Length == 0)
        {
            throw new IsKuraliException(
                "Analiz edilecek Excel dosyası seçilmelidir.");
        }

        var uzanti =
            Path.GetExtension(
                dosya.FileName);

        if (!string.Equals(
                uzanti,
                ".xlsx",
                StringComparison.OrdinalIgnoreCase))
        {
            throw new IsKuraliException(
                "Yalnızca .xlsx uzantılı Excel dosyaları kullanılabilir.");
        }

        await using var dosyaAkisi =
            dosya.OpenReadStream();

        var sonuc =
            await _excelUrunImportServisi
                .AnalizEtAsync(
                    dosyaAkisi,
                    dosya.FileName,
                    cancellationToken);

        return Ok(
            sonuc);
    }

    [HttpPost("urunler/aktar")]
    public async Task<IActionResult> UrunleriAktar(
        IFormFile dosya,
        CancellationToken cancellationToken)
    {
        if (dosya is null ||
            dosya.Length == 0)
        {
            throw new IsKuraliException(
                "İçe aktarılacak Excel dosyası seçilmelidir.");
        }

        var uzanti =
            Path.GetExtension(
                dosya.FileName);

        if (!string.Equals(
                uzanti,
                ".xlsx",
                StringComparison.OrdinalIgnoreCase))
        {
            throw new IsKuraliException(
                "Yalnızca .xlsx uzantılı Excel dosyaları kullanılabilir.");
        }

        await using var dosyaAkisi =
            dosya.OpenReadStream();

        var sonuc =
            await _excelUrunImportServisi
                .AktarAsync(
                    dosyaAkisi,
                    dosya.FileName,
                    cancellationToken);

        return Ok(
            sonuc);
    }
}