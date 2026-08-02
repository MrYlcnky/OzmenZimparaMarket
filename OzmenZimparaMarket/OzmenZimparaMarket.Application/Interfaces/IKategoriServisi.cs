using OzmenZimparaMarket.Application.DTOs.KategoriDtos;

namespace OzmenZimparaMarket.Application.Interfaces;

public interface IKategoriServisi
{
    Task<IReadOnlyList<KategoriListeDto>> TumunuGetirAsync(bool sadeceAktifler = false, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<KategoriListeDto>> AgaciGetirAsync(bool sadeceAktifler = true, CancellationToken cancellationToken = default);

    Task<KategoriListeDto?> IdIleGetirAsync(int id, CancellationToken cancellationToken = default);

    Task<KategoriListeDto?> SeoUrlIleGetirAsync(string seoUrl, CancellationToken cancellationToken = default);

    Task<KategoriListeDto> EkleAsync(KategoriEkleDto dto, CancellationToken cancellationToken = default);

    Task<KategoriListeDto> GuncelleAsync(int id, KategoriGuncelleDto dto, CancellationToken cancellationToken = default);

    Task SilAsync(int id, CancellationToken cancellationToken = default);

    Task<KategoriListeDto> DurumDegistirAsync(int id, bool aktifMi, CancellationToken cancellationToken = default);
}