function SonEklenenUrunler({ urunler = [], loading = false, onUrunleriYonet }) {
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
          flex
          items-center
          justify-between
          gap-4
          border-b
          border-border
          px-5
          py-4
        "
      >
        <div>
          <h2
            className="
              text-base
              font-extrabold
              text-text-primary
            "
          >
            Son Eklenen Ürünler
          </h2>

          <p
            className="
              mt-1
              text-xs
              leading-5
              text-text-muted
            "
          >
            Kataloğa en son eklenen ürün kayıtları.
          </p>
        </div>

        <button
          type="button"
          onClick={onUrunleriYonet}
          className="
            shrink-0
            text-xs
            font-extrabold
            text-brand-blue
            transition

            hover:text-brand-purple
          "
        >
          Tümünü Gör
        </button>
      </div>

      {loading ? (
        <SonUrunSkeleton />
      ) : urunler.length === 0 ? (
        <div
          className="
            flex
            min-h-[320px]
            items-center
            justify-center
            px-6
            py-10
            text-center
          "
        >
          <div>
            <div
              className="
                mx-auto
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                bg-surface-soft
                text-text-muted
              "
            >
              <ProductIcon />
            </div>

            <p
              className="
                mt-4
                text-sm
                font-extrabold
                text-text-primary
              "
            >
              Henüz ürün bulunmuyor
            </p>

            <p
              className="
                mt-1
                text-xs
                text-text-muted
              "
            >
              Kataloğa ürün eklendiğinde burada görüntülenecek.
            </p>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {urunler.map((urun) => (
            <SonUrunSatiri key={urun.id} urun={urun} />
          ))}
        </div>
      )}
    </section>
  );
}

function SonUrunSatiri({ urun }) {
  const gorselUrl = urunGorselUrlOlustur(urun.gorselYolu);

  return (
    <div
      className="
        flex
        items-center
        gap-3
        px-5
        py-3.5
      "
    >
      <div
        className="
          flex
          h-11
          w-11
          shrink-0
          items-center
          justify-center
          overflow-hidden
          rounded-xl
          border
          border-border
          bg-surface-soft
          text-text-muted
        "
      >
        {gorselUrl ? (
          <img
            src={gorselUrl}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <ProductIcon />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p
            className="
              truncate
              text-sm
              font-extrabold
              text-text-primary
            "
          >
            {urun.urunAdi}
          </p>

          {urun.oneCikanMi && (
            <span
              title="Öne çıkan ürün"
              className="
                shrink-0
                text-amber-500
              "
            >
              ★
            </span>
          )}
        </div>

        <div
          className="
            mt-1
            flex
            min-w-0
            items-center
            gap-2
          "
        >
          <span
            className="
              truncate
              font-mono
              text-[11px]
              font-semibold
              text-text-muted
            "
          >
            {urun.urunKodu}
          </span>

          <span className="h-1 w-1 shrink-0 rounded-full bg-slate-300" />

          <span
            className="
              truncate
              text-[11px]
              font-semibold
              text-text-muted
            "
          >
            {urun.kategoriAdi || "-"}
          </span>
        </div>
      </div>

      <div className="shrink-0 text-right">
        <span
          className={`
            inline-flex
            rounded-full
            px-2.5
            py-1
            text-[10px]
            font-extrabold

            ${
              urun.aktifMi
                ? "bg-emerald-50 text-emerald-700"
                : "bg-slate-100 text-slate-500"
            }
          `}
        >
          {urun.aktifMi ? "Aktif" : "Pasif"}
        </span>

        <p
          className="
            mt-1.5
            text-[10px]
            font-semibold
            text-text-muted
          "
        >
          {tarihYaz(urun.olusturmaTarihi)}
        </p>
      </div>
    </div>
  );
}

function SonUrunSkeleton() {
  return (
    <div className="divide-y divide-border">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="
            flex
            items-center
            gap-3
            px-5
            py-4
          "
        >
          <div className="h-11 w-11 animate-pulse rounded-xl bg-slate-100" />

          <div className="flex-1">
            <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100" />
            <div className="mt-2 h-3 w-1/3 animate-pulse rounded bg-slate-100" />
          </div>

          <div className="h-6 w-14 animate-pulse rounded-full bg-slate-100" />
        </div>
      ))}
    </div>
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

  const sunucuBaseUrl = apiBaseUrl.replace(/\/api\/?$/i, "");

  if (!sunucuBaseUrl) {
    return temizYol;
  }

  return `${sunucuBaseUrl}${temizYol.startsWith("/") ? "" : "/"}${temizYol}`;
}

function tarihYaz(tarih) {
  if (!tarih) {
    return "-";
  }

  const date = new Date(tarih);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function ProductIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
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
      />
    </svg>
  );
}

export default SonEklenenUrunler;
