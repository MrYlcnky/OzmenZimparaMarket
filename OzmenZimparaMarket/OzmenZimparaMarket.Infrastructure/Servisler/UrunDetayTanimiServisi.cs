using Microsoft.EntityFrameworkCore;
using OzmenZimparaMarket.Application.DTOs.UrunDetayTanimiDtos;
using OzmenZimparaMarket.Application.Interfaces;
using OzmenZimparaMarket.Application.Istisnalar;
using OzmenZimparaMarket.Domain.Entityler;
using OzmenZimparaMarket.Infrastructure.Veritabani;

namespace OzmenZimparaMarket.Infrastructure.Servisler;

public class UrunDetayTanimiServisi : IUrunDetayTanimiServisi
{
    private readonly OzmenZimparaMarketDbContext _dbContext;

    public UrunDetayTanimiServisi(OzmenZimparaMarketDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<UrunDetayTanimiListeDto>> TumunuGetirAsync(bool sadeceAktifler = false, CancellationToken cancellationToken = default)
    {
        var sorgu = _dbContext.UrunDetayTanimlari.AsNoTracking().AsQueryable();

        if (sadeceAktifler) sorgu = sorgu.Where(x => x.AktifMi);

        return await sorgu
            .OrderBy(x => x.SiraNo)
            .ThenBy(x => x.DetayAdi)
            .Select(x => new UrunDetayTanimiListeDto
            {
                Id = x.Id,
                DetayAdi = x.DetayAdi,
                CokluDegerMi = x.CokluDegerMi,
                FiltredeGosterilsinMi = x.FiltredeGosterilsinMi,
                SepetteSecilebilirMi = x.SepetteSecilebilirMi,
                SiraNo = x.SiraNo,
                AktifMi = x.AktifMi
            })
            .ToListAsync(cancellationToken);
    }

    public async Task<UrunDetayTanimiListeDto?> IdIleGetirAsync(int id, CancellationToken cancellationToken = default)
    {
        var detayTanimi = await _dbContext.UrunDetayTanimlari
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        return detayTanimi is null ? null : DtoyaDonustur(detayTanimi);
    }

    public async Task<UrunDetayTanimiListeDto> EkleAsync(UrunDetayTanimiEkleDto dto, CancellationToken cancellationToken = default)
    {
        var detayAdi = dto.DetayAdi.Trim();

        if (await DetayAdiKullaniliyorMuAsync(detayAdi, null, cancellationToken))
            throw new CakismaException("Bu detay adı daha önce kullanılmıştır.");

        var detayTanimi = new UrunDetayTanimi
        {
            DetayAdi = detayAdi,
            CokluDegerMi = dto.CokluDegerMi,
            FiltredeGosterilsinMi = dto.FiltredeGosterilsinMi,
            SepetteSecilebilirMi = dto.SepetteSecilebilirMi,
            SiraNo = dto.SiraNo,
            AktifMi = dto.AktifMi
        };

        await _dbContext.UrunDetayTanimlari.AddAsync(detayTanimi, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return DtoyaDonustur(detayTanimi);
    }

    public async Task<UrunDetayTanimiListeDto> GuncelleAsync(int id, UrunDetayTanimiGuncelleDto dto, CancellationToken cancellationToken = default)
    {
        var detayTanimi = await _dbContext.UrunDetayTanimlari
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        if (detayTanimi is null)
            throw new KaynakBulunamadiException("Güncellenecek ürün detay tanımı bulunamadı.");

        var detayAdi = dto.DetayAdi.Trim();

        if (await DetayAdiKullaniliyorMuAsync(detayAdi, id, cancellationToken))
            throw new CakismaException("Bu detay adı başka bir ürün detay tanımı tarafından kullanılıyor.");

        if (detayTanimi.CokluDegerMi && !dto.CokluDegerMi)
        {
            var birdenFazlaDegeriOlanUrunVarMi = await _dbContext.UrunDetaylari
                .AsNoTracking()
                .Where(x => x.UrunDetayTanimiId == id)
                .GroupBy(x => x.UrunId)
                .AnyAsync(x => x.Count() > 1, cancellationToken);

            if (birdenFazlaDegeriOlanUrunVarMi)
                throw new IsKuraliException("Bu detay tanımını kullanan bazı ürünlerde birden fazla değer bulunmaktadır. Çoklu değer özelliği kapatılamaz.");
        }

        detayTanimi.DetayAdi = detayAdi;
        detayTanimi.CokluDegerMi = dto.CokluDegerMi;
        detayTanimi.FiltredeGosterilsinMi = dto.FiltredeGosterilsinMi;
        detayTanimi.SepetteSecilebilirMi = dto.SepetteSecilebilirMi;
        detayTanimi.SiraNo = dto.SiraNo;
        detayTanimi.AktifMi = dto.AktifMi;

        await _dbContext.SaveChangesAsync(cancellationToken);

        return DtoyaDonustur(detayTanimi);
    }

    public async Task SilAsync(int id, CancellationToken cancellationToken = default)
    {
        var detayTanimi = await _dbContext.UrunDetayTanimlari
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        if (detayTanimi is null)
            throw new KaynakBulunamadiException("Silinecek ürün detay tanımı bulunamadı.");

        var kullaniliyorMu = await _dbContext.UrunDetaylari
            .AsNoTracking()
            .AnyAsync(x => x.UrunDetayTanimiId == id, cancellationToken);

        if (kullaniliyorMu)
            throw new IsKuraliException("Ürünlerde kullanılan detay tanımı silinemez. Bunun yerine detay tanımını pasife alabilirsiniz.");

        _dbContext.UrunDetayTanimlari.Remove(detayTanimi);

        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task<UrunDetayTanimiListeDto> DurumDegistirAsync(int id, bool aktifMi, CancellationToken cancellationToken = default)
    {
        var detayTanimi = await _dbContext.UrunDetayTanimlari
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        if (detayTanimi is null)
            throw new KaynakBulunamadiException("Ürün detay tanımı bulunamadı.");

        detayTanimi.AktifMi = aktifMi;

        await _dbContext.SaveChangesAsync(cancellationToken);

        return DtoyaDonustur(detayTanimi);
    }

    private async Task<bool> DetayAdiKullaniliyorMuAsync(string detayAdi, int? haricDetayTanimiId, CancellationToken cancellationToken)
    {
        var sorgu = _dbContext.UrunDetayTanimlari
            .AsNoTracking()
            .Where(x => x.DetayAdi == detayAdi);

        if (haricDetayTanimiId.HasValue)
            sorgu = sorgu.Where(x => x.Id != haricDetayTanimiId.Value);

        return await sorgu.AnyAsync(cancellationToken);
    }

    private static UrunDetayTanimiListeDto DtoyaDonustur(UrunDetayTanimi detayTanimi)
    {
        return new UrunDetayTanimiListeDto
        {
            Id = detayTanimi.Id,
            DetayAdi = detayTanimi.DetayAdi,
            CokluDegerMi = detayTanimi.CokluDegerMi,
            FiltredeGosterilsinMi = detayTanimi.FiltredeGosterilsinMi,
            SepetteSecilebilirMi = detayTanimi.SepetteSecilebilirMi,
            SiraNo = detayTanimi.SiraNo,
            AktifMi = detayTanimi.AktifMi
        };
    }
}