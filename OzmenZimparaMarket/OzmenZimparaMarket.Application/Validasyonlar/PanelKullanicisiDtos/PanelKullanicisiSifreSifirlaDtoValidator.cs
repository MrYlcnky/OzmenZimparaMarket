using FluentValidation;
using OzmenZimparaMarket.Application.DTOs.PanelKullanicisiDtos;

namespace OzmenZimparaMarket.Application.Validasyonlar.PanelKullanicisiDtos;

public class PanelKullanicisiSifreSifirlaDtoValidator : AbstractValidator<PanelKullanicisiSifreSifirlaDto>
{
    public PanelKullanicisiSifreSifirlaDtoValidator()
    {
        RuleFor(x => x.YeniSifre).NotEmpty().WithMessage("Yeni şifre zorunludur.").MinimumLength(8).WithMessage("Yeni şifre en az 8 karakter olmalıdır.").MaximumLength(100).WithMessage("Yeni şifre en fazla 100 karakter olabilir.");

        RuleFor(x => x.YeniSifreTekrar).NotEmpty().WithMessage("Yeni şifre tekrarı zorunludur.").Equal(x => x.YeniSifre).WithMessage("Yeni şifreler birbiriyle eşleşmiyor.");
    }
}