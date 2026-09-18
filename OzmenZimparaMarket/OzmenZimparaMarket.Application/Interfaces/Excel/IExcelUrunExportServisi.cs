using OzmenZimparaMarket.Application.DTOs.ExcelDtos;

namespace OzmenZimparaMarket.Application.Interfaces.Excel;

public interface IExcelUrunExportServisi
{
    Task<ExcelDosyaDto> DisariAktarAsync( CancellationToken cancellationToken = default);
}