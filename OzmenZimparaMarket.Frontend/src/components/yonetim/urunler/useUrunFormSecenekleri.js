import { useCallback, useEffect, useRef, useState } from "react";

import { toast } from "react-toastify";

import { yonetimKategorileriniGetir } from "../../../api/servisler/kategoriServisi";

import { yonetimUrunDetayTanimlariniGetir } from "../../../api/servisler/urunDetayTanimiServisi";

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

export default function useUrunFormSecenekleri() {
  const [kategoriler, setKategoriler] = useState([]);

  const [urunDetayTanimlari, setUrunDetayTanimlari] = useState([]);

  const [kategorilerYukleniyorMu, setKategorilerYukleniyorMu] = useState(true);

  const [urunDetayTanimlariYukleniyorMu, setUrunDetayTanimlariYukleniyorMu] =
    useState(false);

  const detayTanimlariYuklendiRef = useRef(false);

  const detayTanimlariIstekRef = useRef(null);

  const kategorileriYukle = useCallback(async () => {
    setKategorilerYukleniyorMu(true);

    try {
      const sonuc = await yonetimKategorileriniGetir();

      setKategoriler(Array.isArray(sonuc) ? sonuc : []);

      return Array.isArray(sonuc) ? sonuc : [];
    } catch (error) {
      setKategoriler([]);

      toast.error(
        apiHataMesajiGetir(error, "Kategoriler yüklenirken bir hata oluştu."),
      );

      return [];
    } finally {
      setKategorilerYukleniyorMu(false);
    }
  }, []);

  const urunDetayTanimlariniYukle = useCallback(
    async (zorlaYenile = false) => {
      /*
       * Daha önce başarıyla yüklendiyse
       * yeniden API isteği atma.
       */
      if (!zorlaYenile && detayTanimlariYuklendiRef.current) {
        return urunDetayTanimlari;
      }

      /*
       * Aynı anda iki farklı yer
       * yükleme isterse ikinci API
       * isteğini atma. Devam eden
       * isteği paylaş.
       */
      if (detayTanimlariIstekRef.current) {
        return detayTanimlariIstekRef.current;
      }

      setUrunDetayTanimlariYukleniyorMu(true);

      const istek = yonetimUrunDetayTanimlariniGetir()
        .then((sonuc) => {
          const tanimlar = Array.isArray(sonuc) ? sonuc : [];

          setUrunDetayTanimlari(tanimlar);

          detayTanimlariYuklendiRef.current = true;

          return tanimlar;
        })
        .catch((error) => {
          detayTanimlariYuklendiRef.current = false;

          setUrunDetayTanimlari([]);

          toast.error(
            apiHataMesajiGetir(
              error,
              "Ürün özellikleri yüklenirken bir hata oluştu.",
            ),
          );

          throw error;
        })
        .finally(() => {
          detayTanimlariIstekRef.current = null;

          setUrunDetayTanimlariYukleniyorMu(false);
        });

      detayTanimlariIstekRef.current = istek;

      return istek;
    },
    [urunDetayTanimlari],
  );

  /*
   * Eski kullanım ihtiyacı için bırakıyoruz.
   *
   * Manuel olarak bütün form seçeneklerini
   * yenilemek gerekirse kullanılabilir.
   */
  const secenekleriYukle = useCallback(async () => {
    const [kategorilerSonucu, detayTanimlariSonucu] = await Promise.allSettled([
      kategorileriYukle(),
      urunDetayTanimlariniYukle(true),
    ]);

    return {
      kategoriler:
        kategorilerSonucu.status === "fulfilled" ? kategorilerSonucu.value : [],

      urunDetayTanimlari:
        detayTanimlariSonucu.status === "fulfilled"
          ? detayTanimlariSonucu.value
          : [],
    };
  }, [kategorileriYukle, urunDetayTanimlariniYukle]);

  useEffect(() => {
    let iptalEdildiMi = false;

    Promise.resolve().then(async () => {
      if (iptalEdildiMi) {
        return;
      }

      await kategorileriYukle();
    });

    return () => {
      iptalEdildiMi = true;
    };
  }, [kategorileriYukle]);

  return {
    kategoriler,
    urunDetayTanimlari,

    /*
     * Eski kullanan yerleri hemen
     * kırmamak için kategorilerin
     * yüklenme durumunu ana loading
     * olarak koruyoruz.
     */
    yukleniyorMu: kategorilerYukleniyorMu,

    kategorilerYukleniyorMu,

    urunDetayTanimlariYukleniyorMu,

    kategorileriYukle,

    urunDetayTanimlariniYukle,

    secenekleriYukle,
  };
}
