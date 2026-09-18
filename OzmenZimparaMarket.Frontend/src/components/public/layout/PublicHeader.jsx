import { useEffect, useRef, useState } from "react";

import { NavLink, useLocation } from "react-router";

import { usePublicSite } from "../../../contexts/PublicSiteContext";
import { useTeklifSepeti } from "../../../contexts/TeklifSepetiContext";

import HakkimizdaDropdown from "./HakkimizdaDropdown";
import PublicMobileMenu from "./PublicMobileMenu";

function PublicHeader() {
  const location = useLocation();

  const { whatsappBaglantisi } = usePublicSite();

  const { sepetKalemSayisi } = useTeklifSepeti();

  const [kurumsalMenuAcikMi, setKurumsalMenuAcikMi] = useState(false);

  const [mobilMenuAcikMi, setMobilMenuAcikMi] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    function disTiklama(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setKurumsalMenuAcikMi(false);
      }
    }

    document.addEventListener("mousedown", disTiklama);

    return () => {
      document.removeEventListener("mousedown", disTiklama);
    };
  }, []);

  function menuleriKapat() {
    setKurumsalMenuAcikMi(false);
    setMobilMenuAcikMi(false);
  }

  const kurumsalAktifMi = location.pathname === "/hakkimizda";

  return (
    <header
      className="
        sticky
        top-0
        z-50
        border-b
        border-white/[0.07]
        bg-[#070912]/95
        shadow-[0_8px_30px_rgba(0,0,0,0.18)]
        backdrop-blur-xl
      "
    >
      <div
        className="
          mx-auto
          flex
          h-[76px]
          max-w-[1440px]
          items-center
          px-5

          sm:px-6
          lg:px-8
        "
      >
        <NavLink
          to="/"
          onClick={menuleriKapat}
          className="
            flex
            shrink-0
            items-center
          "
          aria-label="Ana sayfa"
        >
          <img
            src="/logo/header2.png"
            alt="Özmen Zımpara Market"
            className="
              h-11
              w-auto
              object-contain

              sm:h-12
            "
          />
        </NavLink>

        <nav
          className="
            ml-10
            hidden
            items-center
            gap-1

            lg:flex
            xl:ml-14
          "
        >
          <DesktopNavLink to="/" end onClick={menuleriKapat}>
            Ana Sayfa
          </DesktopNavLink>

          <DesktopNavLink to="/urunler" onClick={menuleriKapat}>
            Ürünlerimiz
          </DesktopNavLink>

          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setKurumsalMenuAcikMi((mevcut) => !mevcut)}
              className={`
                relative
                inline-flex
                h-[76px]
                items-center
                gap-1.5
                px-4
                text-[13px]
                font-bold
                transition-colors

                ${
                  kurumsalAktifMi
                    ? "text-white"
                    : "text-white/60 hover:text-white"
                }
              `}
            >
              Hakkımızda
              <ChevronIcon open={kurumsalMenuAcikMi} />
              {kurumsalAktifMi && (
                <span
                  className="
                    absolute
                    inset-x-4
                    bottom-0
                    h-[2px]
                    bg-gradient-to-r
                    from-blue-500
                    to-purple-500
                  "
                />
              )}
            </button>

            <HakkimizdaDropdown
              open={kurumsalMenuAcikMi}
              onClose={menuleriKapat}
            />
          </div>

          <DesktopNavLink to="/iletisim" onClick={menuleriKapat}>
            Bize Ulaşın
          </DesktopNavLink>
        </nav>

        <div
          className="
            ml-auto
            flex
            items-center
            gap-2
          "
        >
          <div
            className="
              hidden
              items-center
              gap-2
              rounded-xl
              border
              border-white/[0.08]
              bg-white/[0.025]
              px-3.5
              py-2.5
              text-white/75

              sm:flex
            "
          >
            <CartIcon />

            <span
              className="
                hidden
                text-xs
                font-bold

                xl:inline
              "
            >
              Teklif Sepeti
            </span>

            <span
              className="
                flex
                h-5
                min-w-5
                items-center
                justify-center
                rounded-full
                bg-purple-500
                px-1.5
                text-[10px]
                font-extrabold
                text-white
              "
            >
              {sepetKalemSayisi}
            </span>
          </div>

          {whatsappBaglantisi && (
            <a
              href={whatsappBaglantisi}
              target="_blank"
              rel="noreferrer"
              className="
                hidden
                h-10
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#25D366]
                px-4
                text-xs
                font-extrabold
                text-white
                shadow-[0_8px_24px_rgba(37,211,102,0.16)]
                transition-all

                hover:-translate-y-0.5
                hover:bg-[#20bd5a]

                xl:inline-flex
              "
            >
              <WhatsAppIcon />
              WhatsApp'tan İletişime Geç
            </a>
          )}

          <button
            type="button"
            onClick={() => setMobilMenuAcikMi((mevcut) => !mevcut)}
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
              border-white/[0.08]
              bg-white/[0.03]
              text-white/80
              transition

              hover:bg-white/[0.07]
              hover:text-white

              lg:hidden
            "
            aria-label={mobilMenuAcikMi ? "Menüyü kapat" : "Menüyü aç"}
            aria-expanded={mobilMenuAcikMi}
          >
            <MenuIcon open={mobilMenuAcikMi} />
          </button>
        </div>
      </div>

      <PublicMobileMenu
        open={mobilMenuAcikMi}
        sepetKalemSayisi={sepetKalemSayisi}
        whatsappBaglantisi={whatsappBaglantisi}
        onClose={menuleriKapat}
      />
    </header>
  );
}

function DesktopNavLink({ to, end = false, onClick, children }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) => `
        relative
        inline-flex
        h-[76px]
        items-center
        px-4
        text-[13px]
        font-bold
        transition-colors

        ${isActive ? "text-white" : "text-white/60 hover:text-white"}
      `}
    >
      {({ isActive }) => (
        <>
          {children}

          {isActive && (
            <span
              className="
                absolute
                inset-x-4
                bottom-0
                h-[2px]
                bg-gradient-to-r
                from-blue-500
                to-purple-500
              "
            />
          )}
        </>
      )}
    </NavLink>
  );
}

function ChevronIcon({ open }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={`
        h-3.5
        w-3.5
        transition-transform

        ${open ? "rotate-180" : ""}
      `}
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="M3 4h2l2 11h10l2-7H6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle cx="9" cy="19" r="1" />

      <circle cx="17" cy="19" r="1" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4A8 8 0 1 1 20 11.5Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path d="M9 8.5c.5 2.5 2 4 4.5 5" strokeLinecap="round" />
    </svg>
  );
}

function MenuIcon({ open }) {
  if (open) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

export default PublicHeader;
