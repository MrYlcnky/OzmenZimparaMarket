using Ganss.Xss;
using OzmenZimparaMarket.Application.Interfaces;

namespace OzmenZimparaMarket.Infrastructure.Servisler;

public class HtmlTemizlemeServisi : IHtmlTemizlemeServisi
{
    private readonly HtmlSanitizer _htmlSanitizer;

    public HtmlTemizlemeServisi()
    {
        _htmlSanitizer = new HtmlSanitizer();

        _htmlSanitizer.AllowedTags.Clear();
        _htmlSanitizer.AllowedTags.UnionWith(
        [
            "p",
            "br",
            "div",
            "span",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
            "strong",
            "b",
            "em",
            "i",
            "u",
            "s",
            "small",
            "mark",
            "sub",
            "sup",
            "ul",
            "ol",
            "li",
            "blockquote",
            "a",
            "hr",
            "table",
            "thead",
            "tbody",
            "tfoot",
            "tr",
            "th",
            "td"
        ]);

        _htmlSanitizer.AllowedAttributes.Clear();
        _htmlSanitizer.AllowedAttributes.UnionWith(
        [
            "href",
            "title",
            "rel",
            "colspan",
            "rowspan",
            "scope",
            "dir",
            "lang"
        ]);

        _htmlSanitizer.AllowedSchemes.Clear();
        _htmlSanitizer.AllowedSchemes.UnionWith(
        [
            "http",
            "https",
            "mailto",
            "tel"
        ]);

        _htmlSanitizer.AllowedCssProperties.Clear();
        _htmlSanitizer.AllowedAtRules.Clear();
    }

    public string? Temizle(string? html)
    {
        if (string.IsNullOrWhiteSpace(html)) return null;

        var temizHtml = _htmlSanitizer.Sanitize(html.Trim());

        return string.IsNullOrWhiteSpace(temizHtml) ? null : temizHtml.Trim();
    }
}