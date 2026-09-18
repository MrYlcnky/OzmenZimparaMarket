using Microsoft.AspNetCore.Authorization;
using OzmenZimparaMarket.WebAPI.Controllers;
using Xunit;

namespace OzmenZimparaMarket.Tests.Controllers;

public class YetkilendirmeTests
{
    [Fact]
    public void PanelKullanicilariController_YetkilendirmeGerektirmeli()
    {
        var authorizeAttribute =
            typeof(PanelKullanicilariController)
                .GetCustomAttributes(
                    typeof(AuthorizeAttribute),
                    true)
                .SingleOrDefault();

        Assert.NotNull(authorizeAttribute);
    }
}