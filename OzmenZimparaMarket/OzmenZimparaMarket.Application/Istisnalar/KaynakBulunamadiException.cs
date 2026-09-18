namespace OzmenZimparaMarket.Application.Istisnalar;

public class KaynakBulunamadiException : Exception
{
    public KaynakBulunamadiException(string mesaj) : base(mesaj)
    {
    }
}