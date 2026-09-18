import axios from "axios";

const OTURUM_KEY = "ozmen-zimpara-yonetim-oturum";
const GIRIS_YOLU = "/ozmen-zimpara-yonetim/sign-in";
const YONETIM_YOLU = "/ozmen-zimpara-yonetim";

export function oturumGetir() {
  try {
    const kayit = localStorage.getItem(OTURUM_KEY);

    if (!kayit) {
      return null;
    }

    return JSON.parse(kayit);
  } catch {
    localStorage.removeItem(OTURUM_KEY);
    return null;
  }
}

export function oturumKaydet(oturum) {
  localStorage.setItem(OTURUM_KEY, JSON.stringify(oturum));
}

export function oturumSil() {
  localStorage.removeItem(OTURUM_KEY);
}

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  headers: {
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const oturum = oturumGetir();

  if (oturum?.token) {
    config.headers.Authorization = `Bearer ${oturum.token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,

  (error) => {
    const durumKodu = error?.response?.status;
    const mevcutYol = window.location.pathname;

    const yonetimAlaninda =
      mevcutYol === YONETIM_YOLU || mevcutYol.startsWith(`${YONETIM_YOLU}/`);

    const girisSayfasinda = mevcutYol === GIRIS_YOLU;

    if (durumKodu === 401 && yonetimAlaninda && !girisSayfasinda) {
      oturumSil();
      window.location.replace(GIRIS_YOLU);
    }

    return Promise.reject(error);
  },
);

export default apiClient;
