using FluentValidation;
using OzmenZimparaMarket.Application.DTOs.AuthDtos;

namespace OzmenZimparaMarket.Application.Validasyonlar.AuthDtos;

public class GirisDtoValidator : AbstractValidator<GirisDto>
{
    public GirisDtoValidator()
    {
        RuleFor(x => x.KullaniciAdi).NotEmpty().WithMessage("Kullanıcı adı zorunludur.").MaximumLength(100).WithMessage("Kullanıcı adı en fazla 100 karakter olabilir.");

        RuleFor(x => x.Sifre).NotEmpty().WithMessage("Şifre zorunludur.").MaximumLength(100).WithMessage("Şifre en fazla 100 karakter olabilir.");
    }
}