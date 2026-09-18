export const bosKategoriFormu = {
  ustKategoriId: "",
  kategoriAdi: "",
  aciklama: "",
  gorselYolu: "",
  seoUrl: "",
  seoBasligi: "",
  seoAciklamasi: "",
  anaSayfadaGosterilsinMi: false,
  siraNo: 0,
  aktifMi: true,
};

export function kategoriFormaDonustur(kategori) {
  return {
    ustKategoriId: kategori?.ustKategoriId ?? "",

    kategoriAdi: kategori?.kategoriAdi ?? "",

    aciklama: kategori?.aciklama ?? "",

    gorselYolu: kategori?.gorselYolu ?? "",

    seoUrl: kategori?.seoUrl ?? "",

    seoBasligi: kategori?.seoBasligi ?? "",

    seoAciklamasi: kategori?.seoAciklamasi ?? "",

    anaSayfadaGosterilsinMi: kategori?.anaSayfadaGosterilsinMi ?? false,

    siraNo: kategori?.siraNo ?? 0,

    aktifMi: kategori?.aktifMi ?? true,
  };
}

export function zodHatalariniDonustur(issues) {
  const hatalar = {};

  issues.forEach((issue) => {
    const alanAdi = issue.path[0];

    if (!alanAdi) {
      return;
    }

    if (!hatalar[alanAdi]) {
      hatalar[alanAdi] = [];
    }

    hatalar[alanAdi].push(issue.message);
  });

  return hatalar;
}

export function altKategoriIdleriniBul(kategoriler, kategoriId) {
  const bulunanlar = new Set();

  function tara(ustKategoriId) {
    kategoriler
      .filter((kategori) => kategori.ustKategoriId === ustKategoriId)
      .forEach((kategori) => {
        if (bulunanlar.has(kategori.id)) {
          return;
        }

        bulunanlar.add(kategori.id);

        tara(kategori.id);
      });
  }

  tara(kategoriId);

  return bulunanlar;
}

export function kategoriYoluOlustur(kategori, kategoriler) {
  if (!kategori) {
    return "";
  }

  const kategoriMap = new Map(
    kategoriler.map((mevcutKategori) => [mevcutKategori.id, mevcutKategori]),
  );

  const yol = [kategori.kategoriAdi];

  const ziyaretEdilenler = new Set([kategori.id]);

  let ustKategoriId = kategori.ustKategoriId;

  while (ustKategoriId) {
    if (ziyaretEdilenler.has(ustKategoriId)) {
      break;
    }

    ziyaretEdilenler.add(ustKategoriId);

    const ustKategori = kategoriMap.get(ustKategoriId);

    if (!ustKategori) {
      break;
    }

    yol.unshift(ustKategori.kategoriAdi);

    ustKategoriId = ustKategori.ustKategoriId;
  }

  return yol.join(" / ");
}

export function kategorileriHiyerarsikSirala(kategoriler) {
  const kategoriMap = new Map();

  kategoriler.forEach((kategori) => {
    kategoriMap.set(kategori.id, {
      ...kategori,
      altKategoriler: [],
    });
  });

  const kokKategoriler = [];

  kategoriler.forEach((kategori) => {
    const mevcutKategori = kategoriMap.get(kategori.id);

    if (kategori.ustKategoriId && kategoriMap.has(kategori.ustKategoriId)) {
      kategoriMap
        .get(kategori.ustKategoriId)
        .altKategoriler.push(mevcutKategori);

      return;
    }

    kokKategoriler.push(mevcutKategori);
  });

  function listeyiSirala(liste) {
    liste.sort((a, b) => {
      const aSira = Number(a.siraNo) || 0;

      const bSira = Number(b.siraNo) || 0;

      if (aSira !== bSira) {
        return aSira - bSira;
      }

      return a.kategoriAdi.localeCompare(b.kategoriAdi, "tr");
    });

    liste.forEach((kategori) => {
      listeyiSirala(kategori.altKategoriler);
    });
  }

  listeyiSirala(kokKategoriler);

  const sonuc = [];

  function duzlestir(liste, seviye = 0) {
    liste.forEach((kategori) => {
      sonuc.push({
        ...kategori,
        seviye,
      });

      duzlestir(kategori.altKategoriler, seviye + 1);
    });
  }

  duzlestir(kokKategoriler);

  return sonuc;
}

export function ustKategoriSecenekleriniOlustur(
  kategoriler,
  duzenlenenKategoriId,
) {
  let secenekler = kategoriler;

  if (duzenlenenKategoriId) {
    const altKategoriIdleri = altKategoriIdleriniBul(
      kategoriler,
      duzenlenenKategoriId,
    );

    secenekler = kategoriler.filter(
      (kategori) =>
        kategori.id !== duzenlenenKategoriId &&
        !altKategoriIdleri.has(kategori.id),
    );
  }

  const siraliSecenekler = kategorileriHiyerarsikSirala(secenekler);

  return siraliSecenekler.map((kategori) => ({
    ...kategori,

    kategoriYolu: kategoriYoluOlustur(kategori, kategoriler),
  }));
}

export function sonrakiSiraNoHesapla(
  kategoriler,
  ustKategoriId,
  haricKategoriId = null,
) {
  const normalizeUstKategoriId =
    ustKategoriId === "" ||
    ustKategoriId === null ||
    ustKategoriId === undefined
      ? null
      : Number(ustKategoriId);

  const kardesKategoriler = kategoriler.filter((kategori) => {
    if (haricKategoriId && kategori.id === haricKategoriId) {
      return false;
    }

    const kategoriUstId = kategori.ustKategoriId ?? null;

    return kategoriUstId === normalizeUstKategoriId;
  });

  if (kardesKategoriler.length === 0) {
    return 1;
  }

  const enBuyukSiraNo = Math.max(
    ...kardesKategoriler.map((kategori) => Number(kategori.siraNo) || 0),
  );

  return enBuyukSiraNo + 1;
}
