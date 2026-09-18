import apiClient from "../client";

export async function kategoriExcelSablonunuIndir() {
  const response = await apiClient.get("/excel/kategori-sablonu", {
    responseType: "blob",
  });

  const dosyaAdi = responseDosyaAdiGetir(
    response.headers?.["content-disposition"],
    "ozmen-zimpara-market-kategori-sablonu.xlsx",
  );

  blobDosyasiniIndir(response.data, dosyaAdi);
}

export async function kategoriExcelDosyasiniAnalizEt(dosya) {
  const formData = new FormData();

  formData.append("dosya", dosya);

  const response = await apiClient.post("/excel/kategoriler/analiz", formData);

  return response.data;
}

export async function kategoriExcelDosyasiniAktar(dosya) {
  const formData = new FormData();

  formData.append("dosya", dosya);

  const response = await apiClient.post("/excel/kategoriler/aktar", formData);

  return response.data;
}

export async function urunExcelSablonunuIndir() {
  const response = await apiClient.get("/excel/urun-sablonu", {
    responseType: "blob",
  });

  const dosyaAdi = responseDosyaAdiGetir(
    response.headers?.["content-disposition"],
    "ozmen-zimpara-market-urun-sablonu.xlsx",
  );

  blobDosyasiniIndir(response.data, dosyaAdi);
}

function responseDosyaAdiGetir(contentDisposition, varsayilanDosyaAdi) {
  if (typeof contentDisposition !== "string" || !contentDisposition.trim()) {
    return varsayilanDosyaAdi;
  }

  const utf8Eslesme = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);

  if (utf8Eslesme?.[1]) {
    try {
      return decodeURIComponent(utf8Eslesme[1].trim());
    } catch {
      return utf8Eslesme[1].trim();
    }
  }

  const normalEslesme = contentDisposition.match(/filename="?([^";]+)"?/i);

  if (normalEslesme?.[1]) {
    return normalEslesme[1].trim();
  }

  return varsayilanDosyaAdi;
}

function blobDosyasiniIndir(veri, dosyaAdi) {
  const blob = veri instanceof Blob ? veri : new Blob([veri]);

  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = dosyaAdi;

  document.body.appendChild(link);

  link.click();

  link.remove();

  window.URL.revokeObjectURL(url);
}

export async function urunleriExcelDisariAktar() {
  const response = await apiClient.get("/excel/urunler/disari-aktar", {
    responseType: "blob",
  });

  const dosyaAdi = responseDosyaAdiGetir(
    response.headers?.["content-disposition"],
    "ozmen-zimpara-market-urunler.xlsx",
  );

  blobDosyasiniIndir(response.data, dosyaAdi);
}

export async function urunExcelDosyasiniAnalizEt(dosya) {
  const formData = new FormData();

  formData.append("dosya", dosya);

  const response = await apiClient.post("/excel/urunler/analiz", formData);

  return response.data;
}

export async function urunExcelDosyasiniAktar(dosya) {
  const formData = new FormData();

  formData.append("dosya", dosya);

  const response = await apiClient.post("/excel/urunler/aktar", formData);

  return response.data;
}
