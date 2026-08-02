using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OzmenZimparaMarket.Domain.Entityler;

namespace OzmenZimparaMarket.Infrastructure.Veritabani.Configurations;

public class PanelKullanicisiConfiguration : IEntityTypeConfiguration<PanelKullanicisi>
{
    public void Configure(EntityTypeBuilder<PanelKullanicisi> builder)
    {
        builder.ToTable("PanelKullanicilari");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id).ValueGeneratedOnAdd();

        builder.Property(x => x.KullaniciAdi).IsRequired().HasMaxLength(100);

        builder.Property(x => x.SifreHash).IsRequired().HasMaxLength(500);

        builder.Property(x => x.AdSoyad).IsRequired().HasMaxLength(200);

        builder.Property(x => x.AktifMi).IsRequired();

        builder.Property(x => x.OlusturmaTarihi).IsRequired().HasColumnType("datetime(6)").HasDefaultValueSql("CURRENT_TIMESTAMP(6)");

        builder.Property(x => x.GuncellemeTarihi).IsRequired(false).HasColumnType("datetime(6)");

        builder.HasIndex(x => x.KullaniciAdi).IsUnique();

        builder.HasIndex(x => x.AktifMi);
    }
}