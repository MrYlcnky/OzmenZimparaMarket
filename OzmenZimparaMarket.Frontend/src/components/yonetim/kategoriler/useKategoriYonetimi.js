import { useEffect, useMemo, useState } from "react";

import { toast } from "react-toastify";

import {
  kategoriDetayGetir,
  kategoriDurumDegistir,
  kategoriEkle,
  kategoriGuncelle,
  kategoriSil,
  kategoriTopluSil,
  yonetimKategorileriniGetir,
} from "../../../api/servisler/kategoriServisi";

import { kategoriGorseliYukle } from "../../../api/servisler/dosyaServisi";

import { kategoriSchema } from "../../../schemas/kategoriSchema";

import {
  bosKategoriFormu,
  kategoriFormaDonustur,
  sonrakiSiraNoHesapla,
  ustKategoriSecenekleriniOlustur,
  zodHatalariniDonustur,
} from "./kategoriYardimcilari";

function useKategoriYonetimi() {
  const [kategoriler, setKategoriler] = useState([]);

  const [yukleniyor, setYukleniyor] = useState(true);

  const [kategoriModalAcik, setKategoriModalAcik] = useState(false);

  const [duzenlenenKategoriId, setDuzenlenenKategoriId] = useState(null);

  const [form, setForm] = useState({
    ...bosKategoriFormu,
  });

  const [detayYukleniyor, setDetayYukleniyor] = useState(false);

  const [kaydediliyor, setKaydediliyor] = useState(false);

  const [gorselYukleniyor, setGorselYukleniyor] = useState(false);

  const [alanHatalari, setAlanHatalari] = useState(null);

  const [hataMesaji, setHataMesaji] = useState("");

  const [basariMesaji, setBasariMesaji] = useState("");

  const [sayfaHataMesaji, setSayfaHataMesaji] = useState("");

  const [sayfaBasariMesaji, setSayfaBasariMesaji] = useState("");

  const [islemdekiKategoriId, setIslemdekiKategoriId] = useState(null);

  const [silinecekKategori, setSilinecekKategori] = useState(null);

  const [seciliKategoriIdleri, setSeciliKategoriIdleri] = useState([]);

  const [topluSilmeModalAcik, setTopluSilmeModalAcik] = useState(false);

  const [topluSilmeDevamEdiyor, setTopluSilmeDevamEdiyor] = useState(false);

  useEffect(() => {
    let iptalEdildiMi = false;

    async function kategorileriYukle() {
      try {
        setYukleniyor(true);

        setSayfaHataMesaji("");

        const veri = await yonetimKategorileriniGetir();

        if (iptalEdildiMi) {
          return;
        }

        const kategoriListesi = Array.isArray(veri) ? veri : [];

        setKategoriler(kategoriListesi);
      } catch (error) {
        if (iptalEdildiMi) {
          return;
        }

        const mesaj = hataMesajiGetir(
          error,
          "Kategoriler yüklenirken bir hata oluştu.",
        );

        setSayfaHataMesaji(mesaj);

        toast.error(mesaj, {
          toastId: "kategori-yukleme-hatasi",
        });
      } finally {
        if (!iptalEdildiMi) {
          setYukleniyor(false);
        }
      }
    }

    Promise.resolve().then(() => {
      if (!iptalEdildiMi) {
        return kategorileriYukle();
      }

      return undefined;
    });

    return () => {
      iptalEdildiMi = true;
    };
  }, []);

  async function listeyiYenile() {
    const veri = await yonetimKategorileriniGetir();

    const kategoriListesi = Array.isArray(veri) ? veri : [];

    setKategoriler(kategoriListesi);

    const mevcutKategoriIdleri = new Set(
      kategoriListesi.map((kategori) => kategori.id),
    );

    setSeciliKategoriIdleri((mevcutSecimler) =>
      mevcutSecimler.filter((id) => mevcutKategoriIdleri.has(id)),
    );
  }

  function kategoriFormunuTemizle() {
    setDuzenlenenKategoriId(null);

    setForm({
      ...bosKategoriFormu,
    });

    setAlanHatalari(null);

    setHataMesaji("");

    setBasariMesaji("");
  }

  function yeniKategoriAc() {
    setDuzenlenenKategoriId(null);

    setForm({
      ...bosKategoriFormu,

      siraNo: sonrakiSiraNoHesapla(kategoriler, null),
    });

    setAlanHatalari(null);

    setHataMesaji("");

    setBasariMesaji("");

    setKategoriModalAcik(true);
  }

  function kategoriModaliniKapat() {
    if (kaydediliyor || gorselYukleniyor || detayYukleniyor) {
      return;
    }

    setKategoriModalAcik(false);

    kategoriFormunuTemizle();
  }

  function kategoriModaliniBasariylaKapat() {
    setKategoriModalAcik(false);

    kategoriFormunuTemizle();
  }

  async function kategoriDuzenle(id) {
    try {
      kategoriFormunuTemizle();

      setKategoriModalAcik(true);

      setDetayYukleniyor(true);

      const kategori = await kategoriDetayGetir(id);

      setDuzenlenenKategoriId(id);

      setForm(kategoriFormaDonustur(kategori));
    } catch (error) {
      const mesaj = hataMesajiGetir(
        error,
        "Kategori bilgileri alınırken bir hata oluştu.",
      );

      setHataMesaji(mesaj);

      toast.error(mesaj);
    } finally {
      setDetayYukleniyor(false);
    }
  }

  function alanHatasiniTemizle(alanAdi) {
    setAlanHatalari((mevcutHatalar) => {
      if (!mevcutHatalar) {
        return null;
      }

      const yeniHatalar = {
        ...mevcutHatalar,
      };

      const eslesenAnahtar = Object.keys(yeniHatalar).find(
        (anahtar) => anahtar.toLowerCase() === alanAdi.toLowerCase(),
      );

      if (eslesenAnahtar) {
        delete yeniHatalar[eslesenAnahtar];
      }

      return yeniHatalar;
    });
  }

  function formDegisti(event) {
    const { name, value, type, checked } = event.target;

    setForm((mevcutForm) => ({
      ...mevcutForm,

      [name]: type === "checkbox" ? checked : value,
    }));

    setBasariMesaji("");

    alanHatasiniTemizle(name);
  }

  function selectDegisti(alanAdi, deger) {
    setForm((mevcutForm) => {
      const yeniForm = {
        ...mevcutForm,

        [alanAdi]: deger,
      };

      if (alanAdi === "ustKategoriId") {
        yeniForm.siraNo = sonrakiSiraNoHesapla(
          kategoriler,
          deger,
          duzenlenenKategoriId,
        );
      }

      return yeniForm;
    });

    setBasariMesaji("");

    alanHatasiniTemizle(alanAdi);

    if (alanAdi === "ustKategoriId") {
      alanHatasiniTemizle("siraNo");
    }
  }

  async function formuGonder(event) {
    event.preventDefault();

    setHataMesaji("");
    setBasariMesaji("");
    setAlanHatalari(null);

    const sonuc = kategoriSchema.safeParse(form);

    if (!sonuc.success) {
      const mesaj = "Lütfen formdaki eksik veya hatalı alanları kontrol edin.";

      setAlanHatalari(zodHatalariniDonustur(sonuc.error.issues));

      setHataMesaji(mesaj);

      toast.warning(mesaj);

      return;
    }

    try {
      setKaydediliyor(true);

      const duzenlemeModu = Boolean(duzenlenenKategoriId);

      if (duzenlemeModu) {
        await kategoriGuncelle(duzenlenenKategoriId, sonuc.data);
      } else {
        await kategoriEkle(sonuc.data);
      }

      await listeyiYenile();

      const mesaj = duzenlemeModu
        ? "Kategori başarıyla güncellendi."
        : "Kategori başarıyla oluşturuldu.";

      setSayfaBasariMesaji(mesaj);

      setSayfaHataMesaji("");

      toast.success(mesaj);

      kategoriModaliniBasariylaKapat();
    } catch (error) {
      const cevap = error?.response?.data;

      const mesaj = hataMesajiGetir(
        error,
        "Kategori kaydedilirken bir hata oluştu.",
      );

      setAlanHatalari(cevap?.hatalar ?? cevap?.errors ?? null);

      setHataMesaji(mesaj);

      toast.error(mesaj);
    } finally {
      setKaydediliyor(false);
    }
  }

  async function gorselYukle(dosya) {
    try {
      setGorselYukleniyor(true);

      setHataMesaji("");
      setBasariMesaji("");

      const sonuc = await kategoriGorseliYukle(dosya);

      setForm((mevcutForm) => ({
        ...mevcutForm,

        gorselYolu: sonuc.dosyaYolu,
      }));

      alanHatasiniTemizle("gorselYolu");

      const mesaj =
        "Kategori görseli başarıyla yüklendi. Kaydettiğinizde kategoriye uygulanacaktır.";

      setBasariMesaji(mesaj);

      toast.success("Kategori görseli başarıyla yüklendi.");
    } catch (error) {
      const mesaj = hataMesajiGetir(
        error,
        "Kategori görseli yüklenirken bir hata oluştu.",
      );

      setHataMesaji(mesaj);

      toast.error(mesaj);
    } finally {
      setGorselYukleniyor(false);
    }
  }

  function gorselKaldir() {
    setForm((mevcutForm) => ({
      ...mevcutForm,

      gorselYolu: "",
    }));

    setBasariMesaji("");

    alanHatasiniTemizle("gorselYolu");
  }

  async function durumDegistir(kategori) {
    try {
      setIslemdekiKategoriId(kategori.id);

      setSayfaHataMesaji("");
      setSayfaBasariMesaji("");

      const yeniDurum = !kategori.aktifMi;

      await kategoriDurumDegistir(kategori.id, yeniDurum);

      await listeyiYenile();

      const mesaj = yeniDurum
        ? "Kategori aktif hale getirildi."
        : "Kategori pasif hale getirildi.";

      setSayfaBasariMesaji(mesaj);

      toast.success(mesaj);
    } catch (error) {
      const mesaj = hataMesajiGetir(
        error,
        "Kategori durumu değiştirilirken bir hata oluştu.",
      );

      setSayfaHataMesaji(mesaj);

      toast.error(mesaj);
    } finally {
      setIslemdekiKategoriId(null);
    }
  }

  function silmeModaliniAc(kategori) {
    setSilinecekKategori(kategori);
  }

  function silmeModaliniKapat() {
    if (silinecekKategori && islemdekiKategoriId === silinecekKategori.id) {
      return;
    }

    setSilinecekKategori(null);
  }

  async function silmeyiOnayla() {
    if (!silinecekKategori) {
      return;
    }

    try {
      setIslemdekiKategoriId(silinecekKategori.id);

      setSayfaHataMesaji("");
      setSayfaBasariMesaji("");

      await kategoriSil(silinecekKategori.id);

      setSeciliKategoriIdleri((mevcutSecimler) =>
        mevcutSecimler.filter((id) => id !== silinecekKategori.id),
      );

      await listeyiYenile();

      const mesaj = "Kategori başarıyla silindi.";

      setSayfaBasariMesaji(mesaj);

      toast.success(mesaj);

      setSilinecekKategori(null);
    } catch (error) {
      const mesaj = hataMesajiGetir(
        error,
        "Kategori silinirken bir hata oluştu.",
      );

      setSayfaHataMesaji(mesaj);

      toast.error(mesaj);

      setSilinecekKategori(null);
    } finally {
      setIslemdekiKategoriId(null);
    }
  }

  function kategoriSecimleriDegisti(idListesi) {
    if (topluSilmeDevamEdiyor) {
      return;
    }

    const mevcutKategoriIdleri = new Set(
      kategoriler.map((kategori) => kategori.id),
    );

    const temizIdListesi = [
      ...new Set(Array.isArray(idListesi) ? idListesi : []),
    ].filter((id) => mevcutKategoriIdleri.has(id));

    setSeciliKategoriIdleri(temizIdListesi);
  }

  function topluSilmeModaliniAc() {
    if (topluSilmeDevamEdiyor || seciliKategoriIdleri.length === 0) {
      return;
    }

    setTopluSilmeModalAcik(true);
  }

  function topluSilmeModaliniKapat() {
    if (topluSilmeDevamEdiyor) {
      return;
    }

    setTopluSilmeModalAcik(false);
  }

  function kategoriSecimleriniTemizle() {
    if (topluSilmeDevamEdiyor) {
      return;
    }

    setSeciliKategoriIdleri([]);
  }

  async function topluSilmeyiOnayla() {
    if (topluSilmeDevamEdiyor || seciliKategoriIdleri.length === 0) {
      return;
    }

    try {
      setTopluSilmeDevamEdiyor(true);

      setSayfaHataMesaji("");
      setSayfaBasariMesaji("");

      const sonuc = await kategoriTopluSil(seciliKategoriIdleri);

      const silinenIdler = Array.isArray(sonuc?.silinenIdler)
        ? sonuc.silinenIdler
        : [];

      const hatalar = Array.isArray(sonuc?.hatalar) ? sonuc.hatalar : [];

      const silinenKayitSayisi =
        Number(sonuc?.silinenKayitSayisi) || silinenIdler.length;

      const silinemeyenKayitSayisi =
        Number(sonuc?.silinemeyenKayitSayisi) || hatalar.length;

      await listeyiYenile();

      /*
       * Kısmi başarısızlık varsa silinemeyen kayıtları
       * seçili bırakıyoruz. Böylece kullanıcı hangi
       * kayıtların kaldığını tabloda hemen görebilir.
       */
      const silinemeyenIdler = hatalar
        .map((hata) => hata?.id)
        .filter((id) => Number.isInteger(id) && id > 0);

      setSeciliKategoriIdleri(silinemeyenIdler);

      setTopluSilmeModalAcik(false);

      if (silinenKayitSayisi > 0 && silinemeyenKayitSayisi === 0) {
        const mesaj = `${silinenKayitSayisi} kategori başarıyla silindi.`;

        setSayfaBasariMesaji(mesaj);

        toast.success(mesaj);

        return;
      }

      if (silinenKayitSayisi > 0 && silinemeyenKayitSayisi > 0) {
        const mesaj =
          `${silinenKayitSayisi} kategori silindi, ` +
          `${silinemeyenKayitSayisi} kategori silinemedi.`;

        const detayMesaji = topluSilmeHataMesajiOlustur(hatalar, mesaj);

        setSayfaBasariMesaji(
          `${silinenKayitSayisi} kategori başarıyla silindi.`,
        );

        setSayfaHataMesaji(detayMesaji);

        toast.warning(mesaj);

        return;
      }

      const mesaj =
        silinemeyenKayitSayisi > 0
          ? `${silinemeyenKayitSayisi} kategori silinemedi.`
          : "Seçilen kategoriler silinemedi.";

      const detayMesaji = topluSilmeHataMesajiOlustur(hatalar, mesaj);

      setSayfaHataMesaji(detayMesaji);

      toast.error(mesaj);
    } catch (error) {
      const mesaj = hataMesajiGetir(
        error,
        "Seçilen kategoriler silinirken bir hata oluştu.",
      );

      setSayfaHataMesaji(mesaj);

      toast.error(mesaj);
    } finally {
      setTopluSilmeDevamEdiyor(false);
    }
  }

  const seciliKategoriler = useMemo(() => {
    const seciliIdler = new Set(seciliKategoriIdleri);

    return kategoriler.filter((kategori) => seciliIdler.has(kategori.id));
  }, [kategoriler, seciliKategoriIdleri]);

  const ustKategoriSecenekleri = ustKategoriSecenekleriniOlustur(
    kategoriler,
    duzenlenenKategoriId,
  );

  const modalDevreDisi = kaydediliyor || gorselYukleniyor || detayYukleniyor;

  const silmeIslemiDevamEdiyor = Boolean(
    silinecekKategori && islemdekiKategoriId === silinecekKategori.id,
  );

  return {
    kategoriler,
    yukleniyor,

    kategoriModalAcik,
    duzenlenenKategoriId,
    form,

    detayYukleniyor,
    kaydediliyor,
    gorselYukleniyor,

    alanHatalari,
    hataMesaji,
    basariMesaji,

    sayfaHataMesaji,
    sayfaBasariMesaji,

    islemdekiKategoriId,
    silinecekKategori,

    seciliKategoriIdleri,
    seciliKategoriler,
    topluSilmeModalAcik,
    topluSilmeDevamEdiyor,

    ustKategoriSecenekleri,
    modalDevreDisi,
    silmeIslemiDevamEdiyor,

    yeniKategoriAc,
    kategoriModaliniKapat,
    kategoriDuzenle,

    formDegisti,
    selectDegisti,
    formuGonder,

    gorselYukle,
    gorselKaldir,

    durumDegistir,

    silmeModaliniAc,
    silmeModaliniKapat,
    silmeyiOnayla,

    kategoriSecimleriDegisti,
    kategoriSecimleriniTemizle,

    topluSilmeModaliniAc,
    topluSilmeModaliniKapat,
    topluSilmeyiOnayla,

    listeyiYenile,
  };
}

function topluSilmeHataMesajiOlustur(hatalar, varsayilanMesaj) {
  if (!Array.isArray(hatalar) || hatalar.length === 0) {
    return varsayilanMesaj;
  }

  const detaylar = hatalar
    .slice(0, 3)
    .map((hata) => {
      const kategoriAdi = hata?.kategoriAdi?.trim() || `ID: ${hata?.id ?? "-"}`;

      const mesaj = hata?.mesaj?.trim() || "Kategori silinemedi.";

      return `${kategoriAdi}: ${mesaj}`;
    })
    .join(" • ");

  const kalanHataSayisi = hatalar.length - 3;

  if (kalanHataSayisi > 0) {
    return `${varsayilanMesaj} ${detaylar} • +${kalanHataSayisi} hata daha`;
  }

  return `${varsayilanMesaj} ${detaylar}`;
}

function hataMesajiGetir(error, varsayilanMesaj) {
  return (
    error?.response?.data?.mesaj ||
    error?.response?.data?.title ||
    varsayilanMesaj
  );
}

export default useKategoriYonetimi;
