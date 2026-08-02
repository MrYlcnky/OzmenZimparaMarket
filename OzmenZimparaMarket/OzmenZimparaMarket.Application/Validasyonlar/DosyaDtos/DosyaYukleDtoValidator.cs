using FluentValidation;
using OzmenZimparaMarket.Application.DTOs.DosyaDtos;

namespace OzmenZimparaMarket.Application.Validasyonlar.DosyaDtos;

public class DosyaYukleDtoValidator : AbstractValidator<DosyaYukleDto>
{
    private static readonly string[] IzinVerilenUzantilar = [".jpg", ".jpeg", ".png", ".webp"];

    private static readonly string[] IzinVerilenIcerikTurleri = ["image/jpeg", "image/png", "image/webp"];

    private const long MaksimumDosyaBoyutu = 5 * 1024 * 1024;

    public DosyaYukleDtoValidator()
    {
        RuleFor(x => x.DosyaAkisi).NotNull().WithMessage("Dosya içeriği zorunludur.").Must(x => x != Stream.Null && x.CanRead).WithMessage("Dosya içeriği okunabilir olmalıdır.");

        RuleFor(x => x.DosyaAdi).NotEmpty().WithMessage("Dosya adı zorunludur.").MaximumLength(255).WithMessage("Dosya adı en fazla 255 karakter olabilir.").Must(GecerliUzantiMi).WithMessage("Yalnızca JPG, JPEG, PNG ve WEBP görseller yüklenebilir.");

        RuleFor(x => x.IcerikTuru).NotEmpty().WithMessage("Dosya içerik türü zorunludur.").Must(GecerliIcerikTuruMu).WithMessage("Dosya içerik türü desteklenmiyor.");

        RuleFor(x => x.DosyaBoyutu).GreaterThan(0).WithMessage("Dosya boş olamaz.").LessThanOrEqualTo(MaksimumDosyaBoyutu).WithMessage("Dosya boyutu en fazla 5 MB olabilir.");
    }

    private static bool GecerliUzantiMi(string dosyaAdi)
    {
        var uzanti = Path.GetExtension(dosyaAdi);
        return !string.IsNullOrWhiteSpace(uzanti) && IzinVerilenUzantilar.Contains(uzanti, StringComparer.OrdinalIgnoreCase);
    }

    private static bool GecerliIcerikTuruMu(string icerikTuru)
    {
        return IzinVerilenIcerikTurleri.Contains(icerikTuru, StringComparer.OrdinalIgnoreCase);
    }
}