using Microsoft.EntityFrameworkCore;
using OzmenZimparaMarket.Application.DTOs.UrunDetayiDtos;
using OzmenZimparaMarket.Application.Interfaces;
using OzmenZimparaMarket.Domain.Entityler;
using OzmenZimparaMarket.Infrastructure.Veritabani;

namespace OzmenZimparaMarket.Infrastructure.Servisler;

public class UrunDetayiServisi : IUrunDetayiServisi
{
    private readonly OzmenZimparaMarketDbContext _dbContext;

    public UrunDetayiServisi(OzmenZimparaMarketDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<UrunDetayiListeDto>> TumunuGetirAsync(bool sadeceAktifler = false, CancellationToken cancellationToken = default)
    {
        var sorgu = _dbContext.UrunDetaylari.AsNoTracking().AsQueryable();

        if (sadeceAktifler) sorgu = sorgu.Where(x => x.AktifMi);

        return await sorgu
            .OrderBy(x => x.Urun.UrunAdi)
            .ThenBy(x => x.UrunDetayTanimi.SiraNo)
            .ThenBy(x => x.SiraNo)
            .ThenBy(x => x.DetayDegeri)
            .Select(x => new UrunDetayiListeDto
            {
                Id = x.Id,
                UrunId = x.UrunId,
                UrunAdi = x.Urun.UrunAdi,
                UrunKodu = x.Urun.UrunKodu,
                UrunDetayTanimiId = x.UrunDetayTanimiId,
                DetayAdi = x.UrunDetayTanimi.DetayAdi,
                DetayDegeri = x.DetayDegeri,
                SiraNo = x.SiraNo,
                AktifMi = x.AktifMi
            })
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<UrunDetayiListeDto>> UruneGoreGetirAsync(int urunId, bool sadeceAktifler = false, CancellationToken cancellationToken = default)
    {
        var urunVarMi = await _dbContext.Urunler.AsNoTracking().AnyAsync(x => x.Id == urunId, cancellationToken);

        if (!urunVarMi) throw new KeyNotFoundException("Ürün bulunamadı.");

        var sorgu = _dbContext.UrunDetaylari.AsNoTracking().Where(x => x.UrunId == urunId);

        if (sadeceAktifler) sorgu = sorgu.Where(x => x.AktifMi && x.UrunDetayTanimi.AktifMi);

        return await sorgu
            .OrderBy(x => x.UrunDetayTanimi.SiraNo)
            .ThenBy(x => x.SiraNo)
            .ThenBy(x => x.DetayDegeri)
            .Select(x => new UrunDetayiListeDto
            {
                Id = x.Id,
                UrunId = x.UrunId,
                UrunAdi = x.Urun.UrunAdi,
                UrunKodu = x.Urun.UrunKodu,
                UrunDetayTanimiId = x.UrunDetayTanimiId,
                DetayAdi = x.UrunDetayTanimi.DetayAdi,
                DetayDegeri = x.DetayDegeri,
                SiraNo = x.SiraNo,
                AktifMi = x.AktifMi
            })
            .ToListAsync(cancellationToken);
    }

    public async Task<UrunDetayiListeDto?> IdIleGetirAsync(int id, CancellationToken cancellationToken = default)
    {
        return await DtoGetirAsync(id, cancellationToken);
    }

    public async Task<UrunDetayiListeDto> EkleAsync(UrunDetayiEkleDto dto, CancellationToken cancellationToken = default)
    {
        await UrunuDogrulaAsync(dto.UrunId, cancellationToken);

        var detayTanimi = await DetayTaniminiGetirAsync(dto.UrunDetayTanimiId, cancellationToken);
        var detayDegeri = dto.DetayDegeri.Trim();

        await DetayKurallariniDogrulaAsync(dto.UrunId, detayTanimi, detayDegeri, null, cancellationToken);

        var urunDetayi = new UrunDetayi
        {
            UrunId = dto.UrunId,
            UrunDetayTanimiId = dto.UrunDetayTanimiId,
            DetayDegeri = detayDegeri,
            SiraNo = dto.SiraNo,
            AktifMi = dto.AktifMi
        };

        await _dbContext.UrunDetaylari.AddAsync(urunDetayi, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return await DtoGetirAsync(urunDetayi.Id, cancellationToken) ?? throw new InvalidOperationException("Eklenen ürün detayı getirilemedi.");
    }

    public async Task<UrunDetayiListeDto> GuncelleAsync(int id, UrunDetayiGuncelleDto dto, CancellationToken cancellationToken = default)
    {
        var urunDetayi = await _dbContext.UrunDetaylari.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        if (urunDetayi is null) throw new KeyNotFoundException("Güncellenecek ürün detayı bulunamadı.");

        await UrunuDogrulaAsync(dto.UrunId, cancellationToken);

        var detayTanimi = await DetayTaniminiGetirAsync(dto.UrunDetayTanimiId, cancellationToken);
        var detayDegeri = dto.DetayDegeri.Trim();

        await DetayKurallariniDogrulaAsync(dto.UrunId, detayTanimi, detayDegeri, id, cancellationToken);

        urunDetayi.UrunId = dto.UrunId;
        urunDetayi.UrunDetayTanimiId = dto.UrunDetayTanimiId;
        urunDetayi.DetayDegeri = detayDegeri;
        urunDetayi.SiraNo = dto.SiraNo;
        urunDetayi.AktifMi = dto.AktifMi;

        await _dbContext.SaveChangesAsync(cancellationToken);

        return await DtoGetirAsync(urunDetayi.Id, cancellationToken) ?? throw new InvalidOperationException("Güncellenen ürün detayı getirilemedi.");
    }

    public async Task SilAsync(int id, CancellationToken cancellationToken = default)
    {
        var urunDetayi = await _dbContext.UrunDetaylari.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        if (urunDetayi is null) throw new KeyNotFoundException("Silinecek ürün detayı bulunamadı.");

        _dbContext.UrunDetaylari.Remove(urunDetayi);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task<UrunDetayiListeDto> DurumDegistirAsync(int id, bool aktifMi, CancellationToken cancellationToken = default)
    {
        var urunDetayi = await _dbContext.UrunDetaylari.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        if (urunDetayi is null) throw new KeyNotFoundException("Ürün detayı bulunamadı.");

        urunDetayi.AktifMi = aktifMi;

        await _dbContext.SaveChangesAsync(cancellationToken);

        return await DtoGetirAsync(urunDetayi.Id, cancellationToken) ?? throw new InvalidOperationException("Ürün detayı getirilemedi.");
    }

    private async Task UrunuDogrulaAsync(int urunId, CancellationToken cancellationToken)
    {
        var urunVarMi = await _dbContext.Urunler.AsNoTracking().AnyAsync(x => x.Id == urunId, cancellationToken);

        if (!urunVarMi) throw new KeyNotFoundException("Seçilen ürün bulunamadı.");
    }

    private async Task<UrunDetayTanimi> DetayTaniminiGetirAsync(int urunDetayTanimiId, CancellationToken cancellationToken)
    {
        var detayTanimi = await _dbContext.UrunDetayTanimlari.AsNoTracking().FirstOrDefaultAsync(x => x.Id == urunDetayTanimiId, cancellationToken);

        if (detayTanimi is null) throw new KeyNotFoundException("Seçilen ürün detay tanımı bulunamadı.");
        if (!detayTanimi.AktifMi) throw new InvalidOperationException("Pasif ürün detay tanımına değer eklenemez.");

        return detayTanimi;
    }

    private async Task DetayKurallariniDogrulaAsync(int urunId, UrunDetayTanimi detayTanimi, string detayDegeri, int? haricUrunDetayiId, CancellationToken cancellationToken)
    {
        var ayniDegerSorgusu = _dbContext.UrunDetaylari.AsNoTracking().Where(x => x.UrunId == urunId && x.UrunDetayTanimiId == detayTanimi.Id && x.DetayDegeri == detayDegeri);

        if (haricUrunDetayiId.HasValue) ayniDegerSorgusu = ayniDegerSorgusu.Where(x => x.Id != haricUrunDetayiId.Value);

        if (await ayniDegerSorgusu.AnyAsync(cancellationToken)) throw new InvalidOperationException("Bu teknik detay değeri ürüne daha önce eklenmiştir.");

        if (detayTanimi.CokluDegerMi) return;

        var mevcutDegerSorgusu = _dbContext.UrunDetaylari.AsNoTracking().Where(x => x.UrunId == urunId && x.UrunDetayTanimiId == detayTanimi.Id);

        if (haricUrunDetayiId.HasValue) mevcutDegerSorgusu = mevcutDegerSorgusu.Where(x => x.Id != haricUrunDetayiId.Value);

        if (await mevcutDegerSorgusu.AnyAsync(cancellationToken)) throw new InvalidOperationException($"'{detayTanimi.DetayAdi}' detay tanımı birden fazla değer kabul etmemektedir.");
    }

    private async Task<UrunDetayiListeDto?> DtoGetirAsync(int id, CancellationToken cancellationToken)
    {
        return await _dbContext.UrunDetaylari
            .AsNoTracking()
            .Where(x => x.Id == id)
            .Select(x => new UrunDetayiListeDto
            {
                Id = x.Id,
                UrunId = x.UrunId,
                UrunAdi = x.Urun.UrunAdi,
                UrunKodu = x.Urun.UrunKodu,
                UrunDetayTanimiId = x.UrunDetayTanimiId,
                DetayAdi = x.UrunDetayTanimi.DetayAdi,
                DetayDegeri = x.DetayDegeri,
                SiraNo = x.SiraNo,
                AktifMi = x.AktifMi
            })
            .FirstOrDefaultAsync(cancellationToken);
    }
}