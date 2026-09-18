import { NavLink } from "react-router";

function UrunKarti({
  urunAdi,
  urunKodu,
  kategoriAdi,
  kisaAciklama,
  seoUrl,
  gorselYolu,
}) {
  return (
    <article
      className="
        group flex h-full flex-col overflow-hidden
        rounded-ui-lg border border-border
        bg-white shadow-card
        transition-all duration-300
        hover:-translate-y-1
        hover:border-brand-blue/25
        hover:shadow-card-hover
      "
    >
      <NavLink
        to={`/urunler/${seoUrl}`}
        className="block"
        aria-label={`${urunAdi} ürününü incele`}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-surface-muted">
          {gorselYolu ? (
            <img
              src={gorselYolu}
              alt={urunAdi}
              loading="lazy"
              className="
                h-full w-full object-cover
                transition-transform duration-500
                group-hover:scale-[1.04]
              "
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-surface-dark to-brand-black">
              <span className="text-6xl font-extrabold text-white/10">
                {urunAdi?.charAt(0)}
              </span>
            </div>
          )}

          {kategoriAdi && (
            <div className="absolute left-4 top-4">
              <span className="rounded-full border border-white/15 bg-black/50 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur-md">
                {kategoriAdi}
              </span>
            </div>
          )}
        </div>
      </NavLink>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {urunKodu && (
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">
            {urunKodu}
          </p>
        )}

        <NavLink to={`/urunler/${seoUrl}`} className="mt-2">
          <h3 className="text-lg font-bold leading-7 text-text-primary transition-colors group-hover:text-brand-blue">
            {urunAdi}
          </h3>
        </NavLink>

        {kisaAciklama && (
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-text-secondary">
            {kisaAciklama}
          </p>
        )}

        <div className="mt-auto pt-6">
          <NavLink
            to={`/urunler/${seoUrl}`}
            className="
              inline-flex items-center gap-2
              text-sm font-bold text-brand-blue
              transition-colors
              hover:text-brand-purple
            "
          >
            Ürünü İncele
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
                d="M5 12h14M13 6l6 6-6 6"
              />
            </svg>
          </NavLink>
        </div>
      </div>
    </article>
  );
}

export default UrunKarti;
