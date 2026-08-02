using OzmenZimparaMarket.Application.DTOs.AuthDtos;

namespace OzmenZimparaMarket.Application.Interfaces;

public interface IAuthServisi
{
    Task<GirisSonucDto> GirisAsync(GirisDto dto, CancellationToken cancellationToken = default);

    Task<MevcutKullaniciDto?> MevcutKullaniciyiGetirAsync(int kullaniciId, CancellationToken cancellationToken = default);
}