using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OzmenZimparaMarket.Application.DTOs.PanelKullanicisiDtos;
using OzmenZimparaMarket.Application.Interfaces;
using OzmenZimparaMarket.Application.Istisnalar;
using OzmenZimparaMarket.WebAPI.Uzantilar;

namespace OzmenZimparaMarket.WebAPI.Controllers;

[ApiController]
[Authorize]
[Route("api/panel-kullanicilari")]
public class PanelKullanicilariController : ControllerBase
{
    private readonly IPanelKullanicisiServisi _panelKullanicisiServisi;

    public PanelKullanicilariController(IPanelKullanicisiServisi panelKullanicisiServisi)
    {
        _panelKullanicisiServisi = panelKullanicisiServisi;
    }

    [HttpGet("listele")]
    public async Task<IActionResult> Listele(CancellationToken cancellationToken)
    {
        var kullanicilar = await _panelKullanicisiServisi.TumunuGetirAsync(cancellationToken);

        return Ok(kullanicilar);
    }

    [HttpGet("detay/{id:int}")]
    public async Task<IActionResult> Detay(int id, CancellationToken cancellationToken)
    {
        var kullanici = await _panelKullanicisiServisi.IdIleGetirAsync(id, cancellationToken);

        if (kullanici is null)
            throw new KaynakBulunamadiException("Panel kullanıcısı bulunamadı.");

        return Ok(kullanici);
    }

    [HttpPost("ekle")]
    public async Task<IActionResult> Ekle(PanelKullanicisiEkleDto dto, CancellationToken cancellationToken)
    {
        var kullanici = await _panelKullanicisiServisi.EkleAsync(dto, cancellationToken);

        return Ok(kullanici);
    }

    [HttpPut("guncelle/{id:int}")]
    public async Task<IActionResult> Guncelle(int id, PanelKullanicisiGuncelleDto dto, CancellationToken cancellationToken)
    {
        var mevcutKullaniciId = User.KullaniciIdGetir();

        if (id == mevcutKullaniciId && !dto.AktifMi)
            throw new IsKuraliException("Giriş yaptığınız kendi kullanıcı hesabınızı pasife alamazsınız.");

        var kullanici = await _panelKullanicisiServisi.GuncelleAsync(id, dto, cancellationToken);

        return Ok(kullanici);
    }
    [HttpPatch("durum-degistir/{id:int}")]
    public async Task<IActionResult> DurumDegistir(int id, [FromQuery] bool? aktifMi, CancellationToken cancellationToken)
    {
        if (!aktifMi.HasValue)
            throw new IsKuraliException("Aktiflik durumu belirtilmelidir.");

        var mevcutKullaniciId = User.KullaniciIdGetir();

        if (id == mevcutKullaniciId && !aktifMi.Value)
            throw new IsKuraliException("Giriş yaptığınız kendi kullanıcı hesabınızı pasife alamazsınız.");

        var kullanici = await _panelKullanicisiServisi.DurumDegistirAsync(id, aktifMi.Value, cancellationToken);

        return Ok(kullanici);
    }

    [HttpDelete("sil/{id:int}")]
    public async Task<IActionResult> Sil(int id, CancellationToken cancellationToken)
    {
        var mevcutKullaniciId = User.KullaniciIdGetir();

        if (id == mevcutKullaniciId)
            throw new IsKuraliException("Giriş yaptığınız kendi kullanıcı hesabınızı silemezsiniz.");

        await _panelKullanicisiServisi.SilAsync(id, cancellationToken);

        return NoContent();
    }

    [HttpPut("sifre-degistir")]
    public async Task<IActionResult> SifreDegistir(PanelKullanicisiSifreDegistirDto dto, CancellationToken cancellationToken)
    {
        var mevcutKullaniciId = User.KullaniciIdGetir();

        await _panelKullanicisiServisi.SifreDegistirAsync(mevcutKullaniciId, dto, cancellationToken);

        return NoContent();
    }

    [HttpPut("sifre-sifirla/{id:int}")]
    public async Task<IActionResult> SifreSifirla(int id, PanelKullanicisiSifreSifirlaDto dto, CancellationToken cancellationToken)
    {
        var mevcutKullaniciId = User.KullaniciIdGetir();

        if (id == mevcutKullaniciId)
            throw new IsKuraliException("Kendi şifrenizi sıfırlayamazsınız. Şifrenizi değiştirmek için şifre değiştirme işlemini kullanınız.");

        await _panelKullanicisiServisi.SifreSifirlaAsync(id, dto, cancellationToken);

        return NoContent();
    }
}