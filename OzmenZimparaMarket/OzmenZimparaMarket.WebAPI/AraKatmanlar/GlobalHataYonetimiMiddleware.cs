using FluentValidation;
using OzmenZimparaMarket.WebAPI.Modeller;

namespace OzmenZimparaMarket.WebAPI.AraKatmanlar;

public class GlobalHataYonetimiMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalHataYonetimiMiddleware> _logger;

    public GlobalHataYonetimiMiddleware(RequestDelegate next, ILogger<GlobalHataYonetimiMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception exception)
        {
            if (context.Response.HasStarted)
            {
                _logger.LogWarning(exception, "HTTP cevabı başladıktan sonra bir hata oluştu.");
                throw;
            }

            await HatayiYazAsync(context, exception);
        }
    }

    private async Task HatayiYazAsync(HttpContext context, Exception exception)
    {
        var durumKodu = DurumKodunuBelirle(exception);
        var mesaj = MesajiBelirle(exception);
        var validationHatalari = ValidationHatalariniGetir(exception);

        if (durumKodu >= StatusCodes.Status500InternalServerError)
        {
            _logger.LogError(
                exception,
                "Beklenmeyen bir sunucu hatası oluştu. Takip kodu: {TakipKodu}",
                context.TraceIdentifier);
        }
        else
        {
            _logger.LogWarning(
                exception,
                "API isteği hata ile sonuçlandı. Durum kodu: {DurumKodu}, takip kodu: {TakipKodu}",
                durumKodu,
                context.TraceIdentifier);
        }

        var cevap = new ApiHataCevabi
        {
            DurumKodu = durumKodu,
            Mesaj = mesaj,
            TakipKodu = context.TraceIdentifier,
            Hatalar = validationHatalari
        };

        context.Response.Clear();
        context.Response.StatusCode = durumKodu;
        context.Response.ContentType = "application/json; charset=utf-8";

        await context.Response.WriteAsJsonAsync(cevap);
    }

    private static int DurumKodunuBelirle(Exception exception)
    {
        return exception switch
        {
            ValidationException => StatusCodes.Status400BadRequest,
            ArgumentException => StatusCodes.Status400BadRequest,
            UnauthorizedAccessException => StatusCodes.Status401Unauthorized,
            KeyNotFoundException => StatusCodes.Status404NotFound,
            InvalidOperationException => StatusCodes.Status409Conflict,
            _ => StatusCodes.Status500InternalServerError
        };
    }

    private static string MesajiBelirle(Exception exception)
    {
        return exception switch
        {
            ValidationException => "Gönderilen bilgiler doğrulanamadı.",
            ArgumentException => exception.Message,
            UnauthorizedAccessException => exception.Message,
            KeyNotFoundException => exception.Message,
            InvalidOperationException => exception.Message,
            _ => "İşlem sırasında beklenmeyen bir sunucu hatası oluştu."
        };
    }

    private static Dictionary<string, string[]>? ValidationHatalariniGetir(Exception exception)
    {
        if (exception is not ValidationException validationException) return null;

        return validationException.Errors
            .GroupBy(x => x.PropertyName)
            .ToDictionary(
                grup => grup.Key,
                grup => grup.Select(x => x.ErrorMessage).Distinct().ToArray());
    }
}