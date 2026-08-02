namespace OzmenZimparaMarket.Domain.Entityler;

public class Kategori
{
    public int Id { get; set; }

    public int? UstKategoriId { get; set; }

    public string KategoriAdi { get; set; } = string.Empty;

    public string? Aciklama { get; set; }

    public string? GorselYolu { get; set; }

    public string SeoUrl { get; set; } = string.Empty;

    public string? SeoBasligi { get; set; }

    public string? SeoAciklamasi { get; set; }

    public bool AnaSayfadaGosterilsinMi { get; set; }

    public int SiraNo { get; set; }

    public bool AktifMi { get; set; } = true;

    public DateTime OlusturmaTarihi { get; set; }

    public DateTime? GuncellemeTarihi { get; set; }

    public Kategori? UstKategori { get; set; }

    public ICollection<Kategori> AltKategoriler { get; set; } = new List<Kategori>();

    public ICollection<Urun> Urunler { get; set; } = new List<Urun>();
}