using FluentValidation;
using OzmenZimparaMarket.Application.DTOs.PanelKullanicisiDtos;

namespace OzmenZimparaMarket.Application.Validasyonlar.PanelKullanicisiDtos;

public class PanelKullanicisiGuncelleDtoValidator : AbstractValidator<PanelKullanicisiGuncelleDto>
{
    public PanelKullanicisiGuncelleDtoValidator()
    {
        RuleFor(x => x.KullaniciAdi).NotEmpty().WithMessage("Kullanıcı adı zorunludur.").MinimumLength(3).WithMessage("Kullanıcı adı en az 3 karakter olmalıdır.").MaximumLength(100).WithMessage("Kullanıcı adı en fazla 100 karakter olabilir.").Matches(@"^[a-zA-Z0-9._-]+$").WithMessage("Kullanıcı adı yalnızca harf, rakam, nokta, alt çizgi ve kısa çizgi içerebilir.");

        RuleFor(x => x.AdSoyad).NotEmpty().WithMessage("Ad soyad zorunludur.").MinimumLength(2).WithMessage("Ad soyad en az 2 karakter olmalıdır.").MaximumLength(200).WithMessage("Ad soyad en fazla 200 karakter olabilir.");
    }
}