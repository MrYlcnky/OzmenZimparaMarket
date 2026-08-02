using OzmenZimparaMarket.Application.DTOs.UrunDetayiDtos;

namespace OzmenZimparaMarket.Application.Interfaces;

public interface IUrunDetayiServisi
{
    Task<IReadOnlyList<UrunDetayiListeDto>> TumunuGetirAsync(bool sadeceAktifler = false, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<UrunDetayiListeDto>> UruneGoreGetirAsync(int urunId, bool sadeceAktifler = false, CancellationToken cancellationToken = default);

    Task<UrunDetayiListeDto?> IdIleGetirAsync(int id, CancellationToken cancellationToken = default);

    Task<UrunDetayiListeDto> EkleAsync(UrunDetayiEkleDto dto, CancellationToken cancellationToken = default);

    Task<UrunDetayiListeDto> GuncelleAsync(int id, UrunDetayiGuncelleDto dto, CancellationToken cancellationToken = default);

    Task SilAsync(int id, CancellationToken cancellationToken = default);

    Task<UrunDetayiListeDto> DurumDegistirAsync(int id, bool aktifMi, CancellationToken cancellationToken = default);
}