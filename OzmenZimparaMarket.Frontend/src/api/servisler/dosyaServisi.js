import apiClient from "../client";

export async function kategoriGorseliYukle(dosya) {
  const formData = new FormData();

  formData.append("dosya", dosya);

  const response = await apiClient.post(
    "/dosyalar/kategori-gorseli-yukle",
    formData,
  );

  return response.data;
}

export async function dosyaSil(dosyaYolu) {
  await apiClient.delete("/dosyalar/sil", {
    params: {
      dosyaYolu,
    },
  });
}

export function dosyaUrlOlustur(dosyaYolu) {
  if (!dosyaYolu) {
    return "";
  }

  if (dosyaYolu.startsWith("http://") || dosyaYolu.startsWith("https://")) {
    return dosyaYolu;
  }

  const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "") ?? "";

  const backendBaseUrl = apiBaseUrl.replace(/\/api$/i, "");

  const duzenlenmisYol = dosyaYolu.startsWith("/")
    ? dosyaYolu
    : `/${dosyaYolu}`;

  return `${backendBaseUrl}${duzenlenmisYol}`;
}
