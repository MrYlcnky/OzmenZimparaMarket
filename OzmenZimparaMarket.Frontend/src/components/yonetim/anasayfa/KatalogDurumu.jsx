function KatalogDurumu({ kategoriler, urunler, loading = false }) {
  const satirlar = [
    {
      baslik: "Öne Çıkan Ürün",
      aciklama: "Aktif ve öne çıkan olarak işaretlenen ürünler.",
      deger: urunler?.oneCikan ?? 0,
      iconClassName: "bg-amber-50 text-amber-600",
      icon: <StarIcon />,
    },

    {
      baslik: "Ana Sayfa Kategorisi",
      aciklama: "Ana sayfada gösterilecek aktif kategoriler.",
      deger: kategoriler?.anaSayfadaGosterilen ?? 0,
      iconClassName: "bg-blue-50 text-blue-600",
      icon: <HomeIcon />,
    },

    {
      baslik: "Görselsiz Ürün",
      aciklama: "Henüz ürün görseli tanımlanmamış kayıtlar.",
      deger: urunler?.gorselsiz ?? 0,
      iconClassName: "bg-rose-50 text-rose-600",
      icon: <ImageIcon />,
    },

    {
      baslik: "Teknik Detaysız Ürün",
      aciklama: "Teknik özellik değeri bulunmayan ürünler.",
      deger: urunler?.teknikDetaysiz ?? 0,
      iconClassName: "bg-violet-50 text-violet-600",
      icon: <DetailIcon />,
    },
  ];

  return (
    <section
      className="
        overflow-hidden
        rounded-ui-lg
        border
        border-border
        bg-white
        shadow-sm
      "
    >
      <div
        className="
          border-b
          border-border
          px-5
          py-4
        "
      >
        <h2
          className="
            text-base
            font-extrabold
            text-text-primary
          "
        >
          Katalog Durumu
        </h2>

        <p
          className="
            mt-1
            text-xs
            leading-5
            text-text-muted
          "
        >
          Ürün kataloğunda dikkat edilmesi gereken temel kayıtlar.
        </p>
      </div>

      <div className="divide-y divide-border">
        {satirlar.map((satir) => (
          <div
            key={satir.baslik}
            className="
              flex
              items-center
              gap-4
              px-5
              py-4
            "
          >
            <div
              className={`
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl

                ${satir.iconClassName}
              `}
            >
              {satir.icon}
            </div>

            <div className="min-w-0 flex-1">
              <p
                className="
                  text-sm
                  font-extrabold
                  text-text-primary
                "
              >
                {satir.baslik}
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  leading-5
                  text-text-muted
                "
              >
                {satir.aciklama}
              </p>
            </div>

            {loading ? (
              <div className="h-7 w-10 animate-pulse rounded-lg bg-slate-100" />
            ) : (
              <span
                className="
                  min-w-[42px]
                  text-right
                  text-xl
                  font-extrabold
                  text-text-primary
                "
              >
                {satir.deger}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4.5 w-4.5">
      <path d="m12 2.75 2.77 5.62 6.2.9-4.49 4.37 1.06 6.18L12 16.9l-5.54 2.92 1.06-6.18-4.49-4.37 6.2-.9L12 2.75Z" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="m4 10 8-6 8 6v9H4v-9Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <rect
        x="4"
        y="5"
        width="16"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="m6 17 4-4 3 3 2-2 3 3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />

      <circle cx="15.5" cy="9.5" r="1.5" fill="currentColor" />
    </svg>
  );
}

function DetailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M7 6h10M7 12h10M7 18h6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default KatalogDurumu;
