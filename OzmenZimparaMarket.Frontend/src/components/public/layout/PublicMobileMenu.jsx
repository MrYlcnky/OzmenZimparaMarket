import { useState } from "react";
import { NavLink } from "react-router";

function PublicMobileMenu({
  open,
  sepetKalemSayisi = 0,
  whatsappBaglantisi,
  onClose,
}) {
  const [kurumsalAcikMi, setKurumsalAcikMi] = useState(false);

  if (!open) {
    return null;
  }

  return (
    <div
      className="
        border-t
        border-white/[0.07]
        bg-[#080a13]
        lg:hidden
      "
    >
      <div
        className="
          mx-auto
          max-w-[1440px]
          px-5
          pb-6
          pt-4

          sm:px-6
        "
      >
        <nav className="space-y-1">
          <MobilNavLink to="/" end onClick={onClose}>
            Ana Sayfa
          </MobilNavLink>

          <MobilNavLink to="/urunler" onClick={onClose}>
            Ürünlerimiz
          </MobilNavLink>

          <button
            type="button"
            onClick={() => setKurumsalAcikMi((mevcut) => !mevcut)}
            className="
              flex
              w-full
              items-center
              justify-between
              rounded-xl
              px-3
              py-3.5
              text-left
              text-sm
              font-bold
              text-white/75
              transition-colors

              hover:bg-white/[0.04]
              hover:text-white
            "
          >
            <span>Hakkımızda</span>

            <ChevronIcon open={kurumsalAcikMi} />
          </button>

          {kurumsalAcikMi && (
            <div
              className="
                ml-3
                border-l
                border-purple-400/20
                pl-3
              "
            >
              <MobilAltLink to="/hakkimizda" onClick={onClose}>
                Hakkımızda
              </MobilAltLink>

              <MobilAltLink to="/hakkimizda#vizyonumuz" onClick={onClose}>
                Vizyonumuz
              </MobilAltLink>

              <MobilAltLink to="/hakkimizda#misyonumuz" onClick={onClose}>
                Misyonumuz
              </MobilAltLink>

              <MobilAltLink to="/hakkimizda#stratejimiz" onClick={onClose}>
                Stratejimiz
              </MobilAltLink>

              <MobilAltLink
                to="/hakkimizda#kalite-politikamiz"
                onClick={onClose}
              >
                Kalite Politikamız
              </MobilAltLink>
            </div>
          )}

          <MobilNavLink to="/iletisim" onClick={onClose}>
            Bize Ulaşın
          </MobilNavLink>
        </nav>

        <div
          className="
            my-5
            h-px
            bg-white/[0.07]
          "
        />

        <div
          className="
            flex
            items-center
            justify-between
            rounded-xl
            border
            border-white/[0.08]
            bg-white/[0.025]
            px-4
            py-3.5
          "
        >
          <div className="flex items-center gap-3">
            <CartIcon />

            <div>
              <p
                className="
                  text-sm
                  font-bold
                  text-white/90
                "
              >
                Teklif Sepeti
              </p>

              <p
                className="
                  mt-0.5
                  text-[11px]
                  text-white/40
                "
              >
                {sepetKalemSayisi} ürün seçildi
              </p>
            </div>
          </div>

          <span
            className="
              flex
              h-7
              min-w-7
              items-center
              justify-center
              rounded-full
              bg-purple-500
              px-2
              text-xs
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
            onClick={onClose}
            className="
              mt-3
              flex
              h-12
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-[#25D366]
              px-5
              text-sm
              font-extrabold
              text-white
              shadow-[0_10px_30px_rgba(37,211,102,0.18)]
              transition-all

              hover:bg-[#20bd5a]
            "
          >
            <WhatsAppIcon />
            WhatsApp'tan İletişime Geç
          </a>
        )}
      </div>
    </div>
  );
}

function MobilNavLink({ to, end = false, onClick, children }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) => `
        block
        rounded-xl
        px-3
        py-3.5
        text-sm
        font-bold
        transition-colors

        ${
          isActive
            ? "bg-purple-500/10 text-purple-300"
            : "text-white/75 hover:bg-white/[0.04] hover:text-white"
        }
      `}
    >
      {children}
    </NavLink>
  );
}

function MobilAltLink({ to, onClick, children }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className="
        block
        rounded-lg
        px-3
        py-2.5
        text-xs
        font-semibold
        text-white/50
        transition-colors

        hover:bg-white/[0.04]
        hover:text-purple-300
      "
    >
      {children}
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
        h-4
        w-4
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
      className="h-5 w-5 text-purple-300"
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
      className="h-4.5 w-4.5"
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

export default PublicMobileMenu;
