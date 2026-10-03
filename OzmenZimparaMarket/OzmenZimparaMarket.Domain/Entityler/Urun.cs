using OzmenZimparaMarket.Domain.Enumlar;

namespace OzmenZimparaMarket.Domain.Entityler;

public class Urun
{
    public int Id { get; set; }

    public int KategoriId { get; set; }

    public string UrunAdi { get; set; } = string.Empty;

    public string? UrunKodu { get; set; } 

    public string? KisaAciklama { get; set; }

    public string? DetayliAciklama { get; set; }

    public string? GorselYolu { get; set; }

    public SatisBirimi SatisBirimi { get; set; }

    public string SeoUrl { get; set; } = string.Empty;

    public string? SeoBasligi { get; set; }

    public string? SeoAciklamasi { get; set; }

    public bool OneCikanMi { get; set; }

    public int SiraNo { get; set; }

    public bool AktifMi { get; set; } = true;

    public DateTime OlusturmaTarihi { get; set; }

    public DateTime? GuncellemeTarihi { get; set; }

    public Kategori Kategori { get; set; } = null!;

    public ICollection<UrunDetayi> UrunDetaylari { get; set; } = new List<UrunDetayi>();
}