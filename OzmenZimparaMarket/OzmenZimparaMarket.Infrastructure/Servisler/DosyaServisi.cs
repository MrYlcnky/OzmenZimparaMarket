using Microsoft.Extensions.Options;
using OzmenZimparaMarket.Application.DTOs.DosyaDtos;
using OzmenZimparaMarket.Application.Interfaces;
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

    public Task<DosyaYuklemeSonucDto> KategoriGorseliYukleAsync(DosyaYukleDto dto, CancellationToken cancellationToken = default)
    {
        return YukleAsync(dto, _dosyaAyarlari.KategoriGorselleriKlasoru, cancellationToken);
    }

    public Task SilAsync(string dosyaYolu, CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();

        if (string.IsNullOrWhiteSpace(dosyaYolu)) throw new ArgumentException("Silinecek dosya yolu boş olamaz.", nameof(dosyaYolu));

        AyarlariDogrula();

        var temizDosyaYolu = dosyaYolu.Split('?', '#')[0].Replace('/', Path.DirectorySeparatorChar).TrimStart(Path.DirectorySeparatorChar);
        var kokDizin = Path.GetFullPath(_dosyaAyarlari.KokDizin);
        var tamDosyaYolu = Path.GetFullPath(Path.Combine(kokDizin, temizDosyaYolu));

        if (!KokDizinAltindaMi(tamDosyaYolu, kokDizin)) throw new InvalidOperationException("Geçersiz dosya yolu.");
        if (!IzinVerilenKlasorAltindaMi(tamDosyaYolu, kokDizin)) throw new InvalidOperationException("Bu dizindeki dosyalar silinemez.");

        if (File.Exists(tamDosyaYolu)) File.Delete(tamDosyaYolu);

        return Task.CompletedTask;
    }

    private async Task<DosyaYuklemeSonucDto> YukleAsync(DosyaYukleDto dto, string hedefKlasor, CancellationToken cancellationToken)
    {
        AyarlariDogrula();

        var guvenliDosyaAdi = Path.GetFileName(dto.DosyaAdi);
        var uzanti = Path.GetExtension(guvenliDosyaAdi).ToLowerInvariant();

        if (!_dosyaAyarlari.IzinVerilenUzantilar.Contains(uzanti, StringComparer.OrdinalIgnoreCase)) throw new InvalidOperationException("Dosya uzantısı desteklenmiyor.");
        if (!_dosyaAyarlari.IzinVerilenIcerikTurleri.Contains(dto.IcerikTuru, StringComparer.OrdinalIgnoreCase)) throw new InvalidOperationException("Dosya içerik türü desteklenmiyor.");
        if (dto.DosyaBoyutu <= 0 || dto.DosyaBoyutu > _dosyaAyarlari.MaksimumDosyaBoyutu) throw new InvalidOperationException("Dosya boyutu geçersizdir.");
        if (dto.DosyaAkisi == Stream.Null || !dto.DosyaAkisi.CanRead) throw new InvalidOperationException("Dosya içeriği okunamıyor.");

        await using var bellekAkisi = new MemoryStream();

        if (dto.DosyaAkisi.CanSeek) dto.DosyaAkisi.Position = 0;

        await dto.DosyaAkisi.CopyToAsync(bellekAkisi, cancellationToken);

        if (bellekAkisi.Length <= 0) throw new InvalidOperationException("Boş dosya yüklenemez.");
        if (bellekAkisi.Length > _dosyaAyarlari.MaksimumDosyaBoyutu) throw new InvalidOperationException("Dosya boyutu izin verilen sınırı aşıyor.");
        if (bellekAkisi.Length != dto.DosyaBoyutu) throw new InvalidOperationException("Dosya boyutu bilgisi gerçek dosya boyutuyla eşleşmiyor.");

        var dosyaVerisi = bellekAkisi.ToArray();

        if (!DosyaImzasiGecerliMi(dosyaVerisi, uzanti)) throw new InvalidOperationException("Dosya içeriği belirtilen görsel türüyle eşleşmiyor.");

        var kokDizin = Path.GetFullPath(_dosyaAyarlari.KokDizin);
        var tamHedefKlasor = GuvenliKlasorYoluOlustur(kokDizin, hedefKlasor);

        Directory.CreateDirectory(tamHedefKlasor);

        var yeniDosyaAdi = $"{Guid.NewGuid():N}{uzanti}";
        var tamDosyaYolu = Path.Combine(tamHedefKlasor, yeniDosyaAdi);

        await using var dosyaAkisi = new FileStream(tamDosyaYolu, FileMode.CreateNew, FileAccess.Write, FileShare.None, 81920, true);
        await dosyaAkisi.WriteAsync(dosyaVerisi, cancellationToken);

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
        if (string.IsNullOrWhiteSpace(_dosyaAyarlari.KokDizin)) throw new InvalidOperationException("Dosya kök dizini tanımlanmamıştır.");
        if (_dosyaAyarlari.MaksimumDosyaBoyutu <= 0) throw new InvalidOperationException("Maksimum dosya boyutu tanımlanmamıştır.");
        if (_dosyaAyarlari.IzinVerilenUzantilar.Length == 0) throw new InvalidOperationException("İzin verilen dosya uzantıları tanımlanmamıştır.");
        if (_dosyaAyarlari.IzinVerilenIcerikTurleri.Length == 0) throw new InvalidOperationException("İzin verilen içerik türleri tanımlanmamıştır.");
        if (string.IsNullOrWhiteSpace(_dosyaAyarlari.UrunGorselleriKlasoru)) throw new InvalidOperationException("Ürün görselleri klasörü tanımlanmamıştır.");
        if (string.IsNullOrWhiteSpace(_dosyaAyarlari.KategoriGorselleriKlasoru)) throw new InvalidOperationException("Kategori görselleri klasörü tanımlanmamıştır.");
    }

    private bool IzinVerilenKlasorAltindaMi(string tamDosyaYolu, string kokDizin)
    {
        var urunKlasoru = GuvenliKlasorYoluOlustur(kokDizin, _dosyaAyarlari.UrunGorselleriKlasoru);
        var kategoriKlasoru = GuvenliKlasorYoluOlustur(kokDizin, _dosyaAyarlari.KategoriGorselleriKlasoru);

        return KokDizinAltindaMi(tamDosyaYolu, urunKlasoru) || KokDizinAltindaMi(tamDosyaYolu, kategoriKlasoru);
    }

    private static string GuvenliKlasorYoluOlustur(string kokDizin, string goreliKlasor)
    {
        var temizKlasor = goreliKlasor.Replace('/', Path.DirectorySeparatorChar).TrimStart(Path.DirectorySeparatorChar);
        var tamKlasorYolu = Path.GetFullPath(Path.Combine(kokDizin, temizKlasor));

        if (!KokDizinAltindaMi(tamKlasorYolu, kokDizin)) throw new InvalidOperationException("Geçersiz hedef klasör yolu.");

        return tamKlasorYolu;
    }

    private static bool KokDizinAltindaMi(string tamYol, string kokDizin)
    {
        var duzenlenmisKokDizin = Path.GetFullPath(kokDizin).TrimEnd(Path.DirectorySeparatorChar) + Path.DirectorySeparatorChar;
        var duzenlenmisTamYol = Path.GetFullPath(tamYol);

        return duzenlenmisTamYol.StartsWith(duzenlenmisKokDizin, StringComparison.OrdinalIgnoreCase);
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

    private static bool JpegMi(byte[] veri)
    {
        return veri.Length >= 3 && veri[0] == 0xFF && veri[1] == 0xD8 && veri[2] == 0xFF;
    }

    private static bool PngMi(byte[] veri)
    {
        byte[] imza = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];

        return veri.Length >= imza.Length && veri.Take(imza.Length).SequenceEqual(imza);
    }

    private static bool WebpMi(byte[] veri)
    {
        return veri.Length >= 12 &&
               veri[0] == 0x52 && veri[1] == 0x49 && veri[2] == 0x46 && veri[3] == 0x46 &&
               veri[8] == 0x57 && veri[9] == 0x45 && veri[10] == 0x42 && veri[11] == 0x50;
    }
}