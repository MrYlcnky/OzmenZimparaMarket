export const satisBirimiSecenekleri = [
  {
    value: "1",
    label: "Adet",
  },
  {
    value: "2",
    label: "Paket",
  },
  {
    value: "3",
    label: "Kutu",
  },
  {
    value: "4",
    label: "Metre",
  },
  {
    value: "5",
    label: "Rulo",
  },
];

export const bosUrunFormu = {
  kategoriId: "",
  urunAdi: "",
  urunKodu: "",
  kisaAciklama: "",
  detayliAciklama: "",
  gorselYolu: "",
  satisBirimi: "",
  seoUrl: "",
  seoBasligi: "",
  seoAciklamasi: "",
  oneCikanMi: false,
  siraNo: 0,
  aktifMi: true,
  teknikDetaylar: [],
};

export function urunFormaDonustur(urun) {
  if (!urun) {
    return {
      ...bosUrunFormu,
      teknikDetaylar: [],
    };
  }

  return {
    kategoriId:
      urun.kategoriId !== null && urun.kategoriId !== undefined
        ? String(urun.kategoriId)
        : "",

    urunAdi: urun.urunAdi ?? "",

    urunKodu: urun.urunKodu ?? "",

    kisaAciklama: urun.kisaAciklama ?? "",

    detayliAciklama: urun.detayliAciklama ?? "",

    gorselYolu: urun.gorselYolu ?? "",

    satisBirimi:
      urun.satisBirimi !== null && urun.satisBirimi !== undefined
        ? String(urun.satisBirimi)
        : "",

    seoUrl: urun.seoUrl ?? "",

    seoBasligi: urun.seoBasligi ?? "",

    seoAciklamasi: urun.seoAciklamasi ?? "",

    oneCikanMi: Boolean(urun.oneCikanMi),

    siraNo: urun.siraNo ?? 0,

    aktifMi: Boolean(urun.aktifMi),

    teknikDetaylar: teknikDetaylariFormaDonustur(urun.teknikDetaylar),
  };
}

export function teknikDetaylariFormaDonustur(teknikDetayGruplari = []) {
  if (!Array.isArray(teknikDetayGruplari)) {
    return [];
  }

  return teknikDetayGruplari.flatMap((grup) => {
    if (!Array.isArray(grup.degerler)) {
      return [];
    }

    return grup.degerler.map((deger) => ({
      urunDetayiId: deger.urunDetayiId ?? null,

      urunDetayTanimiId: grup.urunDetayTanimiId,

      detayDegeri: deger.detayDegeri ?? "",

      siraNo: deger.siraNo ?? 0,

      aktifMi: deger.aktifMi ?? true,
    }));
  });
}

export function urunPayloadOlustur(form) {
  return {
    kategoriId: sayiyaDonustur(form.kategoriId),

    urunAdi: form.urunAdi?.trim() ?? "",

    urunKodu: bosMetniNullYap(form.urunKodu),

    kisaAciklama: bosMetniNullYap(form.kisaAciklama),

    detayliAciklama: bosMetniNullYap(form.detayliAciklama, false),

    gorselYolu: bosMetniNullYap(form.gorselYolu),

    satisBirimi: sayiyaDonustur(form.satisBirimi),

    seoUrl: bosMetniNullYap(form.seoUrl),

    seoBasligi: bosMetniNullYap(form.seoBasligi),

    seoAciklamasi: bosMetniNullYap(form.seoAciklamasi),

    oneCikanMi: Boolean(form.oneCikanMi),

    siraNo: sayiyaDonustur(form.siraNo, 0),

    aktifMi: Boolean(form.aktifMi),

    teknikDetaylar: Array.isArray(form.teknikDetaylar)
      ? form.teknikDetaylar.map(teknikDetayPayloadOlustur)
      : [],
  };
}

export function teknikDetayPayloadOlustur(teknikDetay) {
  return {
    urunDetayiId:
      teknikDetay.urunDetayiId === null ||
      teknikDetay.urunDetayiId === undefined ||
      teknikDetay.urunDetayiId === ""
        ? null
        : sayiyaDonustur(teknikDetay.urunDetayiId),

    urunDetayTanimiId: sayiyaDonustur(teknikDetay.urunDetayTanimiId),

    detayDegeri: teknikDetay.detayDegeri?.trim() ?? "",

    siraNo: sayiyaDonustur(teknikDetay.siraNo, 0),

    aktifMi: Boolean(teknikDetay.aktifMi),
  };
}

export function zodHatalariniDonustur(zodError) {
  const hatalar = {};

  zodError.issues.forEach((issue) => {
    const alanYolu = issue.path.join(".");

    if (!alanYolu) {
      return;
    }

    if (!hatalar[alanYolu]) {
      hatalar[alanYolu] = issue.message;
    }
  });

  return hatalar;
}

export function teknikDetayHatasiGetir(formHatalari, indeks, alanAdi) {
  return formHatalari[`teknikDetaylar.${indeks}.${alanAdi}`];
}

export function satisBirimiAdiGetir(satisBirimi) {
  const secenek = satisBirimiSecenekleri.find(
    (x) => Number(x.value) === Number(satisBirimi),
  );

  return secenek?.label ?? "-";
}

function bosMetniNullYap(deger, trim = true) {
  if (deger === null || deger === undefined) {
    return null;
  }

  const metin = String(deger);

  const sonuc = trim ? metin.trim() : metin;

  return sonuc.trim().length === 0 ? null : sonuc;
}

function sayiyaDonustur(deger, varsayilanDeger = 0) {
  if (deger === "" || deger === null || deger === undefined) {
    return varsayilanDeger;
  }

  const sayi = Number(deger);

  return Number.isFinite(sayi) ? sayi : varsayilanDeger;
}
