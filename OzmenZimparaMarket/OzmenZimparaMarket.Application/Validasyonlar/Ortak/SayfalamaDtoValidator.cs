using FluentValidation;
using OzmenZimparaMarket.Application.DTOs.OrtakDtos;

namespace OzmenZimparaMarket.Application.Validasyonlar.Ortak;

public class SayfalamaDtoValidator<T> : AbstractValidator<T> where T : SayfalamaDto
{
    public SayfalamaDtoValidator()
    {
        RuleFor(x => x.SayfaNo)
            .GreaterThanOrEqualTo(1)
            .WithMessage("Sayfa numarası en az 1 olmalıdır.");

        RuleFor(x => x.SayfaBoyutu)
            .InclusiveBetween(1, 100)
            .WithMessage("Sayfa boyutu 1 ile 100 arasında olmalıdır.");
    }
}