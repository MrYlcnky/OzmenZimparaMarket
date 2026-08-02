using FluentValidation;
using OzmenZimparaMarket.Application.DTOs.KategoriDtos;

namespace OzmenZimparaMarket.Application.Validasyonlar.KategoriDtos;

public class KategoriEkleDtoValidator : AbstractValidator<KategoriEkleDto>
{
    public KategoriEkleDtoValidator()
    {
        RuleFor(x => x.UstKategoriId).GreaterThan(0).When(x => x.UstKategoriId.HasValue).WithMessage("Üst kategori ID değeri sıfırdan büyük olmalıdır.");

        RuleFor(x => x.KategoriAdi).NotEmpty().WithMessage("Kategori adı zorunludur.").MaximumLength(200).WithMessage("Kategori adı en fazla 200 karakter olabilir.");

        RuleFor(x => x.Aciklama).MaximumLength(2000).WithMessage("Kategori açıklaması en fazla 2000 karakter olabilir.");

        RuleFor(x => x.GorselYolu).MaximumLength(500).WithMessage("Görsel yolu en fazla 500 karakter olabilir.");

        RuleFor(x => x.SeoUrl).MaximumLength(250).WithMessage("SEO URL en fazla 250 karakter olabilir.");

        RuleFor(x => x.SeoBasligi).MaximumLength(250).WithMessage("SEO başlığı en fazla 250 karakter olabilir.");

        RuleFor(x => x.SeoAciklamasi).MaximumLength(500).WithMessage("SEO açıklaması en fazla 500 karakter olabilir.");

        RuleFor(x => x.SiraNo).GreaterThanOrEqualTo(0).WithMessage("Sıra numarası negatif olamaz.");
    }
}