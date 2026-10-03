using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OzmenZimparaMarket.Domain.Entityler;

namespace OzmenZimparaMarket.Infrastructure.Veritabani.Configurations;

public class UrunConfiguration : IEntityTypeConfiguration<Urun>
{
    public void Configure(EntityTypeBuilder<Urun> builder)
    {
        builder.ToTable("Urunler");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id).ValueGeneratedOnAdd();

        builder.Property(x => x.KategoriId).IsRequired();

        builder.Property(x => x.UrunAdi).IsRequired().HasMaxLength(200);

        builder.Property(x => x.UrunKodu).IsRequired(false).HasMaxLength(100);

        builder.Property(x => x.KisaAciklama).IsRequired(false).HasColumnType("text");

        builder.Property(x => x.DetayliAciklama).IsRequired(false).HasColumnType("longtext");

        builder.Property(x => x.GorselYolu).IsRequired(false).HasMaxLength(500);

        builder.Property(x => x.SatisBirimi).IsRequired().HasConversion<int>();

        builder.Property(x => x.SeoUrl).IsRequired().HasMaxLength(250);

        builder.Property(x => x.SeoBasligi).IsRequired(false).HasMaxLength(250);

        builder.Property(x => x.SeoAciklamasi).IsRequired(false).HasMaxLength(500);

        builder.Property(x => x.OneCikanMi).IsRequired();

        builder.Property(x => x.SiraNo).IsRequired();

        builder.Property(x => x.AktifMi).IsRequired();

        builder.Property(x => x.OlusturmaTarihi).IsRequired().HasColumnType("datetime(6)").HasDefaultValueSql("CURRENT_TIMESTAMP(6)");

        builder.Property(x => x.GuncellemeTarihi).IsRequired(false).HasColumnType("datetime(6)");

        builder.HasIndex(x => x.UrunKodu).IsUnique();

        builder.HasIndex(x => x.SeoUrl).IsUnique();

        builder.HasIndex(x => x.KategoriId);

        builder.HasIndex(x => new { x.KategoriId, x.AktifMi, x.SiraNo });

        builder.HasIndex(x => new { x.OneCikanMi, x.AktifMi, x.SiraNo });

        builder.HasOne(x => x.Kategori)
            .WithMany(x => x.Urunler)
            .HasForeignKey(x => x.KategoriId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}