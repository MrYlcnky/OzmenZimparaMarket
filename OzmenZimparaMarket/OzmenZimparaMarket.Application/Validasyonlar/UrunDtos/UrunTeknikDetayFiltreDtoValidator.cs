using FluentValidation;
using OzmenZimparaMarket.Application.DTOs.UrunDtos;

namespace OzmenZimparaMarket.Application.Validasyonlar.UrunDtos;

public class UrunTeknikDetayFiltreDtoValidator : AbstractValidator<UrunTeknikDetayFiltreDto>
{
    public UrunTeknikDetayFiltreDtoValidator()
    {
        RuleFor(x => x.UrunDetayTanimiId)
            .GreaterThan(0)
            .WithMessage("Ürün detay tanımı ID değeri sıfırdan büyük olmalıdır.");

        RuleFor(x => x.Degerler)
            .NotNull()
            .WithMessage("Teknik detay değerleri gönderilmelidir.")
            .NotEmpty()
            .WithMessage("En az bir teknik detay değeri seçilmelidir.")
            .Must(x => x is null || x.Count <= 50)
            .WithMessage("Bir teknik detay filtresinde en fazla 50 değer seçilebilir.");

        RuleForEach(x => x.Degerler)
            .NotEmpty()
            .WithMessage("Teknik detay değeri boş olamaz.")
            .MaximumLength(200)
            .WithMessage("Teknik detay değeri en fazla 200 karakter olabilir.");
    }
}