using FluentValidation;
using OzmenZimparaMarket.Application.DTOs.FirmaGenelBilgisiDtos;

namespace OzmenZimparaMarket.Application.Validasyonlar.FirmaGenelBilgisiDtos;

public class FirmaGenelBilgisiGuncelleDtoValidator : AbstractValidator<FirmaGenelBilgisiGuncelleDto>
{
    public FirmaGenelBilgisiGuncelleDtoValidator()
    {
        RuleFor(x => x.SirketAdi).NotEmpty().WithMessage("Şirket adı zorunludur.").MaximumLength(200).WithMessage("Şirket adı en fazla 200 karakter olabilir.");

        RuleFor(x => x.Hakkimizda).NotEmpty().WithMessage("Hakkımızda metni zorunludur.");

        RuleFor(x => x.Vizyonumuz).NotEmpty().WithMessage("Vizyon metni zorunludur.");

        RuleFor(x => x.Misyonumuz).NotEmpty().WithMessage("Misyon metni zorunludur.");

        RuleFor(x => x.Stratejimiz).NotEmpty().WithMessage("Strateji metni zorunludur.");

        RuleFor(x => x.KalitePolitikamiz).NotEmpty().WithMessage("Kalite politikası zorunludur.");

        RuleFor(x => x.Kvkk).NotEmpty().WithMessage("KVKK metni zorunludur.");

        RuleFor(x => x.IletisimNo).NotEmpty().WithMessage("İletişim numarası zorunludur.").MaximumLength(30).WithMessage("İletişim numarası en fazla 30 karakter olabilir.");

        RuleFor(x => x.WhatsappNo).NotEmpty().WithMessage("WhatsApp numarası zorunludur.").Matches(@"^\d{10,15}$").WithMessage("WhatsApp numarası yalnızca rakamlardan oluşmalı ve ülke koduyla birlikte 10-15 haneli olmalıdır.");

        RuleFor(x => x.Eposta).NotEmpty().WithMessage("E-posta adresi zorunludur.").EmailAddress().WithMessage("Geçerli bir e-posta adresi girilmelidir.").MaximumLength(200).WithMessage("E-posta adresi en fazla 200 karakter olabilir.");

        RuleFor(x => x.AcikAdres).NotEmpty().WithMessage("Açık adres zorunludur.").MaximumLength(1000).WithMessage("Açık adres en fazla 1000 karakter olabilir.");

        RuleFor(x => x.Il).NotEmpty().WithMessage("İl bilgisi zorunludur.").MaximumLength(100).WithMessage("İl en fazla 100 karakter olabilir.");

        RuleFor(x => x.Ilce).NotEmpty().WithMessage("İlçe bilgisi zorunludur.").MaximumLength(100).WithMessage("İlçe en fazla 100 karakter olabilir.");

        RuleFor(x => x.GoogleHaritaBaglantisi).MaximumLength(2000).WithMessage("Google Haritalar bağlantısı en fazla 2000 karakter olabilir.");

        RuleFor(x => x.GoogleHaritaGommeBaglantisi).MaximumLength(4000).WithMessage("Google Haritalar gömme bağlantısı en fazla 4000 karakter olabilir.");
    }
}