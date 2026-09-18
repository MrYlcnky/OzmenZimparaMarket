import apiClient from "../client";

export async function firmaGenelBilgisiGetir() {
  const response = await apiClient.get("/firma-genel-bilgileri/getir");

  return response.data;
}

export async function firmaGenelBilgisiGuncelle(firmaBilgisi) {
  const response = await apiClient.put(
    "/firma-genel-bilgileri/guncelle",
    firmaBilgisi,
  );

  return response.data;
}
