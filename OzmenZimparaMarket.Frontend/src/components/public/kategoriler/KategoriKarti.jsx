import { Link } from "react-router";

function KategoriKarti({ kategoriAdi, aciklama, seoUrl, gorselUrl, siraNo }) {
  const hedefYol = seoUrl
    ? `/urunler?kategori=${encodeURIComponent(seoUrl)}`
    : "/urunler";

  const kartNumarasi = String(siraNo).padStart(2, "0");

  return (
    <Link
      to={hedefYol}
      className="
        group
        relative
        isolate
        block
        aspect-[4/3]
        overflow-hidden
        rounded-[18px]
        bg-[#080a13]
        shadow-[0_12px_32px_rgba(15,23,42,0.10)]
        transition-all
        duration-500

        hover:-translate-y-1
        hover:shadow-[0_22px_48px_rgba(15,23,42,0.16)]

        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-purple-500
        focus-visible:ring-offset-2
      "
    >
      {/* Kartın tamamını kaplayan kategori görseli */}
      <div className="absolute inset-0 -z-30">
        {gorselUrl ? (
          <img
            src={gorselUrl}
            alt={kategoriAdi}
            className="
              h-full
              w-full
              object-cover
              object-center
              transition-transform
              duration-700
              ease-out

              group-hover:scale-[1.045]
            "
          />
        ) : (
          <div
            className="
              flex
              h-full
              w-full
              items-center
              justify-center
              bg-gradient-to-br
              from-[#090b18]
              via-[#101326]
              to-[#24143d]
            "
          >
            <KategoriIcon />
          </div>
        )}
      </div>

      {/* Genel hafif karartma */}
      <div
        className="
          absolute
          inset-0
          -z-20
          bg-black/[0.06]
        "
      />

      {/* Alt yazı okunabilirliği */}
      <div
        className="
          absolute
          inset-0
          -z-10
          bg-gradient-to-t
          from-[#050711]
          via-[#050711]/50
          via-[38%]
          to-transparent
        "
      />

      {/* Hover sırasında biraz daha koyulaşır */}
      <div
        className="
          absolute
          inset-0
          -z-10
          bg-gradient-to-t
          from-[#050711]
          via-[#050711]/40
          to-transparent
          opacity-0
          transition-opacity
          duration-500

          group-hover:opacity-100
        "
      />

      {/* Hafif mor marka ışığı */}
      <div
        className="
          pointer-events-none
          absolute
          -bottom-28
          -left-20
          -z-10
          h-56
          w-56
          rounded-full
          bg-purple-600/25
          blur-[85px]
          opacity-0
          transition-opacity
          duration-500

          group-hover:opacity-100
        "
      />

      {/* Kart numarası */}
      <span
        className="
          absolute
          right-4
          top-4
          text-[10px]
          font-bold
          tracking-[0.14em]
          text-white/70
        "
      >
        {kartNumarasi}
      </span>

      {/* Alt içerik */}
      <div
        className="
          absolute
          inset-x-0
          bottom-0
          p-4

          sm:p-5
        "
      >
        <div
          className="
            transition-transform
            duration-500
            ease-out

            group-hover:-translate-y-1
          "
        >
          <h3
            className="
              text-[16px]
              font-extrabold
              leading-tight
              tracking-[-0.025em]
              text-white

              xl:text-[17px]
            "
          >
            {kategoriAdi}
          </h3>

          {aciklama && (
            <div
              className="
                grid
                grid-rows-[0fr]
                opacity-0
                transition-all
                duration-500
                ease-out

                group-hover:mt-2
                group-hover:grid-rows-[1fr]
                group-hover:opacity-100
              "
            >
              <div className="overflow-hidden">
                <p
                  className="
                    line-clamp-2
                    max-w-[95%]
                    text-[11px]
                    leading-5
                    text-white/65
                  "
                >
                  {aciklama}
                </p>
              </div>
            </div>
          )}

          <div
            className="
              mt-3
              inline-flex
              items-center
              gap-1.5
              text-[10px]
              font-extrabold
              text-purple-300

              sm:text-[11px]
            "
          >
            Ürünleri İncele
            <ArrowIcon />
          </div>
        </div>
      </div>

      {/* İnce dış çizgi */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          rounded-[18px]
          border
          border-white/[0.08]
          transition-colors
          duration-500

          group-hover:border-purple-400/30
        "
      />
    </Link>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="
        h-3.5
        w-3.5
        transition-transform
        duration-300

        group-hover:translate-x-1
      "
      aria-hidden="true"
    >
      <path
        d="M5 12h14M13 6l6 6-6 6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function KategoriIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      className="
        h-14
        w-14
        text-white/20
      "
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="15" />
      <circle cx="24" cy="24" r="5" />
      <path d="M24 9v10M39 24H29M24 39V29M9 24h10" />
    </svg>
  );
}

export default KategoriKarti;
