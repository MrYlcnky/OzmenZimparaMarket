function UrunOzelligiFormu({
  form,
  formHatalari = {},
  onAlanDegisti,
  disabled = false,
}) {
  return (
    <div className="space-y-6">
      <FormBolumu
        baslik="Temel Bilgiler"
        aciklama="Özelliğin adını ve görüntülenme sırasını belirleyin."
      >
        <div
          className="
            grid
            grid-cols-1
            gap-4
            md:grid-cols-[minmax(0,1fr)_150px]
          "
        >
          <FormAlani label="Özellik Adı" required hata={formHatalari.detayAdi}>
            <input
              type="text"
              value={form.detayAdi}
              onChange={(event) =>
                onAlanDegisti("detayAdi", event.target.value)
              }
              disabled={disabled}
              maxLength={150}
              placeholder="Örn. Kum Türü"
              className={inputSinifi(Boolean(formHatalari.detayAdi))}
            />
          </FormAlani>

          <FormAlani label="Sıra No" hata={formHatalari.siraNo}>
            <input
              type="number"
              min="0"
              step="1"
              value={form.siraNo}
              onChange={(event) => onAlanDegisti("siraNo", event.target.value)}
              disabled={disabled}
              className={inputSinifi(Boolean(formHatalari.siraNo))}
            />
          </FormAlani>
        </div>
      </FormBolumu>

      <FormBolumu
        baslik="Kullanım Ayarları"
        aciklama="Özelliğin ürün, filtre ve teklif sepetindeki davranışını belirleyin."
      >
        <div
          className="
            overflow-hidden

            rounded-xl

            border
            border-border

            bg-white
          "
        >
          <AyarSatiri
            baslik="Çoklu Değer"
            aciklama="Bir ürün bu özellik için birden fazla değere sahip olabilir."
            aktif={form.cokluDegerMi}
            onDegistir={(deger) => onAlanDegisti("cokluDegerMi", deger)}
            disabled={disabled}
          />

          <AyarSatiri
            baslik="Filtrede Göster"
            aciklama="Ürün listeleme sayfasındaki filtre seçeneklerinde kullanılır."
            aktif={form.filtredeGosterilsinMi}
            onDegistir={(deger) =>
              onAlanDegisti("filtredeGosterilsinMi", deger)
            }
            disabled={disabled}
            border
          />

          <AyarSatiri
            baslik="Teklif Sepetinde Seçilebilir"
            aciklama="Ziyaretçi teklif oluştururken bu özelliğin değerini seçebilir."
            aktif={form.sepetteSecilebilirMi}
            onDegistir={(deger) => onAlanDegisti("sepetteSecilebilirMi", deger)}
            disabled={disabled}
            border
          />
        </div>
      </FormBolumu>

      <FormBolumu
        baslik="Yayın Durumu"
        aciklama="Özelliğin sistemde kullanılabilir olup olmadığını belirleyin."
      >
        <div
          className="
            overflow-hidden

            rounded-xl

            border
            border-border

            bg-slate-50/50
          "
        >
          <AyarSatiri
            baslik="Aktif"
            aciklama="Pasif özellikler public tarafta ve yeni ürünlerde kullanılmaz."
            aktif={form.aktifMi}
            onDegistir={(deger) => onAlanDegisti("aktifMi", deger)}
            disabled={disabled}
          />
        </div>
      </FormBolumu>
    </div>
  );
}

function FormBolumu({ baslik, aciklama, children }) {
  return (
    <section>
      <div className="mb-3">
        <h3
          className="
            text-[13px]
            font-extrabold
            text-text-primary
          "
        >
          {baslik}
        </h3>

        <p
          className="
            mt-1
            text-[12px]
            leading-5
            text-text-muted
          "
        >
          {aciklama}
        </p>
      </div>

      {children}
    </section>
  );
}

function FormAlani({ label, required = false, hata, children }) {
  return (
    <div>
      <label
        className="
          block
          text-[12px]
          font-extrabold
          text-text-secondary
        "
      >
        {label}

        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <div className="mt-2">{children}</div>

      {hata && (
        <p
          className="
            mt-1.5
            text-xs
            font-semibold
            text-red-600
          "
        >
          {hata}
        </p>
      )}
    </div>
  );
}

function AyarSatiri({
  baslik,
  aciklama,
  aktif,
  onDegistir,
  disabled = false,
  border = false,
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={aktif}
      disabled={disabled}
      onClick={() => onDegistir(!aktif)}
      className={`
        flex
        w-full
        items-center
        justify-between
        gap-5

        px-4
        py-3.5

        text-left

        transition-colors

        hover:bg-slate-50

        focus:outline-none
        focus:ring-4
        focus:ring-inset
        focus:ring-brand-blue/10

        disabled:cursor-not-allowed
        disabled:opacity-60

        ${border ? "border-t border-border" : ""}
      `}
    >
      <div className="min-w-0">
        <div
          className="
            flex
            flex-wrap
            items-center
            gap-2
          "
        >
          <span
            className="
              text-[13px]
              font-extrabold
              text-text-primary
            "
          >
            {baslik}
          </span>

          <span
            className={`
              rounded-full

              px-2
              py-0.5

              text-[10px]
              font-extrabold

              ${
                aktif
                  ? `
                    bg-emerald-50
                    text-emerald-700
                  `
                  : `
                    bg-slate-100
                    text-slate-500
                  `
              }
            `}
          >
            {aktif ? "Açık" : "Kapalı"}
          </span>
        </div>

        <p
          className="
            mt-1
            text-[11px]
            leading-5
            text-text-muted
          "
        >
          {aciklama}
        </p>
      </div>

      <Switch aktif={aktif} />
    </button>
  );
}

function Switch({ aktif }) {
  return (
    <span
      aria-hidden="true"
      className={`
        relative
        block

        h-6
        w-11

        shrink-0

        rounded-full

        transition-colors

        ${aktif ? "bg-brand-blue" : "bg-slate-300"}
      `}
    >
      <span
        className={`
          absolute
          top-1/2

          h-4
          w-4

          -translate-y-1/2

          rounded-full

          bg-white

          shadow-sm

          transition-all

          ${aktif ? "left-6" : "left-1"}
        `}
      />
    </span>
  );
}

function inputSinifi(hatali) {
  return `
    h-11
    w-full

    rounded-xl

    border

    bg-[#fafafa]

    px-3.5

    text-sm
    text-text-primary

    outline-none

    transition-all

    placeholder:text-text-muted

    disabled:cursor-not-allowed
    disabled:opacity-60

    ${
      hatali
        ? `
          border-red-400

          focus:border-red-500
          focus:bg-white
          focus:ring-4
          focus:ring-red-500/10
        `
        : `
          border-border

          hover:border-slate-300
          hover:bg-white

          focus:border-brand-blue
          focus:bg-white
          focus:ring-4
          focus:ring-brand-blue/10
        `
    }
  `;
}

export default UrunOzelligiFormu;
