using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;
using OzmenZimparaMarket.Application.DTOs.OrtakDtos;
using OzmenZimparaMarket.Application.DTOs.UrunDtos;
using OzmenZimparaMarket.Application.Enumlar;
using OzmenZimparaMarket.Application.Interfaces;
using OzmenZimparaMarket.Domain.Entityler;
using OzmenZimparaMarket.Infrastructure.Veritabani;

namespace OzmenZimparaMarket.Infrastructure.Servisler;

public class UrunServisi : IUrunServisi
{
    private readonly OzmenZimparaMarketDbContext _dbContext;
    private readonly IHtmlTemizlemeServisi _htmlTemizlemeServisi;

    public UrunServisi(OzmenZimparaMarketDbContext dbContext, IHtmlTemizlemeServisi htmlTemizlemeServisi)
    {
        _dbContext = dbContext;
        _htmlTemizlemeServisi = htmlTemizlemeServisi;
    }

    public async Task<IReadOnlyList<UrunListeDto>> TumunuGetirAsync(bool sadeceAktifler = false, CancellationToken cancellationToken = default)
    {
        var sorgu = _dbContext.Urunler.AsNoTracking().AsQueryable();

        if (sadeceAktifler) sorgu = sorgu.Where(x => x.AktifMi && x.Kategori.AktifMi);

        var urunler = await sorgu
            .OrderBy(x => x.SiraNo)
            .ThenBy(x => x.UrunAdi)
            .Select(x => new UrunListeDto
            {
                Id = x.Id,
                KategoriId = x.KategoriId,
                KategoriAdi = x.Kategori.KategoriAdi,
                UrunAdi = x.UrunAdi,
                UrunKodu = x.UrunKodu,
                KisaAciklama = x.KisaAciklama,
                DetayliAciklama = x.DetayliAciklama,
                GorselYolu = x.GorselYolu,
                SatisBirimi = x.SatisBirimi,
                SeoUrl = x.SeoUrl,
                SeoBasligi = x.SeoBasligi,
                SeoAciklamasi = x.SeoAciklamasi,
                OneCikanMi = x.OneCikanMi,
                SiraNo = x.SiraNo,
                AktifMi = x.AktifMi,
                OlusturmaTarihi = x.OlusturmaTarihi,
                GuncellemeTarihi = x.GuncellemeTarihi
            })
            .ToListAsync(cancellationToken);

        SatisBirimiAdlariniDoldur(urunler);

        return urunler;
    }

    public async Task<SayfaliSonucDto<UrunListeDto>> FiltreleAsync(UrunFiltreDto filtre, CancellationToken cancellationToken = default)
    {
        var sorgu = _dbContext.Urunler.AsNoTracking().AsQueryable();

        if (filtre.KategoriId.HasValue)
        {
            if (filtre.AltKategorilerDahilMi)
            {
                var kategoriIdleri = await KategoriVeAltKategoriIdleriniGetirAsync(filtre.KategoriId.Value, filtre.AktifMi == true, cancellationToken);
                sorgu = sorgu.Where(x => kategoriIdleri.Contains(x.KategoriId));
            }
            else
            {
                sorgu = sorgu.Where(x => x.KategoriId == filtre.KategoriId.Value);
            }
        }

        if (!string.IsNullOrWhiteSpace(filtre.AramaMetni))
        {
            var aramaMetni = filtre.AramaMetni.Trim();

            sorgu = sorgu.Where(x =>
                x.UrunAdi.Contains(aramaMetni) ||
                x.UrunKodu.Contains(aramaMetni) ||
                (x.KisaAciklama != null && x.KisaAciklama.Contains(aramaMetni)) ||
                (x.DetayliAciklama != null && x.DetayliAciklama.Contains(aramaMetni)) ||
                x.UrunDetaylari.Any(y => y.DetayDegeri.Contains(aramaMetni)));
        }

        if (filtre.AktifMi.HasValue)
        {
            sorgu = sorgu.Where(x => x.AktifMi == filtre.AktifMi.Value);

            if (filtre.AktifMi.Value) sorgu = sorgu.Where(x => x.Kategori.AktifMi);
        }

        if (filtre.OneCikanMi.HasValue) sorgu = sorgu.Where(x => x.OneCikanMi == filtre.OneCikanMi.Value);

        if (filtre.SatisBirimi.HasValue) sorgu = sorgu.Where(x => x.SatisBirimi == filtre.SatisBirimi.Value);

        foreach (var teknikFiltre in filtre.TeknikDetayFiltreleri)
        {
            var detayTanimiId = teknikFiltre.UrunDetayTanimiId;
            var degerler = teknikFiltre.Degerler.Where(x => !string.IsNullOrWhiteSpace(x)).Select(x => x.Trim()).Distinct(StringComparer.OrdinalIgnoreCase).ToList();

            if (degerler.Count == 0) continue;

            sorgu = sorgu.Where(x => x.UrunDetaylari.Any(y =>
                y.UrunDetayTanimiId == detayTanimiId &&
                y.AktifMi &&
                y.UrunDetayTanimi.AktifMi &&
                degerler.Contains(y.DetayDegeri)));
        }

        var toplamKayitSayisi = await sorgu.CountAsync(cancellationToken);

        sorgu = SiralamaUygula(sorgu, filtre.Siralama);

        var urunler = await sorgu
            .Skip((filtre.SayfaNo - 1) * filtre.SayfaBoyutu)
            .Take(filtre.SayfaBoyutu)
            .Select(x => new UrunListeDto
            {
                Id = x.Id,
                KategoriId = x.KategoriId,
                KategoriAdi = x.Kategori.KategoriAdi,
                UrunAdi = x.UrunAdi,
                UrunKodu = x.UrunKodu,
                KisaAciklama = x.KisaAciklama,
                DetayliAciklama = x.DetayliAciklama,
                GorselYolu = x.GorselYolu,
                SatisBirimi = x.SatisBirimi,
                SeoUrl = x.SeoUrl,
                SeoBasligi = x.SeoBasligi,
                SeoAciklamasi = x.SeoAciklamasi,
                OneCikanMi = x.OneCikanMi,
                SiraNo = x.SiraNo,
                AktifMi = x.AktifMi,
                OlusturmaTarihi = x.OlusturmaTarihi,
                GuncellemeTarihi = x.GuncellemeTarihi
            })
            .ToListAsync(cancellationToken);

        SatisBirimiAdlariniDoldur(urunler);

        return new SayfaliSonucDto<UrunListeDto>
        {
            Kayitlar = urunler,
            SayfaNo = filtre.SayfaNo,
            SayfaBoyutu = filtre.SayfaBoyutu,
            ToplamKayitSayisi = toplamKayitSayisi,
            ToplamSayfaSayisi = (int)Math.Ceiling(toplamKayitSayisi / (double)filtre.SayfaBoyutu)
        };
    }

    public async Task<UrunDetayGoruntuleDto?> IdIleGetirAsync(int id, CancellationToken cancellationToken = default)
    {
        var sorgu = _dbContext.Urunler.AsNoTracking().Where(x => x.Id == id);

        return await UrunDetayiniGetirAsync(sorgu, false, cancellationToken);
    }

    public async Task<UrunDetayGoruntuleDto?> SeoUrlIleGetirAsync(string seoUrl, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(seoUrl)) return null;

        var temizSeoUrl = seoUrl.Trim().ToLowerInvariant();

        var sorgu = _dbContext.Urunler
            .AsNoTracking()
            .Where(x => x.SeoUrl == temizSeoUrl && x.AktifMi && x.Kategori.AktifMi);

        return await UrunDetayiniGetirAsync(sorgu, true, cancellationToken);
    }

    public async Task<IReadOnlyList<UrunListeDto>> OneCikanlariGetirAsync(int adet = 8, CancellationToken cancellationToken = default)
    {
        if (adet <= 0) throw new ArgumentException("Ürün adedi sıfırdan büyük olmalıdır.", nameof(adet));
        if (adet > 50) adet = 50;

        var urunler = await _dbContext.Urunler
            .AsNoTracking()
            .Where(x => x.OneCikanMi && x.AktifMi && x.Kategori.AktifMi)
            .OrderBy(x => x.SiraNo)
            .ThenBy(x => x.UrunAdi)
            .Take(adet)
            .Select(x => new UrunListeDto
            {
                Id = x.Id,
                KategoriId = x.KategoriId,
                KategoriAdi = x.Kategori.KategoriAdi,
                UrunAdi = x.UrunAdi,
                UrunKodu = x.UrunKodu,
                KisaAciklama = x.KisaAciklama,
                DetayliAciklama = x.DetayliAciklama,
                GorselYolu = x.GorselYolu,
                SatisBirimi = x.SatisBirimi,
                SeoUrl = x.SeoUrl,
                SeoBasligi = x.SeoBasligi,
                SeoAciklamasi = x.SeoAciklamasi,
                OneCikanMi = x.OneCikanMi,
                SiraNo = x.SiraNo,
                AktifMi = x.AktifMi,
                OlusturmaTarihi = x.OlusturmaTarihi,
                GuncellemeTarihi = x.GuncellemeTarihi
            })
            .ToListAsync(cancellationToken);

        SatisBirimiAdlariniDoldur(urunler);

        return urunler;
    }

    public async Task<UrunListeDto> EkleAsync(UrunEkleDto dto, CancellationToken cancellationToken = default)
    {
        await KategoriyiDogrulaAsync(dto.KategoriId, dto.AktifMi, cancellationToken);

        var urunAdi = dto.UrunAdi.Trim();
        var urunKodu = dto.UrunKodu.Trim();
        var seoUrl = SeoUrlOlustur(string.IsNullOrWhiteSpace(dto.SeoUrl) ? urunAdi : dto.SeoUrl);

        if (await UrunKoduKullaniliyorMuAsync(urunKodu, null, cancellationToken)) throw new InvalidOperationException("Bu ürün kodu daha önce kullanılmıştır.");
        if (await SeoUrlKullaniliyorMuAsync(seoUrl, null, cancellationToken)) throw new InvalidOperationException("Bu SEO URL başka bir ürün tarafından kullanılıyor.");

        var urun = new Urun
        {
            KategoriId = dto.KategoriId,
            UrunAdi = urunAdi,
            UrunKodu = urunKodu,
            KisaAciklama = Temizle(dto.KisaAciklama),
            DetayliAciklama = _htmlTemizlemeServisi.Temizle(dto.DetayliAciklama),
            GorselYolu = Temizle(dto.GorselYolu),
            SatisBirimi = dto.SatisBirimi,
            SeoUrl = seoUrl,
            SeoBasligi = await SeoBasligiOlusturAsync(urunAdi, dto.SeoBasligi, cancellationToken),
            SeoAciklamasi = SeoAciklamasiOlustur(dto.SeoAciklamasi, dto.KisaAciklama),
            OneCikanMi = dto.OneCikanMi,
            SiraNo = dto.SiraNo,
            AktifMi = dto.AktifMi,
            OlusturmaTarihi = DateTime.UtcNow
        };

        await _dbContext.Urunler.AddAsync(urun, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return await ListeDtoGetirAsync(urun.Id, cancellationToken) ?? throw new InvalidOperationException("Eklenen ürün getirilemedi.");
    }

    public async Task<UrunListeDto> GuncelleAsync(int id, UrunGuncelleDto dto, CancellationToken cancellationToken = default)
    {
        var urun = await _dbContext.Urunler.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        if (urun is null) throw new KeyNotFoundException("Güncellenecek ürün bulunamadı.");

        await KategoriyiDogrulaAsync(dto.KategoriId, dto.AktifMi, cancellationToken);

        var urunAdi = dto.UrunAdi.Trim();
        var urunKodu = dto.UrunKodu.Trim();
        var seoUrl = SeoUrlOlustur(string.IsNullOrWhiteSpace(dto.SeoUrl) ? urunAdi : dto.SeoUrl);

        if (await UrunKoduKullaniliyorMuAsync(urunKodu, id, cancellationToken)) throw new InvalidOperationException("Bu ürün kodu başka bir ürün tarafından kullanılıyor.");
        if (await SeoUrlKullaniliyorMuAsync(seoUrl, id, cancellationToken)) throw new InvalidOperationException("Bu SEO URL başka bir ürün tarafından kullanılıyor.");

        urun.KategoriId = dto.KategoriId;
        urun.UrunAdi = urunAdi;
        urun.UrunKodu = urunKodu;
        urun.KisaAciklama = Temizle(dto.KisaAciklama);
        urun.DetayliAciklama = _htmlTemizlemeServisi.Temizle(dto.DetayliAciklama);
        urun.GorselYolu = Temizle(dto.GorselYolu);
        urun.SatisBirimi = dto.SatisBirimi;
        urun.SeoUrl = seoUrl;
        urun.SeoBasligi = await SeoBasligiOlusturAsync(urunAdi, dto.SeoBasligi, cancellationToken);
        urun.SeoAciklamasi = SeoAciklamasiOlustur(dto.SeoAciklamasi, dto.KisaAciklama);
        urun.OneCikanMi = dto.OneCikanMi;
        urun.SiraNo = dto.SiraNo;
        urun.AktifMi = dto.AktifMi;
        urun.GuncellemeTarihi = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);

        return await ListeDtoGetirAsync(urun.Id, cancellationToken) ?? throw new InvalidOperationException("Güncellenen ürün getirilemedi.");
    }

    public async Task SilAsync(int id, CancellationToken cancellationToken = default)
    {
        var urun = await _dbContext.Urunler.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        if (urun is null) throw new KeyNotFoundException("Silinecek ürün bulunamadı.");

        _dbContext.Urunler.Remove(urun);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task<UrunListeDto> DurumDegistirAsync(int id, bool aktifMi, CancellationToken cancellationToken = default)
    {
        var urun = await _dbContext.Urunler.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        if (urun is null) throw new KeyNotFoundException("Ürün bulunamadı.");

        if (aktifMi) await KategoriyiDogrulaAsync(urun.KategoriId, true, cancellationToken);

        urun.AktifMi = aktifMi;
        urun.GuncellemeTarihi = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);

        return await ListeDtoGetirAsync(urun.Id, cancellationToken) ?? throw new InvalidOperationException("Ürün getirilemedi.");
    }

    public async Task<IReadOnlyList<UrunFiltreGrubuDto>> FiltreSecenekleriniGetirAsync( int? kategoriId = null, bool altKategorilerDahilMi = true, CancellationToken cancellationToken = default)
    {
        List<int>? kategoriIdleri = null;

        if (kategoriId.HasValue)
        {
            if (altKategorilerDahilMi)
            {
                kategoriIdleri = await KategoriVeAltKategoriIdleriniGetirAsync(
                    kategoriId.Value,
                    true,
                    cancellationToken);
            }
            else
            {
                var kategori = await _dbContext.Kategoriler
                    .AsNoTracking()
                    .Where(x => x.Id == kategoriId.Value)
                    .Select(x => new
                    {
                        x.Id,
                        x.AktifMi
                    })
                    .FirstOrDefaultAsync(cancellationToken);

                if (kategori is null) throw new KeyNotFoundException("Seçilen kategori bulunamadı.");

                kategoriIdleri = kategori.AktifMi
                    ? [kategori.Id]
                    : [];
            }
        }

        var sorgu = _dbContext.UrunDetaylari
            .AsNoTracking()
            .Where(x =>
                x.AktifMi &&
                x.Urun.AktifMi &&
                x.Urun.Kategori.AktifMi &&
                x.UrunDetayTanimi.AktifMi &&
                x.UrunDetayTanimi.FiltredeGosterilsinMi);

        if (kategoriIdleri is not null)
        {
            sorgu = sorgu.Where(x => kategoriIdleri.Contains(x.Urun.KategoriId));
        }

        var detaylar = await sorgu
            .Select(x => new
            {
                x.UrunId,
                x.UrunDetayTanimiId,
                x.UrunDetayTanimi.DetayAdi,
                x.UrunDetayTanimi.CokluDegerMi,
                DetayTanimiSiraNo = x.UrunDetayTanimi.SiraNo,
                x.DetayDegeri,
                DetayDegeriSiraNo = x.SiraNo
            })
            .ToListAsync(cancellationToken);

        var filtreGruplari = detaylar
            .GroupBy(x => new
            {
                x.UrunDetayTanimiId,
                x.DetayAdi,
                x.CokluDegerMi,
                x.DetayTanimiSiraNo
            })
            .OrderBy(x => x.Key.DetayTanimiSiraNo)
            .ThenBy(x => x.Key.DetayAdi)
            .Select(grup => new UrunFiltreGrubuDto
            {
                UrunDetayTanimiId = grup.Key.UrunDetayTanimiId,
                DetayAdi = grup.Key.DetayAdi,
                CokluDegerMi = grup.Key.CokluDegerMi,
                SiraNo = grup.Key.DetayTanimiSiraNo,
                Secenekler = grup
                    .GroupBy(
                        x => x.DetayDegeri.Trim(),
                        StringComparer.OrdinalIgnoreCase)
                    .OrderBy(x => x.Min(y => y.DetayDegeriSiraNo))
                    .ThenBy(x => x.Key)
                    .Select(x => new UrunFiltreSecenegiDto
                    {
                        Deger = x.Key,
                        UrunSayisi = x
                            .Select(y => y.UrunId)
                            .Distinct()
                            .Count()
                    })
                    .ToList()
            })
            .Where(x => x.Secenekler.Count > 0)
            .ToList();

        return filtreGruplari;
    }

    private async Task<UrunDetayGoruntuleDto?> UrunDetayiniGetirAsync(IQueryable<Urun> sorgu, bool sadeceAktifDetaylar, CancellationToken cancellationToken)
    {
        var urun = await sorgu
            .Select(x => new UrunDetayGoruntuleDto
            {
                Id = x.Id,
                KategoriId = x.KategoriId,
                KategoriAdi = x.Kategori.KategoriAdi,
                KategoriSeoUrl = x.Kategori.SeoUrl,
                UrunAdi = x.UrunAdi,
                UrunKodu = x.UrunKodu,
                KisaAciklama = x.KisaAciklama,
                DetayliAciklama = x.DetayliAciklama,
                GorselYolu = x.GorselYolu,
                SatisBirimi = x.SatisBirimi,
                SeoUrl = x.SeoUrl,
                SeoBasligi = x.SeoBasligi,
                SeoAciklamasi = x.SeoAciklamasi,
                OneCikanMi = x.OneCikanMi,
                SiraNo = x.SiraNo,
                AktifMi = x.AktifMi
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (urun is null) return null;

        urun.SatisBirimiAdi = urun.SatisBirimi.ToString();

        var detaySorgusu = _dbContext.UrunDetaylari.AsNoTracking().Where(x => x.UrunId == urun.Id);

        if (sadeceAktifDetaylar) detaySorgusu = detaySorgusu.Where(x => x.AktifMi && x.UrunDetayTanimi.AktifMi);

        var detaylar = await detaySorgusu
            .OrderBy(x => x.UrunDetayTanimi.SiraNo)
            .ThenBy(x => x.SiraNo)
            .ThenBy(x => x.DetayDegeri)
            .Select(x => new
            {
                x.Id,
                x.UrunDetayTanimiId,
                x.UrunDetayTanimi.DetayAdi,
                x.UrunDetayTanimi.CokluDegerMi,
                x.UrunDetayTanimi.FiltredeGosterilsinMi,
                x.UrunDetayTanimi.SepetteSecilebilirMi,
                DetayTanimiSiraNo = x.UrunDetayTanimi.SiraNo,
                x.DetayDegeri,
                x.SiraNo
            })
            .ToListAsync(cancellationToken);

        urun.TeknikDetaylar = detaylar
            .GroupBy(x => new
            {
                x.UrunDetayTanimiId,
                x.DetayAdi,
                x.CokluDegerMi,
                x.FiltredeGosterilsinMi,
                x.SepetteSecilebilirMi,
                x.DetayTanimiSiraNo
            })
            .OrderBy(x => x.Key.DetayTanimiSiraNo)
            .Select(x => new UrunTeknikDetayGrubuDto
            {
                UrunDetayTanimiId = x.Key.UrunDetayTanimiId,
                DetayAdi = x.Key.DetayAdi,
                CokluDegerMi = x.Key.CokluDegerMi,
                FiltredeGosterilsinMi = x.Key.FiltredeGosterilsinMi,
                SepetteSecilebilirMi = x.Key.SepetteSecilebilirMi,
                SiraNo = x.Key.DetayTanimiSiraNo,
                Degerler = x.OrderBy(y => y.SiraNo).ThenBy(y => y.DetayDegeri).Select(y => new UrunTeknikDetayDegeriDto
                {
                    UrunDetayiId = y.Id,
                    DetayDegeri = y.DetayDegeri,
                    SiraNo = y.SiraNo
                }).ToList()
            })
            .ToList();

        return urun;
    }

    private async Task<List<int>> KategoriVeAltKategoriIdleriniGetirAsync(int kategoriId, bool sadeceAktifKategoriler, CancellationToken cancellationToken)
    {
        var kategoriler = await _dbContext.Kategoriler
            .AsNoTracking()
            .Select(x => new { x.Id, x.UstKategoriId, x.AktifMi })
            .ToListAsync(cancellationToken);

        var secilenKategori = kategoriler.FirstOrDefault(x => x.Id == kategoriId);

        if (secilenKategori is null) throw new KeyNotFoundException("Seçilen kategori bulunamadı.");
        if (sadeceAktifKategoriler && !secilenKategori.AktifMi) return [];

        var sonuc = new List<int>();
        var kuyruk = new Queue<int>();
        kuyruk.Enqueue(kategoriId);

        while (kuyruk.Count > 0)
        {
            var mevcutKategoriId = kuyruk.Dequeue();
            sonuc.Add(mevcutKategoriId);

            var altKategoriler = kategoriler.Where(x => x.UstKategoriId == mevcutKategoriId && (!sadeceAktifKategoriler || x.AktifMi));

            foreach (var altKategori in altKategoriler) kuyruk.Enqueue(altKategori.Id);
        }

        return sonuc;
    }

    private async Task KategoriyiDogrulaAsync(int kategoriId, bool urunAktifOlacakMi, CancellationToken cancellationToken)
    {
        var kategori = await _dbContext.Kategoriler.AsNoTracking().FirstOrDefaultAsync(x => x.Id == kategoriId, cancellationToken);

        if (kategori is null) throw new KeyNotFoundException("Seçilen kategori bulunamadı.");
        if (urunAktifOlacakMi && !kategori.AktifMi) throw new InvalidOperationException("Aktif bir ürün pasif kategoriye bağlanamaz.");
    }

    private async Task<bool> UrunKoduKullaniliyorMuAsync(string urunKodu, int? haricUrunId, CancellationToken cancellationToken)
    {
        var sorgu = _dbContext.Urunler.AsNoTracking().Where(x => x.UrunKodu == urunKodu);

        if (haricUrunId.HasValue) sorgu = sorgu.Where(x => x.Id != haricUrunId.Value);

        return await sorgu.AnyAsync(cancellationToken);
    }

    private async Task<bool> SeoUrlKullaniliyorMuAsync(string seoUrl, int? haricUrunId, CancellationToken cancellationToken)
    {
        var sorgu = _dbContext.Urunler.AsNoTracking().Where(x => x.SeoUrl == seoUrl);

        if (haricUrunId.HasValue) sorgu = sorgu.Where(x => x.Id != haricUrunId.Value);

        return await sorgu.AnyAsync(cancellationToken);
    }

    private async Task<string> SeoBasligiOlusturAsync(string urunAdi, string? seoBasligi, CancellationToken cancellationToken)
    {
        if (!string.IsNullOrWhiteSpace(seoBasligi)) return seoBasligi.Trim();

        var sirketAdi = await _dbContext.FirmaGenelBilgileri.AsNoTracking().Where(x => x.Id == 1).Select(x => x.SirketAdi).FirstOrDefaultAsync(cancellationToken);

        return string.IsNullOrWhiteSpace(sirketAdi) ? urunAdi : $"{urunAdi} | {sirketAdi}";
    }

    private async Task<UrunListeDto?> ListeDtoGetirAsync(int id, CancellationToken cancellationToken)
    {
        var urun = await _dbContext.Urunler
            .AsNoTracking()
            .Where(x => x.Id == id)
            .Select(x => new UrunListeDto
            {
                Id = x.Id,
                KategoriId = x.KategoriId,
                KategoriAdi = x.Kategori.KategoriAdi,
                UrunAdi = x.UrunAdi,
                UrunKodu = x.UrunKodu,
                KisaAciklama = x.KisaAciklama,
                DetayliAciklama = x.DetayliAciklama,
                GorselYolu = x.GorselYolu,
                SatisBirimi = x.SatisBirimi,
                SeoUrl = x.SeoUrl,
                SeoBasligi = x.SeoBasligi,
                SeoAciklamasi = x.SeoAciklamasi,
                OneCikanMi = x.OneCikanMi,
                SiraNo = x.SiraNo,
                AktifMi = x.AktifMi,
                OlusturmaTarihi = x.OlusturmaTarihi,
                GuncellemeTarihi = x.GuncellemeTarihi
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (urun is not null) urun.SatisBirimiAdi = urun.SatisBirimi.ToString();

        return urun;
    }

    private static IQueryable<Urun> SiralamaUygula(IQueryable<Urun> sorgu, UrunSiralamaTuru siralama)
    {
        return siralama switch
        {
            UrunSiralamaTuru.SiraNoAzalan => sorgu.OrderByDescending(x => x.SiraNo).ThenBy(x => x.UrunAdi),
            UrunSiralamaTuru.UrunAdiArtan => sorgu.OrderBy(x => x.UrunAdi),
            UrunSiralamaTuru.UrunAdiAzalan => sorgu.OrderByDescending(x => x.UrunAdi),
            UrunSiralamaTuru.YeniEklenenler => sorgu.OrderByDescending(x => x.OlusturmaTarihi),
            UrunSiralamaTuru.EskiEklenenler => sorgu.OrderBy(x => x.OlusturmaTarihi),
            _ => sorgu.OrderBy(x => x.SiraNo).ThenBy(x => x.UrunAdi)
        };
    }

    private static string SeoUrlOlustur(string metin)
    {
        var duzenlenmisMetin = metin
            .Trim()
            .Replace("ı", "i")
            .Replace("İ", "i")
            .Replace("ş", "s")
            .Replace("Ş", "s")
            .Replace("ğ", "g")
            .Replace("Ğ", "g")
            .Replace("ü", "u")
            .Replace("Ü", "u")
            .Replace("ö", "o")
            .Replace("Ö", "o")
            .Replace("ç", "c")
            .Replace("Ç", "c")
            .ToLowerInvariant()
            .Normalize(NormalizationForm.FormD);

        var sonuc = new StringBuilder();

        foreach (var karakter in duzenlenmisMetin)
        {
            if (CharUnicodeInfo.GetUnicodeCategory(karakter) != UnicodeCategory.NonSpacingMark) sonuc.Append(karakter);
        }

        var seoUrl = Regex.Replace(sonuc.ToString().Normalize(NormalizationForm.FormC), @"[^a-z0-9]+", "-").Trim('-');

        if (string.IsNullOrWhiteSpace(seoUrl)) throw new InvalidOperationException("Ürün için geçerli bir SEO URL oluşturulamadı.");

        return seoUrl;
    }

    private static string? SeoAciklamasiOlustur(string? seoAciklamasi, string? kisaAciklama)
    {
        if (!string.IsNullOrWhiteSpace(seoAciklamasi)) return seoAciklamasi.Trim();

        return Temizle(kisaAciklama);
    }

    private static string? Temizle(string? deger)
    {
        return string.IsNullOrWhiteSpace(deger) ? null : deger.Trim();
    }

    private static void SatisBirimiAdlariniDoldur(IEnumerable<UrunListeDto> urunler)
    {
        foreach (var urun in urunler) urun.SatisBirimiAdi = urun.SatisBirimi.ToString();
    }
}