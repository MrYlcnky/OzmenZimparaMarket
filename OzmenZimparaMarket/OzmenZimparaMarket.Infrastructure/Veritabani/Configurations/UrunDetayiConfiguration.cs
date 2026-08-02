using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OzmenZimparaMarket.Domain.Entityler;

namespace OzmenZimparaMarket.Infrastructure.Veritabani.Configurations;

public class UrunDetayiConfiguration : IEntityTypeConfiguration<UrunDetayi>
{
    public void Configure(EntityTypeBuilder<UrunDetayi> builder)
    {
        builder.ToTable("UrunDetaylari");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id).ValueGeneratedOnAdd();

        builder.Property(x => x.UrunId).IsRequired();

        builder.Property(x => x.UrunDetayTanimiId).IsRequired();

        builder.Property(x => x.DetayDegeri).IsRequired().HasMaxLength(500);

        builder.Property(x => x.SiraNo).IsRequired();

        builder.Property(x => x.AktifMi).IsRequired();

        builder.HasIndex(x => new { x.UrunId, x.UrunDetayTanimiId, x.DetayDegeri }).IsUnique();

        builder.HasIndex(x => x.UrunId);

        builder.HasIndex(x => x.UrunDetayTanimiId);

        builder.HasIndex(x => new { x.UrunId, x.AktifMi, x.SiraNo });

        builder.HasOne(x => x.Urun).WithMany(x => x.UrunDetaylari).HasForeignKey(x => x.UrunId).OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.UrunDetayTanimi).WithMany(x => x.UrunDetaylari).HasForeignKey(x => x.UrunDetayTanimiId).OnDelete(DeleteBehavior.Restrict);
    }
}