using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OzmenZimparaMarket.Domain.Entityler;

namespace OzmenZimparaMarket.Infrastructure.Veritabani.Configurations;

public class FirmaGenelBilgisiConfiguration : IEntityTypeConfiguration<FirmaGenelBilgisi>
{
    public void Configure(EntityTypeBuilder<FirmaGenelBilgisi> builder)
    {
        builder.ToTable("FirmaGenelBilgileri");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id).ValueGeneratedNever();

        builder.Property(x => x.SirketAdi).IsRequired().HasMaxLength(200);

        builder.Property(x => x.Hakkimizda).IsRequired().HasColumnType("longtext");

        builder.Property(x => x.Vizyonumuz).IsRequired().HasColumnType("longtext");

        builder.Property(x => x.Misyonumuz).IsRequired().HasColumnType("longtext");

        builder.Property(x => x.Stratejimiz).IsRequired().HasColumnType("longtext");

        builder.Property(x => x.KalitePolitikamiz).IsRequired().HasColumnType("longtext");

        builder.Property(x => x.Kvkk).IsRequired().HasColumnType("longtext");

        builder.Property(x => x.IletisimNo).IsRequired().HasMaxLength(30);

        builder.Property(x => x.WhatsappNo).IsRequired().HasMaxLength(20);

        builder.Property(x => x.Eposta).IsRequired().HasMaxLength(200);

        builder.Property(x => x.AcikAdres).IsRequired().HasColumnType("text");

        builder.Property(x => x.Il).IsRequired().HasMaxLength(100);

        builder.Property(x => x.Ilce).IsRequired().HasMaxLength(100);

        builder.Property(x => x.GoogleHaritaBaglantisi).IsRequired().HasMaxLength(2000);

        builder.Property(x => x.GoogleHaritaGommeBaglantisi).IsRequired().HasColumnType("text");

        builder.Property(x => x.GuncellemeTarihi).IsRequired().HasColumnType("datetime(6)").HasDefaultValueSql("CURRENT_TIMESTAMP(6)");
    }
}