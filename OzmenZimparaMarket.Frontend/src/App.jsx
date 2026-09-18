import { Route, Routes } from "react-router";
import { ToastContainer } from "react-toastify";

import YonetimKorumasi from "./components/yonetim/YonetimKorumasi";

import PublicLayout from "./layouts/PublicLayout";
import YonetimLayout from "./layouts/YonetimLayout";

import AnaSayfa from "./pages/public/AnaSayfa";
import HakkimizdaSayfasi from "./pages/public/HakkimizdaSayfasi";
import IletisimSayfasi from "./pages/public/IletisimSayfasi";
import UrunDetaySayfasi from "./pages/public/UrunDetaySayfasi";
import UrunlerSayfasi from "./pages/public/UrunlerSayfasi";

import GirisSayfasi from "./pages/yonetim/GirisSayfasi";
import YonetimAnaSayfa from "./pages/yonetim/YonetimAnaSayfa";
import FirmaYonetimiSayfasi from "./pages/yonetim/FirmaYonetimiSayfasi";
import KategoriYonetimiSayfasi from "./pages/yonetim/KategoriYonetimiSayfasi";
import UrunOzellikleriYonetimiSayfasi from "./pages/yonetim/UrunOzellikleriYonetimiSayfasi";
import UrunYonetimiSayfasi from "./pages/yonetim/UrunYonetimiSayfasi";
import KullaniciYonetimiSayfasi from "./pages/yonetim/KullaniciYonetimiSayfasi";

import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <>
      <Routes>
        {/* Public */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<AnaSayfa />} />

          <Route path="urunler" element={<UrunlerSayfasi />} />

          <Route path="urunler/:seoUrl" element={<UrunDetaySayfasi />} />

          <Route path="hakkimizda" element={<HakkimizdaSayfasi />} />

          <Route path="iletisim" element={<IletisimSayfasi />} />
        </Route>

        {/* Yönetim giriş */}
        <Route
          path="/ozmen-zimpara-yonetim/sign-in"
          element={<GirisSayfasi />}
        />

        {/* Korumalı yönetim */}
        <Route element={<YonetimKorumasi />}>
          <Route path="/ozmen-zimpara-yonetim" element={<YonetimLayout />}>
            <Route index element={<YonetimAnaSayfa />} />
            <Route path="firma" element={<FirmaYonetimiSayfasi />} />
            <Route path="kategoriler" element={<KategoriYonetimiSayfasi />} />
            <Route
              path="urun-ozellikleri"
              element={<UrunOzellikleriYonetimiSayfasi />}
            />
            <Route path="urunler" element={<UrunYonetimiSayfasi />} />
            <Route path="kullanicilar" element={<KullaniciYonetimiSayfasi />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
    </>
  );
}

export default App;
