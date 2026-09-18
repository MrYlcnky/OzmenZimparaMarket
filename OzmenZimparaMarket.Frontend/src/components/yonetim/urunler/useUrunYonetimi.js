import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { toast } from "react-toastify";

import {
  urunDurumDegistir,
  urunSil,
  urunTopluSil,
  yonetimUrunleriniFiltrele,
} from "../../../api/servisler/urunServisi";

const BASLANGIC_FILTRELERI = {
  aramaMetni: "",
  kategoriId: "tum",
  aktifMi: "tum",
  oneCikanMi: "tum",
  satisBirimi: "tum",
  siralama: "1",
  sayfaNo: 1,
  sayfaBoyutu: 20,
};

export const urunSiralamaSecenekleri = [
  {
    value: "1",
    label: "Sıra No - Artan",
  },
  {
    value: "2",
    label: "Sıra No - Azalan",
  },
  {
    value: "3",
    label: "Ürün Adı - A → Z",
  },
  {
    value: "4",
    label: "Ürün Adı - Z → A",
  },
  {
    value: "5",
    label: "Yeni Eklenenler",
  },
  {
    value: "6",
    label: "Eski Eklenenler",
  },
];

export const urunDurumSecenekleri = [
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

export const urunOneCikanSecenekleri = [
  {
    value: "tum",
    label: "Tüm Ürünler",
  },
  {
    value: "one-cikan",
    label: "Öne Çıkanlar",
  },
  {
    value: "one-cikmayan",
    label: "Öne Çıkmayanlar",
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

  if (typeof veri?.title === "string" && veri.title.trim()) {
    return veri.title;
  }

  if (typeof veri === "string" && veri.trim()) {
    return veri;
  }

  return varsayilanMesaj;
}

function nullableSayiyaDonustur(deger) {
  if (
    deger === "" ||
    deger === null ||
    deger === undefined ||
    deger === "tum"
  ) {
    return null;
  }

  const sayi = Number(deger);

  return Number.isFinite(sayi) ? sayi : null;
}

function aktiflikFiltresiDonustur(deger) {
  if (deger === "aktif") {
    return true;
  }

  if (deger === "pasif") {
    return false;
  }

  return null;
}

function oneCikanFiltresiDonustur(deger) {
  if (deger === "one-cikan") {
    return true;
  }

  if (deger === "one-cikmayan") {
    return false;
  }

  return null;
}

export default function useUrunYonetimi() {
  const [urunler, setUrunler] = useState([]);

  const [filtreler, setFiltreler] = useState({
    ...BASLANGIC_FILTRELERI,
  });

  const [gecikmeliAramaMetni, setGecikmeliAramaMetni] = useState("");

  const [sayfalama, setSayfalama] = useState({
    sayfaNo: 1,
    sayfaBoyutu: 20,
    toplamKayitSayisi: 0,
    toplamSayfaSayisi: 0,
  });

  const [yukleniyorMu, setYukleniyorMu] = useState(true);

  const [durumDegistirilenUrunId, setDurumDegistirilenUrunId] = useState(null);

  const [siliniyorMu, setSiliniyorMu] = useState(false);

  const [silinecekUrun, setSilinecekUrun] = useState(null);

  /*
   * Toplu seçim.
   *
   * ID listesi sayfa değişse bile korunur.
   */
  const [seciliUrunIdleri, setSeciliUrunIdleri] = useState([]);

  /*
   * Server-side pagination nedeniyle seçilen ürünlerin
   * görüntülenecek bilgilerini burada snapshot olarak tutuyoruz.
   */
  const [seciliUrunKayitlari, setSeciliUrunKayitlari] = useState({});

  /*
   * Toplu silme.
   */
  const [topluSilmeModalAcik, setTopluSilmeModalAcik] = useState(false);

  const [topluSilmeDevamEdiyor, setTopluSilmeDevamEdiyor] = useState(false);

  const istekSirasiRef = useRef(0);

  useEffect(() => {
    const zamanlayici = window.setTimeout(() => {
      setGecikmeliAramaMetni(filtreler.aramaMetni.trim());
    }, 350);

    return () => {
      window.clearTimeout(zamanlayici);
    };
  }, [filtreler.aramaMetni]);

  const urunleriYukle = useCallback(async () => {
    const istekSirasi = ++istekSirasiRef.current;

    setYukleniyorMu(true);

    try {
      const sonuc = await yonetimUrunleriniFiltrele({
        aramaMetni: gecikmeliAramaMetni,

        kategoriId: nullableSayiyaDonustur(filtreler.kategoriId),

        altKategorilerDahilMi: true,

        aktifMi: aktiflikFiltresiDonustur(filtreler.aktifMi),

        oneCikanMi: oneCikanFiltresiDonustur(filtreler.oneCikanMi),

        satisBirimi: nullableSayiyaDonustur(filtreler.satisBirimi),

        teknikDetayFiltreleri: [],

        sayfaNo: filtreler.sayfaNo,

        sayfaBoyutu: filtreler.sayfaBoyutu,

        siralama: Number(filtreler.siralama),
      });

      if (istekSirasi !== istekSirasiRef.current) {
        return;
      }

      const kayitlar = Array.isArray(sonuc?.kayitlar) ? sonuc.kayitlar : [];

      setUrunler(kayitlar);

      /*
       * Seçili ürünlerden mevcut sayfada tekrar gelenler varsa
       * snapshot bilgisini güncelliyoruz.
       */
      setSeciliUrunKayitlari((mevcutKayitlar) => {
        let degisiklikVarMi = false;

        const yeniKayitlar = {
          ...mevcutKayitlar,
        };

        kayitlar.forEach((urun) => {
          if (!mevcutKayitlar[urun.id]) {
            return;
          }

          yeniKayitlar[urun.id] = urun;

          degisiklikVarMi = true;
        });

        return degisiklikVarMi ? yeniKayitlar : mevcutKayitlar;
      });

      setSayfalama({
        sayfaNo: sonuc?.sayfaNo ?? filtreler.sayfaNo,

        sayfaBoyutu: sonuc?.sayfaBoyutu ?? filtreler.sayfaBoyutu,

        toplamKayitSayisi: sonuc?.toplamKayitSayisi ?? 0,

        toplamSayfaSayisi: sonuc?.toplamSayfaSayisi ?? 0,
      });
    } catch (error) {
      if (istekSirasi !== istekSirasiRef.current) {
        return;
      }

      setUrunler([]);

      setSayfalama({
        sayfaNo: filtreler.sayfaNo,

        sayfaBoyutu: filtreler.sayfaBoyutu,

        toplamKayitSayisi: 0,

        toplamSayfaSayisi: 0,
      });

      toast.error(
        apiHataMesajiGetir(error, "Ürünler yüklenirken bir hata oluştu."),
      );
    } finally {
      if (istekSirasi === istekSirasiRef.current) {
        setYukleniyorMu(false);
      }
    }
  }, [
    gecikmeliAramaMetni,
    filtreler.kategoriId,
    filtreler.aktifMi,
    filtreler.oneCikanMi,
    filtreler.satisBirimi,
    filtreler.siralama,
    filtreler.sayfaNo,
    filtreler.sayfaBoyutu,
  ]);

  useEffect(() => {
    let iptalEdildiMi = false;

    Promise.resolve().then(() => {
      if (!iptalEdildiMi) {
        return urunleriYukle();
      }

      return undefined;
    });

    return () => {
      iptalEdildiMi = true;
    };
  }, [urunleriYukle]);

  const urunSecimleriniTemizle = useCallback(() => {
    if (topluSilmeDevamEdiyor) {
      return;
    }

    setSeciliUrunIdleri([]);

    setSeciliUrunKayitlari({});
  }, [topluSilmeDevamEdiyor]);

  const filtreDegistir = useCallback(
    (alanAdi, deger) => {
      /*
       * Filtre değiştiğinde görünmeyen eski ürünlerin
       * yanlışlıkla toplu silinmesini engelliyoruz.
       *
       * Sayfa değişiminde ise seçim korunur.
       */
      urunSecimleriniTemizle();

      setFiltreler((mevcutFiltreler) => ({
        ...mevcutFiltreler,

        [alanAdi]: deger,

        sayfaNo: 1,
      }));
    },
    [urunSecimleriniTemizle],
  );

  const sayfaDegistir = useCallback((sayfaNo) => {
    setFiltreler((mevcutFiltreler) => ({
      ...mevcutFiltreler,

      sayfaNo,
    }));
  }, []);

  const sayfaBoyutuDegistir = useCallback(
    (sayfaBoyutu) => {
      urunSecimleriniTemizle();

      setFiltreler((mevcutFiltreler) => ({
        ...mevcutFiltreler,

        sayfaNo: 1,

        sayfaBoyutu: Number(sayfaBoyutu),
      }));
    },
    [urunSecimleriniTemizle],
  );

  const filtreleriTemizle = useCallback(() => {
    urunSecimleriniTemizle();

    setFiltreler({
      ...BASLANGIC_FILTRELERI,
    });

    setGecikmeliAramaMetni("");
  }, [urunSecimleriniTemizle]);

  const urunDurumunuDegistir = useCallback(
    async (urun) => {
      if (!urun?.id || durumDegistirilenUrunId) {
        return;
      }

      const yeniDurum = !urun.aktifMi;

      setDurumDegistirilenUrunId(urun.id);

      try {
        await urunDurumDegistir(urun.id, yeniDurum);

        /*
         * Durumu değişen ürün aktif/pasif filtresi nedeniyle
         * görünümden çıkabileceğinden seçimden çıkarıyoruz.
         */
        setSeciliUrunIdleri((mevcutIdler) =>
          mevcutIdler.filter((id) => id !== urun.id),
        );

        setSeciliUrunKayitlari((mevcutKayitlar) => {
          if (!mevcutKayitlar[urun.id]) {
            return mevcutKayitlar;
          }

          const yeniKayitlar = {
            ...mevcutKayitlar,
          };

          delete yeniKayitlar[urun.id];

          return yeniKayitlar;
        });

        toast.success(
          yeniDurum
            ? "Ürün aktif hale getirildi."
            : "Ürün pasif hale getirildi.",
        );

        await urunleriYukle();
      } catch (error) {
        toast.error(
          apiHataMesajiGetir(
            error,
            "Ürün durumu değiştirilirken bir hata oluştu.",
          ),
        );
      } finally {
        setDurumDegistirilenUrunId(null);
      }
    },
    [durumDegistirilenUrunId, urunleriYukle],
  );

  const silmeModaliniAc = useCallback((urun) => {
    setSilinecekUrun(urun ?? null);
  }, []);

  const silmeModaliniKapat = useCallback(() => {
    if (siliniyorMu) {
      return;
    }

    setSilinecekUrun(null);
  }, [siliniyorMu]);

  const urunuSil = useCallback(async () => {
    if (!silinecekUrun?.id || siliniyorMu) {
      return;
    }

    setSiliniyorMu(true);

    try {
      await urunSil(silinecekUrun.id);

      const silinenUrunId = silinecekUrun.id;

      /*
       * Tekli silinen ürün seçili kayıtlar arasındaysa
       * toplu seçimden de çıkar.
       */
      setSeciliUrunIdleri((mevcutIdler) =>
        mevcutIdler.filter((id) => id !== silinenUrunId),
      );

      setSeciliUrunKayitlari((mevcutKayitlar) => {
        if (!mevcutKayitlar[silinenUrunId]) {
          return mevcutKayitlar;
        }

        const yeniKayitlar = {
          ...mevcutKayitlar,
        };

        delete yeniKayitlar[silinenUrunId];

        return yeniKayitlar;
      });

      toast.success("Ürün başarıyla silindi.");

      const sonKayitMi = urunler.length === 1;

      const oncekiSayfayaDon = sonKayitMi && filtreler.sayfaNo > 1;

      setSilinecekUrun(null);

      if (oncekiSayfayaDon) {
        setFiltreler((mevcutFiltreler) => ({
          ...mevcutFiltreler,

          sayfaNo: mevcutFiltreler.sayfaNo - 1,
        }));

        return;
      }

      await urunleriYukle();
    } catch (error) {
      toast.error(
        apiHataMesajiGetir(error, "Ürün silinirken bir hata oluştu."),
      );
    } finally {
      setSiliniyorMu(false);
    }
  }, [
    filtreler.sayfaNo,
    silinecekUrun,
    siliniyorMu,
    urunler.length,
    urunleriYukle,
  ]);

  /*
   * DataTable kontrollü seçim değişikliği.
   *
   * DataTable farklı sayfadaki seçili ID'leri de
   * gönderdiği için yalnızca mevcut sayfayı değil,
   * bütün seçimi koruyoruz.
   */
  const urunSecimleriDegisti = useCallback(
    (idListesi) => {
      if (topluSilmeDevamEdiyor) {
        return;
      }

      const temizIdListesi = [
        ...new Set(
          (Array.isArray(idListesi) ? idListesi : [])
            .map((id) => Number(id))
            .filter((id) => Number.isInteger(id) && id > 0),
        ),
      ];

      const seciliIdSet = new Set(temizIdListesi);

      setSeciliUrunIdleri(temizIdListesi);

      setSeciliUrunKayitlari((mevcutKayitlar) => {
        const yeniKayitlar = {};

        /*
         * Önceden başka sayfalardan seçilmiş kayıtları koru.
         */
        temizIdListesi.forEach((id) => {
          if (mevcutKayitlar[id]) {
            yeniKayitlar[id] = mevcutKayitlar[id];
          }
        });

        /*
         * Mevcut sayfadaki seçili kayıtları güncel halleriyle ekle.
         */
        urunler.forEach((urun) => {
          if (seciliIdSet.has(urun.id)) {
            yeniKayitlar[urun.id] = urun;
          }
        });

        return yeniKayitlar;
      });
    },
    [topluSilmeDevamEdiyor, urunler],
  );

  const topluSilmeModaliniAc = useCallback(() => {
    if (topluSilmeDevamEdiyor || seciliUrunIdleri.length === 0) {
      return;
    }

    setTopluSilmeModalAcik(true);
  }, [topluSilmeDevamEdiyor, seciliUrunIdleri.length]);

  const topluSilmeModaliniKapat = useCallback(() => {
    if (topluSilmeDevamEdiyor) {
      return;
    }

    setTopluSilmeModalAcik(false);
  }, [topluSilmeDevamEdiyor]);

  const seciliUrunler = useMemo(
    () =>
      seciliUrunIdleri.map(
        (id) =>
          seciliUrunKayitlari[id] ?? {
            id,
            urunAdi: `Ürün #${id}`,
            urunKodu: "",
            kategoriAdi: "",
          },
      ),
    [seciliUrunIdleri, seciliUrunKayitlari],
  );

  const urunleriTopluSil = useCallback(async () => {
    if (topluSilmeDevamEdiyor || seciliUrunIdleri.length === 0) {
      return;
    }

    setTopluSilmeDevamEdiyor(true);

    try {
      const sonuc = await urunTopluSil(seciliUrunIdleri);

      const silinenKayitSayisi = Number(sonuc?.silinenKayitSayisi) || 0;

      const silinemeyenKayitSayisi = Number(sonuc?.silinemeyenKayitSayisi) || 0;

      /*
       * Backend işlemi sonuçlandıktan sonra seçimleri
       * ve modalı temizliyoruz.
       */
      setSeciliUrunIdleri([]);

      setSeciliUrunKayitlari({});

      setTopluSilmeModalAcik(false);

      if (silinenKayitSayisi > 0) {
        if (silinemeyenKayitSayisi > 0) {
          toast.warning(
            `${silinenKayitSayisi} ürün silindi. ${silinemeyenKayitSayisi} ürün silinemedi.`,
          );
        } else {
          toast.success(`${silinenKayitSayisi} ürün başarıyla silindi.`);
        }
      } else {
        toast.warning("Seçilen ürünlerden hiçbiri silinemedi.");
      }

      /*
       * Toplu silme sonucunda mevcut sayfa artık
       * toplam sayfa sayısını aşabilir.
       */
      const mevcutToplamKayitSayisi = Number(sayfalama.toplamKayitSayisi) || 0;

      const yeniToplamKayitSayisi = Math.max(
        0,
        mevcutToplamKayitSayisi - silinenKayitSayisi,
      );

      const sayfaBoyutu = Math.max(1, Number(filtreler.sayfaBoyutu) || 20);

      const yeniToplamSayfaSayisi = Math.max(
        1,
        Math.ceil(yeniToplamKayitSayisi / sayfaBoyutu),
      );

      const hedefSayfa = Math.min(filtreler.sayfaNo, yeniToplamSayfaSayisi);

      if (hedefSayfa !== filtreler.sayfaNo) {
        setFiltreler((mevcutFiltreler) => ({
          ...mevcutFiltreler,

          sayfaNo: hedefSayfa,
        }));

        return;
      }

      await urunleriYukle();
    } catch (error) {
      toast.error(
        apiHataMesajiGetir(
          error,
          "Seçilen ürünler silinirken bir hata oluştu.",
        ),
      );
    } finally {
      setTopluSilmeDevamEdiyor(false);
    }
  }, [
    filtreler.sayfaBoyutu,
    filtreler.sayfaNo,
    sayfalama.toplamKayitSayisi,
    seciliUrunIdleri,
    topluSilmeDevamEdiyor,
    urunleriYukle,
  ]);

  return {
    urunler,
    filtreler,
    sayfalama,

    yukleniyorMu,
    siliniyorMu,
    silinecekUrun,
    durumDegistirilenUrunId,

    seciliUrunIdleri,
    seciliUrunler,

    topluSilmeModalAcik,
    topluSilmeDevamEdiyor,

    filtreDegistir,
    filtreleriTemizle,

    sayfaDegistir,
    sayfaBoyutuDegistir,

    urunDurumunuDegistir,

    silmeModaliniAc,
    silmeModaliniKapat,
    urunuSil,

    urunSecimleriDegisti,
    urunSecimleriniTemizle,

    topluSilmeModaliniAc,
    topluSilmeModaliniKapat,
    urunleriTopluSil,

    urunleriYukle,
  };
}
