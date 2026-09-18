namespace OzmenZimparaMarket.Application.Istisnalar;

public class IsKuraliException : Exception
{
    public IsKuraliException(string mesaj) : base(mesaj)
    {
    }
}