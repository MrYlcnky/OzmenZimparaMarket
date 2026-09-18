using OzmenZimparaMarket.Application.DTOs.ExcelDtos;

namespace OzmenZimparaMarket.Application.Interfaces.Excel;

public interface IExcelSablonServisi
{
    Task<ExcelDosyaDto> KategoriSablonuOlusturAsync( CancellationToken cancellationToken = default);

    Task<ExcelDosyaDto> UrunSablonuOlusturAsync( CancellationToken cancellationToken = default);
}