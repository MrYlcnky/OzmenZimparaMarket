import apiClient from "../client";

export async function kategoriAgaciniGetir() {
  const response = await apiClient.get("/kategoriler/agac");

  return response.data;
}

export async function kategoriSeoUrlIleGetir(seoUrl) {
  const response = await apiClient.get(
    `/kategoriler/seo-url/${encodeURIComponent(seoUrl)}`,
  );

  return response.data;
}

export async function kategorileriGetir() {
  const response = await apiClient.get("/kategoriler/listele");

  return response.data;
}

export async function yonetimKategorileriniGetir() {
  const response = await apiClient.get("/kategoriler/yonetim-listele");

  return response.data;
}

export async function kategoriDetayGetir(id) {
  const response = await apiClient.get(`/kategoriler/detay/${id}`);

  return response.data;
}

export async function kategoriEkle(kategori) {
  const response = await apiClient.post("/kategoriler/ekle", kategori);

  return response.data;
}

export async function kategoriGuncelle(id, kategori) {
  const response = await apiClient.put(`/kategoriler/guncelle/${id}`, kategori);

  return response.data;
}

export async function kategoriDurumDegistir(id, aktifMi) {
  const response = await apiClient.patch(
    `/kategoriler/durum-degistir/${id}`,
    null,
    {
      params: {
        aktifMi,
      },
    },
  );

  return response.data;
}

export async function kategoriSil(id) {
  await apiClient.delete(`/kategoriler/sil/${id}`);
}

export async function kategoriTopluSil(idListesi) {
  const response = await apiClient.post("/kategoriler/toplu-sil", {
    idListesi,
  });

  return response.data;
}
