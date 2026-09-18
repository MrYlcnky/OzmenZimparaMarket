using Microsoft.EntityFrameworkCore;
using OzmenZimparaMarket.Application.DTOs.YonetimPaneliDtos;
using OzmenZimparaMarket.Application.Interfaces;
using OzmenZimparaMarket.Infrastructure.Veritabani;

namespace OzmenZimparaMarket.Infrastructure.Servisler;

public class YonetimPaneliServisi : IYonetimPaneliServisi
{
    private readonly OzmenZimparaMarketDbContext _dbContext;

    public YonetimPaneliServisi(OzmenZimparaMarketDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<YonetimPaneliOzetDto> OzetGetirAsync(CancellationToken cancellationToken = default)
    {
        var kategoriOzeti = await _dbContext.Kategoriler
            .AsNoTracking()
            .GroupBy(x => 1)
            .Select(grup => new YonetimPaneliKategoriOzetDto
            {
                Toplam = grup.Count(),
                Aktif = grup.Count(x => x.AktifMi),
                Pasif = grup.Count(x => !x.AktifMi),
                AnaSayfadaGosterilen = grup.Count(x =>
                    x.AktifMi &&
                    x.AnaSayfadaGosterilsinMi)
            })
            .FirstOrDefaultAsync(cancellationToken)
            ?? new YonetimPaneliKategoriOzetDto();

        var urunOzeti = await _dbContext.Urunler
            .AsNoTracking()
            .GroupBy(x => 1)
            .Select(grup => new YonetimPaneliUrunOzetDto
            {
                Toplam = grup.Count(),
                Aktif = grup.Count(x => x.AktifMi),
                Pasif = grup.Count(x => !x.AktifMi),
                OneCikan = grup.Count(x =>
                    x.AktifMi &&
                    x.OneCikanMi),
                Gorselsiz = grup.Count(x =>
                    x.GorselYolu == null ||
                    x.GorselYolu == "")
            })
            .FirstOrDefaultAsync(cancellationToken)
            ?? new YonetimPaneliUrunOzetDto();

        urunOzeti.TeknikDetaysiz = await _dbContext.Urunler
            .AsNoTracking()
            .CountAsync(
                x => !x.UrunDetaylari.Any(),
                cancellationToken);

        var teknikOzellikOzeti = await _dbContext.UrunDetayTanimlari
            .AsNoTracking()
            .GroupBy(x => 1)
            .Select(grup => new YonetimPaneliTemelOzetDto
            {
                Toplam = grup.Count(),
                Aktif = grup.Count(x => x.AktifMi),
                Pasif = grup.Count(x => !x.AktifMi)
            })
            .FirstOrDefaultAsync(cancellationToken)
            ?? new YonetimPaneliTemelOzetDto();

        var kullaniciOzeti = await _dbContext.PanelKullanicilari
            .AsNoTracking()
            .GroupBy(x => 1)
            .Select(grup => new YonetimPaneliTemelOzetDto
            {
                Toplam = grup.Count(),
                Aktif = grup.Count(x => x.AktifMi),
                Pasif = grup.Count(x => !x.AktifMi)
            })
            .FirstOrDefaultAsync(cancellationToken)
            ?? new YonetimPaneliTemelOzetDto();

        var sonEklenenUrunler = await _dbContext.Urunler
            .AsNoTracking()
            .OrderByDescending(x => x.OlusturmaTarihi)
            .ThenByDescending(x => x.Id)
            .Take(6)
            .Select(x => new YonetimPaneliSonUrunDto
            {
                Id = x.Id,
                UrunAdi = x.UrunAdi,
                UrunKodu = x.UrunKodu,
                KategoriAdi = x.Kategori.KategoriAdi,
                GorselYolu = x.GorselYolu,
                AktifMi = x.AktifMi,
                OneCikanMi = x.OneCikanMi,
                OlusturmaTarihi = x.OlusturmaTarihi
            })
            .ToListAsync(cancellationToken);

        return new YonetimPaneliOzetDto
        {
            Kategoriler = kategoriOzeti,
            Urunler = urunOzeti,
            TeknikOzellikler = teknikOzellikOzeti,
            Kullanicilar = kullaniciOzeti,
            SonEklenenUrunler = sonEklenenUrunler
        };
    }
}