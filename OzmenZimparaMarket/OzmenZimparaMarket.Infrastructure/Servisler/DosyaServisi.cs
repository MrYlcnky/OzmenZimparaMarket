using Microsoft.Extensions.Options;
using OzmenZimparaMarket.Application.DTOs.DosyaDtos;
using OzmenZimparaMarket.Application.Interfaces;
using OzmenZimparaMarket.Application.Istisnalar;
using OzmenZimparaMarket.Infrastructure.Ayarlar;

namespace OzmenZimparaMarket.Infrastructure.Servisler;

public class DosyaServisi : IDosyaServisi
{
    private readonly DosyaAyarlari _dosyaAyarlari;

    public DosyaServisi(IOptions<DosyaAyarlari> dosyaAyarlari)
    {
        _dosyaAyarlari = dosyaAyarlari.Value;
    }

    public Task<DosyaYuklemeSonucDto> UrunGorseliYukleAsync(DosyaYukleDto dto, CancellationToken cancellationToken = default)
    {
        return YukleAsync(dto, _dosyaAyarlari.UrunGorselleriKlasoru, cancellationToken);
    }

    public Task<IReadOnlyList<DosyaYuklemeSonucDto>> UrunGorselleriniGetirAsync(CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();

        AyarlariDogrula();

        var kokDizin = Path.GetFullPath(_dosyaAyarlari.KokDizin);

        var izinVerilenUzantilar = _dosyaAyarlari
            .IzinVerilenUzantilar
            .ToHashSet(StringComparer.OrdinalIgnoreCase);

        var gorseller = new List<(DosyaYuklemeSonucDto Dosya, DateTime Tarih)>();

        GorselleriEkle(
            _dosyaAyarlari.UrunGorselleriKlasoru,
            kokDizin,
            izinVerilenUzantilar,
            gorseller);

        GorselleriEkle(
            _dosyaAyarlari.KategoriGorselleriKlasoru,
            kokDizin,
            izinVerilenUzantilar,
            gorseller);

        IReadOnlyList<DosyaYuklemeSonucDto> sonuc = gorseller
            .OrderByDescending(x => x.Tarih)
            .Select(x => x.Dosya)
            .ToList();

        return Task.FromResult(sonuc);
    }

    public async Task<DosyaYuklemeSonucDto> UrunGorselineKopyalaAsync(
    string dosyaYolu,
    CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(dosyaYolu))
            throw new ArgumentException("Kaynak görsel yolu boş olamaz.", nameof(dosyaYolu));

        AyarlariDogrula();

        var kokDizin = Path.GetFullPath(_dosyaAyarlari.KokDizin);

        var temizDosyaYolu = dosyaYolu
            .Split('?', '#')[0]
            .Replace('/', Path.DirectorySeparatorChar)
            .TrimStart(Path.DirectorySeparatorChar);

        var kaynakDosyaYolu = Path.GetFullPath(
            Path.Combine(kokDizin, temizDosyaYolu));

        if (!KokDizinAltindaMi(kaynakDosyaYolu, kokDizin))
            throw new InvalidOperationException("Geçersiz kaynak görsel yolu.");

        if (!IzinVerilenKlasorAltindaMi(kaynakDosyaYolu, kokDizin))
            throw new InvalidOperationException("Bu görsel kullanılamaz.");

        if (!File.Exists(kaynakDosyaYolu))
            throw new FileNotFoundException("Seçilen görsel bulunamadı.");

        var uzanti = Path.GetExtension(kaynakDosyaYolu).ToLowerInvariant();

        if (!_dosyaAyarlari.IzinVerilenUzantilar.Contains(
                uzanti,
                StringComparer.OrdinalIgnoreCase))
        {
            throw new InvalidOperationException("Dosya uzantısı desteklenmiyor.");
        }

        var urunKlasoru = GuvenliKlasorYoluOlustur(
            kokDizin,
            _dosyaAyarlari.UrunGorselleriKlasoru);

        Directory.CreateDirectory(urunKlasoru);

        var urunKlasoruTamYolu =
            Path.GetFullPath(urunKlasoru)
                .TrimEnd(Path.DirectorySeparatorChar)
            + Path.DirectorySeparatorChar;

        if (kaynakDosyaYolu.StartsWith(
                urunKlasoruTamYolu,
                StringComparison.OrdinalIgnoreCase))
        {
            return new DosyaYuklemeSonucDto
            {
                DosyaAdi = Path.GetFileName(kaynakDosyaYolu),
                DosyaYolu = "/" + temizDosyaYolu
                    .Replace(Path.DirectorySeparatorChar, '/')
            };
        }

        var yeniDosyaAdi = $"{Guid.NewGuid():N}{uzanti}";

        var hedefDosyaYolu = Path.Combine(
            urunKlasoru,
            yeniDosyaAdi);

        await using var kaynakAkis = new FileStream(
            kaynakDosyaYolu,
            FileMode.Open,
            FileAccess.Read,
            FileShare.Read,
            81920,
            true);

        await using var hedefAkis = new FileStream(
            hedefDosyaYolu,
            FileMode.CreateNew,
            FileAccess.Write,
            FileShare.None,
            81920,
            true);

        await kaynakAkis.CopyToAsync(
            hedefAkis,
            cancellationToken);

        var goreliKlasor = _dosyaAyarlari
            .UrunGorselleriKlasoru
            .Replace('\\', '/')
            .Trim('/');

        return new DosyaYuklemeSonucDto
        {
            DosyaAdi = yeniDosyaAdi,
            DosyaYolu = $"/{goreliKlasor}/{yeniDosyaAdi}"
        };
    }

    public Task<DosyaYuklemeSonucDto> KategoriGorseliYukleAsync(DosyaYukleDto dto, CancellationToken cancellationToken = default)
    {
        return YukleAsync(dto, _dosyaAyarlari.KategoriGorselleriKlasoru, cancellationToken);
    }

    public Task SilAsync(string dosyaYolu, CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();

        if (string.IsNullOrWhiteSpace(dosyaYolu))
            throw new IsKuraliException("Silinecek dosya yolu boş olamaz.");

        AyarlariDogrula();

        var temizDosyaYolu = dosyaYolu
            .Split('?', '#')[0]
            .Replace('/', Path.DirectorySeparatorChar)
            .TrimStart(Path.DirectorySeparatorChar);

        var kokDizin = Path.GetFullPath(_dosyaAyarlari.KokDizin);
        var tamDosyaYolu = Path.GetFullPath(Path.Combine(kokDizin, temizDosyaYolu));

        if (!KokDizinAltindaMi(tamDosyaYolu, kokDizin))
            throw new IsKuraliException("Geçersiz dosya yolu.");

        if (!IzinVerilenKlasorAltindaMi(tamDosyaYolu, kokDizin))
            throw new IsKuraliException("Bu dizindeki dosyalar silinemez.");

        if (File.Exists(tamDosyaYolu))
            File.Delete(tamDosyaYolu);

        return Task.CompletedTask;
    }

    private static void GorselleriEkle(
    string goreliKlasor,
    string kokDizin,
    HashSet<string> izinVerilenUzantilar,
    List<(DosyaYuklemeSonucDto Dosya, DateTime Tarih)> gorseller)
    {
        var temizKlasor = goreliKlasor
            .Replace('/', Path.DirectorySeparatorChar)
            .TrimStart(Path.DirectorySeparatorChar);

        var tamKlasor = Path.GetFullPath(
            Path.Combine(kokDizin, temizKlasor));

        var duzenlenmisKokDizin =
            Path.GetFullPath(kokDizin)
                .TrimEnd(Path.DirectorySeparatorChar)
            + Path.DirectorySeparatorChar;

        if (!tamKlasor.StartsWith(
                duzenlenmisKokDizin,
                StringComparison.OrdinalIgnoreCase))
        {
            throw new InvalidOperationException("Geçersiz görsel klasörü.");
        }

        if (!Directory.Exists(tamKlasor))
        {
            return;
        }

        var webKlasoru = goreliKlasor
            .Replace('\\', '/')
            .Trim('/');

        foreach (var dosyaYolu in Directory.EnumerateFiles(tamKlasor))
        {
            if (!izinVerilenUzantilar.Contains(
                    Path.GetExtension(dosyaYolu)))
            {
                continue;
            }

            var dosyaAdi = Path.GetFileName(dosyaYolu);

            gorseller.Add((
                new DosyaYuklemeSonucDto
                {
                    DosyaAdi = dosyaAdi,
                    DosyaYolu = $"/{webKlasoru}/{dosyaAdi}"
                },
                File.GetLastWriteTimeUtc(dosyaYolu)
            ));
        }
    }
    private async Task<DosyaYuklemeSonucDto> YukleAsync(DosyaYukleDto dto, string hedefKlasor, CancellationToken cancellationToken)
    {
        AyarlariDogrula();

        if (dto is null)
            throw new IsKuraliException("Dosya bilgisi gönderilmelidir.");

        var guvenliDosyaAdi = Path.GetFileName(dto.DosyaAdi);
        var uzanti = Path.GetExtension(guvenliDosyaAdi).ToLowerInvariant();
        var icerikTuru = dto.IcerikTuru?.Trim();

        if (string.IsNullOrWhiteSpace(guvenliDosyaAdi))
            throw new IsKuraliException("Dosya adı boş olamaz.");

        if (!_dosyaAyarlari.IzinVerilenUzantilar.Contains(uzanti, StringComparer.OrdinalIgnoreCase))
            throw new IsKuraliException("Dosya uzantısı desteklenmiyor.");

        if (string.IsNullOrWhiteSpace(icerikTuru) ||
            !_dosyaAyarlari.IzinVerilenIcerikTurleri.Contains(icerikTuru, StringComparer.OrdinalIgnoreCase))
        {
            throw new IsKuraliException("Dosya içerik türü desteklenmiyor.");
        }

        if (!IcerikTuruUzantiIleUyumluMu(uzanti, icerikTuru))
            throw new IsKuraliException("Dosya uzantısı ile içerik türü birbiriyle eşleşmiyor.");

        if (dto.DosyaBoyutu <= 0 || dto.DosyaBoyutu > _dosyaAyarlari.MaksimumDosyaBoyutu)
            throw new IsKuraliException("Dosya boyutu geçersizdir.");

        if (dto.DosyaAkisi == Stream.Null || !dto.DosyaAkisi.CanRead)
            throw new IsKuraliException("Dosya içeriği okunamıyor.");

        await using var bellekAkisi = new MemoryStream();

        if (dto.DosyaAkisi.CanSeek)
            dto.DosyaAkisi.Position = 0;

        await dto.DosyaAkisi.CopyToAsync(bellekAkisi, cancellationToken);

        if (bellekAkisi.Length <= 0)
            throw new IsKuraliException("Boş dosya yüklenemez.");

        if (bellekAkisi.Length > _dosyaAyarlari.MaksimumDosyaBoyutu)
            throw new IsKuraliException("Dosya boyutu izin verilen sınırı aşıyor.");

        if (bellekAkisi.Length != dto.DosyaBoyutu)
            throw new IsKuraliException("Dosya boyutu bilgisi gerçek dosya boyutuyla eşleşmiyor.");

        var dosyaVerisi = bellekAkisi.ToArray();

        if (!DosyaImzasiGecerliMi(dosyaVerisi, uzanti))
            throw new IsKuraliException("Dosya içeriği belirtilen görsel türüyle eşleşmiyor.");

        var gorselBoyutu = GorselBoyutlariniGetir(dosyaVerisi, uzanti);

        if (!gorselBoyutu.HasValue)
            throw new IsKuraliException("Görsel boyutları okunamadı veya görsel dosyası geçersiz.");

        var (genislik, yukseklik) = gorselBoyutu.Value;

        if (genislik <= 0 || yukseklik <= 0)
            throw new IsKuraliException("Görsel boyutları geçersizdir.");

        if (genislik > _dosyaAyarlari.MaksimumGenislik)
            throw new IsKuraliException($"Görsel genişliği en fazla {_dosyaAyarlari.MaksimumGenislik} piksel olabilir.");

        if (yukseklik > _dosyaAyarlari.MaksimumYukseklik)
            throw new IsKuraliException($"Görsel yüksekliği en fazla {_dosyaAyarlari.MaksimumYukseklik} piksel olabilir.");

        var toplamPikselSayisi = (long)genislik * yukseklik;

        if (toplamPikselSayisi > _dosyaAyarlari.MaksimumPikselSayisi)
            throw new IsKuraliException($"Görsel toplamda en fazla {_dosyaAyarlari.MaksimumPikselSayisi:N0} piksel içerebilir.");

        var kokDizin = Path.GetFullPath(_dosyaAyarlari.KokDizin);
        var tamHedefKlasor = GuvenliKlasorYoluOlustur(kokDizin, hedefKlasor);

        Directory.CreateDirectory(tamHedefKlasor);

        var yeniDosyaAdi = $"{Guid.NewGuid():N}{uzanti}";
        var tamDosyaYolu = Path.Combine(tamHedefKlasor, yeniDosyaAdi);

        try
        {
            await using (var dosyaAkisi = new FileStream(
                             tamDosyaYolu,
                             FileMode.CreateNew,
                             FileAccess.Write,
                             FileShare.None,
                             81920,
                             true))
            {
                await dosyaAkisi.WriteAsync(dosyaVerisi, cancellationToken);
            }
        }
        catch
        {
            if (File.Exists(tamDosyaYolu))
            {
                try
                {
                    File.Delete(tamDosyaYolu);
                }
                catch
                {
                    // Asıl hatayı gölgelememek için burada yeni hata üretilmez.
                }
            }

            throw;
        }

        var goreliKlasor = hedefKlasor.Replace('\\', '/').Trim('/');
        var goreliDosyaYolu = $"/{goreliKlasor}/{yeniDosyaAdi}";

        return new DosyaYuklemeSonucDto
        {
            DosyaAdi = yeniDosyaAdi,
            DosyaYolu = goreliDosyaYolu
        };
    }

    private void AyarlariDogrula()
    {
        if (string.IsNullOrWhiteSpace(_dosyaAyarlari.KokDizin))
            throw new InvalidOperationException("Dosya kök dizini tanımlanmamıştır.");

        if (_dosyaAyarlari.MaksimumDosyaBoyutu <= 0)
            throw new InvalidOperationException("Maksimum dosya boyutu tanımlanmamıştır.");

        if (_dosyaAyarlari.MaksimumGenislik <= 0)
            throw new InvalidOperationException("Maksimum görsel genişliği tanımlanmamıştır.");

        if (_dosyaAyarlari.MaksimumYukseklik <= 0)
            throw new InvalidOperationException("Maksimum görsel yüksekliği tanımlanmamıştır.");

        if (_dosyaAyarlari.MaksimumPikselSayisi <= 0)
            throw new InvalidOperationException("Maksimum görsel piksel sayısı tanımlanmamıştır.");

        if (_dosyaAyarlari.IzinVerilenUzantilar.Length == 0)
            throw new InvalidOperationException("İzin verilen dosya uzantıları tanımlanmamıştır.");

        if (_dosyaAyarlari.IzinVerilenIcerikTurleri.Length == 0)
            throw new InvalidOperationException("İzin verilen içerik türleri tanımlanmamıştır.");

        if (string.IsNullOrWhiteSpace(_dosyaAyarlari.UrunGorselleriKlasoru))
            throw new InvalidOperationException("Ürün görselleri klasörü tanımlanmamıştır.");

        if (string.IsNullOrWhiteSpace(_dosyaAyarlari.KategoriGorselleriKlasoru))
            throw new InvalidOperationException("Kategori görselleri klasörü tanımlanmamıştır.");
    }

    private bool IzinVerilenKlasorAltindaMi(string tamDosyaYolu, string kokDizin)
    {
        var urunKlasoru = GuvenliKlasorYoluOlustur(
            kokDizin,
            _dosyaAyarlari.UrunGorselleriKlasoru);

        var kategoriKlasoru = GuvenliKlasorYoluOlustur(
            kokDizin,
            _dosyaAyarlari.KategoriGorselleriKlasoru);

        return KokDizinAltindaMi(tamDosyaYolu, urunKlasoru) ||
               KokDizinAltindaMi(tamDosyaYolu, kategoriKlasoru);
    }

    private static string GuvenliKlasorYoluOlustur(string kokDizin, string goreliKlasor)
    {
        var temizKlasor = goreliKlasor
            .Replace('/', Path.DirectorySeparatorChar)
            .TrimStart(Path.DirectorySeparatorChar);

        var tamKlasorYolu = Path.GetFullPath(
            Path.Combine(kokDizin, temizKlasor));

        if (!KokDizinAltindaMi(tamKlasorYolu, kokDizin))
            throw new InvalidOperationException("Geçersiz hedef klasör yolu.");

        return tamKlasorYolu;
    }

    private static bool KokDizinAltindaMi(string tamYol, string kokDizin)
    {
        var duzenlenmisKokDizin = Path
            .GetFullPath(kokDizin)
            .TrimEnd(Path.DirectorySeparatorChar) + Path.DirectorySeparatorChar;

        var duzenlenmisTamYol = Path.GetFullPath(tamYol);

        return duzenlenmisTamYol.StartsWith(
            duzenlenmisKokDizin,
            StringComparison.OrdinalIgnoreCase);
    }

    private static bool IcerikTuruUzantiIleUyumluMu(string uzanti, string icerikTuru)
    {
        return uzanti switch
        {
            ".jpg" or ".jpeg" => icerikTuru.Equals("image/jpeg", StringComparison.OrdinalIgnoreCase),
            ".png" => icerikTuru.Equals("image/png", StringComparison.OrdinalIgnoreCase),
            ".webp" => icerikTuru.Equals("image/webp", StringComparison.OrdinalIgnoreCase),
            _ => false
        };
    }

    private static bool DosyaImzasiGecerliMi(byte[] veri, string uzanti)
    {
        return uzanti switch
        {
            ".jpg" or ".jpeg" => JpegMi(veri),
            ".png" => PngMi(veri),
            ".webp" => WebpMi(veri),
            _ => false
        };
    }

    private static (int Genislik, int Yukseklik)? GorselBoyutlariniGetir(byte[] veri, string uzanti)
    {
        return uzanti switch
        {
            ".jpg" or ".jpeg" => JpegBoyutlariniGetir(veri),
            ".png" => PngBoyutlariniGetir(veri),
            ".webp" => WebpBoyutlariniGetir(veri),
            _ => null
        };
    }

    private static bool JpegMi(byte[] veri)
    {
        return veri.Length >= 3 &&
               veri[0] == 0xFF &&
               veri[1] == 0xD8 &&
               veri[2] == 0xFF;
    }

    private static bool PngMi(byte[] veri)
    {
        byte[] imza =
        [
            0x89,
            0x50,
            0x4E,
            0x47,
            0x0D,
            0x0A,
            0x1A,
            0x0A
        ];

        return veri.Length >= imza.Length &&
               veri.Take(imza.Length).SequenceEqual(imza);
    }

    private static bool WebpMi(byte[] veri)
    {
        return veri.Length >= 12 &&
               veri[0] == 0x52 &&
               veri[1] == 0x49 &&
               veri[2] == 0x46 &&
               veri[3] == 0x46 &&
               veri[8] == 0x57 &&
               veri[9] == 0x45 &&
               veri[10] == 0x42 &&
               veri[11] == 0x50;
    }

    private static (int Genislik, int Yukseklik)? PngBoyutlariniGetir(byte[] veri)
    {
        if (!PngMi(veri) || veri.Length < 24)
            return null;

        if (veri[12] != 0x49 ||
            veri[13] != 0x48 ||
            veri[14] != 0x44 ||
            veri[15] != 0x52)
        {
            return null;
        }

        var genislik = BuyukEndianInt32Oku(veri, 16);
        var yukseklik = BuyukEndianInt32Oku(veri, 20);

        if (genislik <= 0 || yukseklik <= 0)
            return null;

        return (genislik, yukseklik);
    }

    private static (int Genislik, int Yukseklik)? JpegBoyutlariniGetir(byte[] veri)
    {
        if (!JpegMi(veri) || veri.Length < 10)
            return null;

        var konum = 2;

        while (konum < veri.Length)
        {
            if (veri[konum] != 0xFF)
            {
                konum++;
                continue;
            }

            while (konum < veri.Length && veri[konum] == 0xFF)
                konum++;

            if (konum >= veri.Length)
                break;

            var isaretci = veri[konum];
            konum++;

            if (isaretci == 0xD8 ||
                isaretci == 0xD9 ||
                isaretci == 0x01 ||
                (isaretci >= 0xD0 && isaretci <= 0xD7))
            {
                continue;
            }

            if (konum + 1 >= veri.Length)
                return null;

            var segmentUzunlugu = (veri[konum] << 8) | veri[konum + 1];

            if (segmentUzunlugu < 2)
                return null;

            if (SofIsaretcisiMi(isaretci))
            {
                if (segmentUzunlugu < 7 || konum + 6 >= veri.Length)
                    return null;

                var yukseklik = (veri[konum + 3] << 8) | veri[konum + 4];
                var genislik = (veri[konum + 5] << 8) | veri[konum + 6];

                if (genislik <= 0 || yukseklik <= 0)
                    return null;

                return (genislik, yukseklik);
            }

            if (segmentUzunlugu > veri.Length - konum)
                return null;

            konum += segmentUzunlugu;
        }

        return null;
    }

    private static bool SofIsaretcisiMi(byte isaretci)
    {
        return isaretci is
            0xC0 or
            0xC1 or
            0xC2 or
            0xC3 or
            0xC5 or
            0xC6 or
            0xC7 or
            0xC9 or
            0xCA or
            0xCB or
            0xCD or
            0xCE or
            0xCF;
    }

    private static (int Genislik, int Yukseklik)? WebpBoyutlariniGetir(byte[] veri)
    {
        if (!WebpMi(veri) || veri.Length < 20)
            return null;

        var konum = 12;

        while (konum + 8 <= veri.Length)
        {
            var parcaTuru = System.Text.Encoding.ASCII.GetString(veri, konum, 4);
            var parcaBoyutu = KucukEndianUInt32Oku(veri, konum + 4);

            var veriBaslangici = konum + 8;

            if (parcaBoyutu > int.MaxValue)
                return null;

            var parcaBoyutuInt = (int)parcaBoyutu;

            if (parcaBoyutuInt > veri.Length - veriBaslangici)
                return null;

            switch (parcaTuru)
            {
                case "VP8X":
                    if (parcaBoyutuInt < 10)
                        return null;

                    var vp8xGenislik =
                        1 +
                        veri[veriBaslangici + 4] +
                        (veri[veriBaslangici + 5] << 8) +
                        (veri[veriBaslangici + 6] << 16);

                    var vp8xYukseklik =
                        1 +
                        veri[veriBaslangici + 7] +
                        (veri[veriBaslangici + 8] << 8) +
                        (veri[veriBaslangici + 9] << 16);

                    return (vp8xGenislik, vp8xYukseklik);

                case "VP8L":
                    if (parcaBoyutuInt < 5 ||
                        veri[veriBaslangici] != 0x2F)
                    {
                        return null;
                    }

                    var vp8lB1 = veri[veriBaslangici + 1];
                    var vp8lB2 = veri[veriBaslangici + 2];
                    var vp8lB3 = veri[veriBaslangici + 3];
                    var vp8lB4 = veri[veriBaslangici + 4];

                    var vp8lGenislik =
                        1 + (((vp8lB2 & 0x3F) << 8) | vp8lB1);

                    var vp8lYukseklik =
                        1 +
                        (((vp8lB4 & 0x0F) << 10) |
                         (vp8lB3 << 2) |
                         ((vp8lB2 & 0xC0) >> 6));

                    return (vp8lGenislik, vp8lYukseklik);

                case "VP8 ":
                    if (parcaBoyutuInt < 10)
                        return null;

                    if (veri[veriBaslangici + 3] != 0x9D ||
                        veri[veriBaslangici + 4] != 0x01 ||
                        veri[veriBaslangici + 5] != 0x2A)
                    {
                        return null;
                    }

                    var vp8Genislik =
                        (veri[veriBaslangici + 6] |
                         (veri[veriBaslangici + 7] << 8)) & 0x3FFF;

                    var vp8Yukseklik =
                        (veri[veriBaslangici + 8] |
                         (veri[veriBaslangici + 9] << 8)) & 0x3FFF;

                    if (vp8Genislik <= 0 || vp8Yukseklik <= 0)
                        return null;

                    return (vp8Genislik, vp8Yukseklik);
            }

            var sonrakiKonum = (long)veriBaslangici + parcaBoyutuInt;

            if ((parcaBoyutuInt & 1) != 0)
                sonrakiKonum++;

            if (sonrakiKonum > veri.Length)
                return null;

            konum = (int)sonrakiKonum;
        }

        return null;
    }

    private static int BuyukEndianInt32Oku(byte[] veri, int baslangic)
    {
        if (baslangic < 0 || baslangic > veri.Length - 4)
            return -1;

        var deger =
            ((uint)veri[baslangic] << 24) |
            ((uint)veri[baslangic + 1] << 16) |
            ((uint)veri[baslangic + 2] << 8) |
            veri[baslangic + 3];

        return deger > int.MaxValue
            ? -1
            : (int)deger;
    }

    private static uint KucukEndianUInt32Oku(byte[] veri, int baslangic)
    {
        if (baslangic < 0 || baslangic > veri.Length - 4)
            return uint.MaxValue;

        return
            veri[baslangic] |
            ((uint)veri[baslangic + 1] << 8) |
            ((uint)veri[baslangic + 2] << 16) |
            ((uint)veri[baslangic + 3] << 24);
    }
}