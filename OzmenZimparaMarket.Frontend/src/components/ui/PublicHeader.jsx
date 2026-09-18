import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router";

import Container from "./Container";

function PublicHeader() {
  const [menuAcik, setMenuAcik] = useState(false);
  const location = useLocation();

  const sepetAdedi = 0;

  useEffect(() => {
    setMenuAcik(false);
  }, [location.pathname]);

  useEffect(() => {
    function escapeIleKapat(event) {
      if (event.key === "Escape") {
        setMenuAcik(false);
      }
    }

    window.addEventListener("keydown", escapeIleKapat);

    return () => {
      window.removeEventListener("keydown", escapeIleKapat);
    };
  }, []);

  const navLinkClass = ({ isActive }) =>
    `
      relative flex h-full items-center
      text-sm font-semibold
      transition-colors duration-200
      ${isActive ? "text-white" : "text-text-light-muted hover:text-white"}
    `;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-brand-black/90 text-text-light backdrop-blur-xl">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-purple/60 to-transparent" />

      <Container>
        <div className="flex h-[84px] items-center justify-between gap-6">
          {/* Logo */}
          <NavLink
            to="/"
            className="flex shrink-0 items-center"
            aria-label="Özmen Zımpara Market Ana Sayfa"
          >
            <img
              src="/logo/header2.png"
              alt="Özmen Zımpara Market"
              className="h-12 w-auto object-contain transition-opacity duration-200 hover:opacity-90 sm:h-14"
            />
          </NavLink>

          {/* Desktop Menü */}
          <nav className="hidden h-full items-center gap-9 lg:flex">
            <NavLink to="/" end className={navLinkClass}>
              {({ isActive }) => (
                <>
                  Ana Sayfa
                  {isActive && (
                    <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-gradient-to-r from-brand-blue to-brand-purple" />
                  )}
                </>
              )}
            </NavLink>

            <NavLink to="/urunler" className={navLinkClass}>
              {({ isActive }) => (
                <>
                  Ürünler
                  {isActive && (
                    <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-gradient-to-r from-brand-blue to-brand-purple" />
                  )}
                </>
              )}
            </NavLink>

            <NavLink to="/hakkimizda" className={navLinkClass}>
              {({ isActive }) => (
                <>
                  Hakkımızda
                  {isActive && (
                    <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-gradient-to-r from-brand-blue to-brand-purple" />
                  )}
                </>
              )}
            </NavLink>

            <NavLink to="/iletisim" className={navLinkClass}>
              {({ isActive }) => (
                <>
                  İletişim
                  {isActive && (
                    <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-gradient-to-r from-brand-blue to-brand-purple" />
                  )}
                </>
              )}
            </NavLink>
          </nav>

          {/* Sağ Taraf */}
          <div className="flex shrink-0 items-center gap-3">
            {/* Sepet */}
            <button
              type="button"
              aria-label={`Teklif sepeti, ${sepetAdedi} ürün`}
              className="
                group relative
                hidden h-11 items-center gap-2.5
                rounded-ui border border-white/10
                bg-white/[0.04] px-4
                text-sm font-semibold text-white
                transition-all duration-200
                hover:border-brand-blue/50
                hover:bg-white/[0.07]
                sm:inline-flex
              "
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5 text-text-light-muted transition-colors group-hover:text-brand-blue-light"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 5.25h1.5l1.8 9.3a2.25 2.25 0 0 0 2.21 1.82h7.97a2.25 2.25 0 0 0 2.2-1.78l1.07-5.09H6.1"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.25 20.25h.01M17.25 20.25h.01"
                />
              </svg>

              <span>Teklif Sepeti</span>

              <span className="inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-brand-blue to-brand-purple px-1.5 text-[11px] font-bold text-white">
                {sepetAdedi}
              </span>
            </button>

            {/* Mobil Sepet */}
            <button
              type="button"
              aria-label={`Teklif sepeti, ${sepetAdedi} ürün`}
              className="
                relative flex h-11 w-11
                items-center justify-center
                rounded-ui border border-white/10
                bg-white/[0.04]
                text-white
                transition hover:border-brand-blue/50
                sm:hidden
              "
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 5.25h1.5l1.8 9.3a2.25 2.25 0 0 0 2.21 1.82h7.97a2.25 2.25 0 0 0 2.2-1.78l1.07-5.09H6.1"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.25 20.25h.01M17.25 20.25h.01"
                />
              </svg>

              {sepetAdedi > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-purple px-1 text-[10px] font-bold">
                  {sepetAdedi}
                </span>
              )}
            </button>

            {/* Mobil Menü */}
            <button
              type="button"
              aria-label={menuAcik ? "Menüyü kapat" : "Menüyü aç"}
              aria-expanded={menuAcik}
              aria-controls="mobil-menu"
              onClick={() => setMenuAcik(!menuAcik)}
              className="
                flex h-11 w-11
                items-center justify-center
                rounded-ui border border-white/10
                bg-white/[0.04]
                transition
                hover:border-brand-blue/50
                lg:hidden
              "
            >
              {menuAcik ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-6 w-6"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 6l12 12M18 6 6 18"
                  />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-6 w-6"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 7h16M4 12h16M4 17h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobil Menü */}
      {menuAcik && (
        <div
          id="mobil-menu"
          className="border-t border-white/10 bg-brand-black/98 lg:hidden"
        >
          <Container>
            <nav className="flex flex-col py-5">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `
                    rounded-ui px-4 py-3.5
                    text-sm font-semibold
                    transition
                    ${
                      isActive
                        ? "bg-white/[0.07] text-white"
                        : "text-text-light-muted hover:bg-white/[0.04] hover:text-white"
                    }
                  `
                }
              >
                Ana Sayfa
              </NavLink>

              <NavLink
                to="/urunler"
                className={({ isActive }) =>
                  `
                    rounded-ui px-4 py-3.5
                    text-sm font-semibold
                    transition
                    ${
                      isActive
                        ? "bg-white/[0.07] text-white"
                        : "text-text-light-muted hover:bg-white/[0.04] hover:text-white"
                    }
                  `
                }
              >
                Ürünler
              </NavLink>

              <NavLink
                to="/hakkimizda"
                className={({ isActive }) =>
                  `
                    rounded-ui px-4 py-3.5
                    text-sm font-semibold
                    transition
                    ${
                      isActive
                        ? "bg-white/[0.07] text-white"
                        : "text-text-light-muted hover:bg-white/[0.04] hover:text-white"
                    }
                  `
                }
              >
                Hakkımızda
              </NavLink>

              <NavLink
                to="/iletisim"
                className={({ isActive }) =>
                  `
                    rounded-ui px-4 py-3.5
                    text-sm font-semibold
                    transition
                    ${
                      isActive
                        ? "bg-white/[0.07] text-white"
                        : "text-text-light-muted hover:bg-white/[0.04] hover:text-white"
                    }
                  `
                }
              >
                İletişim
              </NavLink>
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}

export default PublicHeader;
