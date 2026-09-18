import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { toast } from "react-toastify";

import { mevcutOturumGetir } from "../../../api/servisler/authServisi";
import { yonetimPaneliOzetGetir } from "../../../api/servisler/yonetimPaneliServisi";

const BOS_OZET = {
  kategoriler: {
    toplam: 0,
    aktif: 0,
    pasif: 0,
    anaSayfadaGosterilen: 0,
  },

  urunler: {
    toplam: 0,
    aktif: 0,
    pasif: 0,
    oneCikan: 0,
    gorselsiz: 0,
    teknikDetaysiz: 0,
  },

  teknikOzellikler: {
    toplam: 0,
    aktif: 0,
    pasif: 0,
  },

  kullanicilar: {
    toplam: 0,
    aktif: 0,
    pasif: 0,
  },

  sonEklenenUrunler: [],
};

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

export default function useYonetimPaneli() {
  const [ozet, setOzet] = useState(BOS_OZET);

  const [yukleniyorMu, setYukleniyorMu] = useState(true);

  const [yenileniyorMu, setYenileniyorMu] = useState(false);

  const [hataMesaji, setHataMesaji] = useState("");

  const istekSirasiRef = useRef(0);

  const oturum = useMemo(() => mevcutOturumGetir(), []);

  const kullaniciAdi =
    oturum?.adSoyad?.trim() || oturum?.kullaniciAdi?.trim() || "Yönetici";

  const ozetiYukle = useCallback(async ({ manuelMi = false } = {}) => {
    const istekSirasi = ++istekSirasiRef.current;

    if (manuelMi) {
      setYenileniyorMu(true);
    } else {
      setYukleniyorMu(true);
    }

    setHataMesaji("");

    try {
      const sonuc = await yonetimPaneliOzetGetir();

      if (istekSirasi !== istekSirasiRef.current) {
        return;
      }

      setOzet({
        kategoriler: {
          toplam: Number(sonuc?.kategoriler?.toplam) || 0,

          aktif: Number(sonuc?.kategoriler?.aktif) || 0,

          pasif: Number(sonuc?.kategoriler?.pasif) || 0,

          anaSayfadaGosterilen:
            Number(sonuc?.kategoriler?.anaSayfadaGosterilen) || 0,
        },

        urunler: {
          toplam: Number(sonuc?.urunler?.toplam) || 0,

          aktif: Number(sonuc?.urunler?.aktif) || 0,

          pasif: Number(sonuc?.urunler?.pasif) || 0,

          oneCikan: Number(sonuc?.urunler?.oneCikan) || 0,

          gorselsiz: Number(sonuc?.urunler?.gorselsiz) || 0,

          teknikDetaysiz: Number(sonuc?.urunler?.teknikDetaysiz) || 0,
        },

        teknikOzellikler: {
          toplam: Number(sonuc?.teknikOzellikler?.toplam) || 0,

          aktif: Number(sonuc?.teknikOzellikler?.aktif) || 0,

          pasif: Number(sonuc?.teknikOzellikler?.pasif) || 0,
        },

        kullanicilar: {
          toplam: Number(sonuc?.kullanicilar?.toplam) || 0,

          aktif: Number(sonuc?.kullanicilar?.aktif) || 0,

          pasif: Number(sonuc?.kullanicilar?.pasif) || 0,
        },

        sonEklenenUrunler: Array.isArray(sonuc?.sonEklenenUrunler)
          ? sonuc.sonEklenenUrunler
          : [],
      });

      if (manuelMi) {
        toast.success("Dashboard verileri yenilendi.");
      }
    } catch (error) {
      if (istekSirasi !== istekSirasiRef.current) {
        return;
      }

      const mesaj = apiHataMesajiGetir(
        error,
        "Yönetim paneli verileri yüklenirken bir hata oluştu.",
      );

      setHataMesaji(mesaj);

      if (manuelMi) {
        toast.error(mesaj);
      }
    } finally {
      if (istekSirasi === istekSirasiRef.current) {
        setYukleniyorMu(false);
        setYenileniyorMu(false);
      }
    }
  }, []);

  useEffect(() => {
    let iptalEdildiMi = false;

    Promise.resolve().then(() => {
      if (!iptalEdildiMi) {
        return ozetiYukle();
      }

      return undefined;
    });

    return () => {
      iptalEdildiMi = true;
    };
  }, [ozetiYukle]);

  const yenile = useCallback(() => {
    return ozetiYukle({
      manuelMi: true,
    });
  }, [ozetiYukle]);

  return {
    ozet,
    kullaniciAdi,

    yukleniyorMu,
    yenileniyorMu,

    hataMesaji,

    yenile,
  };
}
