using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace OzmenZimparaMarket.Infrastructure.Veritabani;

public class OzmenZimparaMarketDbContextFactory : IDesignTimeDbContextFactory<OzmenZimparaMarketDbContext>
{
    public OzmenZimparaMarketDbContext CreateDbContext(string[] args)
    {
        var connectionString = BaglantiCumlesiniGetir();

        var optionsBuilder =
            new DbContextOptionsBuilder<OzmenZimparaMarketDbContext>();

        optionsBuilder.UseMySql(
            connectionString,
            ServerVersion.AutoDetect(connectionString),
            mySqlOptions =>
            {
                mySqlOptions.EnableRetryOnFailure(
                    5,
                    TimeSpan.FromSeconds(5),
                    null);
            });

        return new OzmenZimparaMarketDbContext(
            optionsBuilder.Options);
    }

    private static string BaglantiCumlesiniGetir()
    {
        var ortamDegiskeni = Environment.GetEnvironmentVariable(
            "ConnectionStrings__MySqlBaglantisi");

        if (!string.IsNullOrWhiteSpace(ortamDegiskeni))
            return ortamDegiskeni;

        var webApiDizini = WebApiDizininiBul();

        if (webApiDizini is null)
        {
            throw new InvalidOperationException(
                "Design-time işlemi için WebAPI proje dizini bulunamadı.");
        }

        var developmentDosyasi = Path.Combine(
            webApiDizini,
            "appsettings.Development.json");

        var connectionString =
            JsonDosyasindanBaglantiCumlesiniGetir(developmentDosyasi);

        if (!string.IsNullOrWhiteSpace(connectionString))
            return connectionString;

        var genelAyarDosyasi = Path.Combine(
            webApiDizini,
            "appsettings.json");

        connectionString =
            JsonDosyasindanBaglantiCumlesiniGetir(genelAyarDosyasi);

        if (!string.IsNullOrWhiteSpace(connectionString))
            return connectionString;

        throw new InvalidOperationException(
            "'MySqlBaglantisi' connection string bilgisi design-time işlemi için bulunamadı.");
    }

    private static string? WebApiDizininiBul()
    {
        var baslangicDizinleri = new[]
        {
            Directory.GetCurrentDirectory(),
            AppContext.BaseDirectory
        }
        .Distinct(StringComparer.OrdinalIgnoreCase);

        foreach (var baslangicDizini in baslangicDizinleri)
        {
            var mevcutDizin = new DirectoryInfo(
                Path.GetFullPath(baslangicDizini));

            while (mevcutDizin is not null)
            {
                if (mevcutDizin.Name.Equals(
                        "OzmenZimparaMarket.WebAPI",
                        StringComparison.OrdinalIgnoreCase) &&
                    File.Exists(Path.Combine(
                        mevcutDizin.FullName,
                        "appsettings.json")))
                {
                    return mevcutDizin.FullName;
                }

                var dogrudanWebApiDizini = Path.Combine(
                    mevcutDizin.FullName,
                    "OzmenZimparaMarket.WebAPI");

                if (File.Exists(Path.Combine(
                        dogrudanWebApiDizini,
                        "appsettings.json")))
                {
                    return dogrudanWebApiDizini;
                }

                var icIceWebApiDizini = Path.Combine(
                    mevcutDizin.FullName,
                    "OzmenZimparaMarket",
                    "OzmenZimparaMarket.WebAPI");

                if (File.Exists(Path.Combine(
                        icIceWebApiDizini,
                        "appsettings.json")))
                {
                    return icIceWebApiDizini;
                }

                mevcutDizin = mevcutDizin.Parent;
            }
        }

        return null;
    }

    private static string? JsonDosyasindanBaglantiCumlesiniGetir(
        string dosyaYolu)
    {
        if (!File.Exists(dosyaYolu))
            return null;

        using var dosyaAkisi = File.OpenRead(dosyaYolu);
        using var jsonBelgesi = JsonDocument.Parse(dosyaAkisi);

        if (!jsonBelgesi.RootElement.TryGetProperty(
                "ConnectionStrings",
                out var connectionStrings))
        {
            return null;
        }

        if (!connectionStrings.TryGetProperty(
                "MySqlBaglantisi",
                out var connectionStringElement))
        {
            return null;
        }

        var connectionString =
            connectionStringElement.GetString();

        return string.IsNullOrWhiteSpace(connectionString)
            ? null
            : connectionString;
    }
}