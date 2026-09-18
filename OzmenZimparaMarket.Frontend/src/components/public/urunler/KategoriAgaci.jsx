function KategoriAgaci({ kategoriler, seciliKategori, onKategoriSec }) {
  return (
    <div>
      <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-text-primary">
        Kategoriler
      </h2>

      <div className="mt-4 space-y-1">
        <button
          type="button"
          onClick={() => onKategoriSec(null)}
          className={`
            flex w-full items-center justify-between
            rounded-ui px-3 py-2.5
            text-left text-sm font-semibold
            transition-colors
            ${
              seciliKategori === null
                ? "bg-brand-blue text-white"
                : "text-text-secondary hover:bg-surface-muted hover:text-text-primary"
            }
          `}
        >
          Tüm Ürünler
        </button>

        {kategoriler.map((kategori) => (
          <div key={kategori.id}>
            <button
              type="button"
              onClick={() => onKategoriSec(kategori.seoUrl)}
              className={`
                flex w-full items-center justify-between
                rounded-ui px-3 py-2.5
                text-left text-sm font-semibold
                transition-colors
                ${
                  seciliKategori === kategori.seoUrl
                    ? "bg-brand-blue text-white"
                    : "text-text-secondary hover:bg-surface-muted hover:text-text-primary"
                }
              `}
            >
              <span>{kategori.kategoriAdi}</span>

              {kategori.altKategoriler?.length > 0 && (
                <span
                  className={`
                    text-xs
                    ${
                      seciliKategori === kategori.seoUrl
                        ? "text-white/70"
                        : "text-text-muted"
                    }
                  `}
                >
                  {kategori.altKategoriler.length}
                </span>
              )}
            </button>

            {kategori.altKategoriler?.length > 0 && (
              <div className="ml-4 mt-1 border-l border-border pl-3">
                {kategori.altKategoriler.map((altKategori) => (
                  <button
                    key={altKategori.id}
                    type="button"
                    onClick={() => onKategoriSec(altKategori.seoUrl)}
                    className={`
                      block w-full rounded-ui px-3 py-2
                      text-left text-sm
                      transition-colors
                      ${
                        seciliKategori === altKategori.seoUrl
                          ? "font-semibold text-brand-blue"
                          : "text-text-muted hover:bg-surface-muted hover:text-text-primary"
                      }
                    `}
                  >
                    {altKategori.kategoriAdi}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default KategoriAgaci;
