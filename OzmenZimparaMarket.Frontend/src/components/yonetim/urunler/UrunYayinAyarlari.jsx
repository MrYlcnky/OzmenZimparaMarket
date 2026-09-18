function UrunYayinAyarlari({ form, formHatalari = {}, onFieldChange }) {
  return (
    <div
      className="
        grid
        gap-5
        lg:grid-cols-[1fr_1fr_220px]
      "
    >
      <AyarKarti
        baslik="Aktif Ürün"
        aciklama="Ürün aktif olduğunda public katalogda yayınlanabilir."
      >
        <Toggle
          checked={form.aktifMi}
          onChange={(value) => onFieldChange("aktifMi", value)}
          aktifMetin="Aktif"
          pasifMetin="Pasif"
        />
      </AyarKarti>

      <AyarKarti
        baslik="Öne Çıkan Ürün"
        aciklama="Ürünü öne çıkan ürün alanlarında göstermek için işaretleyin."
      >
        <Toggle
          checked={form.oneCikanMi}
          onChange={(value) => onFieldChange("oneCikanMi", value)}
          aktifMetin="Öne Çıkan"
          pasifMetin="Standart"
        />
      </AyarKarti>

      <AyarKarti
        baslik="Sıra No"
        aciklama="Düşük sıra numarası öncelikli gösterilir."
      >
        <input
          type="number"
          min="0"
          step="1"
          value={form.siraNo}
          onChange={(event) => onFieldChange("siraNo", event.target.value)}
          className={`
            h-10
            w-full
            rounded-lg
            border
            bg-white
            px-3
            text-sm
            font-bold
            text-text-primary
            outline-none

            ${
              formHatalari.siraNo
                ? `
                  border-red-300
                  focus:ring-4
                  focus:ring-red-100
                `
                : `
                  border-border
                  focus:border-brand-blue
                  focus:ring-4
                  focus:ring-brand-blue/10
                `
            }
          `}
        />

        {formHatalari.siraNo && (
          <p
            className="
              mt-1.5
              text-xs
              font-semibold
              text-red-600
            "
          >
            {formHatalari.siraNo}
          </p>
        )}
      </AyarKarti>
    </div>
  );
}

function AyarKarti({ baslik, aciklama, children }) {
  return (
    <div
      className="
        rounded-xl
        border border-border
        bg-surface-soft/40
        p-4
      "
    >
      <h4
        className="
          text-sm
          font-extrabold
          text-text-primary
        "
      >
        {baslik}
      </h4>

      <p
        className="
          mt-1
          min-h-[40px]
          text-xs
          leading-5
          text-text-muted
        "
      >
        {aciklama}
      </p>

      <div className="mt-4">{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange, aktifMetin, pasifMetin }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="
        inline-flex
        items-center
        gap-3
      "
    >
      <span
        className={`
          relative
          inline-flex
          h-6 w-11
          shrink-0
          rounded-full
          transition-colors

          ${checked ? "bg-brand-blue" : "bg-slate-300"}
        `}
      >
        <span
          className={`
            absolute
            top-1
            h-4 w-4
            rounded-full
            bg-white
            shadow-sm
            transition-transform

            ${checked ? "translate-x-6" : "translate-x-1"}
          `}
        />
      </span>

      <span
        className={`
          text-xs
          font-extrabold

          ${checked ? "text-brand-blue" : "text-text-muted"}
        `}
      >
        {checked ? aktifMetin : pasifMetin}
      </span>
    </button>
  );
}

export default UrunYayinAyarlari;
