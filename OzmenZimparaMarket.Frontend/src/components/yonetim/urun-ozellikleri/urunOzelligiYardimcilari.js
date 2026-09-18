export const bosUrunOzelligiFormu = {
  detayAdi: "",
  cokluDegerMi: false,
  filtredeGosterilsinMi: false,
  sepetteSecilebilirMi: false,
  siraNo: 0,
  aktifMi: true,
};

export function urunOzelligiFormaDonustur(urunOzelligi) {
  if (!urunOzelligi) {
    return {
      ...bosUrunOzelligiFormu,
    };
  }

  return {
    detayAdi: urunOzelligi.detayAdi ?? "",
    cokluDegerMi: Boolean(urunOzelligi.cokluDegerMi),
    filtredeGosterilsinMi: Boolean(urunOzelligi.filtredeGosterilsinMi),
    sepetteSecilebilirMi: Boolean(urunOzelligi.sepetteSecilebilirMi),
    siraNo: urunOzelligi.siraNo ?? 0,
    aktifMi: Boolean(urunOzelligi.aktifMi),
  };
}

export function zodHatalariniDonustur(zodError) {
  const hatalar = {};

  zodError.issues.forEach((issue) => {
    const alanAdi = issue.path?.[0];

    if (!alanAdi) {
      return;
    }

    if (!hatalar[alanAdi]) {
      hatalar[alanAdi] = issue.message;
    }
  });

  return hatalar;
}

export function sonrakiSiraNoHesapla(urunOzellikleri = []) {
  if (!Array.isArray(urunOzellikleri) || urunOzellikleri.length === 0) {
    return 0;
  }

  const enBuyukSiraNo = Math.max(
    ...urunOzellikleri.map((urunOzelligi) => {
      const siraNo = Number(urunOzelligi.siraNo);

      return Number.isFinite(siraNo) ? siraNo : 0;
    }),
  );

  return enBuyukSiraNo + 1;
}
