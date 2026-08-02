using FluentValidation;
using OzmenZimparaMarket.Application.DTOs.UrunDetayiDtos;

namespace OzmenZimparaMarket.Application.Validasyonlar.UrunDetayiDtos;

public class UrunDetayiEkleDtoValidator : AbstractValidator<UrunDetayiEkleDto>
{
    public UrunDetayiEkleDtoValidator()
    {
        RuleFor(x => x.UrunId).GreaterThan(0).WithMessage("Ürün seçimi zorunludur.");

        RuleFor(x => x.UrunDetayTanimiId).GreaterThan(0).WithMessage("Ürün detay tanımı seçimi zorunludur.");

        RuleFor(x => x.DetayDegeri).NotEmpty().WithMessage("Detay değeri zorunludur.").MaximumLength(500).WithMessage("Detay değeri en fazla 500 karakter olabilir.");

        RuleFor(x => x.SiraNo).GreaterThanOrEqualTo(0).WithMessage("Sıra numarası negatif olamaz.");
    }
}