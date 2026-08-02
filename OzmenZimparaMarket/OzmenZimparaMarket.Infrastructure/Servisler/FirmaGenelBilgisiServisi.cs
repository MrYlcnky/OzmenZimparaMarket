using Microsoft.EntityFrameworkCore;
using OzmenZimparaMarket.Application.DTOs.FirmaGenelBilgisiDtos;
using OzmenZimparaMarket.Application.Interfaces;
using OzmenZimparaMarket.Domain.Entityler;
using OzmenZimparaMarket.Infrastructure.Veritabani;

namespace OzmenZimparaMarket.Infrastructure.Servisler;

public class FirmaGenelBilgisiServisi : IFirmaGenelBilgisiServisi
{
    private const int FirmaKaydiId = 1;
    private readonly OzmenZimparaMarketDbContext _dbContext;
    private readonly IHtmlTemizlemeServisi _htmlTemizlemeServisi;

    public FirmaGenelBilgisiServisi(OzmenZimparaMarketDbContext dbContext, IHtmlTemizlemeServisi htmlTemizlemeServisi)
    {
        _dbContext = dbContext;
        _htmlTemizlemeServisi = htmlTemizlemeServisi;
    }

    public async Task<FirmaGenelBilgisiListeDto> GetirAsync(CancellationToken cancellationToken = default)
    {
        var firma = await _dbContext.FirmaGenelBilgileri.AsNoTracking().FirstOrDefaultAsync(x => x.Id == FirmaKaydiId, cancellationToken);

        if (firma is null) throw new InvalidOperationException("Firma genel bilgileri bulunamadı.");

        return DtoyaDonustur(firma);
    }

    public async Task<FirmaGenelBilgisiListeDto> GuncelleAsync(FirmaGenelBilgisiGuncelleDto dto, CancellationToken cancellationToken = default)
    {
        var firma = await _dbContext.FirmaGenelBilgileri.FirstOrDefaultAsync(x => x.Id == FirmaKaydiId, cancellationToken);

        if (firma is null) throw new InvalidOperationException("Firma genel bilgileri bulunamadı.");

        firma.SirketAdi = dto.SirketAdi.Trim();
        firma.Hakkimizda = _htmlTemizlemeServisi.Temizle(dto.Hakkimizda);
        firma.Vizyonumuz = _htmlTemizlemeServisi.Temizle(dto.Vizyonumuz);
        firma.Misyonumuz = _htmlTemizlemeServisi.Temizle(dto.Misyonumuz);
        firma.Stratejimiz = _htmlTemizlemeServisi.Temizle(dto.Stratejimiz);
        firma.KalitePolitikamiz = _htmlTemizlemeServisi.Temizle(dto.KalitePolitikamiz);
        firma.Kvkk = _htmlTemizlemeServisi.Temizle(dto.Kvkk);
        firma.IletisimNo = dto.IletisimNo.Trim();
        firma.WhatsappNo = dto.WhatsappNo.Trim();
        firma.Eposta = dto.Eposta.Trim();
        firma.AcikAdres = dto.AcikAdres.Trim();
        firma.Il = dto.Il.Trim();
        firma.Ilce = dto.Ilce.Trim();
        firma.GoogleHaritaBaglantisi = dto.GoogleHaritaBaglantisi.Trim();
        firma.GoogleHaritaGommeBaglantisi = dto.GoogleHaritaGommeBaglantisi.Trim();
        firma.GuncellemeTarihi = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);

        return DtoyaDonustur(firma);
    }

    private static FirmaGenelBilgisiListeDto DtoyaDonustur(FirmaGenelBilgisi firma)
    {
        return new FirmaGenelBilgisiListeDto
        {
            Id = firma.Id,
            SirketAdi = firma.SirketAdi,
            Hakkimizda = firma.Hakkimizda,
            Vizyonumuz = firma.Vizyonumuz,
            Misyonumuz = firma.Misyonumuz,
            Stratejimiz = firma.Stratejimiz,
            KalitePolitikamiz = firma.KalitePolitikamiz,
            Kvkk = firma.Kvkk,
            IletisimNo = firma.IletisimNo,
            WhatsappNo = firma.WhatsappNo,
            Eposta = firma.Eposta,
            AcikAdres = firma.AcikAdres,
            Il = firma.Il,
            Ilce = firma.Ilce,
            GoogleHaritaBaglantisi = firma.GoogleHaritaBaglantisi,
            GoogleHaritaGommeBaglantisi = firma.GoogleHaritaGommeBaglantisi,
            GuncellemeTarihi = firma.GuncellemeTarihi
        };
    }
}