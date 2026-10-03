import { useState } from "react";

import { toast } from "react-toastify";

import {
  urunExcelDosyasiniAktar,
  urunExcelDosyasiniAnalizEt,
  urunExcelSablonunuIndir,
  urunleriExcelDisariAktar,
} from "../../api/servisler/excelServisi";

import UrunDetayModal from "../../components/yonetim/urunler/UrunDetayModal";
import UrunExcelImportModal from "../../components/yonetim/urunler/UrunExcelImportModal";
import UrunFormModal from "../../components/yonetim/urunler/UrunFormModal";
import UrunListesi from "../../components/yonetim/urunler/UrunListesi";
import UrunSayfaBasligi from "../../components/yonetim/urunler/UrunSayfaBasligi";
import UrunSilModal from "../../components/yonetim/urunler/UrunSilModal";
import UrunTopluSilModal from "../../components/yonetim/urunler/UrunTopluSilModal";

import useUrunFormSecenekleri from "../../components/yonetim/urunler/useUrunFormSecenekleri";
import useUrunFormu from "../../components/yonetim/urunler/useUrunFormu";
import useUrunYonetimi from "../../components/yonetim/urunler/useUrunYonetimi";

function UrunYonetimiSayfasi() {
  const [excelSablonIndiriliyorMu, setExcelSablonIndiriliyorMu] =
    useState(false);

  const [excelDisariAktariliyorMu, setExcelDisariAktariliyorMu] =
    useState(false);

  const [excelImportModalAcikMi, setExcelImportModalAcikMi] = useState(false);

  const [excelDosyasi, setExcelDosyasi] = useState(null);

  const [excelAnalizSonucu, setExcelAnalizSonucu] = useState(null);

  const [excelAnalizEdiliyorMu, setExcelAnalizEdiliyorMu] = useState(false);

  const [excelAktariliyorMu, setExcelAktariliyorMu] = useState(false);

  const {
    urunler,
    filtreler,
    sayfalama,

    yukleniyorMu,
    siliniyorMu,
    silinecekUrun,
    durumDegistirilenUrunId,
    oneCikanDegistirilenUrunId,

    seciliUrunIdleri,
    seciliUrunler,

    topluSilmeModalAcik,
    topluSilmeDevamEdiyor,

    filtreDegistir,
    filtreleriTemizle,

    sayfaDegistir,
    sayfaBoyutuDegistir,

    urunDurumunuDegistir,
    urunOneCikanDurumunuDegistir,
    silmeModaliniAc,
    silmeModaliniKapat,
    urunuSil,

    urunSecimleriDegisti,

    topluSilmeModaliniAc,
    topluSilmeModaliniKapat,
    urunleriTopluSil,

    urunleriYukle,
  } = useUrunYonetimi();

  const {
    kategoriler,
    urunDetayTanimlari,

    kategorilerYukleniyorMu,
    urunDetayTanimlariYukleniyorMu,

    urunDetayTanimlariniYukle,
  } = useUrunFormSecenekleri();

  const {
    formModalAcikMi,
    detayModalAcikMi,

    formModu,

    form,
    formHatalari,

    formYukleniyorMu,
    kaydediliyorMu,

    detayUrun,
    detayYukleniyorMu,

    yeniUrunModaliniAc,
    formModaliniKapat,

    urunDuzenlemeModaliniAc,

    urunDetayModaliniAc,
    detayModaliniKapat,

    formAlaniniDegistir,

    teknikDetayEkle,
    teknikDetayDegistir,
    teknikDetaySil,

    urunuKaydet,
  } = useUrunFormu({
    urunDetayTanimlari,

    onKaydedildi: urunleriYukle,
  });

  async function excelSablonunuIndir() {
    if (excelSablonIndiriliyorMu) {
      return;
    }

    try {
      setExcelSablonIndiriliyorMu(true);

      await urunExcelSablonunuIndir();

      toast.success("Ürün Excel şablonu indirildi.");
    } catch (error) {
      console.error("Ürün Excel şablonu indirilemedi:", error);

      const mesaj = hataMesajiGetir(
        error,
        "Ürün Excel şablonu indirilirken bir hata oluştu.",
      );

      toast.error(mesaj);
    } finally {
      setExcelSablonIndiriliyorMu(false);
    }
  }

  async function urunleriExcelDisariAktarHandler() {
    if (excelDisariAktariliyorMu) {
      return;
    }

    try {
      setExcelDisariAktariliyorMu(true);

      await urunleriExcelDisariAktar();

      toast.success("Ürünler Excel dosyasına aktarıldı.");
    } catch (error) {
      console.error("Ürünler Excel'e aktarılamadı:", error);

      const mesaj = hataMesajiGetir(
        error,
        "Ürünler Excel'e aktarılırken bir hata oluştu.",
      );

      toast.error(mesaj);
    } finally {
      setExcelDisariAktariliyorMu(false);
    }
  }

  function excelIceAktarModaliniAc() {
    if (excelAnalizEdiliyorMu || excelAktariliyorMu) {
      return;
    }

    setExcelDosyasi(null);

    setExcelAnalizSonucu(null);

    setExcelImportModalAcikMi(true);
  }

  function excelImportModaliniKapat() {
    if (excelAnalizEdiliyorMu || excelAktariliyorMu) {
      return;
    }

    setExcelImportModalAcikMi(false);

    setExcelDosyasi(null);

    setExcelAnalizSonucu(null);
  }

  function excelImportModaliniBasariylaKapat() {
    setExcelImportModalAcikMi(false);

    setExcelDosyasi(null);

    setExcelAnalizSonucu(null);
  }

  function excelDosyasiDegisti(dosya) {
    if (!dosya || excelAnalizEdiliyorMu || excelAktariliyorMu) {
      return;
    }

    const dosyaAdi = String(dosya.name ?? "").trim();

    const sonNoktaIndex = dosyaAdi.lastIndexOf(".");

    const uzanti =
      sonNoktaIndex >= 0 ? dosyaAdi.slice(sonNoktaIndex + 1).toLowerCase() : "";

    if (uzanti !== "xlsx") {
      toast.warning("Yalnızca .xlsx uzantılı Excel dosyaları kullanılabilir.");

      return;
    }

    setExcelDosyasi(dosya);

    setExcelAnalizSonucu(null);
  }

  async function excelDosyasiniAnalizEt() {
    if (!excelDosyasi) {
      toast.warning("Lütfen analiz edilecek ürün Excel dosyasını seçin.");

      return;
    }

    if (excelAnalizEdiliyorMu || excelAktariliyorMu) {
      return;
    }

    try {
      setExcelAnalizEdiliyorMu(true);

      setExcelAnalizSonucu(null);

      const sonuc = await urunExcelDosyasiniAnalizEt(excelDosyasi);

      setExcelAnalizSonucu(sonuc);

      const hataliSatirSayisi = Number(sonuc?.hataliSatirSayisi) || 0;

      const yeniUrunSayisi = Number(sonuc?.olusturulacakUrunSayisi) || 0;

      const mevcutUrunSayisi = Number(sonuc?.mevcutUrunSayisi) || 0;

      if (hataliSatirSayisi > 0) {
        toast.warning(
          `${hataliSatirSayisi} ürün satırında düzeltilmesi gereken hata bulundu.`,
        );

        return;
      }

      if (yeniUrunSayisi === 0) {
        if (mevcutUrunSayisi > 0) {
          toast.info(
            "Excel dosyasındaki ürünlerin tamamı sistemde zaten mevcut.",
          );
        } else {
          toast.info("Excel dosyasında içe aktarılacak yeni ürün bulunmuyor.");
        }

        return;
      }

      toast.success(`${yeniUrunSayisi} yeni ürün içe aktarmaya hazır.`);
    } catch (error) {
      console.error("Ürün Excel dosyası analiz edilemedi:", error);

      const mesaj = hataMesajiGetir(
        error,
        "Ürün Excel dosyası analiz edilirken bir hata oluştu.",
      );

      toast.error(mesaj);
    } finally {
      setExcelAnalizEdiliyorMu(false);
    }
  }

  async function excelAktariminiBaslat() {
    if (!excelDosyasi || !excelAnalizSonucu?.aktarimaHazirMi) {
      return;
    }

    if (excelAktariliyorMu || excelAnalizEdiliyorMu) {
      return;
    }

    try {
      setExcelAktariliyorMu(true);

      const sonuc = await urunExcelDosyasiniAktar(excelDosyasi);

      const eklenenUrunSayisi = Number(sonuc?.eklenenUrunSayisi) || 0;

      const mevcutUrunSayisi = Number(sonuc?.mevcutUrunSayisi) || 0;

      const eklenenTeknikDetaySayisi =
        Number(sonuc?.eklenenTeknikDetaySayisi) || 0;

      let mesaj = `${eklenenUrunSayisi} ürün başarıyla içe aktarıldı.`;

      if (eklenenTeknikDetaySayisi > 0) {
        mesaj += ` ${eklenenTeknikDetaySayisi} teknik özellik değeri eklendi.`;
      }

      if (mevcutUrunSayisi > 0) {
        mesaj += ` ${mevcutUrunSayisi} mevcut ürün değişiklik yapılmadan atlandı.`;
      }

      excelImportModaliniBasariylaKapat();

      try {
        await urunleriYukle();
      } catch (listeHatasi) {
        console.error(
          "Ürün aktarımı tamamlandı ancak ürün listesi yenilenemedi:",
          listeHatasi,
        );

        toast.warning(`${mesaj} Ancak ürün listesi otomatik yenilenemedi.`);

        return;
      }

      toast.success(mesaj);
    } catch (error) {
      console.error("Ürün Excel aktarımı başarısız:", error);

      const mesaj = hataMesajiGetir(
        error,
        "Ürünler Excel dosyasından içe aktarılırken bir hata oluştu.",
      );

      toast.error(mesaj);
    } finally {
      setExcelAktariliyorMu(false);
    }
  }

  async function yeniUrunFormunuAc() {
    try {
      await urunDetayTanimlariniYukle();

      await yeniUrunModaliniAc();
    } catch {
      /*
       * Hata mesajı
       * useUrunFormSecenekleri içinde
       * zaten gösteriliyor.
       */
    }
  }

  async function urunDuzenlemeFormunuAc(urun) {
    if (!urun?.id) {
      return;
    }

    try {
      await urunDetayTanimlariniYukle();

      await urunDuzenlemeModaliniAc(urun);
    } catch {
      /*
       * Ürün özellikleri
       * yüklenemezse düzenleme
       * formunu açmıyoruz.
       */
    }
  }

  async function detaydanDuzenlemeyeGec() {
    if (!detayUrun?.id) {
      return;
    }

    const urun = detayUrun;

    try {
      await urunDetayTanimlariniYukle();

      detayModaliniKapat();

      await urunDuzenlemeModaliniAc(urun);
    } catch {
      /*
       * Ürün özellikleri
       * yüklenemezse detay
       * ekranını kapatmıyoruz.
       */
    }
  }

  const formLoading =
    formYukleniyorMu ||
    kategorilerYukleniyorMu ||
    urunDetayTanimlariYukleniyorMu;

  return (
    <div className="min-h-full bg-surface-soft">
      <UrunSayfaBasligi
        onYeniUrun={yeniUrunFormunuAc}
        onExcelSablonIndir={excelSablonunuIndir}
        onExcelDisariAktar={urunleriExcelDisariAktarHandler}
        onExcelIceAktar={excelIceAktarModaliniAc}
        excelSablonIndiriliyorMu={excelSablonIndiriliyorMu}
        excelDisariAktariliyorMu={excelDisariAktariliyorMu}
      />

      <div
        className="
          px-6
          py-6

          lg:px-8
        "
      >
        <UrunListesi
          urunler={urunler}
          filtreler={filtreler}
          sayfalama={sayfalama}
          kategoriSecenekleri={kategoriler}
          yukleniyorMu={yukleniyorMu}
          durumDegistirilenUrunId={durumDegistirilenUrunId}
          seciliUrunIdleri={seciliUrunIdleri}
          topluSilmeDevamEdiyor={topluSilmeDevamEdiyor}
          filtreDegistir={filtreDegistir}
          filtreleriTemizle={filtreleriTemizle}
          sayfaDegistir={sayfaDegistir}
          sayfaBoyutuDegistir={sayfaBoyutuDegistir}
          urunDurumunuDegistir={urunDurumunuDegistir}
          urunSecimleriDegisti={urunSecimleriDegisti}
          topluSilmeModaliniAc={topluSilmeModaliniAc}
          onUrunDetay={urunDetayModaliniAc}
          onUrunDuzenle={urunDuzenlemeFormunuAc}
          silmeModaliniAc={silmeModaliniAc}
          oneCikanDegistirilenUrunId={oneCikanDegistirilenUrunId}
          urunOneCikanDurumunuDegistir={urunOneCikanDurumunuDegistir}
        />
      </div>

      <UrunFormModal
        open={formModalAcikMi}
        mode={formModu}
        form={form}
        formHatalari={formHatalari}
        kategoriSecenekleri={kategoriler}
        urunDetayTanimlari={urunDetayTanimlari}
        loading={formLoading}
        saving={kaydediliyorMu}
        onClose={formModaliniKapat}
        onFieldChange={formAlaniniDegistir}
        onTeknikDetayEkle={teknikDetayEkle}
        onTeknikDetayDegistir={teknikDetayDegistir}
        onTeknikDetaySil={teknikDetaySil}
        onSave={urunuKaydet}
      />

      <UrunDetayModal
        open={detayModalAcikMi}
        urun={detayUrun}
        loading={detayYukleniyorMu}
        onClose={detayModaliniKapat}
        onEdit={detaydanDuzenlemeyeGec}
      />

      <UrunSilModal
        open={Boolean(silinecekUrun)}
        urun={silinecekUrun}
        loading={siliniyorMu}
        onClose={silmeModaliniKapat}
        onConfirm={urunuSil}
      />

      <UrunTopluSilModal
        open={topluSilmeModalAcik}
        urunler={seciliUrunler}
        onClose={topluSilmeModaliniKapat}
        onConfirm={urunleriTopluSil}
        islemDevamEdiyor={topluSilmeDevamEdiyor}
      />

      <UrunExcelImportModal
        open={excelImportModalAcikMi}
        onClose={excelImportModaliniKapat}
        dosya={excelDosyasi}
        onDosyaDegistir={excelDosyasiDegisti}
        analizSonucu={excelAnalizSonucu}
        analizEdiliyorMu={excelAnalizEdiliyorMu}
        aktariliyorMu={excelAktariliyorMu}
        onAnalizEt={excelDosyasiniAnalizEt}
        onIceAktar={excelAktariminiBaslat}
      />
    </div>
  );
}

function hataMesajiGetir(error, varsayilanMesaj) {
  return (
    error?.response?.data?.mesaj ||
    error?.response?.data?.title ||
    varsayilanMesaj
  );
}

export default UrunYonetimiSayfasi;
