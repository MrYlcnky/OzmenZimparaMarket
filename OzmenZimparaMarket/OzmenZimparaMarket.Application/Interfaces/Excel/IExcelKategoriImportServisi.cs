using OzmenZimparaMarket.Application.DTOs.ExcelDtos;

namespace OzmenZimparaMarket.Application.Interfaces.Excel;

public interface IExcelKategoriImportServisi
{
    Task<KategoriExcelAnalizSonucDto> AnalizEtAsync(
        Stream dosyaAkisi,
        string dosyaAdi,
        CancellationToken cancellationToken = default);

    Task<KategoriExcelAktarimSonucDto> AktarAsync(
       Stream dosyaAkisi,
       string dosyaAdi,
       CancellationToken cancellationToken = default);
}