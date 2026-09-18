namespace OzmenZimparaMarket.Application.Istisnalar;

public class CakismaException : Exception
{
    public CakismaException(string mesaj) : base(mesaj)
    {
    }
}