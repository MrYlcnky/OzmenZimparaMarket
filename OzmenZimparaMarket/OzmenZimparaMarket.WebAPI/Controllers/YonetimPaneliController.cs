using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OzmenZimparaMarket.Application.Interfaces;

namespace OzmenZimparaMarket.WebAPI.Controllers;

[ApiController]
[Authorize]
[Route("api/yonetim-paneli")]
public class YonetimPaneliController : ControllerBase
{
    private readonly IYonetimPaneliServisi _yonetimPaneliServisi;

    public YonetimPaneliController(IYonetimPaneliServisi yonetimPaneliServisi)
    {
        _yonetimPaneliServisi = yonetimPaneliServisi;
    }

    [HttpGet("ozet")]
    public async Task<IActionResult> Ozet(CancellationToken cancellationToken)
    {
        var sonuc = await _yonetimPaneliServisi.OzetGetirAsync(
            cancellationToken);

        return Ok(sonuc);
    }
}