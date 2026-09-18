using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using OzmenZimparaMarket.Application.Interfaces;
using OzmenZimparaMarket.Domain.Entityler;
using OzmenZimparaMarket.Infrastructure.Ayarlar;

namespace OzmenZimparaMarket.Infrastructure.Veritabani;

public class VeritabaniBaslaticisi
{
    private const int FirmaKaydiId = 1;

    private readonly OzmenZimparaMarketDbContext _dbContext;
    private readonly ISifreHashServisi _sifreHashServisi;
    private readonly BaslangicAdminAyarlari _baslangicAdminAyarlari;

    public VeritabaniBaslaticisi(
        OzmenZimparaMarketDbContext dbContext,
        ISifreHashServisi sifreHashServisi,
        IOptions<BaslangicAdminAyarlari> baslangicAdminAyarlari)
    {
        _dbContext = dbContext;
        _sifreHashServisi = sifreHashServisi;
        _baslangicAdminAyarlari = baslangicAdminAyarlari.Value;
    }

    public async Task BaslangicVerileriniOlusturAsync(CancellationToken cancellationToken = default)
    {
        var executionStrategy = _dbContext.Database.CreateExecutionStrategy();

        await executionStrategy.ExecuteAsync(async () =>
        {
            _dbContext.ChangeTracker.Clear();

            var veritabaninaBaglanilabiliyorMu =
                await _dbContext.Database.CanConnectAsync(cancellationToken);

            if (!veritabaninaBaglanilabiliyorMu)
                throw new InvalidOperationException("Veritabanına bağlantı kurulamadı.");

            await using var transaction =
                await _dbContext.Database.BeginTransactionAsync(cancellationToken);

            try
            {
                await FirmaKaydiniOlusturAsync(cancellationToken);
                await BaslangicAdmininiOlusturAsync(cancellationToken);
                await UrunDetayTanimlariniOlusturAsync(cancellationToken);

                await _dbContext.SaveChangesAsync(cancellationToken);
                await transaction.CommitAsync(cancellationToken);
            }
            catch
            {
                await transaction.RollbackAsync(cancellationToken);
                throw;
            }
        });
    }

    private async Task FirmaKaydiniOlusturAsync(CancellationToken cancellationToken)
    {
        var firmaKayitIdleri = await _dbContext.FirmaGenelBilgileri
            .AsNoTracking()
            .Select(x => x.Id)
            .ToListAsync(cancellationToken);

        if (firmaKayitIdleri.Count == 1 &&
            firmaKayitIdleri[0] == FirmaKaydiId)
        {
            return;
        }

        if (firmaKayitIdleri.Count > 1)
        {
            throw new InvalidOperationException(
                "Firma genel bilgileri tablosunda birden fazla kayıt bulunuyor.");
        }

        if (firmaKayitIdleri.Count == 1)
        {
            throw new InvalidOperationException(
                $"Firma genel bilgileri kaydının Id değeri {FirmaKaydiId} olmalıdır.");
        }

        var firma = new FirmaGenelBilgisi
        {
            Id = FirmaKaydiId,
            SirketAdi = "Özmen Zımpara Market",
            Hakkimizda = string.Empty,
            Vizyonumuz = string.Empty,
            Misyonumuz = string.Empty,
            Stratejimiz = string.Empty,
            KalitePolitikamiz = string.Empty,
            Kvkk = string.Empty,
            IletisimNo = string.Empty,
            WhatsappNo = string.Empty,
            Eposta = string.Empty,
            AcikAdres = string.Empty,
            Il = string.Empty,
            Ilce = string.Empty,
            GoogleHaritaBaglantisi = string.Empty,
            GoogleHaritaGommeBaglantisi = string.Empty,
            GuncellemeTarihi = DateTime.UtcNow
        };

        await _dbContext.FirmaGenelBilgileri.AddAsync(
            firma,
            cancellationToken);
    }

    private async Task BaslangicAdmininiOlusturAsync(CancellationToken cancellationToken)
    {
        var herhangiBirKullaniciVarMi = await _dbContext.PanelKullanicilari
            .AsNoTracking()
            .AnyAsync(cancellationToken);

        if (herhangiBirKullaniciVarMi)
            return;

        BaslangicAdminAyarlariniDogrula();

        var kullaniciAdi =
            _baslangicAdminAyarlari.KullaniciAdi.Trim();

        var adSoyad =
            _baslangicAdminAyarlari.AdSoyad.Trim();

        var admin = new PanelKullanicisi
        {
            KullaniciAdi = kullaniciAdi,
            AdSoyad = adSoyad,
            SifreHash = _sifreHashServisi.Hashle(
                _baslangicAdminAyarlari.Sifre),
            AktifMi = _baslangicAdminAyarlari.AktifMi,
            OlusturmaTarihi = DateTime.UtcNow
        };

        await _dbContext.PanelKullanicilari.AddAsync(
            admin,
            cancellationToken);
    }

    private async Task UrunDetayTanimlariniOlusturAsync(CancellationToken cancellationToken)
    {
        var mevcutDetayAdlari = await _dbContext.UrunDetayTanimlari
            .AsNoTracking()
            .Select(x => x.DetayAdi)
            .ToListAsync(cancellationToken);

        var mevcutDetayAdiSeti =
            mevcutDetayAdlari.ToHashSet(
                StringComparer.OrdinalIgnoreCase);

        var detayTanimlari = new[]
        {
            new UrunDetayTanimi
            {
                DetayAdi = "Kullanım Alanı",
                CokluDegerMi = true,
                FiltredeGosterilsinMi = true,
                SepetteSecilebilirMi = false,
                SiraNo = 1,
                AktifMi = true
            },
            new UrunDetayTanimi
            {
                DetayAdi = "Kum Türü",
                CokluDegerMi = true,
                FiltredeGosterilsinMi = true,
                SepetteSecilebilirMi = false,
                SiraNo = 2,
                AktifMi = true
            },
            new UrunDetayTanimi
            {
                DetayAdi = "Bez Türü",
                CokluDegerMi = true,
                FiltredeGosterilsinMi = true,
                SepetteSecilebilirMi = false,
                SiraNo = 3,
                AktifMi = true
            },
            new UrunDetayTanimi
            {
                DetayAdi = "Kumlama",
                CokluDegerMi = true,
                FiltredeGosterilsinMi = true,
                SepetteSecilebilirMi = false,
                SiraNo = 4,
                AktifMi = true
            },
            new UrunDetayTanimi
            {
                DetayAdi = "Kuru Kullanım",
                CokluDegerMi = false,
                FiltredeGosterilsinMi = true,
                SepetteSecilebilirMi = false,
                SiraNo = 5,
                AktifMi = true
            },
            new UrunDetayTanimi
            {
                DetayAdi = "Sulu Kullanım",
                CokluDegerMi = false,
                FiltredeGosterilsinMi = true,
                SepetteSecilebilirMi = false,
                SiraNo = 6,
                AktifMi = true
            },
            new UrunDetayTanimi
            {
                DetayAdi = "Kum Numarası",
                CokluDegerMi = true,
                FiltredeGosterilsinMi = true,
                SepetteSecilebilirMi = true,
                SiraNo = 7,
                AktifMi = true
            },
            new UrunDetayTanimi
            {
                DetayAdi = "Ölçü",
                CokluDegerMi = true,
                FiltredeGosterilsinMi = true,
                SepetteSecilebilirMi = true,
                SiraNo = 8,
                AktifMi = true
            },
            new UrunDetayTanimi
            {
                DetayAdi = "Kum Tablosu",
                CokluDegerMi = true,
                FiltredeGosterilsinMi = false,
                SepetteSecilebilirMi = false,
                SiraNo = 9,
                AktifMi = true
            }
        };

        foreach (var detayTanimi in detayTanimlari)
        {
            if (mevcutDetayAdiSeti.Contains(detayTanimi.DetayAdi))
                continue;

            await _dbContext.UrunDetayTanimlari.AddAsync(
                detayTanimi,
                cancellationToken);
        }
    }

    private void BaslangicAdminAyarlariniDogrula()
    {
        if (string.IsNullOrWhiteSpace(
                _baslangicAdminAyarlari.KullaniciAdi))
        {
            throw new InvalidOperationException(
                "Başlangıç admin kullanıcı adı tanımlanmamıştır.");
        }

        if (string.IsNullOrWhiteSpace(
                _baslangicAdminAyarlari.AdSoyad))
        {
            throw new InvalidOperationException(
                "Başlangıç admin ad soyad bilgisi tanımlanmamıştır.");
        }

        if (string.IsNullOrWhiteSpace(
                _baslangicAdminAyarlari.Sifre))
        {
            throw new InvalidOperationException(
                "Başlangıç admin şifresi tanımlanmamıştır.");
        }

        if (_baslangicAdminAyarlari.Sifre.Length < 8)
        {
            throw new InvalidOperationException(
                "Başlangıç admin şifresi en az 8 karakter olmalıdır.");
        }
    }
}