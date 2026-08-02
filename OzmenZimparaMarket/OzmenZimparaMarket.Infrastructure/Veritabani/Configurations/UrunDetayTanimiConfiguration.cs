using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OzmenZimparaMarket.Domain.Entityler;

namespace OzmenZimparaMarket.Infrastructure.Veritabani.Configurations;

public class UrunDetayTanimiConfiguration : IEntityTypeConfiguration<UrunDetayTanimi>
{
    public void Configure(EntityTypeBuilder<UrunDetayTanimi> builder)
    {
        builder.ToTable("UrunDetayTanimlari");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id).ValueGeneratedOnAdd();

        builder.Property(x => x.DetayAdi).IsRequired().HasMaxLength(150);

        builder.Property(x => x.CokluDegerMi).IsRequired();

        builder.Property(x => x.FiltredeGosterilsinMi).IsRequired();

        builder.Property(x => x.SepetteSecilebilirMi).IsRequired();

        builder.Property(x => x.SiraNo).IsRequired();

        builder.Property(x => x.AktifMi).IsRequired();

        builder.HasIndex(x => x.DetayAdi).IsUnique();

        builder.HasIndex(x => new { x.AktifMi, x.SiraNo });

        builder.HasIndex(x => new { x.FiltredeGosterilsinMi, x.AktifMi, x.SiraNo });

        builder.HasIndex(x => new { x.SepetteSecilebilirMi, x.AktifMi, x.SiraNo });
    }
}