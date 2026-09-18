using Microsoft.EntityFrameworkCore;
using OzmenZimparaMarket.Application.DTOs.FirmaGenelBilgisiDtos;
using OzmenZimparaMarket.Application.Interfaces;
using OzmenZimparaMarket.Application.Istisnalar;
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
        var firma = await _dbContext.FirmaGenelBilgileri
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == FirmaKaydiId, cancellationToken);

        if (firma is null)
            throw new KaynakBulunamadiException("Firma genel bilgileri bulunamadı.");

        return DtoyaDonustur(firma);
    }

    public async Task<FirmaGenelBilgisiListeDto> GuncelleAsync(FirmaGenelBilgisiGuncelleDto dto, CancellationToken cancellationToken = default)
    {
        var firma = await _dbContext.FirmaGenelBilgileri
            .FirstOrDefaultAsync(x => x.Id == FirmaKaydiId, cancellationToken);

        if (firma is null)
            throw new KaynakBulunamadiException("Firma genel bilgileri bulunamadı.");

        firma.SirketAdi = dto.SirketAdi.Trim();
        firma.Hakkimizda = ZorunluHtmlTemizle(dto.Hakkimizda, "Hakkımızda");
        firma.Vizyonumuz = ZorunluHtmlTemizle(dto.Vizyonumuz, "Vizyon");
        firma.Misyonumuz = ZorunluHtmlTemizle(dto.Misyonumuz, "Misyon");
        firma.Stratejimiz = ZorunluHtmlTemizle(dto.Stratejimiz, "Strateji");
        firma.KalitePolitikamiz = ZorunluHtmlTemizle(dto.KalitePolitikamiz, "Kalite politikası");
        firma.Kvkk = ZorunluHtmlTemizle(dto.Kvkk, "KVKK");
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

    private string ZorunluHtmlTemizle(string html, string alanAdi)
    {
        var temizHtml = _htmlTemizlemeServisi.Temizle(html);

        if (string.IsNullOrWhiteSpace(temizHtml))
            throw new IsKuraliException($"{alanAdi} alanı geçerli bir içerik içermelidir.");

        return temizHtml;
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