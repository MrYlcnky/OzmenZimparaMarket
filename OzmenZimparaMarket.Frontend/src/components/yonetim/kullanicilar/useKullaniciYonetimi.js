import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { toast } from "react-toastify";

import { mevcutOturumGetir } from "../../../api/servisler/authServisi";

import {
  kendiSifremiDegistir,
  panelKullanicilariniGetir,
  panelKullanicisiDurumDegistir,
  panelKullanicisiEkle,
  panelKullanicisiGuncelle,
  panelKullanicisiSifreSifirla,
  panelKullanicisiSil,
} from "../../../api/servisler/panelKullanicisiServisi";

import {
  panelKullanicisiEkleSchema,
  panelKullanicisiGuncelleSchema,
  panelKullanicisiSifreDegistirSchema,
  panelKullanicisiSifreSifirlaSchema,
} from "../../../schemas/panelKullanicisiSchema";

const BOS_KULLANICI_FORMU = {
  kullaniciAdi: "",
  adSoyad: "",
  sifre: "",
  aktifMi: true,
};

const BOS_SIFRE_SIFIRLAMA_FORMU = {
  yeniSifre: "",
  yeniSifreTekrar: "",
};

const BOS_SIFRE_DEGISTIRME_FORMU = {
  mevcutSifre: "",
  yeniSifre: "",
  yeniSifreTekrar: "",
};

export const kullaniciDurumSecenekleri = [
  {
    value: "tum",
    label: "Tüm Durumlar",
  },
  {
    value: "aktif",
    label: "Aktif",
  },
  {
    value: "pasif",
    label: "Pasif",
  },
];

function apiHataMesajiGetir(error, varsayilanMesaj) {
  const veri = error?.response?.data;

  if (typeof veri?.mesaj === "string" && veri.mesaj.trim()) {
    return veri.mesaj;
  }

  if (typeof veri?.message === "string" && veri.message.trim()) {
    return veri.message;
  }

  if (veri?.errors && typeof veri.errors === "object") {
    const ilkHataListesi = Object.values(veri.errors).find(
      (hatalar) => Array.isArray(hatalar) && hatalar.length > 0,
    );

    if (ilkHataListesi?.[0]) {
      return ilkHataListesi[0];
    }
  }

  if (typeof veri?.title === "string" && veri.title.trim()) {
    return veri.title;
  }

  if (typeof veri === "string" && veri.trim()) {
    return veri;
  }

  return varsayilanMesaj;
}

function zodAlanHatalariniGetir(zodError) {
  const sonuc = {};

  for (const issue of zodError?.issues ?? []) {
    const alanAdi = issue.path?.[0];

    if (!alanAdi || sonuc[alanAdi]) {
      continue;
    }

    sonuc[alanAdi] = issue.message;
  }

  return sonuc;
}

export default function useKullaniciYonetimi() {
  const mevcutKullaniciId = useMemo(() => {
    const oturum = mevcutOturumGetir();

    const id = Number(oturum?.kullaniciId);

    return Number.isInteger(id) && id > 0 ? id : null;
  }, []);

  const [kullanicilar, setKullanicilar] = useState([]);

  const [aramaMetni, setAramaMetni] = useState("");

  const [durumFiltresi, setDurumFiltresi] = useState("tum");

  const [yukleniyorMu, setYukleniyorMu] = useState(true);

  const [durumDegistirilenKullaniciId, setDurumDegistirilenKullaniciId] =
    useState(null);

  /*
   * Kullanıcı formu
   */
  const [formModalAcikMi, setFormModalAcikMi] = useState(false);

  const [formModu, setFormModu] = useState("ekle");

  const [duzenlenecekKullanici, setDuzenlenecekKullanici] = useState(null);

  const [kullaniciFormu, setKullaniciFormu] = useState({
    ...BOS_KULLANICI_FORMU,
  });

  const [kullaniciFormHatalari, setKullaniciFormHatalari] = useState({});

  const [kullaniciKaydediliyorMu, setKullaniciKaydediliyorMu] = useState(false);

  /*
   * Silme
   */
  const [siliniyorMu, setSiliniyorMu] = useState(false);

  const [silinecekKullanici, setSilinecekKullanici] = useState(null);

  /*
   * Başka kullanıcının şifresini sıfırlama
   */
  const [sifresiSifirlanacakKullanici, setSifresiSifirlanacakKullanici] =
    useState(null);

  const [sifreSifirlamaFormu, setSifreSifirlamaFormu] = useState({
    ...BOS_SIFRE_SIFIRLAMA_FORMU,
  });

  const [sifreSifirlamaHatalari, setSifreSifirlamaHatalari] = useState({});

  const [sifreSifirlaniyorMu, setSifreSifirlaniyorMu] = useState(false);

  /*
   * Kendi şifresini değiştirme
   */
  const [sifreDegistirmeModalAcikMi, setSifreDegistirmeModalAcikMi] =
    useState(false);

  const [sifreDegistirmeFormu, setSifreDegistirmeFormu] = useState({
    ...BOS_SIFRE_DEGISTIRME_FORMU,
  });

  const [sifreDegistirmeHatalari, setSifreDegistirmeHatalari] = useState({});

  const [sifreDegistiriliyorMu, setSifreDegistiriliyorMu] = useState(false);

  const istekSirasiRef = useRef(0);

  const kullanicilariYukle = useCallback(async () => {
    const istekSirasi = ++istekSirasiRef.current;

    setYukleniyorMu(true);

    try {
      const sonuc = await panelKullanicilariniGetir();

      if (istekSirasi !== istekSirasiRef.current) {
        return;
      }

      setKullanicilar(Array.isArray(sonuc) ? sonuc : []);
    } catch (error) {
      if (istekSirasi !== istekSirasiRef.current) {
        return;
      }

      setKullanicilar([]);

      toast.error(
        apiHataMesajiGetir(error, "Kullanıcılar yüklenirken bir hata oluştu."),
      );
    } finally {
      if (istekSirasi === istekSirasiRef.current) {
        setYukleniyorMu(false);
      }
    }
  }, []);

  useEffect(() => {
    let iptalEdildiMi = false;

    Promise.resolve().then(() => {
      if (!iptalEdildiMi) {
        return kullanicilariYukle();
      }

      return undefined;
    });

    return () => {
      iptalEdildiMi = true;
    };
  }, [kullanicilariYukle]);

  const filtrelenmisKullanicilar = useMemo(() => {
    const arama = aramaMetni.trim().toLocaleLowerCase("tr-TR");

    return kullanicilar.filter((kullanici) => {
      if (durumFiltresi === "aktif" && !kullanici.aktifMi) {
        return false;
      }

      if (durumFiltresi === "pasif" && kullanici.aktifMi) {
        return false;
      }

      if (!arama) {
        return true;
      }

      const kullaniciAdi = String(
        kullanici.kullaniciAdi ?? "",
      ).toLocaleLowerCase("tr-TR");

      const adSoyad = String(kullanici.adSoyad ?? "").toLocaleLowerCase(
        "tr-TR",
      );

      return kullaniciAdi.includes(arama) || adSoyad.includes(arama);
    });
  }, [aramaMetni, durumFiltresi, kullanicilar]);

  const aktifKullaniciSayisi = useMemo(
    () => kullanicilar.filter((kullanici) => kullanici.aktifMi).length,
    [kullanicilar],
  );

  const pasifKullaniciSayisi = kullanicilar.length - aktifKullaniciSayisi;

  const aktifFiltreVarMi = durumFiltresi !== "tum";

  const aramaMetniDegistir = useCallback((deger) => {
    setAramaMetni(deger);
  }, []);

  const durumFiltresiDegistir = useCallback((deger) => {
    setDurumFiltresi(deger);
  }, []);

  const filtreleriTemizle = useCallback(() => {
    setAramaMetni("");
    setDurumFiltresi("tum");
  }, []);

  /*
   * Yeni kullanıcı
   */
  const yeniKullaniciModaliniAc = useCallback(() => {
    setFormModu("ekle");

    setDuzenlenecekKullanici(null);

    setKullaniciFormu({
      ...BOS_KULLANICI_FORMU,
    });

    setKullaniciFormHatalari({});

    setFormModalAcikMi(true);
  }, []);

  /*
   * Kullanıcı düzenleme
   */
  const duzenlemeModaliniAc = useCallback((kullanici) => {
    if (!kullanici?.id) {
      return;
    }

    setFormModu("duzenle");

    setDuzenlenecekKullanici(kullanici);

    setKullaniciFormu({
      kullaniciAdi: kullanici.kullaniciAdi ?? "",
      adSoyad: kullanici.adSoyad ?? "",
      sifre: "",
      aktifMi: Boolean(kullanici.aktifMi),
    });

    setKullaniciFormHatalari({});

    setFormModalAcikMi(true);
  }, []);

  const formModaliniKapat = useCallback(() => {
    if (kullaniciKaydediliyorMu) {
      return;
    }

    setFormModalAcikMi(false);

    setDuzenlenecekKullanici(null);

    setKullaniciFormu({
      ...BOS_KULLANICI_FORMU,
    });

    setKullaniciFormHatalari({});
  }, [kullaniciKaydediliyorMu]);

  const kullaniciFormAlaniniDegistir = useCallback((alanAdi, deger) => {
    setKullaniciFormu((mevcutForm) => ({
      ...mevcutForm,
      [alanAdi]: deger,
    }));

    setKullaniciFormHatalari((mevcutHatalar) => {
      if (!mevcutHatalar?.[alanAdi]) {
        return mevcutHatalar;
      }

      const yeniHatalar = {
        ...mevcutHatalar,
      };

      delete yeniHatalar[alanAdi];

      return yeniHatalar;
    });
  }, []);

  const kullaniciyiKaydet = useCallback(
    async (event) => {
      event?.preventDefault?.();

      if (kullaniciKaydediliyorMu) {
        return;
      }

      const duzenlemeModu = formModu === "duzenle";

      const veri = duzenlemeModu
        ? {
            kullaniciAdi: kullaniciFormu.kullaniciAdi,
            adSoyad: kullaniciFormu.adSoyad,
            aktifMi: kullaniciFormu.aktifMi,
          }
        : {
            kullaniciAdi: kullaniciFormu.kullaniciAdi,
            adSoyad: kullaniciFormu.adSoyad,
            sifre: kullaniciFormu.sifre,
            aktifMi: kullaniciFormu.aktifMi,
          };

      const schema = duzenlemeModu
        ? panelKullanicisiGuncelleSchema
        : panelKullanicisiEkleSchema;

      const dogrulama = schema.safeParse(veri);

      if (!dogrulama.success) {
        setKullaniciFormHatalari(zodAlanHatalariniGetir(dogrulama.error));

        return;
      }

      if (
        duzenlemeModu &&
        duzenlenecekKullanici?.id === mevcutKullaniciId &&
        !dogrulama.data.aktifMi
      ) {
        toast.warning(
          "Giriş yaptığınız kendi kullanıcı hesabınızı pasife alamazsınız.",
        );

        return;
      }

      setKullaniciKaydediliyorMu(true);

      try {
        if (duzenlemeModu) {
          await panelKullanicisiGuncelle(
            duzenlenecekKullanici.id,
            dogrulama.data,
          );

          toast.success("Kullanıcı bilgileri güncellendi.");
        } else {
          await panelKullanicisiEkle(dogrulama.data);

          toast.success("Yeni kullanıcı oluşturuldu.");
        }

        setFormModalAcikMi(false);

        setDuzenlenecekKullanici(null);

        setKullaniciFormu({
          ...BOS_KULLANICI_FORMU,
        });

        setKullaniciFormHatalari({});

        await kullanicilariYukle();
      } catch (error) {
        toast.error(
          apiHataMesajiGetir(
            error,
            duzenlemeModu
              ? "Kullanıcı güncellenirken bir hata oluştu."
              : "Kullanıcı oluşturulurken bir hata oluştu.",
          ),
        );
      } finally {
        setKullaniciKaydediliyorMu(false);
      }
    },
    [
      duzenlenecekKullanici,
      formModu,
      kullaniciFormu,
      kullaniciKaydediliyorMu,
      kullanicilariYukle,
      mevcutKullaniciId,
    ],
  );

  /*
   * Aktif / pasif
   */
  const kullaniciDurumunuDegistir = useCallback(
    async (kullanici) => {
      if (!kullanici?.id || durumDegistirilenKullaniciId) {
        return;
      }

      const yeniDurum = !kullanici.aktifMi;

      if (kullanici.id === mevcutKullaniciId && !yeniDurum) {
        toast.warning(
          "Giriş yaptığınız kendi kullanıcı hesabınızı pasife alamazsınız.",
        );

        return;
      }

      if (kullanici.aktifMi && aktifKullaniciSayisi <= 1) {
        toast.warning("Sistemdeki son aktif kullanıcı pasife alınamaz.");

        return;
      }

      setDurumDegistirilenKullaniciId(kullanici.id);

      try {
        await panelKullanicisiDurumDegistir(kullanici.id, yeniDurum);

        toast.success(
          yeniDurum
            ? "Kullanıcı aktif hale getirildi."
            : "Kullanıcı pasif hale getirildi.",
        );

        await kullanicilariYukle();
      } catch (error) {
        toast.error(
          apiHataMesajiGetir(
            error,
            "Kullanıcı durumu değiştirilirken bir hata oluştu.",
          ),
        );
      } finally {
        setDurumDegistirilenKullaniciId(null);
      }
    },
    [
      aktifKullaniciSayisi,
      durumDegistirilenKullaniciId,
      kullanicilariYukle,
      mevcutKullaniciId,
    ],
  );

  /*
   * Silme
   */
  const silmeModaliniAc = useCallback(
    (kullanici) => {
      if (!kullanici?.id) {
        return;
      }

      if (kullanici.id === mevcutKullaniciId) {
        toast.warning(
          "Giriş yaptığınız kendi kullanıcı hesabınızı silemezsiniz.",
        );

        return;
      }

      if (kullanici.aktifMi && aktifKullaniciSayisi <= 1) {
        toast.warning("Sistemdeki son aktif kullanıcı silinemez.");

        return;
      }

      setSilinecekKullanici(kullanici);
    },
    [aktifKullaniciSayisi, mevcutKullaniciId],
  );

  const silmeModaliniKapat = useCallback(() => {
    if (siliniyorMu) {
      return;
    }

    setSilinecekKullanici(null);
  }, [siliniyorMu]);

  const kullaniciyiSil = useCallback(async () => {
    if (!silinecekKullanici?.id || siliniyorMu) {
      return;
    }

    setSiliniyorMu(true);

    try {
      await panelKullanicisiSil(silinecekKullanici.id);

      toast.success("Kullanıcı başarıyla silindi.");

      setSilinecekKullanici(null);

      await kullanicilariYukle();
    } catch (error) {
      toast.error(
        apiHataMesajiGetir(error, "Kullanıcı silinirken bir hata oluştu."),
      );
    } finally {
      setSiliniyorMu(false);
    }
  }, [kullanicilariYukle, silinecekKullanici, siliniyorMu]);

  /*
   * Başka kullanıcının şifresini sıfırlama
   */
  const sifreSifirlamaModaliniAc = useCallback(
    (kullanici) => {
      if (!kullanici?.id) {
        return;
      }

      if (kullanici.id === mevcutKullaniciId) {
        toast.warning(
          "Kendi şifrenizi sıfırlayamazsınız. Şifremi Değiştir işlemini kullanın.",
        );

        return;
      }

      setSifresiSifirlanacakKullanici(kullanici);

      setSifreSifirlamaFormu({
        ...BOS_SIFRE_SIFIRLAMA_FORMU,
      });

      setSifreSifirlamaHatalari({});
    },
    [mevcutKullaniciId],
  );

  const sifreSifirlamaModaliniKapat = useCallback(() => {
    if (sifreSifirlaniyorMu) {
      return;
    }

    setSifresiSifirlanacakKullanici(null);

    setSifreSifirlamaFormu({
      ...BOS_SIFRE_SIFIRLAMA_FORMU,
    });

    setSifreSifirlamaHatalari({});
  }, [sifreSifirlaniyorMu]);

  const sifreSifirlamaAlaniniDegistir = useCallback((alanAdi, deger) => {
    setSifreSifirlamaFormu((mevcutForm) => ({
      ...mevcutForm,
      [alanAdi]: deger,
    }));

    setSifreSifirlamaHatalari((mevcutHatalar) => {
      if (!mevcutHatalar?.[alanAdi]) {
        return mevcutHatalar;
      }

      const yeniHatalar = {
        ...mevcutHatalar,
      };

      delete yeniHatalar[alanAdi];

      return yeniHatalar;
    });
  }, []);

  const kullaniciSifresiniSifirla = useCallback(
    async (event) => {
      event?.preventDefault?.();

      if (!sifresiSifirlanacakKullanici?.id || sifreSifirlaniyorMu) {
        return;
      }

      const dogrulama =
        panelKullanicisiSifreSifirlaSchema.safeParse(sifreSifirlamaFormu);

      if (!dogrulama.success) {
        setSifreSifirlamaHatalari(zodAlanHatalariniGetir(dogrulama.error));

        return;
      }

      setSifreSifirlaniyorMu(true);

      try {
        await panelKullanicisiSifreSifirla(
          sifresiSifirlanacakKullanici.id,
          dogrulama.data,
        );

        toast.success(
          `${sifresiSifirlanacakKullanici.adSoyad} kullanıcısının şifresi sıfırlandı.`,
        );

        setSifresiSifirlanacakKullanici(null);

        setSifreSifirlamaFormu({
          ...BOS_SIFRE_SIFIRLAMA_FORMU,
        });

        setSifreSifirlamaHatalari({});

        await kullanicilariYukle();
      } catch (error) {
        toast.error(
          apiHataMesajiGetir(
            error,
            "Kullanıcı şifresi sıfırlanırken bir hata oluştu.",
          ),
        );
      } finally {
        setSifreSifirlaniyorMu(false);
      }
    },
    [
      kullanicilariYukle,
      sifreSifirlamaFormu,
      sifreSifirlaniyorMu,
      sifresiSifirlanacakKullanici,
    ],
  );

  /*
   * Kendi şifresini değiştirme
   */
  const sifreDegistirmeModaliniAc = useCallback(() => {
    setSifreDegistirmeFormu({
      ...BOS_SIFRE_DEGISTIRME_FORMU,
    });

    setSifreDegistirmeHatalari({});

    setSifreDegistirmeModalAcikMi(true);
  }, []);

  const sifreDegistirmeModaliniKapat = useCallback(() => {
    if (sifreDegistiriliyorMu) {
      return;
    }

    setSifreDegistirmeModalAcikMi(false);

    setSifreDegistirmeFormu({
      ...BOS_SIFRE_DEGISTIRME_FORMU,
    });

    setSifreDegistirmeHatalari({});
  }, [sifreDegistiriliyorMu]);

  const sifreDegistirmeAlaniniDegistir = useCallback((alanAdi, deger) => {
    setSifreDegistirmeFormu((mevcutForm) => ({
      ...mevcutForm,
      [alanAdi]: deger,
    }));

    setSifreDegistirmeHatalari((mevcutHatalar) => {
      if (!mevcutHatalar?.[alanAdi]) {
        return mevcutHatalar;
      }

      const yeniHatalar = {
        ...mevcutHatalar,
      };

      delete yeniHatalar[alanAdi];

      return yeniHatalar;
    });
  }, []);

  const kendiSifresiniDegistir = useCallback(
    async (event) => {
      event?.preventDefault?.();

      if (sifreDegistiriliyorMu) {
        return;
      }

      const dogrulama =
        panelKullanicisiSifreDegistirSchema.safeParse(sifreDegistirmeFormu);

      if (!dogrulama.success) {
        setSifreDegistirmeHatalari(zodAlanHatalariniGetir(dogrulama.error));

        return;
      }

      setSifreDegistiriliyorMu(true);

      try {
        await kendiSifremiDegistir(dogrulama.data);

        toast.success("Şifreniz başarıyla değiştirildi.");

        setSifreDegistirmeModalAcikMi(false);

        setSifreDegistirmeFormu({
          ...BOS_SIFRE_DEGISTIRME_FORMU,
        });

        setSifreDegistirmeHatalari({});

        await kullanicilariYukle();
      } catch (error) {
        toast.error(
          apiHataMesajiGetir(
            error,
            "Şifreniz değiştirilirken bir hata oluştu.",
          ),
        );
      } finally {
        setSifreDegistiriliyorMu(false);
      }
    },
    [kullanicilariYukle, sifreDegistirmeFormu, sifreDegistiriliyorMu],
  );

  return {
    mevcutKullaniciId,

    kullanicilar,
    filtrelenmisKullanicilar,

    aramaMetni,
    durumFiltresi,

    aktifKullaniciSayisi,
    pasifKullaniciSayisi,
    aktifFiltreVarMi,

    yukleniyorMu,

    durumDegistirilenKullaniciId,

    formModalAcikMi,
    formModu,
    duzenlenecekKullanici,
    kullaniciFormu,
    kullaniciFormHatalari,
    kullaniciKaydediliyorMu,

    siliniyorMu,
    silinecekKullanici,

    sifresiSifirlanacakKullanici,
    sifreSifirlamaFormu,
    sifreSifirlamaHatalari,
    sifreSifirlaniyorMu,

    sifreDegistirmeModalAcikMi,
    sifreDegistirmeFormu,
    sifreDegistirmeHatalari,
    sifreDegistiriliyorMu,

    aramaMetniDegistir,
    durumFiltresiDegistir,
    filtreleriTemizle,

    yeniKullaniciModaliniAc,
    duzenlemeModaliniAc,
    formModaliniKapat,
    kullaniciFormAlaniniDegistir,
    kullaniciyiKaydet,

    kullaniciDurumunuDegistir,

    silmeModaliniAc,
    silmeModaliniKapat,
    kullaniciyiSil,

    sifreSifirlamaModaliniAc,
    sifreSifirlamaModaliniKapat,
    sifreSifirlamaAlaniniDegistir,
    kullaniciSifresiniSifirla,

    sifreDegistirmeModaliniAc,
    sifreDegistirmeModaliniKapat,
    sifreDegistirmeAlaniniDegistir,
    kendiSifresiniDegistir,

    kullanicilariYukle,
  };
}
