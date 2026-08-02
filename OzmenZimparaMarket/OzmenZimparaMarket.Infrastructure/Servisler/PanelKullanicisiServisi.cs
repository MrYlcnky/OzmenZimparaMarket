using Microsoft.EntityFrameworkCore;
using OzmenZimparaMarket.Application.DTOs.PanelKullanicisiDtos;
using OzmenZimparaMarket.Application.Interfaces;
using OzmenZimparaMarket.Domain.Entityler;
using OzmenZimparaMarket.Infrastructure.Veritabani;

namespace OzmenZimparaMarket.Infrastructure.Servisler;

public class PanelKullanicisiServisi : IPanelKullanicisiServisi
{
    private readonly OzmenZimparaMarketDbContext _dbContext;
    private readonly ISifreHashServisi _sifreHashServisi;

    public PanelKullanicisiServisi(OzmenZimparaMarketDbContext dbContext, ISifreHashServisi sifreHashServisi)
    {
        _dbContext = dbContext;
        _sifreHashServisi = sifreHashServisi;
    }

    public async Task<IReadOnlyList<PanelKullanicisiListeDto>> TumunuGetirAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.PanelKullanicilari
            .AsNoTracking()
            .OrderBy(x => x.AdSoyad)
            .ThenBy(x => x.KullaniciAdi)
            .Select(x => new PanelKullanicisiListeDto
            {
                Id = x.Id,
                KullaniciAdi = x.KullaniciAdi,
                AdSoyad = x.AdSoyad,
                AktifMi = x.AktifMi,
                OlusturmaTarihi = x.OlusturmaTarihi,
                GuncellemeTarihi = x.GuncellemeTarihi
            })
            .ToListAsync(cancellationToken);
    }

    public async Task<PanelKullanicisiListeDto?> IdIleGetirAsync(int id, CancellationToken cancellationToken = default)
    {
        return await DtoGetirAsync(id, cancellationToken);
    }

    public async Task<PanelKullanicisiListeDto> EkleAsync(PanelKullanicisiEkleDto dto, CancellationToken cancellationToken = default)
    {
        var kullaniciAdi = dto.KullaniciAdi.Trim();
        var adSoyad = dto.AdSoyad.Trim();

        if (await KullaniciAdiKullaniliyorMuAsync(kullaniciAdi, null, cancellationToken)) throw new InvalidOperationException("Bu kullanıcı adı daha önce kullanılmıştır.");

        var kullanici = new PanelKullanicisi
        {
            KullaniciAdi = kullaniciAdi,
            SifreHash = _sifreHashServisi.Hashle(dto.Sifre),
            AdSoyad = adSoyad,
            AktifMi = dto.AktifMi,
            OlusturmaTarihi = DateTime.UtcNow
        };

        await _dbContext.PanelKullanicilari.AddAsync(kullanici, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return await DtoGetirAsync(kullanici.Id, cancellationToken) ?? throw new InvalidOperationException("Eklenen panel kullanıcısı getirilemedi.");
    }

    public async Task<PanelKullanicisiListeDto> GuncelleAsync(int id, PanelKullanicisiGuncelleDto dto, CancellationToken cancellationToken = default)
    {
        var kullanici = await _dbContext.PanelKullanicilari.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        if (kullanici is null) throw new KeyNotFoundException("Güncellenecek panel kullanıcısı bulunamadı.");

        var kullaniciAdi = dto.KullaniciAdi.Trim();
        var adSoyad = dto.AdSoyad.Trim();

        if (await KullaniciAdiKullaniliyorMuAsync(kullaniciAdi, id, cancellationToken)) throw new InvalidOperationException("Bu kullanıcı adı başka bir panel kullanıcısı tarafından kullanılıyor.");

        if (kullanici.AktifMi && !dto.AktifMi) await SonAktifKullaniciKontroluAsync(id, cancellationToken);

        kullanici.KullaniciAdi = kullaniciAdi;
        kullanici.AdSoyad = adSoyad;
        kullanici.AktifMi = dto.AktifMi;
        kullanici.GuncellemeTarihi = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);

        return await DtoGetirAsync(kullanici.Id, cancellationToken) ?? throw new InvalidOperationException("Güncellenen panel kullanıcısı getirilemedi.");
    }

    public async Task SilAsync(int id, CancellationToken cancellationToken = default)
    {
        var kullanici = await _dbContext.PanelKullanicilari.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        if (kullanici is null) throw new KeyNotFoundException("Silinecek panel kullanıcısı bulunamadı.");

        if (kullanici.AktifMi) await SonAktifKullaniciKontroluAsync(id, cancellationToken);

        _dbContext.PanelKullanicilari.Remove(kullanici);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task<PanelKullanicisiListeDto> DurumDegistirAsync(int id, bool aktifMi, CancellationToken cancellationToken = default)
    {
        var kullanici = await _dbContext.PanelKullanicilari.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        if (kullanici is null) throw new KeyNotFoundException("Panel kullanıcısı bulunamadı.");

        if (kullanici.AktifMi && !aktifMi) await SonAktifKullaniciKontroluAsync(id, cancellationToken);

        kullanici.AktifMi = aktifMi;
        kullanici.GuncellemeTarihi = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);

        return await DtoGetirAsync(kullanici.Id, cancellationToken) ?? throw new InvalidOperationException("Panel kullanıcısı getirilemedi.");
    }

    public async Task SifreDegistirAsync(int kullaniciId, PanelKullanicisiSifreDegistirDto dto, CancellationToken cancellationToken = default)
    {
        var kullanici = await _dbContext.PanelKullanicilari.FirstOrDefaultAsync(x => x.Id == kullaniciId, cancellationToken);

        if (kullanici is null) throw new KeyNotFoundException("Panel kullanıcısı bulunamadı.");
        if (!kullanici.AktifMi) throw new InvalidOperationException("Pasif panel kullanıcısının şifresi değiştirilemez.");
        if (!_sifreHashServisi.Dogrula(dto.MevcutSifre, kullanici.SifreHash)) throw new InvalidOperationException("Mevcut şifre hatalıdır.");
        if (dto.YeniSifre != dto.YeniSifreTekrar) throw new InvalidOperationException("Yeni şifreler birbiriyle eşleşmiyor.");
        if (_sifreHashServisi.Dogrula(dto.YeniSifre, kullanici.SifreHash)) throw new InvalidOperationException("Yeni şifre mevcut şifreyle aynı olamaz.");

        kullanici.SifreHash = _sifreHashServisi.Hashle(dto.YeniSifre);
        kullanici.GuncellemeTarihi = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task SifreSifirlaAsync(int id, PanelKullanicisiSifreSifirlaDto dto, CancellationToken cancellationToken = default)
    {
        var kullanici = await _dbContext.PanelKullanicilari.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        if (kullanici is null) throw new KeyNotFoundException("Şifresi sıfırlanacak panel kullanıcısı bulunamadı.");
        if (dto.YeniSifre != dto.YeniSifreTekrar) throw new InvalidOperationException("Yeni şifreler birbiriyle eşleşmiyor.");
        if (_sifreHashServisi.Dogrula(dto.YeniSifre, kullanici.SifreHash)) throw new InvalidOperationException("Yeni şifre mevcut şifreyle aynı olamaz.");

        kullanici.SifreHash = _sifreHashServisi.Hashle(dto.YeniSifre);
        kullanici.GuncellemeTarihi = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    private async Task<bool> KullaniciAdiKullaniliyorMuAsync(string kullaniciAdi, int? haricKullaniciId, CancellationToken cancellationToken)
    {
        var sorgu = _dbContext.PanelKullanicilari.AsNoTracking().Where(x => x.KullaniciAdi == kullaniciAdi);

        if (haricKullaniciId.HasValue) sorgu = sorgu.Where(x => x.Id != haricKullaniciId.Value);

        return await sorgu.AnyAsync(cancellationToken);
    }

    private async Task SonAktifKullaniciKontroluAsync(int haricKullaniciId, CancellationToken cancellationToken)
    {
        var baskaAktifKullaniciVarMi = await _dbContext.PanelKullanicilari.AsNoTracking().AnyAsync(x => x.Id != haricKullaniciId && x.AktifMi, cancellationToken);

        if (!baskaAktifKullaniciVarMi) throw new InvalidOperationException("Sistemdeki son aktif panel kullanıcısı silinemez veya pasife alınamaz.");
    }

    private async Task<PanelKullanicisiListeDto?> DtoGetirAsync(int id, CancellationToken cancellationToken)
    {
        return await _dbContext.PanelKullanicilari
            .AsNoTracking()
            .Where(x => x.Id == id)
            .Select(x => new PanelKullanicisiListeDto
            {
                Id = x.Id,
                KullaniciAdi = x.KullaniciAdi,
                AdSoyad = x.AdSoyad,
                AktifMi = x.AktifMi,
                OlusturmaTarihi = x.OlusturmaTarihi,
                GuncellemeTarihi = x.GuncellemeTarihi
            })
            .FirstOrDefaultAsync(cancellationToken);
    }
}