using Microsoft.EntityFrameworkCore;
using OzmenZimparaMarket.Application.DTOs.AuthDtos;
using OzmenZimparaMarket.Application.Interfaces;
using OzmenZimparaMarket.Infrastructure.Veritabani;

namespace OzmenZimparaMarket.Infrastructure.Servisler;

public class AuthServisi : IAuthServisi
{
    private readonly OzmenZimparaMarketDbContext _dbContext;
    private readonly ISifreHashServisi _sifreHashServisi;
    private readonly IJwtServisi _jwtServisi;

    public AuthServisi(OzmenZimparaMarketDbContext dbContext, ISifreHashServisi sifreHashServisi, IJwtServisi jwtServisi)
    {
        _dbContext = dbContext;
        _sifreHashServisi = sifreHashServisi;
        _jwtServisi = jwtServisi;
    }

    public async Task<GirisSonucDto> GirisAsync(GirisDto dto, CancellationToken cancellationToken = default)
    {
        var kullaniciAdi = dto.KullaniciAdi.Trim();

        var kullanici = await _dbContext.PanelKullanicilari.AsNoTracking().FirstOrDefaultAsync(x => x.KullaniciAdi == kullaniciAdi, cancellationToken);

        if (kullanici is null || !kullanici.AktifMi || !_sifreHashServisi.Dogrula(dto.Sifre, kullanici.SifreHash)) throw new UnauthorizedAccessException("Kullanıcı adı veya şifre hatalıdır.");

        var tokenSonucu = _jwtServisi.TokenOlustur(kullanici.Id, kullanici.KullaniciAdi, kullanici.AdSoyad);

        return new GirisSonucDto
        {
            Token = tokenSonucu.Token,
            TokenBitisTarihi = tokenSonucu.TokenBitisTarihi,
            KullaniciId = kullanici.Id,
            KullaniciAdi = kullanici.KullaniciAdi,
            AdSoyad = kullanici.AdSoyad
        };
    }

    public async Task<MevcutKullaniciDto?> MevcutKullaniciyiGetirAsync(int kullaniciId, CancellationToken cancellationToken = default)
    {
        if (kullaniciId <= 0) return null;

        return await _dbContext.PanelKullanicilari
            .AsNoTracking()
            .Where(x => x.Id == kullaniciId && x.AktifMi)
            .Select(x => new MevcutKullaniciDto
            {
                KullaniciId = x.Id,
                KullaniciAdi = x.KullaniciAdi,
                AdSoyad = x.AdSoyad
            })
            .FirstOrDefaultAsync(cancellationToken);
    }
}