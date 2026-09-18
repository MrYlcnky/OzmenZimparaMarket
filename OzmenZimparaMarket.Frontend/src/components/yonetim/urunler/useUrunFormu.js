import { useCallback, useState } from "react";
import { toast } from "react-toastify";

import {
  sonrakiUrunSiraNoGetir,
  urunDetayGetir,
  urunEkle,
  urunGuncelle,
} from "../../../api/servisler/urunServisi";

import { urunSchema } from "../../../schemas/urunSchema";

import {
  bosUrunFormu,
  urunFormaDonustur,
  urunPayloadOlustur,
  zodHatalariniDonustur,
} from "./urunYardimcilari";

function apiHataMesajiGetir(error, varsayilanMesaj) {
  const veri = error?.response?.data;

  if (typeof veri?.mesaj === "string" && veri.mesaj.trim()) {
    return veri.mesaj;
  }

  if (typeof veri?.message === "string" && veri.message.trim()) {
    return veri.message;
  }

  if (typeof veri === "string" && veri.trim()) {
    return veri;
  }

  return varsayilanMesaj;
}

function bosFormOlustur() {
  return {
    ...bosUrunFormu,
    teknikDetaylar: [],
  };
}

export default function useUrunFormu({
  urunDetayTanimlari = [],
  onKaydedildi,
} = {}) {
  const [formModalAcikMi, setFormModalAcikMi] = useState(false);

  const [detayModalAcikMi, setDetayModalAcikMi] = useState(false);

  const [formModu, setFormModu] = useState("yeni");

  const [duzenlenenUrunId, setDuzenlenenUrunId] = useState(null);

  const [form, setForm] = useState(bosFormOlustur);

  const [formHatalari, setFormHatalari] = useState({});

  const [formYukleniyorMu, setFormYukleniyorMu] = useState(false);

  const [kaydediliyorMu, setKaydediliyorMu] = useState(false);

  const [detayUrun, setDetayUrun] = useState(null);

  const [detayYukleniyorMu, setDetayYukleniyorMu] = useState(false);
  const yeniUrunModaliniAc = useCallback(async () => {
    setFormModu("yeni");

    setDuzenlenenUrunId(null);

    setFormHatalari({});

    setForm(bosFormOlustur());

    setFormModalAcikMi(true);

    setFormYukleniyorMu(true);

    try {
      const sonrakiSiraNo = await sonrakiUrunSiraNoGetir();

      setForm({
        ...bosFormOlustur(),

        siraNo: String(sonrakiSiraNo),
      });
    } catch (error) {
      setForm({
        ...bosFormOlustur(),

        siraNo: "0",
      });

      toast.error(
        apiHataMesajiGetir(
          error,
          "Sıra numarası otomatik belirlenemedi. Sıra numarasını manuel girebilirsiniz.",
        ),
      );
    } finally {
      setFormYukleniyorMu(false);
    }
  }, []);

  const formModaliniKapat = useCallback(() => {
    if (kaydediliyorMu || formYukleniyorMu) {
      return;
    }

    setFormModalAcikMi(false);

    setFormModu("yeni");

    setDuzenlenenUrunId(null);

    setForm(bosFormOlustur());

    setFormHatalari({});
  }, [kaydediliyorMu, formYukleniyorMu]);

  const urunDuzenlemeModaliniAc = useCallback(async (urun) => {
    if (!urun?.id) {
      return;
    }

    setFormModu("duzenle");

    setDuzenlenenUrunId(urun.id);

    setFormHatalari({});

    setForm(bosFormOlustur());

    setFormModalAcikMi(true);

    setFormYukleniyorMu(true);

    try {
      const detay = await urunDetayGetir(urun.id);

      setForm(urunFormaDonustur(detay));
    } catch (error) {
      toast.error(
        apiHataMesajiGetir(
          error,
          "Ürün bilgileri yüklenirken bir hata oluştu.",
        ),
      );

      setFormModalAcikMi(false);

      setDuzenlenenUrunId(null);
    } finally {
      setFormYukleniyorMu(false);
    }
  }, []);

  const urunDetayModaliniAc = useCallback(async (urun) => {
    if (!urun?.id) {
      return;
    }

    setDetayUrun(null);

    setDetayModalAcikMi(true);

    setDetayYukleniyorMu(true);

    try {
      const detay = await urunDetayGetir(urun.id);

      setDetayUrun(detay);
    } catch (error) {
      toast.error(
        apiHataMesajiGetir(error, "Ürün detayı yüklenirken bir hata oluştu."),
      );

      setDetayModalAcikMi(false);
    } finally {
      setDetayYukleniyorMu(false);
    }
  }, []);

  const detayModaliniKapat = useCallback(() => {
    if (detayYukleniyorMu) {
      return;
    }

    setDetayModalAcikMi(false);

    setDetayUrun(null);
  }, [detayYukleniyorMu]);

  const formAlaniniDegistir = useCallback((alanAdi, deger) => {
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
  }, []);

  const teknikDetayEkle = useCallback((urunDetayTanimiId) => {
    const tanimId = Number(urunDetayTanimiId);

    if (!Number.isFinite(tanimId) || tanimId <= 0) {
      return;
    }

    setForm((mevcutForm) => {
      const ayniTanimDetaylari = mevcutForm.teknikDetaylar.filter(
        (x) => Number(x.urunDetayTanimiId) === tanimId,
      );

      const sonrakiSiraNo =
        ayniTanimDetaylari.length === 0
          ? 0
          : Math.max(...ayniTanimDetaylari.map((x) => Number(x.siraNo) || 0)) +
            1;

      return {
        ...mevcutForm,

        teknikDetaylar: [
          ...mevcutForm.teknikDetaylar,

          {
            urunDetayiId: null,

            urunDetayTanimiId: tanimId,

            detayDegeri: "",

            siraNo: sonrakiSiraNo,

            aktifMi: true,
          },
        ],
      };
    });
  }, []);

  const teknikDetayDegistir = useCallback((indeks, alanAdi, deger) => {
    setForm((mevcutForm) => ({
      ...mevcutForm,

      teknikDetaylar: mevcutForm.teknikDetaylar.map((detay, detayIndeksi) =>
        detayIndeksi === indeks
          ? {
              ...detay,
              [alanAdi]: deger,
            }
          : detay,
      ),
    }));

    const hataAnahtari = `teknikDetaylar.${indeks}.${alanAdi}`;

    setFormHatalari((mevcutHatalar) => {
      if (!mevcutHatalar[hataAnahtari]) {
        return mevcutHatalar;
      }

      const yeniHatalar = {
        ...mevcutHatalar,
      };

      delete yeniHatalar[hataAnahtari];

      return yeniHatalar;
    });
  }, []);

  const teknikDetaySil = useCallback((indeks) => {
    setForm((mevcutForm) => ({
      ...mevcutForm,

      teknikDetaylar: mevcutForm.teknikDetaylar.filter(
        (_, detayIndeksi) => detayIndeksi !== indeks,
      ),
    }));

    setFormHatalari((mevcutHatalar) => {
      const yeniHatalar = {};

      Object.entries(mevcutHatalar).forEach(([anahtar, mesaj]) => {
        if (!anahtar.startsWith("teknikDetaylar.")) {
          yeniHatalar[anahtar] = mesaj;
        }
      });

      return yeniHatalar;
    });
  }, []);

  const teknikDetayKurallariniDogrula = useCallback(
    (teknikDetaylar) => {
      const hatalar = {};

      const gruplar = teknikDetaylar.reduce((sonuc, detay, indeks) => {
        const tanimId = Number(detay.urunDetayTanimiId);

        if (!sonuc[tanimId]) {
          sonuc[tanimId] = [];
        }

        sonuc[tanimId].push({
          ...detay,
          indeks,
        });

        return sonuc;
      }, {});

      Object.entries(gruplar).forEach(([tanimId, detaylar]) => {
        const tanim = urunDetayTanimlari.find(
          (x) => Number(x.id) === Number(tanimId),
        );

        if (!tanim) {
          return;
        }

        if (!tanim.cokluDegerMi && detaylar.length > 1) {
          detaylar.forEach((detay) => {
            hatalar[`teknikDetaylar.${detay.indeks}.detayDegeri`] =
              `${tanim.detayAdi} özelliği yalnızca tek değer kabul eder.`;
          });
        }

        const kullanilanDegerler = new Map();

        detaylar.forEach((detay) => {
          const normalizeDeger = detay.detayDegeri
            ?.trim()
            .toLocaleLowerCase("tr-TR");

          if (!normalizeDeger) {
            return;
          }

          if (kullanilanDegerler.has(normalizeDeger)) {
            const ilkIndeks = kullanilanDegerler.get(normalizeDeger);

            hatalar[`teknikDetaylar.${ilkIndeks}.detayDegeri`] =
              "Aynı özellik değeri birden fazla kez kullanılamaz.";

            hatalar[`teknikDetaylar.${detay.indeks}.detayDegeri`] =
              "Aynı özellik değeri birden fazla kez kullanılamaz.";

            return;
          }

          kullanilanDegerler.set(normalizeDeger, detay.indeks);
        });
      });

      return hatalar;
    },
    [urunDetayTanimlari],
  );

  const urunuKaydet = useCallback(async () => {
    if (kaydediliyorMu || formYukleniyorMu) {
      return false;
    }

    setFormHatalari({});

    const sonuc = urunSchema.safeParse(form);

    if (!sonuc.success) {
      setFormHatalari(zodHatalariniDonustur(sonuc.error));

      toast.error("Lütfen formdaki hatalı alanları kontrol edin.");

      return false;
    }

    const teknikDetayHatalari = teknikDetayKurallariniDogrula(
      sonuc.data.teknikDetaylar,
    );

    if (Object.keys(teknikDetayHatalari).length > 0) {
      setFormHatalari(teknikDetayHatalari);

      toast.error("Teknik özelliklerde düzeltilmesi gereken alanlar var.");

      return false;
    }

    const payload = urunPayloadOlustur(sonuc.data);

    setKaydediliyorMu(true);

    try {
      let kaydedilenUrun;

      if (formModu === "duzenle" && duzenlenenUrunId) {
        kaydedilenUrun = await urunGuncelle(duzenlenenUrunId, payload);

        toast.success("Ürün başarıyla güncellendi.");
      } else {
        kaydedilenUrun = await urunEkle(payload);

        toast.success("Ürün başarıyla eklendi.");
      }

      setFormModalAcikMi(false);

      setFormModu("yeni");

      setDuzenlenenUrunId(null);

      setForm(bosFormOlustur());

      setFormHatalari({});

      if (typeof onKaydedildi === "function") {
        await onKaydedildi(kaydedilenUrun);
      }

      return true;
    } catch (error) {
      toast.error(
        apiHataMesajiGetir(
          error,
          formModu === "duzenle"
            ? "Ürün güncellenirken bir hata oluştu."
            : "Ürün eklenirken bir hata oluştu.",
        ),
      );

      return false;
    } finally {
      setKaydediliyorMu(false);
    }
  }, [
    duzenlenenUrunId,
    form,
    formModu,
    formYukleniyorMu,
    kaydediliyorMu,
    onKaydedildi,
    teknikDetayKurallariniDogrula,
  ]);

  return {
    formModalAcikMi,
    detayModalAcikMi,

    formModu,
    duzenlenenUrunId,

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

    setForm,
  };
}
