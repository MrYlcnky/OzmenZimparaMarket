using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OzmenZimparaMarket.Application.DTOs.PanelKullanicisiDtos;
using OzmenZimparaMarket.Application.Interfaces;
using OzmenZimparaMarket.WebAPI.Controllers;
using Xunit;

namespace OzmenZimparaMarket.Tests.Controllers;

public class PanelKullanicilariControllerTests
{
    [Fact]
    public async Task SifreSifirla_KendiHesabiIcinCagrildiginda_Reddedilmeli()
    {
        var sahteServis = new SahtePanelKullanicisiServisi();

        var controller =
            new PanelKullanicilariController(sahteServis);

        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext
            {
                User = new ClaimsPrincipal(
                    new ClaimsIdentity(
                    [
                        new Claim(
                            ClaimTypes.NameIdentifier,
                            "7")
                    ],
                    "Test"))
            }
        };

        var dto = new PanelKullanicisiSifreSifirlaDto
        {
            YeniSifre = "YeniSifre123!",
            YeniSifreTekrar = "YeniSifre123!"
        };

        await Assert.ThrowsAnyAsync<Exception>(
            () => controller.SifreSifirla(
                7,
                dto,
                CancellationToken.None));

        Assert.False(
            sahteServis.SifreSifirlaCagrildiMi);
    }

    private sealed class SahtePanelKullanicisiServisi
        : IPanelKullanicisiServisi
    {
        public bool SifreSifirlaCagrildiMi { get; private set; }

        public Task<IReadOnlyList<PanelKullanicisiListeDto>>
            TumunuGetirAsync(
                CancellationToken cancellationToken = default)
        {
            throw new NotSupportedException();
        }

        public Task<PanelKullanicisiListeDto?>
            IdIleGetirAsync(
                int id,
                CancellationToken cancellationToken = default)
        {
            throw new NotSupportedException();
        }

        public Task<PanelKullanicisiListeDto>
            EkleAsync(
                PanelKullanicisiEkleDto dto,
                CancellationToken cancellationToken = default)
        {
            throw new NotSupportedException();
        }

        public Task<PanelKullanicisiListeDto>
            GuncelleAsync(
                int id,
                PanelKullanicisiGuncelleDto dto,
                CancellationToken cancellationToken = default)
        {
            throw new NotSupportedException();
        }

        public Task SilAsync(
            int id,
            CancellationToken cancellationToken = default)
        {
            throw new NotSupportedException();
        }

        public Task<PanelKullanicisiListeDto>
            DurumDegistirAsync(
                int id,
                bool aktifMi,
                CancellationToken cancellationToken = default)
        {
            throw new NotSupportedException();
        }

        public Task SifreDegistirAsync(
            int kullaniciId,
            PanelKullanicisiSifreDegistirDto dto,
            CancellationToken cancellationToken = default)
        {
            throw new NotSupportedException();
        }

        public Task SifreSifirlaAsync(
            int id,
            PanelKullanicisiSifreSifirlaDto dto,
            CancellationToken cancellationToken = default)
        {
            SifreSifirlaCagrildiMi = true;

            return Task.CompletedTask;
        }
    }
}