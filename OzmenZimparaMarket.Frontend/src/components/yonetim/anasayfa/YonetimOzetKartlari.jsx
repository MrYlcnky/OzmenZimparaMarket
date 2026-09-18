function YonetimOzetKartlari({ ozet, loading = false }) {
  const kartlar = [
    {
      key: "kategori",
      baslik: "Kategoriler",
      deger: ozet?.kategoriler?.toplam ?? 0,
      altMetin: `${ozet?.kategoriler?.aktif ?? 0} aktif`,
      icon: <CategoryIcon />,
      iconClassName: "bg-blue-50 text-blue-600",
    },

    {
      key: "urun",
      baslik: "Ürünler",
      deger: ozet?.urunler?.toplam ?? 0,
      altMetin: `${ozet?.urunler?.aktif ?? 0} aktif`,
      icon: <ProductIcon />,
      iconClassName: "bg-violet-50 text-violet-600",
    },

    {
      key: "ozellik",
      baslik: "Teknik Özellikler",
      deger: ozet?.teknikOzellikler?.toplam ?? 0,
      altMetin: `${ozet?.teknikOzellikler?.aktif ?? 0} aktif`,
      icon: <SlidersIcon />,
      iconClassName: "bg-indigo-50 text-indigo-600",
    },

    {
      key: "kullanici",
      baslik: "Panel Kullanıcıları",
      deger: ozet?.kullanicilar?.toplam ?? 0,
      altMetin: `${ozet?.kullanicilar?.aktif ?? 0} aktif`,
      icon: <UsersIcon />,
      iconClassName: "bg-emerald-50 text-emerald-600",
    },
  ];

  return (
    <div
      className="
        grid
        gap-4

        sm:grid-cols-2
        xl:grid-cols-4
      "
    >
      {kartlar.map(({ key, ...kart }) => (
        <OzetKarti key={key} {...kart} loading={loading} />
      ))}
    </div>
  );
}

function OzetKarti({ baslik, deger, altMetin, icon, iconClassName, loading }) {
  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-ui-lg
        border
        border-border
        bg-white
        p-5
        shadow-sm
      "
    >
      <div
        className="
          absolute
          inset-x-0
          top-0
          h-[2px]
          bg-gradient-to-r
          from-brand-blue
          via-brand-purple
          to-transparent
          opacity-70
        "
      />

      <div className="flex items-start justify-between gap-4">
        <div>
          <p
            className="
              text-xs
              font-extrabold
              uppercase
              tracking-[0.06em]
              text-text-muted
            "
          >
            {baslik}
          </p>

          {loading ? (
            <div
              className="
                mt-3
                h-9
                w-20
                animate-pulse
                rounded-lg
                bg-slate-100
              "
            />
          ) : (
            <p
              className="
                mt-2
                text-3xl
                font-extrabold
                tracking-tight
                text-text-primary
              "
            >
              {deger}
            </p>
          )}

          {loading ? (
            <div
              className="
                mt-2
                h-4
                w-16
                animate-pulse
                rounded
                bg-slate-100
              "
            />
          ) : (
            <p
              className="
                mt-1
                text-xs
                font-semibold
                text-text-muted
              "
            >
              {altMetin}
            </p>
          )}
        </div>

        <div
          className={`
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-xl

            ${iconClassName}
          `}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function CategoryIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M4 5h6v6H4V5Zm10 0h6v6h-6V5ZM4 15h6v4H4v-4Zm10 0h6v4h-6v-4Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ProductIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M5 7.5 12 4l7 3.5v9L12 20l-7-3.5v-9Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />

      <path
        d="m5 7.5 7 3.5 7-3.5M12 11v9"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SlidersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M4 7h10M18 7h2M4 17h2M10 17h10M14 4v6M10 14v6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.7" />

      <path
        d="M3.5 19a5.5 5.5 0 0 1 11 0"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <path
        d="M16 6.2a3 3 0 0 1 0 5.6M17 14.5A5 5 0 0 1 21 19"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default YonetimOzetKartlari;
