function UrunSeoAlani({ form, formHatalari = {}, onFieldChange }) {
  return (
    <div className="space-y-5">
      <div
        className="
          grid
          gap-5
          md:grid-cols-2
        "
      >
        <Alan
          label="SEO URL"
          hata={formHatalari.seoUrl}
          aciklama="Boş bırakırsanız ürün adından otomatik oluşturulur."
        >
          <input
            type="text"
            value={form.seoUrl ?? ""}
            maxLength={250}
            onChange={(event) => onFieldChange("seoUrl", event.target.value)}
            placeholder="flap-disk-115-mm"
            className={inputClass(formHatalari.seoUrl)}
          />
        </Alan>

        <Alan
          label="SEO Başlığı"
          hata={formHatalari.seoBasligi}
          aciklama="Boş bırakırsanız ürün ve firma adından otomatik oluşturulur."
        >
          <input
            type="text"
            value={form.seoBasligi ?? ""}
            maxLength={250}
            onChange={(event) =>
              onFieldChange("seoBasligi", event.target.value)
            }
            placeholder="Flap Disk 115 mm | Özmen Zımpara Market"
            className={inputClass(formHatalari.seoBasligi)}
          />
        </Alan>
      </div>

      <Alan
        label="SEO Açıklaması"
        hata={formHatalari.seoAciklamasi}
        aciklama="Boş bırakılırsa kısa açıklama kullanılacaktır."
      >
        <textarea
          value={form.seoAciklamasi ?? ""}
          maxLength={500}
          rows={3}
          onChange={(event) =>
            onFieldChange("seoAciklamasi", event.target.value)
          }
          placeholder="Arama motorlarında gösterilecek kısa ürün açıklaması..."
          className={`
            ${inputClass(formHatalari.seoAciklamasi)}
            h-auto
            resize-y
            py-3
          `}
        />
      </Alan>
    </div>
  );
}

function Alan({ label, hata, aciklama, children }) {
  return (
    <div>
      <label
        className="
          mb-2
          block
          text-sm
          font-bold
          text-text-primary
        "
      >
        {label}
      </label>

      {children}

      {hata ? (
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
      ) : (
        aciklama && (
          <p
            className="
              mt-1.5
              text-xs
              leading-5
              text-text-muted
            "
          >
            {aciklama}
          </p>
        )
      )}
    </div>
  );
}

function inputClass(hata) {
  return `
    h-11
    w-full
    rounded-ui
    border
    bg-white
    px-3.5
    text-sm
    text-text-primary
    outline-none
    transition

    placeholder:text-text-muted

    ${
      hata
        ? `
          border-red-300
          focus:border-red-400
          focus:ring-4
          focus:ring-red-100
        `
        : `
          border-border
          hover:border-slate-300
          focus:border-brand-blue
          focus:ring-4
          focus:ring-brand-blue/10
        `
    }
  `;
}

export default UrunSeoAlani;
