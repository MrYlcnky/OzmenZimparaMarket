import apiClient from "../client";

export async function panelKullanicilariniGetir() {
  const response = await apiClient.get("/panel-kullanicilari/listele");

  return response.data;
}

export async function panelKullanicisiDetayGetir(id) {
  const response = await apiClient.get(`/panel-kullanicilari/detay/${id}`);

  return response.data;
}

export async function panelKullanicisiEkle(dto) {
  const response = await apiClient.post("/panel-kullanicilari/ekle", dto);

  return response.data;
}

export async function panelKullanicisiGuncelle(id, dto) {
  const response = await apiClient.put(
    `/panel-kullanicilari/guncelle/${id}`,
    dto,
  );

  return response.data;
}

export async function panelKullanicisiDurumDegistir(id, aktifMi) {
  const response = await apiClient.patch(
    `/panel-kullanicilari/durum-degistir/${id}`,
    null,
    {
      params: {
        aktifMi,
      },
    },
  );

  return response.data;
}

export async function panelKullanicisiSil(id) {
  await apiClient.delete(`/panel-kullanicilari/sil/${id}`);
}

export async function panelKullanicisiSifreSifirla(id, dto) {
  await apiClient.put(`/panel-kullanicilari/sifre-sifirla/${id}`, dto);
}

export async function kendiSifremiDegistir(dto) {
  await apiClient.put("/panel-kullanicilari/sifre-degistir", dto);
}
