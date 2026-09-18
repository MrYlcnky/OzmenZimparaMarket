import { NavLink } from "react-router";

function KategoriKarti({ kategoriAdi, aciklama, seoUrl, gorselYolu }) {
  return (
    <NavLink
      to={`/urunler?kategori=${seoUrl}`}
      className="
        group relative overflow-hidden
        rounded-ui-lg border border-border
        bg-white shadow-card
        transition-all duration-300
        hover:-translate-y-1
        hover:border-brand-blue/30
        hover:shadow-card-hover
      "
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-muted">
        {gorselYolu ? (
          <img
            src={gorselYolu}
            alt={kategoriAdi}
            loading="lazy"
            className="
              h-full w-full object-cover
              transition-transform duration-500
              group-hover:scale-[1.04]
            "
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-surface-dark to-brand-black">
            <span className="text-5xl font-extrabold text-white/10">
              {kategoriAdi?.charAt(0)}
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-text-primary">
              {kategoriAdi}
            </h3>

            {aciklama && (
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-text-secondary">
                {aciklama}
              </p>
            )}
          </div>

          <span
            className="
              mt-1 flex h-9 w-9 shrink-0
              items-center justify-center
              rounded-ui bg-surface-soft
              text-text-secondary
              transition-all duration-200
              group-hover:bg-brand-blue
              group-hover:text-white
            "
          >
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
          </span>
        </div>
      </div>
    </NavLink>
  );
}

export default KategoriKarti;
