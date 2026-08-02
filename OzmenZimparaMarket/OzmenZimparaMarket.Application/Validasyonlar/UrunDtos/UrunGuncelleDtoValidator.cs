using FluentValidation;
using OzmenZimparaMarket.Application.DTOs.UrunDtos;

namespace OzmenZimparaMarket.Application.Validasyonlar.UrunDtos;

public class UrunGuncelleDtoValidator : AbstractValidator<UrunGuncelleDto>
{
    public UrunGuncelleDtoValidator()
    {
        RuleFor(x => x.KategoriId).GreaterThan(0).WithMessage("Kategori seçimi zorunludur.");

        RuleFor(x => x.UrunAdi).NotEmpty().WithMessage("Ürün adı zorunludur.").MaximumLength(200).WithMessage("Ürün adı en fazla 200 karakter olabilir.");

        RuleFor(x => x.UrunKodu).NotEmpty().WithMessage("Ürün kodu zorunludur.").MaximumLength(100).WithMessage("Ürün kodu en fazla 100 karakter olabilir.");

        RuleFor(x => x.KisaAciklama).MaximumLength(1000).WithMessage("Kısa açıklama en fazla 1000 karakter olabilir.");

        RuleFor(x => x.DetayliAciklama).MaximumLength(10000).WithMessage("Detaylı açıklama en fazla 10000 karakter olabilir.");

        RuleFor(x => x.GorselYolu).MaximumLength(500).WithMessage("Görsel yolu en fazla 500 karakter olabilir.");

        RuleFor(x => x.SatisBirimi).IsInEnum().WithMessage("Geçerli bir satış birimi seçilmelidir.");

        RuleFor(x => x.SeoUrl).MaximumLength(250).WithMessage("SEO URL en fazla 250 karakter olabilir.");

        RuleFor(x => x.SeoBasligi).MaximumLength(250).WithMessage("SEO başlığı en fazla 250 karakter olabilir.");

        RuleFor(x => x.SeoAciklamasi).MaximumLength(500).WithMessage("SEO açıklaması en fazla 500 karakter olabilir.");

        RuleFor(x => x.SiraNo).GreaterThanOrEqualTo(0).WithMessage("Sıra numarası negatif olamaz.");
    }
}