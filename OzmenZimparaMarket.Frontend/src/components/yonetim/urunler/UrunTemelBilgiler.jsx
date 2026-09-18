import Select from "../../ui/Select";

import { satisBirimiSecenekleri } from "./urunYardimcilari";

function UrunTemelBilgiler({
  form,
  formHatalari = {},
  kategoriSecenekleri = [],
  onFieldChange,
}) {
  const kategoriler = [
    {
      value: "seciniz",
      label: "Kategori seçin",
    },

    ...kategoriSecenekleriniOlustur(kategoriSecenekleri),
  ];

  const satisBirimleri = [
    {
      value: "seciniz",
      label: "Satış birimi seçin",
    },

    ...satisBirimiSecenekleri,
  ];

  return (
    <div className="space-y-5">
      <div
        className="
          grid
          gap-5
          md:grid-cols-2
        "
      >
        <FormAlani label="Ürün Adı" zorunlu hata={formHatalari.urunAdi}>
          <input
            type="text"
            value={form.urunAdi ?? ""}
            onChange={(event) => onFieldChange("urunAdi", event.target.value)}
            maxLength={200}
            placeholder="Örn. Flap Disk 115 mm"
            className={inputClass(formHatalari.urunAdi)}
          />
        </FormAlani>

        <FormAlani label="Ürün Kodu" zorunlu hata={formHatalari.urunKodu}>
          <input
            type="text"
            value={form.urunKodu ?? ""}
            onChange={(event) => onFieldChange("urunKodu", event.target.value)}
            maxLength={100}
            placeholder="Örn. FD-115"
            className={inputClass(formHatalari.urunKodu)}
          />
        </FormAlani>

        <FormAlani label="Kategori" zorunlu hata={formHatalari.kategoriId}>
          <Select
            value={form.kategoriId ? String(form.kategoriId) : "seciniz"}
            options={kategoriler}
            onValueChange={(value) =>
              onFieldChange("kategoriId", value === "seciniz" ? "" : value)
            }
          />

          <p
            className="
              mt-1.5
              text-[11px]
              leading-5
              text-text-muted
            "
          >
            Ana ve alt kategoriler hiyerarşik olarak gösterilir.
          </p>
        </FormAlani>

        <FormAlani label="Satış Birimi" zorunlu hata={formHatalari.satisBirimi}>
          <Select
            value={form.satisBirimi ? String(form.satisBirimi) : "seciniz"}
            options={satisBirimleri}
            onValueChange={(value) =>
              onFieldChange("satisBirimi", value === "seciniz" ? "" : value)
            }
          />
        </FormAlani>
      </div>

      <FormAlani label="Kısa Açıklama" hata={formHatalari.kisaAciklama}>
        <textarea
          value={form.kisaAciklama ?? ""}
          onChange={(event) =>
            onFieldChange("kisaAciklama", event.target.value)
          }
          rows={3}
          maxLength={1000}
          placeholder="Ürünü birkaç cümleyle açıklayın..."
          className={`
            ${inputClass(formHatalari.kisaAciklama)}

            h-auto
            resize-y
            py-3
          `}
        />
      </FormAlani>
    </div>
  );
}

function kategoriSecenekleriniOlustur(kategoriSecenekleri) {
  if (!Array.isArray(kategoriSecenekleri) || kategoriSecenekleri.length === 0) {
    return [];
  }

  const kategoriler = kategoriSecenekleri
    .map((kategori) => {
      const id = kategori.id ?? kategori.value;

      const kategoriAdi = kategori.kategoriAdi ?? kategori.label ?? "";

      return {
        ...kategori,

        id: id !== undefined && id !== null ? Number(id) : null,

        kategoriAdi: String(kategoriAdi).trim(),

        ustKategoriId:
          kategori.ustKategoriId !== undefined &&
          kategori.ustKategoriId !== null &&
          kategori.ustKategoriId !== ""
            ? Number(kategori.ustKategoriId)
            : null,

        siraNo: Number(kategori.siraNo ?? 0),

        aktifMi: kategori.aktifMi !== false,
      };
    })
    .filter(
      (kategori) =>
        Number.isInteger(kategori.id) &&
        kategori.id > 0 &&
        kategori.kategoriAdi,
    );

  const kategoriIdleri = new Set(kategoriler.map((kategori) => kategori.id));

  const altKategoriSozlugu = new Map();

  kategoriler.forEach((kategori) => {
    const ustKategoriId = kategori.ustKategoriId;

    const gecerliUstKategoriId =
      ustKategoriId &&
      kategoriIdleri.has(ustKategoriId) &&
      ustKategoriId !== kategori.id
        ? ustKategoriId
        : null;

    if (!altKategoriSozlugu.has(gecerliUstKategoriId)) {
      altKategoriSozlugu.set(gecerliUstKategoriId, []);
    }

    altKategoriSozlugu.get(gecerliUstKategoriId).push(kategori);
  });

  for (const liste of altKategoriSozlugu.values()) {
    liste.sort(kategoriSirala);
  }

  const sonuc = [];

  const ziyaretEdilenler = new Set();

  function kategoriEkle(kategori, seviye) {
    if (ziyaretEdilenler.has(kategori.id)) {
      return;
    }

    ziyaretEdilenler.add(kategori.id);

    sonuc.push({
      value: String(kategori.id),

      label: kategoriLabelOlustur(kategori, seviye),

      bold: seviye === 0,

      seviye,

      aktifMi: kategori.aktifMi,
    });

    const altKategoriler = altKategoriSozlugu.get(kategori.id) ?? [];

    altKategoriler.forEach((altKategori) =>
      kategoriEkle(altKategori, seviye + 1),
    );
  }

  const kokKategoriler = altKategoriSozlugu.get(null) ?? [];

  kokKategoriler.forEach((kategori) => kategoriEkle(kategori, 0));

  kategoriler
    .filter((kategori) => !ziyaretEdilenler.has(kategori.id))
    .sort(kategoriSirala)
    .forEach((kategori) => kategoriEkle(kategori, 0));

  return sonuc;
}

function kategoriLabelOlustur(kategori, seviye) {
  const girinti = seviye > 0 ? `${"\u00A0\u00A0\u00A0".repeat(seviye)}↳ ` : "";

  const pasifMetni = kategori.aktifMi === false ? "  •  Pasif" : "";

  return `${girinti}${kategori.kategoriAdi}${pasifMetni}`;
}

function kategoriSirala(a, b) {
  const siraFarki = (a.siraNo ?? 0) - (b.siraNo ?? 0);

  if (siraFarki !== 0) {
    return siraFarki;
  }

  return a.kategoriAdi.localeCompare(b.kategoriAdi, "tr", {
    sensitivity: "base",
  });
}

function FormAlani({ label, zorunlu = false, hata, children }) {
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

        {zorunlu && <span className="ml-1 text-red-500">*</span>}
      </label>

      {children}

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

export default UrunTemelBilgiler;
