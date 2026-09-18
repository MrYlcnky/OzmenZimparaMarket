using OzmenZimparaMarket.Application.DTOs.DosyaDtos;

namespace OzmenZimparaMarket.Application.Interfaces;

public interface IDosyaServisi
{
    Task<DosyaYuklemeSonucDto> UrunGorseliYukleAsync(DosyaYukleDto dto, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<DosyaYuklemeSonucDto>> UrunGorselleriniGetirAsync(CancellationToken cancellationToken = default);

    Task<DosyaYuklemeSonucDto> KategoriGorseliYukleAsync(DosyaYukleDto dto, CancellationToken cancellationToken = default);
    Task<DosyaYuklemeSonucDto> UrunGorselineKopyalaAsync( string dosyaYolu, CancellationToken cancellationToken = default);

    Task SilAsync(string dosyaYolu, CancellationToken cancellationToken = default);
}