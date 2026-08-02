using Microsoft.EntityFrameworkCore;
using OzmenZimparaMarket.Domain.Entityler;

namespace OzmenZimparaMarket.Infrastructure.Veritabani;

public class OzmenZimparaMarketDbContext : DbContext
{
    public OzmenZimparaMarketDbContext(DbContextOptions<OzmenZimparaMarketDbContext> options) : base(options)
    {
    }

    public DbSet<FirmaGenelBilgisi> FirmaGenelBilgileri => Set<FirmaGenelBilgisi>();

    public DbSet<Kategori> Kategoriler => Set<Kategori>();

    public DbSet<Urun> Urunler => Set<Urun>();

    public DbSet<UrunDetayTanimi> UrunDetayTanimlari => Set<UrunDetayTanimi>();

    public DbSet<UrunDetayi> UrunDetaylari => Set<UrunDetayi>();

    public DbSet<PanelKullanicisi> PanelKullanicilari => Set<PanelKullanicisi>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(OzmenZimparaMarketDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }
}