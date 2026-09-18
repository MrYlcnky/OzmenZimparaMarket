using OzmenZimparaMarket.Application.DTOs.UrunDtos;
using OzmenZimparaMarket.Application.Validasyonlar.UrunDtos;
using Xunit;

namespace OzmenZimparaMarket.Tests.Validasyonlar;

public class UrunFiltreDtoValidatorTests
{
    [Fact]
    public void Validate_SayfaNoSifirOldugunda_GecersizOlmali()
    {
        var validator = new UrunFiltreDtoValidator();

        var dto = new UrunFiltreDto
        {
            SayfaNo = 0,
            SayfaBoyutu = 20
        };

        var sonuc = validator.Validate(dto);

        Assert.False(sonuc.IsValid);

        Assert.Contains(
            sonuc.Errors,
            x => x.PropertyName == nameof(UrunFiltreDto.SayfaNo));
    }

    [Fact]
    public void Validate_SayfaBoyutuYuzdenBuyukOldugunda_GecersizOlmali()
    {
        var validator = new UrunFiltreDtoValidator();

        var dto = new UrunFiltreDto
        {
            SayfaNo = 1,
            SayfaBoyutu = 101
        };

        var sonuc = validator.Validate(dto);

        Assert.False(sonuc.IsValid);

        Assert.Contains(
            sonuc.Errors,
            x => x.PropertyName == nameof(UrunFiltreDto.SayfaBoyutu));
    }

    [Fact]
    public void Validate_YirmiBirTeknikFiltreGrubuOldugunda_GecersizOlmali()
    {
        var validator = new UrunFiltreDtoValidator();

        var dto = new UrunFiltreDto
        {
            TeknikDetayFiltreleri = Enumerable
                .Range(1, 21)
                .Select(x => new UrunTeknikDetayFiltreDto
                {
                    UrunDetayTanimiId = x,
                    Degerler = ["Deger"]
                })
                .ToList()
        };

        var sonuc = validator.Validate(dto);

        Assert.False(sonuc.IsValid);
    }

    [Fact]
    public void Validate_AyniDetayTanimiBirdenFazlaKezGonderildiginde_GecersizOlmali()
    {
        var validator = new UrunFiltreDtoValidator();

        var dto = new UrunFiltreDto
        {
            TeknikDetayFiltreleri =
            [
                new UrunTeknikDetayFiltreDto
                {
                    UrunDetayTanimiId = 1,
                    Degerler = ["Metal"]
                },
                new UrunTeknikDetayFiltreDto
                {
                    UrunDetayTanimiId = 1,
                    Degerler = ["Ahşap"]
                }
            ]
        };

        var sonuc = validator.Validate(dto);

        Assert.False(sonuc.IsValid);
    }

    [Fact]
    public void Validate_BirFiltredeEllibirDegerOldugunda_GecersizOlmali()
    {
        var validator = new UrunFiltreDtoValidator();

        var dto = new UrunFiltreDto
        {
            TeknikDetayFiltreleri =
            [
                new UrunTeknikDetayFiltreDto
                {
                    UrunDetayTanimiId = 1,
                    Degerler = Enumerable
                        .Range(1, 51)
                        .Select(x => $"Deger{x}")
                        .ToList()
                }
            ]
        };

        var sonuc = validator.Validate(dto);

        Assert.False(sonuc.IsValid);
    }

    [Fact]
    public void Validate_IkiYuzBirKarakterlikFiltreDegeriOldugunda_GecersizOlmali()
    {
        var validator = new UrunFiltreDtoValidator();

        var dto = new UrunFiltreDto
        {
            TeknikDetayFiltreleri =
            [
                new UrunTeknikDetayFiltreDto
                {
                    UrunDetayTanimiId = 1,
                    Degerler = [new string('A', 201)]
                }
            ]
        };

        var sonuc = validator.Validate(dto);

        Assert.False(sonuc.IsValid);
    }

    [Fact]
    public void Validate_NormalFiltreIstegiOldugunda_GecerliOlmali()
    {
        var validator = new UrunFiltreDtoValidator();

        var dto = new UrunFiltreDto
        {
            SayfaNo = 1,
            SayfaBoyutu = 20,
            TeknikDetayFiltreleri =
            [
                new UrunTeknikDetayFiltreDto
                {
                    UrunDetayTanimiId = 1,
                    Degerler = ["Metal", "Ahşap"]
                }
            ]
        };

        var sonuc = validator.Validate(dto);

        Assert.True(sonuc.IsValid);
    }
}