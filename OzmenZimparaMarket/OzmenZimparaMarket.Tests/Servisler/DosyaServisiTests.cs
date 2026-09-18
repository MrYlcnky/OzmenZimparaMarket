using Microsoft.Extensions.Options;
using OzmenZimparaMarket.Application.DTOs.DosyaDtos;
using OzmenZimparaMarket.Infrastructure.Ayarlar;
using OzmenZimparaMarket.Infrastructure.Servisler;
using Xunit;

namespace OzmenZimparaMarket.Tests.Servisler;

public class DosyaServisiTests
{
    [Fact]
    public async Task UrunGorseliYukleAsync_SahteJpegGonderildiginde_Reddedilmeli()
    {
        var kokDizin = GeciciKokDizinOlustur();

        try
        {
            var servis = ServisOlustur(kokDizin);

            byte[] sahteJpeg =
            [
                0x54, 0x45, 0x53, 0x54,
                0x44, 0x4F, 0x53, 0x59, 0x41
            ];

            await using var akim = new MemoryStream(sahteJpeg);

            var dto = new DosyaYukleDto
            {
                DosyaAdi = "sahte.jpg",
                IcerikTuru = "image/jpeg",
                DosyaBoyutu = sahteJpeg.Length,
                DosyaAkisi = akim
            };

            await Assert.ThrowsAnyAsync<Exception>(
                () => servis.UrunGorseliYukleAsync(dto));
        }
        finally
        {
            GeciciKokDizinSil(kokDizin);
        }
    }

    [Fact]
    public async Task UrunGorseliYukleAsync_MaksimumBoyutAsildiginda_Reddedilmeli()
    {
        var kokDizin = GeciciKokDizinOlustur();

        try
        {
            var servis = ServisOlustur(
                kokDizin,
                maksimumDosyaBoyutu: 10);

            byte[] veri = new byte[11];

            veri[0] = 0xFF;
            veri[1] = 0xD8;
            veri[2] = 0xFF;

            await using var akim = new MemoryStream(veri);

            var dto = new DosyaYukleDto
            {
                DosyaAdi = "buyuk.jpg",
                IcerikTuru = "image/jpeg",
                DosyaBoyutu = veri.Length,
                DosyaAkisi = akim
            };

            await Assert.ThrowsAnyAsync<Exception>(
                () => servis.UrunGorseliYukleAsync(dto));
        }
        finally
        {
            GeciciKokDizinSil(kokDizin);
        }
    }

    [Fact]
    public async Task UrunGorseliYukleAsync_UzantiVeMimeUyusmadiginda_Reddedilmeli()
    {
        var kokDizin = GeciciKokDizinOlustur();

        try
        {
            var servis = ServisOlustur(kokDizin);

            byte[] pngImzaliVeri =
            [
                0x89, 0x50, 0x4E, 0x47,
                0x0D, 0x0A, 0x1A, 0x0A,
                0x00, 0x00, 0x00, 0x00
            ];

            await using var akim = new MemoryStream(pngImzaliVeri);

            var dto = new DosyaYukleDto
            {
                DosyaAdi = "uyusmaz.jpg",
                IcerikTuru = "image/png",
                DosyaBoyutu = pngImzaliVeri.Length,
                DosyaAkisi = akim
            };

            await Assert.ThrowsAnyAsync<Exception>(
                () => servis.UrunGorseliYukleAsync(dto));
        }
        finally
        {
            GeciciKokDizinSil(kokDizin);
        }
    }

    [Fact]
    public async Task SilAsync_PathTraversalDenemesinde_Reddedilmeli()
    {
        var anaDizin = GeciciKokDizinOlustur();
        var kokDizin = Path.Combine(anaDizin, "wwwroot");

        Directory.CreateDirectory(kokDizin);

        var disDosyaYolu =
            Path.Combine(anaDizin, "silinmemesi-gereken.txt");

        await File.WriteAllTextAsync(
            disDosyaYolu,
            "Bu dosya silinmemeli.");

        try
        {
            var servis = ServisOlustur(kokDizin);

            await Assert.ThrowsAnyAsync<Exception>(
                () => servis.SilAsync("../silinmemesi-gereken.txt"));

            Assert.True(File.Exists(disDosyaYolu));
        }
        finally
        {
            GeciciKokDizinSil(anaDizin);
        }
    }

    [Fact]
    public async Task UrunGorseliYukleAsync_DosyaBoyutuBilgisiGercekleUyusmadiginda_Reddedilmeli()
    {
        var kokDizin = GeciciKokDizinOlustur();

        try
        {
            var servis = ServisOlustur(kokDizin);

            byte[] veri =
            [
                0xFF, 0xD8, 0xFF,
                0x00, 0x00, 0x00
            ];

            await using var akim = new MemoryStream(veri);

            var dto = new DosyaYukleDto
            {
                DosyaAdi = "gorsel.jpg",
                IcerikTuru = "image/jpeg",
                DosyaBoyutu = veri.Length + 5,
                DosyaAkisi = akim
            };

            await Assert.ThrowsAnyAsync<Exception>(
                () => servis.UrunGorseliYukleAsync(dto));
        }
        finally
        {
            GeciciKokDizinSil(kokDizin);
        }
    }

    private static DosyaServisi ServisOlustur(
        string kokDizin,
        long maksimumDosyaBoyutu = 5 * 1024 * 1024)
    {
        var ayarlar = new DosyaAyarlari
        {
            KokDizin = kokDizin,
            MaksimumDosyaBoyutu = maksimumDosyaBoyutu,
            MaksimumGenislik = 8192,
            MaksimumYukseklik = 8192,
            MaksimumPikselSayisi = 40000000,
            UrunGorselleriKlasoru = "uploads/urunler",
            KategoriGorselleriKlasoru = "uploads/kategoriler",
            IzinVerilenUzantilar =
            [
                ".jpg",
                ".jpeg",
                ".png",
                ".webp"
            ],
            IzinVerilenIcerikTurleri =
            [
                "image/jpeg",
                "image/png",
                "image/webp"
            ]
        };

        return new DosyaServisi(
            Options.Create(ayarlar));
    }

    private static string GeciciKokDizinOlustur()
    {
        var dizin = Path.Combine(
            Path.GetTempPath(),
            "OzmenZimparaMarket.Tests",
            Guid.NewGuid().ToString("N"));

        Directory.CreateDirectory(dizin);

        return dizin;
    }

    private static void GeciciKokDizinSil(string dizin)
    {
        if (Directory.Exists(dizin))
            Directory.Delete(dizin, true);
    }
}