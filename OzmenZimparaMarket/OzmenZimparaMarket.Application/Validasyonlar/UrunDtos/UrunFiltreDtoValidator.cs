using FluentValidation;
using OzmenZimparaMarket.Application.DTOs.UrunDtos;
using OzmenZimparaMarket.Application.Validasyonlar.Ortak;

namespace OzmenZimparaMarket.Application.Validasyonlar.UrunDtos;

public class UrunFiltreDtoValidator : AbstractValidator<UrunFiltreDto>
{
    public UrunFiltreDtoValidator()
    {
        Include(new SayfalamaDtoValidator<UrunFiltreDto>());

        RuleFor(x => x.KategoriId)
            .GreaterThan(0)
            .When(x => x.KategoriId.HasValue)
            .WithMessage("Kategori ID değeri sıfırdan büyük olmalıdır.");

        RuleFor(x => x.AramaMetni)
            .MaximumLength(200)
            .WithMessage("Arama metni en fazla 200 karakter olabilir.");

        RuleFor(x => x.SatisBirimi)
            .IsInEnum()
            .When(x => x.SatisBirimi.HasValue)
            .WithMessage("Geçerli bir satış birimi seçilmelidir.");

        RuleFor(x => x.Siralama)
            .IsInEnum()
            .WithMessage("Geçerli bir sıralama türü seçilmelidir.");

        RuleFor(x => x.TeknikDetayFiltreleri)
            .NotNull()
            .WithMessage("Teknik detay filtreleri null olamaz.")
            .Must(x => x is null || x.Count <= 20)
            .WithMessage("En fazla 20 teknik detay filtresi gönderilebilir.")
            .Must(TekrarlananDetayTanimiYokMu)
            .WithMessage("Aynı ürün detay tanımı birden fazla filtre grubu olarak gönderilemez.");

        RuleForEach(x => x.TeknikDetayFiltreleri)
            .SetValidator(new UrunTeknikDetayFiltreDtoValidator());
    }

    private static bool TekrarlananDetayTanimiYokMu(List<UrunTeknikDetayFiltreDto>? filtreler)
    {
        if (filtreler is null) return true;

        return filtreler
            .Select(x => x.UrunDetayTanimiId)
            .Distinct()
            .Count() == filtreler.Count;
    }
}