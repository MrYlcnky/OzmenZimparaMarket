namespace OzmenZimparaMarket.Application.Istisnalar;

public class YetkisizErisimException : Exception
{
    public YetkisizErisimException(string mesaj) : base(mesaj)
    {
    }
}