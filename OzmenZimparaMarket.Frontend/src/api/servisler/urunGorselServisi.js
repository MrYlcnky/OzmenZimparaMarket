import apiClient from "../client";

export async function urunGorseliYukle(dosya) {
  const formData = new FormData();

  formData.append("dosya", dosya);

  const response = await apiClient.post(
    "/dosyalar/urun-gorseli-yukle",
    formData,
  );

  return response.data;
}

export async function urunGorselleriniGetir() {
  const response = await apiClient.get("/dosyalar/urun-gorselleri");

  return Array.isArray(response.data) ? response.data : [];
}

export async function urunGorseliSil(dosyaYolu) {
  await apiClient.delete("/dosyalar/sil", {
    params: {
      dosyaYolu,
    },
  });
}

export async function mevcutGorseliUrunGorselineDonustur(dosyaYolu) {
  const response = await apiClient.post(
    "/dosyalar/urun-gorseline-kopyala",
    null,
    {
      params: {
        dosyaYolu,
      },
    },
  );

  return response.data;
}
