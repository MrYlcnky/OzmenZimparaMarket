import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  urunDetayTanimiDetayGetir,
  urunDetayTanimiDurumDegistir,
  urunDetayTanimiEkle,
  urunDetayTanimiGuncelle,
  urunDetayTanimiSil,
  yonetimUrunDetayTanimlariniGetir,
} from "../../../api/servisler/urunDetayTanimiServisi";

import { urunDetayTanimiSchema } from "../../../schemas/urunDetayTanimiSchema";

import {
  bosUrunOzelligiFormu,
  sonrakiSiraNoHesapla,
  urunOzelligiFormaDonustur,
  zodHatalariniDonustur,
} from "./urunOzelligiYardimcilari";

function apiHataMesajiniGetir(error, varsayilanMesaj) {
  return (
    error?.response?.data?.mesaj ??
    error?.response?.data?.message ??
    error?.message ??
    varsayilanMesaj
  );
}

export default function useUrunOzelligiYonetimi() {
  const [urunOzellikleri, setUrunOzellikleri] = useState([]);

  const [yukleniyor, setYukleniyor] = useState(true);

  const [formModalAcik, setFormModalAcik] = useState(false);

  const [duzenlenenUrunOzelligi, setDuzenlenenUrunOzelligi] = useState(null);

  const [form, setForm] = useState({
    ...bosUrunOzelligiFormu,
  });

  const [formHatalari, setFormHatalari] = useState({});

  const [kaydediliyor, setKaydediliyor] = useState(false);

  const [detayYukleniyor, setDetayYukleniyor] = useState(false);

  const [durumDegistirilenId, setDurumDegistirilenId] = useState(null);

  const [silModalAcik, setSilModalAcik] = useState(false);

  const [silinecekUrunOzelligi, setSilinecekUrunOzelligi] = useState(null);

  const [siliniyor, setSiliniyor] = useState(false);

  const urunOzellikleriniGetir = useCallback(async () => {
    try {
      setYukleniyor(true);

      const veriler = await yonetimUrunDetayTanimlariniGetir();

      setUrunOzellikleri(Array.isArray(veriler) ? veriler : []);
    } catch (error) {
      toast.error(
        apiHataMesajiniGetir(
          error,
          "Ürün özellikleri yüklenirken bir hata oluştu.",
        ),
      );
    } finally {
      setYukleniyor(false);
    }
  }, []);

  useEffect(() => {
    let iptalEdildiMi = false;

    Promise.resolve().then(() => {
      if (!iptalEdildiMi) {
        return urunOzellikleriniGetir();
      }

      return undefined;
    });

    return () => {
      iptalEdildiMi = true;
    };
  }, [urunOzellikleriniGetir]);

  function yeniUrunOzelligiAc() {
    setDuzenlenenUrunOzelligi(null);

    setForm({
      ...bosUrunOzelligiFormu,
      siraNo: sonrakiSiraNoHesapla(urunOzellikleri),
    });

    setFormHatalari({});

    setFormModalAcik(true);
  }

  async function urunOzelligiDuzenle(id) {
    try {
      setDetayYukleniyor(true);

      setFormHatalari({});

      const urunOzelligi = await urunDetayTanimiDetayGetir(id);

      setDuzenlenenUrunOzelligi(urunOzelligi);

      setForm(urunOzelligiFormaDonustur(urunOzelligi));

      setFormModalAcik(true);
    } catch (error) {
      toast.error(
        apiHataMesajiniGetir(
          error,
          "Ürün özelliği bilgileri alınırken bir hata oluştu.",
        ),
      );
    } finally {
      setDetayYukleniyor(false);
    }
  }

  function formModaliniKapat() {
    if (kaydediliyor) {
      return;
    }

    setFormModalAcik(false);

    setDuzenlenenUrunOzelligi(null);

    setForm({
      ...bosUrunOzelligiFormu,
    });

    setFormHatalari({});
  }

  function formAlaniDegisti(alanAdi, deger) {
    setForm((mevcutForm) => ({
      ...mevcutForm,
      [alanAdi]: deger,
    }));

    setFormHatalari((mevcutHatalar) => {
      if (!mevcutHatalar[alanAdi]) {
        return mevcutHatalar;
      }

      const yeniHatalar = {
        ...mevcutHatalar,
      };

      delete yeniHatalar[alanAdi];

      return yeniHatalar;
    });
  }

  async function urunOzelligiKaydet() {
    const dogrulamaSonucu = urunDetayTanimiSchema.safeParse(form);

    if (!dogrulamaSonucu.success) {
      setFormHatalari(zodHatalariniDonustur(dogrulamaSonucu.error));

      return false;
    }

    try {
      setKaydediliyor(true);

      const dto = dogrulamaSonucu.data;

      if (duzenlenenUrunOzelligi) {
        await urunDetayTanimiGuncelle(duzenlenenUrunOzelligi.id, dto);

        toast.success("Ürün özelliği başarıyla güncellendi.");
      } else {
        await urunDetayTanimiEkle(dto);

        toast.success("Ürün özelliği başarıyla eklendi.");
      }

      setFormModalAcik(false);

      setDuzenlenenUrunOzelligi(null);

      setForm({
        ...bosUrunOzelligiFormu,
      });

      setFormHatalari({});

      await urunOzellikleriniGetir();

      return true;
    } catch (error) {
      toast.error(
        apiHataMesajiniGetir(
          error,
          duzenlenenUrunOzelligi
            ? "Ürün özelliği güncellenirken bir hata oluştu."
            : "Ürün özelliği eklenirken bir hata oluştu.",
        ),
      );

      return false;
    } finally {
      setKaydediliyor(false);
    }
  }

  async function urunOzelligiDurumDegistir(urunOzelligi) {
    if (!urunOzelligi?.id) {
      return;
    }

    const yeniDurum = !urunOzelligi.aktifMi;

    try {
      setDurumDegistirilenId(urunOzelligi.id);

      const guncellenenUrunOzelligi = await urunDetayTanimiDurumDegistir(
        urunOzelligi.id,
        yeniDurum,
      );

      setUrunOzellikleri((mevcutUrunOzellikleri) =>
        mevcutUrunOzellikleri.map((mevcutUrunOzelligi) =>
          mevcutUrunOzelligi.id === urunOzelligi.id
            ? guncellenenUrunOzelligi
            : mevcutUrunOzelligi,
        ),
      );

      toast.success(
        yeniDurum
          ? "Ürün özelliği aktif hale getirildi."
          : "Ürün özelliği pasif hale getirildi.",
      );
    } catch (error) {
      toast.error(
        apiHataMesajiniGetir(
          error,
          "Ürün özelliğinin durumu değiştirilirken bir hata oluştu.",
        ),
      );
    } finally {
      setDurumDegistirilenId(null);
    }
  }

  function urunOzelligiSilmeOnayiAc(urunOzelligi) {
    setSilinecekUrunOzelligi(urunOzelligi);

    setSilModalAcik(true);
  }

  function silModaliniKapat() {
    if (siliniyor) {
      return;
    }

    setSilModalAcik(false);

    setSilinecekUrunOzelligi(null);
  }

  async function urunOzelligiSil() {
    if (!silinecekUrunOzelligi?.id) {
      return false;
    }

    try {
      setSiliniyor(true);

      await urunDetayTanimiSil(silinecekUrunOzelligi.id);

      toast.success("Ürün özelliği başarıyla silindi.");

      setUrunOzellikleri((mevcutUrunOzellikleri) =>
        mevcutUrunOzellikleri.filter(
          (urunOzelligi) => urunOzelligi.id !== silinecekUrunOzelligi.id,
        ),
      );

      setSilModalAcik(false);

      setSilinecekUrunOzelligi(null);

      return true;
    } catch (error) {
      toast.error(
        apiHataMesajiniGetir(
          error,
          "Ürün özelliği silinirken bir hata oluştu.",
        ),
      );

      return false;
    } finally {
      setSiliniyor(false);
    }
  }

  return {
    urunOzellikleri,
    yukleniyor,

    formModalAcik,
    duzenlenenUrunOzelligi,
    form,
    formHatalari,
    kaydediliyor,
    detayYukleniyor,

    durumDegistirilenId,

    silModalAcik,
    silinecekUrunOzelligi,
    siliniyor,

    urunOzellikleriniGetir,

    yeniUrunOzelligiAc,
    urunOzelligiDuzenle,
    formModaliniKapat,

    formAlaniDegisti,
    urunOzelligiKaydet,

    urunOzelligiDurumDegistir,

    urunOzelligiSilmeOnayiAc,
    silModaliniKapat,
    urunOzelligiSil,
  };
}
