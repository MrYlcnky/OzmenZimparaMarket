using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using OzmenZimparaMarket.Application.Interfaces;
using OzmenZimparaMarket.Application.Interfaces.Excel;
using OzmenZimparaMarket.Domain.Entityler;
using OzmenZimparaMarket.Infrastructure.Ayarlar;
using OzmenZimparaMarket.Infrastructure.Servisler;
using OzmenZimparaMarket.Infrastructure.Servisler.Excel;
using OzmenZimparaMarket.Infrastructure.Veritabani;

namespace OzmenZimparaMarket.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration,
        string dosyaKokDizini)
    {
        var connectionString =
            configuration.GetConnectionString("MySqlBaglantisi");

        if (string.IsNullOrWhiteSpace(connectionString))
            throw new InvalidOperationException(
                "'MySqlBaglantisi' connection string bilgisi tanımlanmamıştır.");

        if (string.IsNullOrWhiteSpace(dosyaKokDizini))
            throw new InvalidOperationException(
                "Dosya kök dizini tanımlanmamıştır.");

        services.AddDbContext<OzmenZimparaMarketDbContext>(options =>
        {
            options.UseMySql(
                connectionString,
                ServerVersion.AutoDetect(connectionString),
                mySqlOptions =>
                {
                    mySqlOptions.EnableRetryOnFailure(
                        5,
                        TimeSpan.FromSeconds(5),
                        null);
                });
        });

        services.Configure<JwtAyarlari>(
            configuration.GetSection(
                JwtAyarlari.BolumAdi));

        services.Configure<BaslangicAdminAyarlari>(
            configuration.GetSection(
                BaslangicAdminAyarlari.BolumAdi));

        services.Configure<DosyaAyarlari>(
            configuration.GetSection(
                DosyaAyarlari.BolumAdi));

        services.PostConfigure<DosyaAyarlari>(options =>
        {
            options.KokDizin =
                dosyaKokDizini;
        });

        services.Configure<PasswordHasherOptions>(options =>
        {
            options.CompatibilityMode =
                PasswordHasherCompatibilityMode.IdentityV3;

            options.IterationCount =
                220000;
        });

        services.AddScoped<
            IPasswordHasher<PanelKullanicisi>,
            PasswordHasher<PanelKullanicisi>>();

        services.AddSingleton<
            IHtmlTemizlemeServisi,
            HtmlTemizlemeServisi>();

        services.AddScoped<
            ISifreHashServisi,
            SifreHashServisi>();

        services.AddScoped<
            IJwtServisi,
            JwtServisi>();

        services.AddScoped<
            IFirmaGenelBilgisiServisi,
            FirmaGenelBilgisiServisi>();

        services.AddScoped<
            IKategoriServisi,
            KategoriServisi>();

        services.AddScoped<
            IUrunServisi,
            UrunServisi>();

        services.AddScoped<
            IUrunDetayTanimiServisi,
            UrunDetayTanimiServisi>();

        services.AddScoped<
            IUrunDetayiServisi,
            UrunDetayiServisi>();

        services.AddScoped<
            IPanelKullanicisiServisi,
            PanelKullanicisiServisi>();

        services.AddScoped<
            IAuthServisi,
            AuthServisi>();

        services.AddScoped<
            IDosyaServisi,
            DosyaServisi>();

        services.AddScoped<
            IExcelSablonServisi,
            ExcelSablonServisi>();

        services.AddScoped<
            IExcelUrunExportServisi,
            ExcelUrunExportServisi>();

        services.AddScoped<
            IExcelUrunImportServisi,
            ExcelUrunImportServisi>();

        services.AddScoped<
            IExcelKategoriImportServisi,
            ExcelKategoriImportServisi>();

        services.AddScoped<IYonetimPaneliServisi, YonetimPaneliServisi>();

        services.AddScoped<
            VeritabaniBaslaticisi>();

        return services;
    }
}