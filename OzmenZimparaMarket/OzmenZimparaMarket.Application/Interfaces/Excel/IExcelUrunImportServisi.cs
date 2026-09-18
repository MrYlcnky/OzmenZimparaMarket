using OzmenZimparaMarket.Application.DTOs.ExcelDtos;

namespace OzmenZimparaMarket.Application.Interfaces.Excel;

public interface IExcelUrunImportServisi
{
    Task<UrunExcelAnalizSonucDto> AnalizEtAsync(Stream dosyaAkisi, string dosyaAdi, CancellationToken cancellationToken = default);

    Task<UrunExcelAktarimSonucDto> AktarAsync(Stream dosyaAkisi, string dosyaAdi, CancellationToken cancellationToken = default);
}