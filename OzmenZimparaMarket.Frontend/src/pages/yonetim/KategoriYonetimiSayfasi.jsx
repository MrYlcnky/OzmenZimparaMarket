import { useState } from "react";

import { toast } from "react-toastify";

import {
  kategoriExcelDosyasiniAktar,
  kategoriExcelDosyasiniAnalizEt,
  kategoriExcelSablonunuIndir,
} from "../../api/servisler/excelServisi";

import ExcelImportModal from "../../components/yonetim/excel/ExcelImportModal";
import KategoriFormModal from "../../components/yonetim/kategoriler/KategoriFormModal";
import KategoriListesi from "../../components/yonetim/kategoriler/KategoriListesi";
import KategoriSayfaBasligi from "../../components/yonetim/kategoriler/KategoriSayfaBasligi";
import KategoriSilModal from "../../components/yonetim/kategoriler/KategoriSilModal";
import KategoriTopluSilModal from "../../components/yonetim/kategoriler/KategoriTopluSilModal";
import useKategoriYonetimi from "../../components/yonetim/kategoriler/useKategoriYonetimi";

import Container from "../../components/ui/Container";

function KategoriYonetimiSayfasi() {
  const yonetim = useKategoriYonetimi();

  const [excelSablonIndiriliyorMu, setExcelSablonIndiriliyorMu] =
    useState(false);

  const [excelImportModalAcikMi, setExcelImportModalAcikMi] = useState(false);

  const [excelDosyasi, setExcelDosyasi] = useState(null);

  const [excelAnalizSonucu, setExcelAnalizSonucu] = useState(null);

  const [excelAnalizEdiliyorMu, setExcelAnalizEdiliyorMu] = useState(false);

  const [excelAktariliyorMu, setExcelAktariliyorMu] = useState(false);

  async function excelSablonunuIndir() {
    if (excelSablonIndiriliyorMu) {
      return;
    }

    try {
      setExcelSablonIndiriliyorMu(true);

      await kategoriExcelSablonunuIndir();

      toast.success("Kategori Excel şablonu indirildi.");
    } catch (error) {
      console.error("Kategori Excel şablonu indirilemedi:", error);

      const mesaj = hataMesajiGetir(
        error,
        "Kategori Excel şablonu indirilirken bir hata oluştu.",
      );

      toast.error(mesaj);
    } finally {
      setExcelSablonIndiriliyorMu(false);
    }
  }

  function excelIceAktar() {
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

  function excelDosyasiDegisti(dosya) {
    if (!dosya) {
      return;
    }

    const uzanti = dosya.name?.split(".").pop()?.toLocaleLowerCase("tr-TR");

    if (uzanti !== "xlsx") {
      toast.warning("Yalnızca .xlsx uzantılı Excel dosyaları kullanılabilir.");

      return;
    }

    setExcelDosyasi(dosya);

    setExcelAnalizSonucu(null);
  }

  async function excelDosyasiniAnalizEt() {
    if (!excelDosyasi) {
      toast.warning("Lütfen analiz edilecek Excel dosyasını seçin.");

      return;
    }

    if (excelAnalizEdiliyorMu || excelAktariliyorMu) {
      return;
    }

    try {
      setExcelAnalizEdiliyorMu(true);

      setExcelAnalizSonucu(null);

      const sonuc = await kategoriExcelDosyasiniAnalizEt(excelDosyasi);

      setExcelAnalizSonucu(sonuc);

      if (Number(sonuc?.hataliSatirSayisi) > 0) {
        toast.warning(
          "Excel dosyasında düzeltilmesi gereken satırlar bulundu.",
        );

        return;
      }

      if (Number(sonuc?.olusturulacakKategoriSayisi) === 0) {
        toast.info(
          "Excel dosyasında içe aktarılacak yeni kategori bulunmuyor.",
        );

        return;
      }

      toast.success("Excel dosyası başarıyla analiz edildi.");
    } catch (error) {
      console.error("Kategori Excel dosyası analiz edilemedi:", error);

      const mesaj = hataMesajiGetir(
        error,
        "Excel dosyası analiz edilirken bir hata oluştu.",
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

      const sonuc = await kategoriExcelDosyasiniAktar(excelDosyasi);

      try {
        await yonetim.listeyiYenile();
      } catch (listeHatasi) {
        console.error(
          "Kategori aktarımı tamamlandı ancak liste yenilenemedi:",
          listeHatasi,
        );

        toast.warning(
          "Kategoriler başarıyla içe aktarıldı ancak kategori listesi yenilenemedi.",
        );

        setExcelImportModalAcikMi(false);

        setExcelDosyasi(null);

        setExcelAnalizSonucu(null);

        return;
      }

      const eklenenKategoriSayisi = Number(sonuc?.eklenenKategoriSayisi) || 0;

      const otomatikOlusturulanSayisi =
        Number(sonuc?.otomatikOlusturulanUstKategoriSayisi) || 0;

      if (otomatikOlusturulanSayisi > 0) {
        toast.success(
          `${eklenenKategoriSayisi} kategori başarıyla içe aktarıldı. ${otomatikOlusturulanSayisi} üst kategori otomatik oluşturuldu.`,
        );
      } else {
        toast.success(
          `${eklenenKategoriSayisi} kategori başarıyla içe aktarıldı.`,
        );
      }

      setExcelImportModalAcikMi(false);

      setExcelDosyasi(null);

      setExcelAnalizSonucu(null);
    } catch (error) {
      console.error("Kategori Excel aktarımı başarısız:", error);

      const mesaj = hataMesajiGetir(
        error,
        "Kategoriler Excel dosyasından içe aktarılırken bir hata oluştu.",
      );

      toast.error(mesaj);
    } finally {
      setExcelAktariliyorMu(false);
    }
  }

  return (
    <div
      className="
        min-h-[calc(100vh-76px)]
        bg-[#f7f8fb]
      "
    >
      <KategoriSayfaBasligi
        onYeniKategori={yonetim.yeniKategoriAc}
        onExcelSablonIndir={excelSablonunuIndir}
        onExcelIceAktar={excelIceAktar}
        excelSablonIndiriliyorMu={excelSablonIndiriliyorMu}
      />

      <Container>
        <div
          className="
            py-8
            lg:py-10
          "
        >
          <SayfaMesajlari
            hataMesaji={yonetim.sayfaHataMesaji}
            basariMesaji={yonetim.sayfaBasariMesaji}
          />

          {yonetim.yukleniyor ? (
            <KategoriListeLoading />
          ) : (
            <KategoriListesi
              kategoriler={yonetim.kategoriler}
              onDuzenle={yonetim.kategoriDuzenle}
              onDurumDegistir={yonetim.durumDegistir}
              onSil={yonetim.silmeModaliniAc}
              islemdekiKategoriId={yonetim.islemdekiKategoriId}
              seciliKategoriIdleri={yonetim.seciliKategoriIdleri}
              onSecimDegistir={yonetim.kategoriSecimleriDegisti}
              onTopluSil={yonetim.topluSilmeModaliniAc}
              topluSilmeDevamEdiyor={yonetim.topluSilmeDevamEdiyor}
            />
          )}
        </div>
      </Container>

      <KategoriFormModal
        open={yonetim.kategoriModalAcik}
        onClose={yonetim.kategoriModaliniKapat}
        duzenlenenKategoriId={yonetim.duzenlenenKategoriId}
        form={yonetim.form}
        kategoriler={yonetim.ustKategoriSecenekleri}
        onChange={yonetim.formDegisti}
        onSelectChange={yonetim.selectDegisti}
        onSubmit={yonetim.formuGonder}
        onGorselYukle={yonetim.gorselYukle}
        onGorselKaldir={yonetim.gorselKaldir}
        detayYukleniyor={yonetim.detayYukleniyor}
        kaydediliyor={yonetim.kaydediliyor}
        gorselYukleniyor={yonetim.gorselYukleniyor}
        hataMesaji={yonetim.hataMesaji}
        basariMesaji={yonetim.basariMesaji}
        alanHatalari={yonetim.alanHatalari}
        closeDisabled={yonetim.modalDevreDisi}
      />

      <KategoriSilModal
        open={Boolean(yonetim.silinecekKategori)}
        kategori={yonetim.silinecekKategori}
        onClose={yonetim.silmeModaliniKapat}
        onConfirm={yonetim.silmeyiOnayla}
        islemDevamEdiyor={yonetim.silmeIslemiDevamEdiyor}
      />

      <KategoriTopluSilModal
        open={yonetim.topluSilmeModalAcik}
        onClose={yonetim.topluSilmeModaliniKapat}
        kategoriler={yonetim.seciliKategoriler}
        onConfirm={yonetim.topluSilmeyiOnayla}
        islemDevamEdiyor={yonetim.topluSilmeDevamEdiyor}
      />

      <ExcelImportModal
        open={excelImportModalAcikMi}
        onClose={excelImportModaliniKapat}
        baslik="Excel'den Kategori İçe Aktar"
        eyebrow="Kategori Excel İşlemleri"
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

function SayfaMesajlari({ hataMesaji, basariMesaji }) {
  if (!hataMesaji && !basariMesaji) {
    return null;
  }

  return (
    <div
      className="
        mb-6
        space-y-3
      "
    >
      {hataMesaji && (
        <div
          role="alert"
          className="
            rounded-ui-lg
            border
            border-danger/20
            bg-danger/[0.06]
            px-4
            py-3
            text-sm
            text-danger
          "
        >
          {hataMesaji}
        </div>
      )}

      {basariMesaji && (
        <div
          role="status"
          className="
            rounded-ui-lg
            border
            border-success/20
            bg-success/[0.06]
            px-4
            py-3
            text-sm
            text-success
          "
        >
          {basariMesaji}
        </div>
      )}
    </div>
  );
}

function KategoriListeLoading() {
  return (
    <div
      className="
        flex
        min-h-[360px]
        items-center
        justify-center
        rounded-[18px]
        border
        border-border
        bg-white
      "
    >
      <div className="text-center">
        <div
          className="
            mx-auto
            h-9 w-9
            animate-spin
            rounded-full
            border-[3px]
            border-brand-blue/15
            border-t-brand-blue
          "
        />

        <p
          className="
            mt-4
            text-sm
            font-semibold
            text-text-muted
          "
        >
          Kategoriler yükleniyor...
        </p>
      </div>
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

export default KategoriYonetimiSayfasi;
