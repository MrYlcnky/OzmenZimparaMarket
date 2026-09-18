function UrunFiltreleri() {
  return (
    <div className="border-t border-border pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-text-primary">
          Teknik Filtreler
        </h2>

        <button
          type="button"
          className="text-xs font-semibold text-brand-blue transition-colors hover:text-brand-purple"
        >
          Temizle
        </button>
      </div>

      <div className="mt-5 space-y-6">
        {/* Kum Türü */}
        <div>
          <p className="text-sm font-bold text-text-primary">Kum Türü</p>

          <div className="mt-3 space-y-2">
            {["Seramik", "Alüminyum Oksit", "Silisyum Karbür"].map((deger) => (
              <label
                key={deger}
                className="flex cursor-pointer items-center gap-3 text-sm text-text-secondary"
              >
                <input type="checkbox" className="h-4 w-4 accent-brand-blue" />

                <span>{deger}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Kullanım Alanı */}
        <div>
          <p className="text-sm font-bold text-text-primary">Kullanım Alanı</p>

          <div className="mt-3 space-y-2">
            {["Metal", "Ahşap", "Paslanmaz Çelik"].map((deger) => (
              <label
                key={deger}
                className="flex cursor-pointer items-center gap-3 text-sm text-text-secondary"
              >
                <input type="checkbox" className="h-4 w-4 accent-brand-blue" />

                <span>{deger}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UrunFiltreleri;
