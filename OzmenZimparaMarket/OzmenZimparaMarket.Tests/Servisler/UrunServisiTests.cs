using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using OzmenZimparaMarket.Application.DTOs.DosyaDtos;
using OzmenZimparaMarket.Application.DTOs.UrunDtos;
using OzmenZimparaMarket.Application.Interfaces;
using OzmenZimparaMarket.Domain.Entityler;
using OzmenZimparaMarket.Domain.Enumlar;
using OzmenZimparaMarket.Infrastructure.Servisler;
using OzmenZimparaMarket.Infrastructure.Veritabani;
using Xunit;

namespace OzmenZimparaMarket.Tests.Servisler;

public class UrunServisiTests
{
    [Fact]
    public async Task EkleAsync_AyniUrunKoduTekrarKullanildiginda_Reddedilmeli()
    {
        await using var dbContext = DbContextOlustur();

        var kategori = AktifKategoriOlustur(
            1,
            "Zımpara Bantları",
            "zimpara-bantlari");

        var mevcutUrun = UrunOlustur(
            1,
            kategori.Id,
            "Mevcut Ürün",
            "URUN-001",
            "mevcut-urun",
            true);

        dbContext.Kategoriler.Add(kategori);
        dbContext.Urunler.Add(mevcutUrun);

        await dbContext.SaveChangesAsync();

        var servis = ServisOlustur(dbContext);

        var dto = new UrunEkleDto
        {
            KategoriId = kategori.Id,
            UrunAdi = "Yeni Ürün",
            UrunKodu = "URUN-001",
            SeoUrl = "yeni-urun",
            SatisBirimi = SatisBirimi.Adet,
            SiraNo = 2,
            AktifMi = true
        };

        await Assert.ThrowsAnyAsync<Exception>(
            () => servis.EkleAsync(dto));

        Assert.Equal(
            1,
            await dbContext.Urunler.CountAsync());
    }

    [Fact]
    public async Task EkleAsync_AyniSeoUrlTekrarKullanildiginda_Reddedilmeli()
    {
        await using var dbContext = DbContextOlustur();

        var kategori = AktifKategoriOlustur(
            1,
            "Zımpara Bantları",
            "zimpara-bantlari");

        var mevcutUrun = UrunOlustur(
            1,
            kategori.Id,
            "Mevcut Ürün",
            "URUN-001",
            "ayni-seo-url",
            true);

        dbContext.Kategoriler.Add(kategori);
        dbContext.Urunler.Add(mevcutUrun);

        await dbContext.SaveChangesAsync();

        var servis = ServisOlustur(dbContext);

        var dto = new UrunEkleDto
        {
            KategoriId = kategori.Id,
            UrunAdi = "Yeni Ürün",
            UrunKodu = "URUN-002",
            SeoUrl = "ayni-seo-url",
            SatisBirimi = SatisBirimi.Adet,
            SiraNo = 2,
            AktifMi = true
        };

        await Assert.ThrowsAnyAsync<Exception>(
            () => servis.EkleAsync(dto));

        Assert.Equal(
            1,
            await dbContext.Urunler.CountAsync());
    }

    [Fact]
    public async Task FiltreleAsync_PasifUrun_PublicSonuctaGorunmemeli()
    {
        await using var dbContext = DbContextOlustur();

        var kategori = AktifKategoriOlustur(
            1,
            "Zımpara Bantları",
            "zimpara-bantlari");

        var aktifUrun = UrunOlustur(
            1,
            kategori.Id,
            "Aktif Ürün",
            "AKTIF-001",
            "aktif-urun",
            true);

        var pasifUrun = UrunOlustur(
            2,
            kategori.Id,
            "Pasif Ürün",
            "PASIF-001",
            "pasif-urun",
            false);

        dbContext.Kategoriler.Add(kategori);
        dbContext.Urunler.AddRange(
            aktifUrun,
            pasifUrun);

        await dbContext.SaveChangesAsync();

        var servis = ServisOlustur(dbContext);

        var sonuc = await servis.FiltreleAsync(
            new UrunFiltreDto
            {
                AktifMi = true,
                SayfaNo = 1,
                SayfaBoyutu = 20
            });

        Assert.Single(sonuc.Kayitlar);

        Assert.Equal(
            "AKTIF-001",
            sonuc.Kayitlar.Single().UrunKodu);

        Assert.DoesNotContain(
            sonuc.Kayitlar,
            x => x.UrunKodu == "PASIF-001");
    }

    [Fact]
    public async Task FiltreleAsync_UstKategorisiPasifOlanUrun_PublicSonuctaGorunmemeli()
    {
        await using var dbContext = DbContextOlustur();

        var pasifUstKategori = new Kategori
        {
            Id = 1,
            KategoriAdi = "Pasif Üst Kategori",
            SeoUrl = "pasif-ust-kategori",
            SiraNo = 1,
            AktifMi = false,
            OlusturmaTarihi = DateTime.UtcNow
        };

        var aktifAltKategori = new Kategori
        {
            Id = 2,
            UstKategoriId = pasifUstKategori.Id,
            KategoriAdi = "Aktif Alt Kategori",
            SeoUrl = "aktif-alt-kategori",
            SiraNo = 1,
            AktifMi = true,
            OlusturmaTarihi = DateTime.UtcNow
        };

        var urun = UrunOlustur(
            1,
            aktifAltKategori.Id,
            "Gizlenmesi Gereken Ürün",
            "GIZLI-001",
            "gizlenmesi-gereken-urun",
            true);

        dbContext.Kategoriler.AddRange(
            pasifUstKategori,
            aktifAltKategori);

        dbContext.Urunler.Add(urun);

        await dbContext.SaveChangesAsync();

        var servis = ServisOlustur(dbContext);

        var sonuc = await servis.FiltreleAsync(
            new UrunFiltreDto
            {
                AktifMi = true,
                SayfaNo = 1,
                SayfaBoyutu = 20
            });

        Assert.Empty(sonuc.Kayitlar);
        Assert.Equal(0, sonuc.ToplamKayitSayisi);
    }

    private static OzmenZimparaMarketDbContext DbContextOlustur()
    {
        var options =
            new DbContextOptionsBuilder<OzmenZimparaMarketDbContext>()
                .UseInMemoryDatabase(
                    Guid.NewGuid().ToString("N"))
                .Options;

        return new OzmenZimparaMarketDbContext(options);
    }

    private static UrunServisi ServisOlustur(
        OzmenZimparaMarketDbContext dbContext)
    {
        return new UrunServisi(
            dbContext,
            new HtmlTemizlemeServisi(),
            new SahteDosyaServisi(),
            NullLogger<UrunServisi>.Instance);
    }

    private static Kategori AktifKategoriOlustur(
        int id,
        string kategoriAdi,
        string seoUrl)
    {
        return new Kategori
        {
            Id = id,
            KategoriAdi = kategoriAdi,
            SeoUrl = seoUrl,
            SiraNo = 1,
            AktifMi = true,
            OlusturmaTarihi = DateTime.UtcNow
        };
    }

    private static Urun UrunOlustur(
        int id,
        int kategoriId,
        string urunAdi,
        string urunKodu,
        string seoUrl,
        bool aktifMi)
    {
        return new Urun
        {
            Id = id,
            KategoriId = kategoriId,
            UrunAdi = urunAdi,
            UrunKodu = urunKodu,
            SeoUrl = seoUrl,
            SatisBirimi = SatisBirimi.Adet,
            SiraNo = id,
            AktifMi = aktifMi,
            OlusturmaTarihi = DateTime.UtcNow
        };
    }

    private sealed class SahteDosyaServisi : IDosyaServisi
    {
        public Task<DosyaYuklemeSonucDto> UrunGorseliYukleAsync(
            DosyaYukleDto dto,
            CancellationToken cancellationToken = default)
        {
            throw new NotSupportedException();
        }

        public Task<IReadOnlyList<DosyaYuklemeSonucDto>> UrunGorselleriniGetirAsync(
    CancellationToken cancellationToken = default)
        {
            IReadOnlyList<DosyaYuklemeSonucDto> sonuc =
                Array.Empty<DosyaYuklemeSonucDto>();

            return Task.FromResult(sonuc);
        }

        public Task<DosyaYuklemeSonucDto> UrunGorselineKopyalaAsync(
            string dosyaYolu,
            CancellationToken cancellationToken = default)
        {
            var sonuc = new DosyaYuklemeSonucDto
            {
                DosyaAdi = string.Empty,
                DosyaYolu = dosyaYolu
            };

            return Task.FromResult(sonuc);
        }

        public Task<DosyaYuklemeSonucDto> KategoriGorseliYukleAsync(
            DosyaYukleDto dto,
            CancellationToken cancellationToken = default)
        {
            throw new NotSupportedException();
        }

        public Task SilAsync(
            string dosyaYolu,
            CancellationToken cancellationToken = default)
        {
            throw new NotSupportedException();
        }
    }
}