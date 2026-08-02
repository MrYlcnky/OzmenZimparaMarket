namespace OzmenZimparaMarket.Application.DTOs.AuthDtos;

public class JwtTokenSonucDto
{
    public string Token { get; set; } = string.Empty;

    public DateTime TokenBitisTarihi { get; set; }
}