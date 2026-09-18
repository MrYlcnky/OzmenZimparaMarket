import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";

import { cikisYap, mevcutOturumGetir } from "../api/servisler/authServisi";

import Container from "../components/ui/Container";

const navigasyon = [
  {
    ad: "Genel Bakış",
    yol: "/ozmen-zimpara-yonetim",
    end: true,
  },
  {
    ad: "Firma Yönetimi",
    yol: "/ozmen-zimpara-yonetim/firma",
  },
  {
    ad: "Kategori Yönetimi",
    yol: "/ozmen-zimpara-yonetim/kategoriler",
  },
  {
    ad: "Ürün Özellikleri Yönetimi",
    yol: "/ozmen-zimpara-yonetim/urun-ozellikleri",
  },
  {
    ad: "Ürün Yönetimi",
    yol: "/ozmen-zimpara-yonetim/urunler",
  },
  {
    ad: "Kullanıcı Yönetimi",
    yol: "/ozmen-zimpara-yonetim/kullanicilar",
  },
];

function YonetimLayout() {
  const navigate = useNavigate();

  const [mobilMenuAcik, setMobilMenuAcik] = useState(false);

  const oturum = mevcutOturumGetir();

  function cikis() {
    cikisYap();

    navigate("/ozmen-zimpara-yonetim/sign-in", {
      replace: true,
    });
  }

  function navClassName({ isActive }) {
    return `
      relative flex h-10 items-center
      whitespace-nowrap px-1
      text-sm font-semibold
      transition-colors
      ${isActive ? "text-white" : "text-text-light-muted hover:text-white"}
    `;
  }

  return (
    <div className="min-h-screen bg-surface-soft">
      {/* Üst yönetim navigasyonu */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-brand-black/95 backdrop-blur-xl">
        <Container>
          <div className="flex h-[76px] items-center justify-between gap-6">
            {/* Logo */}
            <NavLink
              to="/ozmen-zimpara-yonetim"
              onClick={() => setMobilMenuAcik(false)}
              className="shrink-0"
            >
              <img
                src="/logo/header2.png"
                alt="Özmen Zımpara Market"
                className="h-11 w-auto object-contain"
              />
            </NavLink>

            {/* Desktop navigasyon */}
            <nav className="hidden flex-1 items-center justify-center gap-5 xl:flex">
              {navigasyon.map((item) => (
                <NavLink
                  key={item.yol}
                  to={item.yol}
                  end={item.end}
                  className={navClassName}
                >
                  {({ isActive }) => (
                    <>
                      {item.ad}

                      {isActive && (
                        <span
                          className="
                            absolute inset-x-0
                            -bottom-[18px]
                            h-0.5
                            rounded-full
                            bg-gradient-to-r
                            from-brand-blue
                            to-brand-purple
                          "
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Kullanıcı */}
            <div className="hidden items-center gap-4 xl:flex">
              <div className="text-right">
                <p className="text-sm font-bold text-white">
                  {oturum?.adSoyad || oturum?.kullaniciAdi}
                </p>

                <p className="mt-0.5 text-xs text-text-light-muted">Yönetici</p>
              </div>

              <button
                type="button"
                onClick={cikis}
                className="
                  inline-flex h-10 items-center
                  justify-center rounded-ui
                  border border-white/10
                  bg-white/[0.04] px-4
                  text-sm font-semibold text-white
                  transition-colors
                  hover:border-danger/40
                  hover:bg-danger/10
                "
              >
                Çıkış
              </button>
            </div>

            {/* Mobil / tablet menü */}
            <button
              type="button"
              onClick={() => setMobilMenuAcik((acik) => !acik)}
              className="
                flex h-10 w-10 items-center
                justify-center rounded-ui
                border border-white/10
                text-white
                xl:hidden
              "
              aria-label="Yönetim menüsünü aç"
              aria-expanded={mobilMenuAcik}
            >
              {mobilMenuAcik ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" d="M6 6l12 12M18 6 6 18" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobil / tablet dropdown */}
          {mobilMenuAcik && (
            <div className="border-t border-white/10 py-4 xl:hidden">
              <nav className="space-y-1">
                {navigasyon.map((item) => (
                  <NavLink
                    key={item.yol}
                    to={item.yol}
                    end={item.end}
                    onClick={() => setMobilMenuAcik(false)}
                    className={({ isActive }) =>
                      `
                        block rounded-ui
                        px-4 py-3
                        text-sm font-semibold
                        transition-colors
                        ${
                          isActive
                            ? "bg-brand-blue text-white"
                            : "text-text-light-muted hover:bg-white/[0.05] hover:text-white"
                        }
                      `
                    }
                  >
                    {item.ad}
                  </NavLink>
                ))}
              </nav>

              <div className="mt-4 border-t border-white/10 pt-4">
                <p className="px-4 text-sm font-bold text-white">
                  {oturum?.adSoyad || oturum?.kullaniciAdi}
                </p>

                <p className="mt-1 px-4 text-xs text-text-light-muted">
                  Yönetici
                </p>

                <button
                  type="button"
                  onClick={cikis}
                  className="
                    mt-4 w-full rounded-ui
                    border border-danger/25
                    bg-danger/10
                    px-4 py-3
                    text-left text-sm
                    font-semibold text-red-200
                  "
                >
                  Oturumu Kapat
                </button>
              </div>
            </div>
          )}
        </Container>
      </header>

      {/* Yönetim sayfaları */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default YonetimLayout;
