import apiClient from "../client";

export async function oneCikanUrunleriGetir(adet = 6) {
  const response = await apiClient.get("/urunler/one-cikanlar", {
    params: {
      adet,
    },
  });

  return response.data;
}

export async function urunSeoUrlIleGetir(seoUrl) {
  const response = await apiClient.get(
    `/urunler/seo-url/${encodeURIComponent(seoUrl)}`,
  );

  return response.data;
}

export async function urunleriFiltrele(filtre = {}) {
  const response = await apiClient.post("/urunler/filtrele", filtre);

  return response.data;
}

export async function urunFiltreSecenekleriniGetir(
  kategoriId = null,
  altKategorilerDahilMi = true,
) {
  const response = await apiClient.get("/urunler/filtre-secenekleri", {
    params: {
      kategoriId,
      altKategorilerDahilMi,
    },
  });

  return response.data;
}

export async function yonetimUrunleriniFiltrele(filtre = {}) {
  const response = await apiClient.post("/urunler/yonetim-filtrele", {
    kategoriId: filtre.kategoriId ?? null,
    altKategorilerDahilMi: filtre.altKategorilerDahilMi ?? true,
    aramaMetni: filtre.aramaMetni?.trim() || null,
    aktifMi: filtre.aktifMi ?? null,
    oneCikanMi: filtre.oneCikanMi ?? null,
    satisBirimi: filtre.satisBirimi ?? null,
    teknikDetayFiltreleri: filtre.teknikDetayFiltreleri ?? [],
    sayfaNo: filtre.sayfaNo ?? 1,
    sayfaBoyutu: filtre.sayfaBoyutu ?? 20,
    siralama: filtre.siralama ?? 1,
  });

  return response.data;
}

export async function urunDetayGetir(id) {
  const response = await apiClient.get(`/urunler/detay/${id}`);

  return response.data;
}

export async function urunEkle(urun) {
  const response = await apiClient.post("/urunler/ekle", urun);

  return response.data;
}

export async function urunGuncelle(id, urun) {
  const response = await apiClient.put(`/urunler/guncelle/${id}`, urun);

  return response.data;
}

export async function urunDurumDegistir(id, aktifMi) {
  const response = await apiClient.patch(
    `/urunler/durum-degistir/${id}`,
    null,
    {
      params: {
        aktifMi,
      },
    },
  );

  return response.data;
}

export async function urunOneCikanDurumDegistir(id, oneCikanMi) {
  const response = await apiClient.patch(
    `/urunler/one-cikan-degistir/${id}`,
    null,
    {
      params: {
        oneCikanMi,
      },
    },
  );

  return response.data;
}

export async function urunSil(id) {
  await apiClient.delete(`/urunler/sil/${id}`);
}

export async function sonrakiUrunSiraNoGetir() {
  const sonuc = await yonetimUrunleriniFiltrele({
    kategoriId: null,
    altKategorilerDahilMi: true,
    aramaMetni: null,
    aktifMi: null,
    oneCikanMi: null,
    satisBirimi: null,
    teknikDetayFiltreleri: [],
    sayfaNo: 1,
    sayfaBoyutu: 1,
    siralama: 2,
  });

  const urunler = Array.isArray(sonuc?.kayitlar) ? sonuc.kayitlar : [];

  if (urunler.length === 0) {
    return 1;
  }

  const enBuyukSiraNo = Number(urunler[0]?.siraNo);

  if (!Number.isFinite(enBuyukSiraNo)) {
    return 1;
  }

  return enBuyukSiraNo + 1;
}

export async function urunTopluSil(idListesi) {
  const temizIdListesi = [
    ...new Set(
      (Array.isArray(idListesi) ? idListesi : [])
        .map((id) => Number(id))
        .filter((id) => Number.isInteger(id) && id > 0),
    ),
  ];

  const response = await apiClient.post("/urunler/toplu-sil", {
    idListesi: temizIdListesi,
  });

  return response.data;
}
