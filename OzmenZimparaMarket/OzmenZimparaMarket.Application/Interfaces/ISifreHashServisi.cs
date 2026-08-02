namespace OzmenZimparaMarket.Application.Interfaces;

public interface ISifreHashServisi
{
    string Hashle(string sifre);

    bool Dogrula(string sifre, string sifreHash);
}