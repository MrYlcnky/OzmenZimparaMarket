using FluentValidation;
using OzmenZimparaMarket.Application.DTOs.UrunDetayTanimiDtos;

namespace OzmenZimparaMarket.Application.Validasyonlar.UrunDetayTanimiDtos;

public class UrunDetayTanimiGuncelleDtoValidator : AbstractValidator<UrunDetayTanimiGuncelleDto>
{
    public UrunDetayTanimiGuncelleDtoValidator()
    {
        RuleFor(x => x.DetayAdi).NotEmpty().WithMessage("Detay adı zorunludur.").MaximumLength(150).WithMessage("Detay adı en fazla 150 karakter olabilir.");

        RuleFor(x => x.SiraNo).GreaterThanOrEqualTo(0).WithMessage("Sıra numarası negatif olamaz.");
    }
}