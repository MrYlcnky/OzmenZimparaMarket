using FluentValidation;
using OzmenZimparaMarket.Application.DTOs.UrunDtos;

namespace OzmenZimparaMarket.Application.Validasyonlar.UrunDtos;

public class UrunTeknikDetayKaydetDtoValidator : AbstractValidator<UrunTeknikDetayKaydetDto>
{
    public UrunTeknikDetayKaydetDtoValidator()
    {
        RuleFor(x => x.UrunDetayiId)
            .GreaterThan(0)
            .When(x => x.UrunDetayiId.HasValue)
            .WithMessage("Ürün detayı ID değeri sıfırdan büyük olmalıdır.");

        RuleFor(x => x.UrunDetayTanimiId)
            .GreaterThan(0)
            .WithMessage("Ürün detay tanımı seçimi zorunludur.");

        RuleFor(x => x.DetayDegeri)
            .NotEmpty()
            .WithMessage("Detay değeri zorunludur.")
            .MaximumLength(500)
            .WithMessage("Detay değeri en fazla 500 karakter olabilir.");

        RuleFor(x => x.SiraNo)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Sıra numarası negatif olamaz.");
    }
}