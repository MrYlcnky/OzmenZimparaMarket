import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { firmaGenelBilgisiGetir } from "../api/servisler/firmaServisi";

import PublicSiteContext from "./PublicSiteContext";

const BOS_FIRMA_BILGISI = {
  sirketAdi: "",

  hakkimizda: "",
  vizyonumuz: "",
  misyonumuz: "",
  stratejimiz: "",
  kalitePolitikamiz: "",
  kvkk: "",

  iletisimNo: "",
  whatsappNo: "",
  eposta: "",

  acikAdres: "",
  il: "",
  ilce: "",

  googleHaritaBaglantisi: "",
  googleHaritaGommeBaglantisi: "",

  guncellemeTarihi: null,
};

function firmaBilgisiniNormalizeEt(veri) {
  return {
    sirketAdi: veri?.sirketAdi ?? "",

    hakkimizda: veri?.hakkimizda ?? "",

    vizyonumuz: veri?.vizyonumuz ?? "",

    misyonumuz: veri?.misyonumuz ?? "",

    stratejimiz: veri?.stratejimiz ?? "",

    kalitePolitikamiz: veri?.kalitePolitikamiz ?? "",

    kvkk: veri?.kvkk ?? "",

    iletisimNo: veri?.iletisimNo ?? "",

    whatsappNo: veri?.whatsappNo ?? "",

    eposta: veri?.eposta ?? "",

    acikAdres: veri?.acikAdres ?? "",

    il: veri?.il ?? "",

    ilce: veri?.ilce ?? "",

    googleHaritaBaglantisi: veri?.googleHaritaBaglantisi ?? "",

    googleHaritaGommeBaglantisi: veri?.googleHaritaGommeBaglantisi ?? "",

    guncellemeTarihi: veri?.guncellemeTarihi ?? null,
  };
}

function apiHataMesajiGetir(error, varsayilanMesaj) {
  const veri = error?.response?.data;

  if (typeof veri?.mesaj === "string" && veri.mesaj.trim()) {
    return veri.mesaj;
  }

  if (typeof veri?.message === "string" && veri.message.trim()) {
    return veri.message;
  }

  if (typeof veri?.title === "string" && veri.title.trim()) {
    return veri.title;
  }

  if (typeof veri === "string" && veri.trim()) {
    return veri;
  }

  return varsayilanMesaj;
}

function PublicSiteProvider({ children }) {
  const [firmaBilgisi, setFirmaBilgisi] = useState({
    ...BOS_FIRMA_BILGISI,
  });

  const [yukleniyorMu, setYukleniyorMu] = useState(true);

  const [hataMesaji, setHataMesaji] = useState("");

  const istekSirasiRef = useRef(0);

  const firmaBilgisiniYukle = useCallback(async () => {
    const istekSirasi = ++istekSirasiRef.current;

    setYukleniyorMu(true);
    setHataMesaji("");

    try {
      const veri = await firmaGenelBilgisiGetir();

      if (istekSirasi !== istekSirasiRef.current) {
        return;
      }

      setFirmaBilgisi(firmaBilgisiniNormalizeEt(veri));
    } catch (error) {
      if (istekSirasi !== istekSirasiRef.current) {
        return;
      }

      setFirmaBilgisi({
        ...BOS_FIRMA_BILGISI,
      });

      setHataMesaji(apiHataMesajiGetir(error, "Firma bilgileri alınamadı."));
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
        return firmaBilgisiniYukle();
      }

      return undefined;
    });

    return () => {
      iptalEdildiMi = true;
    };
  }, [firmaBilgisiniYukle]);

  const tamAdres = useMemo(() => {
    const parcalar = [
      firmaBilgisi.acikAdres,
      firmaBilgisi.ilce,
      firmaBilgisi.il,
    ]
      .map((deger) => String(deger ?? "").trim())
      .filter(Boolean);

    return parcalar.join(", ");
  }, [firmaBilgisi.acikAdres, firmaBilgisi.il, firmaBilgisi.ilce]);

  const whatsappNumarasi = useMemo(() => {
    return String(firmaBilgisi.whatsappNo ?? "").replace(/\D/g, "");
  }, [firmaBilgisi.whatsappNo]);

  const whatsappBaglantisi = useMemo(() => {
    if (!whatsappNumarasi) {
      return "";
    }

    return `https://wa.me/${whatsappNumarasi}`;
  }, [whatsappNumarasi]);

  const telefonBaglantisi = useMemo(() => {
    const telefon = String(firmaBilgisi.iletisimNo ?? "").trim();

    if (!telefon) {
      return "";
    }

    const temizTelefon = telefon.replace(/[^\d+]/g, "");

    return temizTelefon ? `tel:${temizTelefon}` : "";
  }, [firmaBilgisi.iletisimNo]);

  const epostaBaglantisi = useMemo(() => {
    const eposta = String(firmaBilgisi.eposta ?? "").trim();

    return eposta ? `mailto:${eposta}` : "";
  }, [firmaBilgisi.eposta]);

  const contextDegeri = useMemo(
    () => ({
      firmaBilgisi,

      yukleniyorMu,
      hataMesaji,

      tamAdres,

      whatsappNumarasi,
      whatsappBaglantisi,

      telefonBaglantisi,
      epostaBaglantisi,

      firmaBilgisiniYukle,
    }),
    [
      firmaBilgisi,

      yukleniyorMu,
      hataMesaji,

      tamAdres,

      whatsappNumarasi,
      whatsappBaglantisi,

      telefonBaglantisi,
      epostaBaglantisi,

      firmaBilgisiniYukle,
    ],
  );

  return (
    <PublicSiteContext.Provider value={contextDegeri}>
      {children}
    </PublicSiteContext.Provider>
  );
}

export default PublicSiteProvider;
