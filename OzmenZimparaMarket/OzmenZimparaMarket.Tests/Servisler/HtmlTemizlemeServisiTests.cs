using OzmenZimparaMarket.Infrastructure.Servisler;
using Xunit;

namespace OzmenZimparaMarket.Tests.Servisler;

public class HtmlTemizlemeServisiTests
{
    [Fact]
    public void Temizle_NullDegerVerildiginde_NullDonmeli()
    {
        var servis = new HtmlTemizlemeServisi();

        var sonuc = servis.Temizle(null);

        Assert.Null(sonuc);
    }

    [Fact]
    public void Temizle_BosDegerVerildiginde_NullDonmeli()
    {
        var servis = new HtmlTemizlemeServisi();

        var sonuc = servis.Temizle("   ");

        Assert.Null(sonuc);
    }

    [Fact]
    public void Temizle_SadeceScriptIcerdiginde_NullDonmeli()
    {
        var servis = new HtmlTemizlemeServisi();

        var sonuc = servis.Temizle(
            "<script>alert('xss')</script>");

        Assert.Null(sonuc);
    }

    [Fact]
    public void Temizle_ZararliHtmlIceriginiTemizlemeli()
    {
        var servis = new HtmlTemizlemeServisi();

        var html =
            """
            <div class="zararli" style="color:red">
                <script>alert('xss')</script>
                <a href="javascript:alert('xss')">Bağlantı</a>
                <strong>Güvenli İçerik</strong>
            </div>
            """;

        var sonuc = servis.Temizle(html);

        Assert.NotNull(sonuc);

        Assert.False(
            sonuc.Contains(
                "<script",
                StringComparison.OrdinalIgnoreCase));

        Assert.False(
            sonuc.Contains(
                "javascript:",
                StringComparison.OrdinalIgnoreCase));

        Assert.False(
            sonuc.Contains(
                "class=",
                StringComparison.OrdinalIgnoreCase));

        Assert.False(
            sonuc.Contains(
                "style=",
                StringComparison.OrdinalIgnoreCase));

        Assert.Contains(
            "<strong>Güvenli İçerik</strong>",
            sonuc);
    }

    [Fact]
    public void Temizle_IzinVerilenHtmlEtiketleriniKorumali()
    {
        var servis = new HtmlTemizlemeServisi();

        var html =
            "<p>Metin <strong>kalın</strong></p>";

        var sonuc = servis.Temizle(html);

        Assert.NotNull(sonuc);
        Assert.Contains("<p>", sonuc);
        Assert.Contains("<strong>kalın</strong>", sonuc);
    }
}