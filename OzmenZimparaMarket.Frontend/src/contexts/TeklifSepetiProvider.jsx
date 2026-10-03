import { useCallback, useEffect, useMemo, useState } from "react";

import TeklifSepetiContext from "./TeklifSepetiContext";

const STORAGE_KEY = "ozmen-zimpara-teklif-sepeti-v1";

function pozitifSayiGetir(deger, varsayilanDeger = 1) {
  const sayi = Number(deger);

  if (!Number.isFinite(sayi) || sayi <= 0) {
    return varsayilanDeger;
  }

  return sayi;
}

function urunIdGetir(urun) {
  const id = Number(urun?.id);

  return Number.isInteger(id) && id > 0 ? id : null;
}

function secimleriNormalizeEt(secimler) {
  if (!Array.isArray(secimler)) {
    return [];
  }

  return secimler
    .filter((secim) => secim && typeof secim === "object")
    .map((secim) => ({
      ...secim,
    }));
}

function sabitJsonDegeriOlustur(deger) {
  if (deger === null || typeof deger !== "object") {
    return JSON.stringify(deger);
  }

  if (Array.isArray(deger)) {
    return `[${deger.map((item) => sabitJsonDegeriOlustur(item)).join(",")}]`;
  }

  const anahtarlar = Object.keys(deger).sort();

  return `{${anahtarlar
    .map(
      (anahtar) =>
        `${JSON.stringify(anahtar)}:${sabitJsonDegeriOlustur(deger[anahtar])}`,
    )
    .join(",")}}`;
}

function satirAnahtariOlustur(urunId, secimler) {
  const secimAnahtari = sabitJsonDegeriOlustur(secimler);

  return `${urunId}:${secimAnahtari}`;
}

function sepetSatiriniNormalizeEt(satir) {
  const urunId = urunIdGetir({
    id: satir?.urunId,
  });

  if (!urunId) {
    return null;
  }

  const secimler = secimleriNormalizeEt(satir?.secimler);

  return {
    satirAnahtari:
      satir?.satirAnahtari || satirAnahtariOlustur(urunId, secimler),

    urunId,

    urunAdi: String(satir?.urunAdi ?? ""),

    urunKodu: String(satir?.urunKodu ?? ""),
    kategoriAdi: String(satir?.kategoriAdi ?? ""),

    seoUrl: String(satir?.seoUrl ?? ""),

    gorselYolu: satir?.gorselYolu ?? null,

    satisBirimi: satir?.satisBirimi ?? null,

    satisBirimiAdi: String(satir?.satisBirimiAdi ?? ""),

    miktar: pozitifSayiGetir(satir?.miktar),

    secimler,
  };
}

function localStorageSepetiniOku() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const kayit = window.localStorage.getItem(STORAGE_KEY);

    if (!kayit) {
      return [];
    }

    const veri = JSON.parse(kayit);

    if (!Array.isArray(veri)) {
      return [];
    }

    return veri.map(sepetSatiriniNormalizeEt).filter(Boolean);
  } catch {
    return [];
  }
}

function TeklifSepetiProvider({ children }) {
  const [sepetUrunleri, setSepetUrunleri] = useState(localStorageSepetiniOku);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sepetUrunleri));
    } catch {
      /*
       * LocalStorage kullanılamıyorsa
       * sepet mevcut oturum boyunca
       * React state içerisinde çalışır.
       */
    }
  }, [sepetUrunleri]);

  const urunEkle = useCallback((urun, { miktar = 1, secimler = [] } = {}) => {
    const urunId = urunIdGetir(urun);

    if (!urunId) {
      return false;
    }

    const temizSecimler = secimleriNormalizeEt(secimler);

    const satirAnahtari = satirAnahtariOlustur(urunId, temizSecimler);

    const eklenecekMiktar = pozitifSayiGetir(miktar);

    setSepetUrunleri((mevcutSepet) => {
      const mevcutSatir = mevcutSepet.find(
        (satir) => satir.satirAnahtari === satirAnahtari,
      );

      if (mevcutSatir) {
        return mevcutSepet.map((satir) =>
          satir.satirAnahtari === satirAnahtari
            ? {
                ...satir,

                urunAdi: urun?.urunAdi ?? satir.urunAdi,

                urunKodu: urun?.urunKodu ?? satir.urunKodu,
                kategoriAdi: urun?.kategoriAdi ?? satir.kategoriAdi,

                seoUrl: urun?.seoUrl ?? satir.seoUrl,

                gorselYolu: urun?.gorselYolu ?? satir.gorselYolu,

                satisBirimi: urun?.satisBirimi ?? satir.satisBirimi,

                satisBirimiAdi: urun?.satisBirimiAdi ?? satir.satisBirimiAdi,

                miktar: satir.miktar + eklenecekMiktar,
              }
            : satir,
        );
      }

      return [
        ...mevcutSepet,

        {
          satirAnahtari,

          urunId,

          urunAdi: urun?.urunAdi ?? "",

          urunKodu: urun?.urunKodu ?? "",
          kategoriAdi: urun?.kategoriAdi ?? "",

          seoUrl: urun?.seoUrl ?? "",

          gorselYolu: urun?.gorselYolu ?? null,

          satisBirimi: urun?.satisBirimi ?? null,

          satisBirimiAdi: urun?.satisBirimiAdi ?? "",

          miktar: eklenecekMiktar,

          secimler: temizSecimler,
        },
      ];
    });

    return true;
  }, []);

  const urunKaldir = useCallback((satirAnahtari) => {
    setSepetUrunleri((mevcutSepet) =>
      mevcutSepet.filter((satir) => satir.satirAnahtari !== satirAnahtari),
    );
  }, []);

  const miktarDegistir = useCallback((satirAnahtari, yeniMiktar) => {
    const miktar = Number(yeniMiktar);

    if (!Number.isFinite(miktar)) {
      return;
    }

    if (miktar <= 0) {
      setSepetUrunleri((mevcutSepet) =>
        mevcutSepet.filter((satir) => satir.satirAnahtari !== satirAnahtari),
      );

      return;
    }

    setSepetUrunleri((mevcutSepet) =>
      mevcutSepet.map((satir) =>
        satir.satirAnahtari === satirAnahtari
          ? {
              ...satir,
              miktar,
            }
          : satir,
      ),
    );
  }, []);

  const sepetiTemizle = useCallback(() => {
    setSepetUrunleri([]);
  }, []);

  const sepetteMi = useCallback(
    (urunId) => {
      const id = Number(urunId);

      if (!Number.isInteger(id) || id <= 0) {
        return false;
      }

      return sepetUrunleri.some((satir) => satir.urunId === id);
    },
    [sepetUrunleri],
  );

  const sepetKalemSayisi = sepetUrunleri.length;

  const toplamMiktar = useMemo(() => {
    return sepetUrunleri.reduce(
      (toplam, satir) => toplam + pozitifSayiGetir(satir.miktar),
      0,
    );
  }, [sepetUrunleri]);

  const sepetBosMu = sepetKalemSayisi === 0;

  const contextDegeri = useMemo(
    () => ({
      sepetUrunleri,

      sepetKalemSayisi,
      toplamMiktar,
      sepetBosMu,

      urunEkle,
      urunKaldir,
      miktarDegistir,
      sepetiTemizle,
      sepetteMi,
    }),
    [
      sepetUrunleri,

      sepetKalemSayisi,
      toplamMiktar,
      sepetBosMu,

      urunEkle,
      urunKaldir,
      miktarDegistir,
      sepetiTemizle,
      sepetteMi,
    ],
  );

  return (
    <TeklifSepetiContext.Provider value={contextDegeri}>
      {children}
    </TeklifSepetiContext.Provider>
  );
}

export default TeklifSepetiProvider;
