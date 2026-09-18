import { useEffect, useRef, useState } from "react";

function ExcelIslemleriMenu({
  sablonIndiriliyorMu = false,
  disariAktariliyorMu = false,

  onSablonIndir,
  onDisariAktar,
  onIceAktar,

  sablonMetni = "Excel Şablonunu İndir",
  disariAktarMetni = "Excel'e Dışa Aktar",
  aktarMetni = "Excel'den İçe Aktar",
}) {
  const [acikMi, setAcikMi] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    function disariTiklandi(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setAcikMi(false);
      }
    }

    function escapeBasildi(event) {
      if (event.key === "Escape") {
        setAcikMi(false);
      }
    }

    document.addEventListener("mousedown", disariTiklandi);
    document.addEventListener("keydown", escapeBasildi);

    return () => {
      document.removeEventListener("mousedown", disariTiklandi);
      document.removeEventListener("keydown", escapeBasildi);
    };
  }, []);

  async function sablonuIndir() {
    if (sablonIndiriliyorMu || !onSablonIndir) {
      return;
    }

    setAcikMi(false);

    await onSablonIndir();
  }

  async function disariAktar() {
    if (disariAktariliyorMu || !onDisariAktar) {
      return;
    }

    setAcikMi(false);

    await onDisariAktar();
  }

  function iceAktar() {
    if (!onIceAktar) {
      return;
    }

    setAcikMi(false);

    onIceAktar();
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setAcikMi((mevcut) => !mevcut)}
        className="
          inline-flex
          h-11
          items-center
          justify-center
          gap-2
          rounded-ui
          border
          border-border
          bg-white
          px-4
          text-sm
          font-bold
          text-text-secondary
          shadow-sm
          transition-all

          hover:border-brand-blue/25
          hover:bg-brand-blue/[0.025]
          hover:text-text-primary
        "
        aria-haspopup="menu"
        aria-expanded={acikMi}
      >
        <ExcelIcon />

        <span>Excel İşlemleri</span>

        <ChevronIcon acikMi={acikMi} />
      </button>

      {acikMi && (
        <div
          role="menu"
          className="
            absolute
            right-0
            top-[calc(100%+8px)]
            z-50
            w-[290px]
            overflow-hidden
            rounded-ui-lg
            border
            border-border
            bg-white
            p-1.5
            shadow-[0_18px_50px_rgba(15,23,42,0.14)]
          "
        >
          {onSablonIndir && (
            <button
              type="button"
              role="menuitem"
              onClick={sablonuIndir}
              disabled={sablonIndiriliyorMu}
              className="
                flex
                w-full
                items-start
                gap-3
                rounded-ui
                px-3
                py-3
                text-left
                transition-colors

                hover:bg-surface-soft

                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              <MenuIconKutusu>
                {sablonIndiriliyorMu ? <YukleniyorIcon /> : <DownloadIcon />}
              </MenuIconKutusu>

              <span>
                <span
                  className="
                    block
                    text-sm
                    font-bold
                    text-text-primary
                  "
                >
                  {sablonIndiriliyorMu ? "Şablon hazırlanıyor..." : sablonMetni}
                </span>

                <span
                  className="
                    mt-1
                    block
                    text-[11px]
                    leading-4
                    text-text-muted
                  "
                >
                  Güncel Excel şablonunu bilgisayarınıza indirin.
                </span>
              </span>
            </button>
          )}

          {onDisariAktar && (
            <>
              {onSablonIndir && <MenuAyirici />}

              <button
                type="button"
                role="menuitem"
                onClick={disariAktar}
                disabled={disariAktariliyorMu}
                className="
                  flex
                  w-full
                  items-start
                  gap-3
                  rounded-ui
                  px-3
                  py-3
                  text-left
                  transition-colors

                  hover:bg-surface-soft

                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                <MenuIconKutusu>
                  {disariAktariliyorMu ? <YukleniyorIcon /> : <ExportIcon />}
                </MenuIconKutusu>

                <span>
                  <span
                    className="
                      block
                      text-sm
                      font-bold
                      text-text-primary
                    "
                  >
                    {disariAktariliyorMu
                      ? "Excel hazırlanıyor..."
                      : disariAktarMetni}
                  </span>

                  <span
                    className="
                      mt-1
                      block
                      text-[11px]
                      leading-4
                      text-text-muted
                    "
                  >
                    Mevcut kayıtları Excel dosyası olarak indirin.
                  </span>
                </span>
              </button>
            </>
          )}

          {onIceAktar && (
            <>
              {(onSablonIndir || onDisariAktar) && <MenuAyirici />}

              <button
                type="button"
                role="menuitem"
                onClick={iceAktar}
                className="
                  flex
                  w-full
                  items-start
                  gap-3
                  rounded-ui
                  px-3
                  py-3
                  text-left
                  transition-colors

                  hover:bg-surface-soft
                "
              >
                <MenuIconKutusu>
                  <UploadIcon />
                </MenuIconKutusu>

                <span>
                  <span
                    className="
                      block
                      text-sm
                      font-bold
                      text-text-primary
                    "
                  >
                    {aktarMetni}
                  </span>

                  <span
                    className="
                      mt-1
                      block
                      text-[11px]
                      leading-4
                      text-text-muted
                    "
                  >
                    Doldurduğunuz Excel dosyasını analiz edin.
                  </span>
                </span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function MenuAyirici() {
  return (
    <div
      className="
        my-1
        border-t
        border-border
      "
    />
  );
}

function MenuIconKutusu({ children }) {
  return (
    <span
      className="
        flex
        h-9 w-9
        shrink-0
        items-center
        justify-center
        rounded-ui
        bg-brand-blue/[0.07]
        text-brand-blue
      "
    >
      {children}
    </span>
  );
}

function YukleniyorIcon() {
  return (
    <span
      className="
        h-4
        w-4
        animate-spin
        rounded-full
        border-2
        border-brand-blue/20
        border-t-brand-blue
      "
    />
  );
}

function ExcelIcon() {
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
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 3h7l4 4v14H7V3Z"
      />

      <path strokeLinecap="round" strokeLinejoin="round" d="M14 3v5h5" />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m9.5 12 4 5m0-5-4 5"
      />
    </svg>
  );
}

function DownloadIcon() {
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
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4v11m0 0-4-4m4 4 4-4M5 19h14"
      />
    </svg>
  );
}

function ExportIcon() {
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
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 4h7l4 4v12H7V4Z"
      />

      <path strokeLinecap="round" strokeLinejoin="round" d="M14 4v5h5" />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.5 14h5m0 0-2-2m2 2-2 2"
      />
    </svg>
  );
}

function UploadIcon() {
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
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 20V9m0 0-4 4m4-4 4 4M5 5h14"
      />
    </svg>
  );
}

function ChevronIcon({ acikMi }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={`
        h-3.5
        w-3.5
        transition-transform

        ${acikMi ? "rotate-180" : ""}
      `}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
    </svg>
  );
}

export default ExcelIslemleriMenu;
