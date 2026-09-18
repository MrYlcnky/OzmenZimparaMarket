import apiClient, { oturumGetir, oturumKaydet, oturumSil } from "../client";

export async function girisYap(kullaniciAdi, sifre) {
  const response = await apiClient.post("/auth/giris", {
    kullaniciAdi,
    sifre,
  });

  oturumKaydet(response.data);

  return response.data;
}

export async function mevcutKullaniciGetir() {
  const response = await apiClient.get("/auth/mevcut-kullanici");

  return response.data;
}

export function cikisYap() {
  oturumSil();
}

export function mevcutOturumGetir() {
  const oturum = oturumGetir();

  if (!oturum?.token) {
    return null;
  }

  if (oturum.tokenBitisTarihi) {
    const bitisTarihi = Date.parse(oturum.tokenBitisTarihi);

    if (Number.isNaN(bitisTarihi) || bitisTarihi <= Date.now()) {
      oturumSil();
      return null;
    }
  }

  return oturum;
}
