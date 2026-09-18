using OzmenZimparaMarket.Application.DTOs.OrtakDtos;
using OzmenZimparaMarket.Application.DTOs.UrunDtos;

namespace OzmenZimparaMarket.Application.Interfaces;

public interface IUrunServisi
{
    Task<IReadOnlyList<UrunListeDto>> TumunuGetirAsync(bool sadeceAktifler = false, CancellationToken cancellationToken = default);

    Task<SayfaliSonucDto<UrunListeDto>> FiltreleAsync(UrunFiltreDto filtre, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<UrunFiltreGrubuDto>> FiltreSecenekleriniGetirAsync(int? kategoriId = null, bool altKategorilerDahilMi = true, CancellationToken cancellationToken = default);

    Task<UrunDetayGoruntuleDto?> IdIleGetirAsync(int id, CancellationToken cancellationToken = default);

    Task<UrunDetayGoruntuleDto?> SeoUrlIleGetirAsync(string seoUrl, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<UrunListeDto>> OneCikanlariGetirAsync(int adet = 8, CancellationToken cancellationToken = default);

    Task<UrunListeDto> EkleAsync(UrunEkleDto dto, CancellationToken cancellationToken = default);

    Task<UrunListeDto> GuncelleAsync(int id, UrunGuncelleDto dto, CancellationToken cancellationToken = default);
    Task<UrunTopluSilSonucDto> TopluSilAsync( UrunTopluSilDto dto, CancellationToken cancellationToken = default);

    Task SilAsync(int id, CancellationToken cancellationToken = default);

    Task<UrunListeDto> DurumDegistirAsync(int id, bool aktifMi, CancellationToken cancellationToken = default);
}