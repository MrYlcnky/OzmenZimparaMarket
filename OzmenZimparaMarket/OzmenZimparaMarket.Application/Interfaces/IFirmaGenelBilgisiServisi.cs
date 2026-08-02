using OzmenZimparaMarket.Application.DTOs.FirmaGenelBilgisiDtos;

namespace OzmenZimparaMarket.Application.Interfaces;

public interface IFirmaGenelBilgisiServisi
{
    Task<FirmaGenelBilgisiListeDto> GetirAsync( CancellationToken cancellationToken = default );

    Task<FirmaGenelBilgisiListeDto> GuncelleAsync( FirmaGenelBilgisiGuncelleDto dto, CancellationToken cancellationToken = default );
}