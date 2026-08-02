using FluentValidation;
using OzmenZimparaMarket.Application.DTOs.PanelKullanicisiDtos;

namespace OzmenZimparaMarket.Application.Validasyonlar.PanelKullanicisiDtos;

public class PanelKullanicisiSifreDegistirDtoValidator : AbstractValidator<PanelKullanicisiSifreDegistirDto>
{
    public PanelKullanicisiSifreDegistirDtoValidator()
    {
        RuleFor(x => x.MevcutSifre).NotEmpty().WithMessage("Mevcut şifre zorunludur.");

        RuleFor(x => x.YeniSifre).NotEmpty().WithMessage("Yeni şifre zorunludur.").MinimumLength(8).WithMessage("Yeni şifre en az 8 karakter olmalıdır.").MaximumLength(100).WithMessage("Yeni şifre en fazla 100 karakter olabilir.").NotEqual(x => x.MevcutSifre).WithMessage("Yeni şifre mevcut şifreyle aynı olamaz.");

        RuleFor(x => x.YeniSifreTekrar).NotEmpty().WithMessage("Yeni şifre tekrarı zorunludur.").Equal(x => x.YeniSifre).WithMessage("Yeni şifreler birbiriyle eşleşmiyor.");
    }
}