using OzmenZimparaMarket.Application.DTOs.PanelKullanicisiDtos;

namespace OzmenZimparaMarket.Application.Interfaces;

public interface IPanelKullanicisiServisi
{
    Task<IReadOnlyList<PanelKullanicisiListeDto>> TumunuGetirAsync(CancellationToken cancellationToken = default);

    Task<PanelKullanicisiListeDto?> IdIleGetirAsync(int id, CancellationToken cancellationToken = default);

    Task<PanelKullanicisiListeDto> EkleAsync(PanelKullanicisiEkleDto dto, CancellationToken cancellationToken = default);

    Task<PanelKullanicisiListeDto> GuncelleAsync(int id, PanelKullanicisiGuncelleDto dto, CancellationToken cancellationToken = default);

    Task SilAsync(int id, CancellationToken cancellationToken = default);

    Task<PanelKullanicisiListeDto> DurumDegistirAsync(int id, bool aktifMi, CancellationToken cancellationToken = default);

    Task SifreDegistirAsync(int kullaniciId, PanelKullanicisiSifreDegistirDto dto, CancellationToken cancellationToken = default);

    Task SifreSifirlaAsync(int id, PanelKullanicisiSifreSifirlaDto dto, CancellationToken cancellationToken = default);
}