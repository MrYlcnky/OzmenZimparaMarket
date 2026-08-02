using Microsoft.AspNetCore.Identity;
using OzmenZimparaMarket.Application.Interfaces;
using OzmenZimparaMarket.Domain.Entityler;

namespace OzmenZimparaMarket.Infrastructure.Servisler;

public class SifreHashServisi : ISifreHashServisi
{
    private readonly IPasswordHasher<PanelKullanicisi> _passwordHasher;

    public SifreHashServisi(IPasswordHasher<PanelKullanicisi> passwordHasher)
    {
        _passwordHasher = passwordHasher;
    }

    public string Hashle(string sifre)
    {
        if (string.IsNullOrWhiteSpace(sifre)) throw new ArgumentException("Şifre boş olamaz.", nameof(sifre));

        return _passwordHasher.HashPassword(new PanelKullanicisi(), sifre);
    }

    public bool Dogrula(string sifre, string sifreHash)
    {
        if (string.IsNullOrWhiteSpace(sifre) || string.IsNullOrWhiteSpace(sifreHash)) return false;

        var sonuc = _passwordHasher.VerifyHashedPassword(new PanelKullanicisi(), sifreHash, sifre);

        return sonuc is PasswordVerificationResult.Success or PasswordVerificationResult.SuccessRehashNeeded;
    }
}