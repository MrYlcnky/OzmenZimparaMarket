import apiClient from "../client";

export async function yonetimUrunDetayTanimlariniGetir() {
  const response = await apiClient.get("/urun-detay-tanimlari/yonetim-listele");

  return response.data;
}

export async function urunDetayTanimiDetayGetir(id) {
  const response = await apiClient.get(`/urun-detay-tanimlari/detay/${id}`);

  return response.data;
}

export async function urunDetayTanimiEkle(detayTanimi) {
  const response = await apiClient.post(
    "/urun-detay-tanimlari/ekle",
    detayTanimi,
  );

  return response.data;
}

export async function urunDetayTanimiGuncelle(id, detayTanimi) {
  const response = await apiClient.put(
    `/urun-detay-tanimlari/guncelle/${id}`,
    detayTanimi,
  );

  return response.data;
}

export async function urunDetayTanimiDurumDegistir(id, aktifMi) {
  const response = await apiClient.patch(
    `/urun-detay-tanimlari/durum-degistir/${id}`,
    null,
    {
      params: {
        aktifMi,
      },
    },
  );

  return response.data;
}

export async function urunDetayTanimiSil(id) {
  await apiClient.delete(`/urun-detay-tanimlari/sil/${id}`);
}
