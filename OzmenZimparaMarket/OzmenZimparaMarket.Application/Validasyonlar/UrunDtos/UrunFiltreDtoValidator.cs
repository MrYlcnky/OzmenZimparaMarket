using FluentValidation;
using OzmenZimparaMarket.Application.DTOs.UrunDtos;

namespace OzmenZimparaMarket.Application.Validasyonlar.UrunDtos;

public class UrunFiltreDtoValidator : AbstractValidator<UrunFiltreDto>
{
    public UrunFiltreDtoValidator()
    {
        RuleFor(x => x.KategoriId).GreaterThan(0).When(x => x.KategoriId.HasValue).WithMessage("Kategori ID değeri sıfırdan büyük olmalıdır.");

        RuleFor(x => x.AramaMetni).MaximumLength(200).WithMessage("Arama metni en fazla 200 karakter olabilir.");

        RuleFor(x => x.SatisBirimi).IsInEnum().When(x => x.SatisBirimi.HasValue).WithMessage("Geçerli bir satış birimi seçilmelidir.");

        RuleFor(x => x.Siralama).IsInEnum().WithMessage("Geçerli bir sıralama türü seçilmelidir.");

        RuleFor(x => x.SayfaNo).GreaterThanOrEqualTo(1).WithMessage("Sayfa numarası en az 1 olmalıdır.");

        RuleFor(x => x.SayfaBoyutu).InclusiveBetween(1, 100).WithMessage("Sayfa boyutu 1 ile 100 arasında olmalıdır.");

        RuleFor(x => x.TeknikDetayFiltreleri).NotNull().WithMessage("Teknik detay filtreleri null olamaz.");

        RuleForEach(x => x.TeknikDetayFiltreleri).SetValidator(new UrunTeknikDetayFiltreDtoValidator());
    }
}