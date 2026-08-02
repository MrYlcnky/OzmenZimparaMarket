using FluentValidation;
using FluentValidation.Results;
using Microsoft.AspNetCore.Mvc.Filters;

namespace OzmenZimparaMarket.WebAPI.Filtreler;

public class FluentValidationActionFilter : IAsyncActionFilter
{
    private readonly IServiceProvider _serviceProvider;

    public FluentValidationActionFilter(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var validationHatalari = new List<ValidationFailure>();

        foreach (var actionArgument in context.ActionArguments.Values)
        {
            if (actionArgument is null) continue;

            var validatorTuru = typeof(IValidator<>).MakeGenericType(actionArgument.GetType());
            var validator = _serviceProvider.GetService(validatorTuru) as IValidator;

            if (validator is null) continue;

            var validationContext = new ValidationContext<object>(actionArgument);

            var validationSonucu = await validator.ValidateAsync(
                validationContext,
                context.HttpContext.RequestAborted);

            if (!validationSonucu.IsValid) validationHatalari.AddRange(validationSonucu.Errors);
        }

        if (validationHatalari.Count > 0) throw new ValidationException(validationHatalari);

        await next();
    }
}