import { useEffect, useState } from "react";

import UrunTeknikBilgileri from "./UrunTeknikBilgileri";
import UrunTeklifAlani from "./UrunTeklifAlani";

function UrunDetayPaneli({ urun }) {
  const [gorselAcikMi, setGorselAcikMi] = useState(false);

  const gorselUrl = urunGorselUrlOlustur(urun?.gorselYolu);

  useEffect(() => {
    if (!gorselAcikMi) {
      return undefined;
    }

    function klavyeKontrol(event) {
      if (event.key === "Escape") {
        setGorselAcikMi(false);
      }
    }

    const oncekiOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", klavyeKontrol);

    return () => {
      document.body.style.overflow = oncekiOverflow;

      window.removeEventListener("keydown", klavyeKontrol);
    };
  }, [gorselAcikMi]);

  if (!urun) {
    return null;
  }

  return (
    <>
      <div
        className="
          min-w-0
          overflow-hidden
          rounded-[22px]
          border
          border-zinc-200/80
          bg-white
          shadow-[0_18px_50px_rgba(15,23,42,0.045)]

          lg:rounded-[26px]
        "
      >
        <div
          className="
            grid
            min-w-0

            xl:grid-cols-[38%_minmax(0,1fr)]
            xl:items-stretch
          "
        >
          {/* Ürün görseli */}
          <div
            className="
              relative
              flex
              min-h-[420px]
              w-full
              items-center
              justify-center
              overflow-hidden
              border-b
              border-zinc-200
              bg-zinc-50

              sm:min-h-[500px]

              xl:min-h-[680px]
              xl:border-b-0
              xl:border-r
            "
          >
            {gorselUrl ? (
              <button
                type="button"
                onClick={() => setGorselAcikMi(true)}
                className="
                  group/gorsel
                  flex
                  h-full
                  min-h-[420px]
                  w-full
                  cursor-zoom-in
                  items-center
                  justify-center
                  overflow-hidden
                  outline-none

                  sm:min-h-[500px]
                  xl:min-h-[680px]
                "
                aria-label={`${urun.urunAdi} görselini büyüt`}
              >
                <img
                  src={gorselUrl}
                  alt={urun.urunAdi}
                  className="
                    h-full
                    w-full
                    object-contain
                    object-center
                    p-5
                    transition-transform
                    duration-500
                    ease-out

                    group-hover/gorsel:scale-[1.025]

                    sm:p-7
                    xl:p-8
                  "
                />
              </button>
            ) : (
              <div
                className="
                  flex
                  h-full
                  min-h-[420px]
                  w-full
                  items-center
                  justify-center
                  bg-gradient-to-br
                  from-[#090b18]
                  via-[#101326]
                  to-[#24143d]

                  sm:min-h-[500px]
                  xl:min-h-[680px]
                "
              >
                <UrunFallbackIcon />
              </div>
            )}

            {urun.oneCikanMi && (
              <span
                className="
                  pointer-events-none
                  absolute
                  left-4
                  top-4
                  rounded-full
                  border
                  border-zinc-200/80
                  bg-white/95
                  px-3
                  py-1.5
                  text-[9px]
                  font-extrabold
                  uppercase
                  tracking-[0.10em]
                  text-purple-700
                  shadow-sm
                  backdrop-blur-md
                "
              >
                Öne Çıkan
              </span>
            )}

            {gorselUrl && (
              <span
                className="
                  pointer-events-none
                  absolute
                  bottom-4
                  right-4
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-zinc-200/80
                  bg-white/95
                  px-3
                  py-2
                  text-[10px]
                  font-extrabold
                  text-zinc-700
                  shadow-sm
                  backdrop-blur-md
                "
              >
                <ZoomIcon />
                Büyüt
              </span>
            )}
          </div>

          {/* Ürün bilgileri */}
          <div
            className="
              min-w-0
              p-5

              sm:p-6
              lg:p-7
              xl:p-8
            "
          >
            {urun.kategoriAdi && (
              <p
                className="
                  text-[10px]
                  font-extrabold
                  uppercase
                  tracking-[0.13em]
                  text-purple-600

                  sm:text-[11px]
                "
              >
                {urun.kategoriAdi}
              </p>
            )}

            <h1
              className="
                mt-2
                text-[27px]
                font-extrabold
                leading-[1.15]
                tracking-[-0.04em]
                text-zinc-950

                sm:text-[32px]
                xl:text-[36px]
              "
            >
              {urun.urunAdi}
            </h1>

            {/* Ürün meta bilgileri */}
            <div
              className="
                mt-4
                flex
                flex-wrap
                gap-2
              "
            >
              {urun.urunKodu && (
                <MetaBilgi baslik="Ürün Kodu" deger={urun.urunKodu} />
              )}

              {urun.satisBirimiAdi && (
                <MetaBilgi baslik="Satış Birimi" deger={urun.satisBirimiAdi} />
              )}
            </div>

            {/* Kısa açıklama */}
            {urun.kisaAciklama && (
              <p
                className="
                  mt-5
                  text-[13px]
                  font-medium
                  leading-6
                  text-zinc-600
                "
              >
                {urun.kisaAciklama}
              </p>
            )}

            {/* Detaylı açıklama */}
            {urun.detayliAciklama &&
              urun.detayliAciklama !== urun.kisaAciklama && (
                <div
                  className="
                    mt-4
                    rounded-[14px]
                    border
                    border-zinc-100
                    bg-zinc-50/70
                    px-4
                    py-3
                  "
                >
                  <p
                    className="
                      whitespace-pre-line
                      text-[12px]
                      leading-6
                      text-zinc-500
                    "
                  >
                    {urun.detayliAciklama}
                  </p>
                </div>
              )}

            {/* Teknik bilgiler */}
            <UrunTeknikBilgileri teknikDetaylar={urun.teknikDetaylar} />

            {/* Teklif / miktar / sepet */}
            <UrunTeklifAlani urun={urun} />
          </div>
        </div>
      </div>

      {/* Büyük görsel / Lightbox */}
      {gorselAcikMi && gorselUrl && (
        <div
          className="
            fixed
            inset-0
            z-[9999]
            flex
            items-center
            justify-center
            bg-black/85
            p-4
            backdrop-blur-sm

            sm:p-6
          "
          role="dialog"
          aria-modal="true"
          aria-label={`${urun.urunAdi} büyük ürün görseli`}
          onClick={() => setGorselAcikMi(false)}
        >
          <button
            type="button"
            onClick={() => setGorselAcikMi(false)}
            className="
              absolute
              right-4
              top-4
              z-20
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              border
              border-white/15
              bg-black/50
              text-white
              backdrop-blur-md
              transition-all

              hover:scale-105
              hover:bg-white
              hover:text-zinc-950

              sm:right-6
              sm:top-6
            "
            aria-label="Büyük görseli kapat"
          >
            <CloseIcon />
          </button>

          <div
            className="
    relative
    flex
    h-[92vh]
    w-full
    max-w-[1400px]
    items-center
    justify-center
  "
          >
            <img
              src={gorselUrl}
              alt={urun.urunAdi}
              onClick={(event) => event.stopPropagation()}
              className="
                max-h-[88vh]
                max-w-full
                object-contain
                object-center
                drop-shadow-[0_30px_60px_rgba(0,0,0,0.40)]
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                bottom-0
                left-1/2
                max-w-[80%]
                -translate-x-1/2
                rounded-full
                bg-black/45
                px-4
                py-2
                text-center
                text-[11px]
                font-semibold
                text-white/80
                backdrop-blur-md
              "
            >
              {urun.urunAdi}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function MetaBilgi({ baslik, deger }) {
  return (
    <span
      className="
        inline-flex
        items-center
        gap-1.5
        rounded-lg
        border
        border-zinc-200
        bg-zinc-50
        px-2.5
        py-2
        text-[10px]

        sm:px-3
        sm:text-[11px]
      "
    >
      <span
        className="
          font-semibold
          text-zinc-400
        "
      >
        {baslik}:
      </span>

      <span
        className="
          font-extrabold
          text-zinc-800
        "
      >
        {deger}
      </span>
    </span>
  );
}

function urunGorselUrlOlustur(gorselYolu) {
  if (!gorselYolu || typeof gorselYolu !== "string") {
    return null;
  }

  const temizYol = gorselYolu.trim();

  if (!temizYol) {
    return null;
  }

  if (
    temizYol.startsWith("http://") ||
    temizYol.startsWith("https://") ||
    temizYol.startsWith("data:") ||
    temizYol.startsWith("blob:")
  ) {
    return temizYol;
  }

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

  const backendBaseUrl = apiBaseUrl.replace(/\/api\/?$/i, "");

  if (!backendBaseUrl) {
    return temizYol;
  }

  const ayrac = temizYol.startsWith("/") ? "" : "/";

  return `${backendBaseUrl}${ayrac}${temizYol}`;
}

function ZoomIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-3.5 w-3.5"
      aria-hidden="true"
    >
      <circle cx="10.5" cy="10.5" r="6" />

      <path d="m15 15 5 5M10.5 8v5M8 10.5h5" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M7 7l10 10M17 7 7 17" strokeLinecap="round" />
    </svg>
  );
}

function UrunFallbackIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      className="
        h-14
        w-14
        text-white/20

        sm:h-16
        sm:w-16
      "
      aria-hidden="true"
    >
      <circle cx="32" cy="32" r="21" />

      <circle cx="32" cy="32" r="7" />
    </svg>
  );
}

export default UrunDetayPaneli;
