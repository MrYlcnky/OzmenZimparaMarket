using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OzmenZimparaMarket.Domain.Entityler;

namespace OzmenZimparaMarket.Infrastructure.Veritabani.Configurations;

public class KategoriConfiguration : IEntityTypeConfiguration<Kategori>
{
    public void Configure(EntityTypeBuilder<Kategori> builder)
    {
        builder.ToTable("Kategoriler");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id).ValueGeneratedOnAdd();

        builder.Property(x => x.UstKategoriId).IsRequired(false);

        builder.Property(x => x.KategoriAdi).IsRequired().HasMaxLength(200);

        builder.Property(x => x.Aciklama).IsRequired(false).HasColumnType("text");

        builder.Property(x => x.GorselYolu).IsRequired(false).HasMaxLength(500);

        builder.Property(x => x.SeoUrl).IsRequired().HasMaxLength(250);

        builder.Property(x => x.SeoBasligi).IsRequired(false).HasMaxLength(250);

        builder.Property(x => x.SeoAciklamasi).IsRequired(false).HasMaxLength(500);

        builder.Property(x => x.AnaSayfadaGosterilsinMi).IsRequired();

        builder.Property(x => x.SiraNo).IsRequired();

        builder.Property(x => x.AktifMi).IsRequired();

        builder.Property(x => x.OlusturmaTarihi).IsRequired().HasColumnType("datetime(6)").HasDefaultValueSql("CURRENT_TIMESTAMP(6)");

        builder.Property(x => x.GuncellemeTarihi).IsRequired(false).HasColumnType("datetime(6)");

        builder.HasIndex(x => x.SeoUrl).IsUnique();

        builder.HasIndex(x => x.UstKategoriId);

        builder.HasIndex(x => new { x.AktifMi, x.SiraNo });

        builder.HasIndex(x => new { x.AnaSayfadaGosterilsinMi, x.AktifMi });

        builder.HasOne(x => x.UstKategori)
            .WithMany(x => x.AltKategoriler)
            .HasForeignKey(x => x.UstKategoriId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}