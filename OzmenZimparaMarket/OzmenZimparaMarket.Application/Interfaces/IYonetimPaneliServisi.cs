using OzmenZimparaMarket.Application.DTOs.YonetimPaneliDtos;

namespace OzmenZimparaMarket.Application.Interfaces;

public interface IYonetimPaneliServisi
{
    Task<YonetimPaneliOzetDto> OzetGetirAsync(CancellationToken cancellationToken = default);
}