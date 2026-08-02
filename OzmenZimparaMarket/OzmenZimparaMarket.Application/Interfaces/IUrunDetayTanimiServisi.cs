using OzmenZimparaMarket.Application.DTOs.UrunDetayTanimiDtos;

namespace OzmenZimparaMarket.Application.Interfaces;

public interface IUrunDetayTanimiServisi
{
    Task<IReadOnlyList<UrunDetayTanimiListeDto>> TumunuGetirAsync(bool sadeceAktifler = false, CancellationToken cancellationToken = default);

    Task<UrunDetayTanimiListeDto?> IdIleGetirAsync(int id, CancellationToken cancellationToken = default);

    Task<UrunDetayTanimiListeDto> EkleAsync(UrunDetayTanimiEkleDto dto, CancellationToken cancellationToken = default);

    Task<UrunDetayTanimiListeDto> GuncelleAsync(int id, UrunDetayTanimiGuncelleDto dto, CancellationToken cancellationToken = default);

    Task SilAsync(int id, CancellationToken cancellationToken = default);

    Task<UrunDetayTanimiListeDto> DurumDegistirAsync(int id, bool aktifMi, CancellationToken cancellationToken = default);
}