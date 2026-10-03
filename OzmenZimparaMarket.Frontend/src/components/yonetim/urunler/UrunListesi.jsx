import { useCallback, useMemo, useState } from "react";

import DataTable from "../../ui/DataTable";

import GorselOnizlemeModal from "../../ui/GorselOnizlemeModal";

import Select from "../../ui/Select";

import { satisBirimiSecenekleri, satisBirimiAdiGetir } from "./urunYardimcilari";

import { urunDurumSecenekleri, urunOneCikanSecenekleri, urunSiralamaSecenekleri } from "./useUrunYonetimi";

export default function UrunListesi({
  urunler = [],

  filtreler,

  sayfalama,

  kategoriSecenekleri = [],

  yukleniyorMu = false,

  durumDegistirilenUrunId = null,
  oneCikanDegistirilenUrunId = null,

  seciliUrunIdleri = [],

  topluSilmeDevamEdiyor = false,

  filtreDegistir,

  filtreleriTemizle,

  sayfaDegistir,

  sayfaBoyutuDegistir,

  urunDurumunuDegistir,
  urunOneCikanDurumunuDegistir,

  urunSecimleriDegisti,

  topluSilmeModaliniAc,

  onUrunDetay,

  onUrunDuzenle,

  silmeModaliniAc,
}) {
  const [gorselOnizleme, setGorselOnizleme] = useState(null);

  const gorselOnizlemeyiAc = useCallback((urun) => {
    const gorselUrl = urunGorselUrlOlustur(urun?.gorselYolu);

    if (!gorselUrl) {
      return;
    }

    setGorselOnizleme({
      src: gorselUrl,
      alt: urun?.urunAdi || "Ürün görseli",
      baslik: urun?.urunAdi || "",
    });
  }, []);

  const gorselOnizlemeyiKapat = useCallback(() => {
    setGorselOnizleme(null);
  }, []);

  const kategoriFiltreSecenekleri = useMemo(
    () => [
      {
        value: "tum",

        label: "Tüm Kategoriler",
      },

      ...kategoriFiltreSecenekleriniOlustur(kategoriSecenekleri),
    ],

    [kategoriSecenekleri],
  );

  const satisBirimiFiltreSecenekleri = useMemo(
    () => [
      {
        value: "tum",

        label: "Tüm Birimler",
      },

      ...satisBirimiSecenekleri,
    ],

    [],
  );

  const aktifFiltreVarMi =
    filtreler.kategoriId !== "tum" ||
    filtreler.aktifMi !== "tum" ||
    filtreler.oneCikanMi !== "tum" ||
    filtreler.satisBirimi !== "tum" ||
    filtreler.siralama !== "1";

  const columns = useMemo(
    () => [
      {
        key: "urun",

        header: "Ürün",

        width: "310px",

        render: (urun) => <UrunBilgisi urun={urun} onGorselAc={() => gorselOnizlemeyiAc(urun)} />,
      },

      {
        key: "kategori",

        header: "Kategori",

        width: "180px",

        render: (urun) => (
          <div>
            <span className="line-clamp-2 text-sm font-bold text-text-primary">{urun.kategoriAdi || "-"}</span>
          </div>
        ),
      },

      {
        key: "satisBirimi",

        header: "Satış Birimi",

        width: "130px",

        render: (urun) => (
          <span
            className="

              inline-flex

              rounded-lg

              border

              border-border

              bg-surface-soft

              px-2.5

              py-1.5

              text-xs

              font-bold

              text-text-secondary

            "
          >
            {urun.satisBirimiAdi || satisBirimiAdiGetir(urun.satisBirimi)}
          </span>
        ),
      },

      {
        key: "teknikDetay",

        header: "Özellik",

        width: "110px",

        render: (urun) => <TeknikDetaySayisi sayi={urun.teknikDetaySayisi ?? 0} />,
      },

      {
        key: "siraNo",

        header: "Sıra",

        width: "80px",

        render: (urun) => <span className="font-bold text-text-secondary">{urun.siraNo ?? 0}</span>,
      },

      {
        key: "oneCikanMi",
        header: "Öne Çıkan",
        width: "130px",
        render: (urun) => (
          <OneCikanButonu
            urun={urun}
            loading={oneCikanDegistirilenUrunId === urun.id}
            onClick={() => urunOneCikanDurumunuDegistir(urun)}
          />
        ),
      },

      {
        key: "aktifMi",

        header: "Durum",

        width: "130px",

        render: (urun) => (
          <DurumButonu
            urun={urun}
            loading={durumDegistirilenUrunId === urun.id}
            onClick={() => urunDurumunuDegistir(urun)}
          />
        ),
      },

      {
        key: "islemler",

        header: "İşlemler",

        width: "160px",

        headerClassName: "text-right",

        cellClassName: "text-right",

        render: (urun) => (
          <IslemButonlari
            onDetail={() => onUrunDetay?.(urun)}
            onEdit={() => onUrunDuzenle?.(urun)}
            onDelete={() => silmeModaliniAc(urun)}
          />
        ),
      },
    ],

    [durumDegistirilenUrunId, gorselOnizlemeyiAc, onUrunDetay, onUrunDuzenle, silmeModaliniAc, urunDurumunuDegistir],
  );

  const toolbarRight = (
    <>
      <div className="w-full sm:w-[210px]">
        <Select
          value={filtreler.kategoriId}
          options={kategoriFiltreSecenekleri}
          onValueChange={(value) => filtreDegistir("kategoriId", value)}
        />
      </div>

      <div className="w-full sm:w-[150px]">
        <Select
          value={filtreler.aktifMi}
          options={urunDurumSecenekleri}
          onValueChange={(value) => filtreDegistir("aktifMi", value)}
        />
      </div>

      <div className="w-full sm:w-[175px]">
        <Select
          value={filtreler.oneCikanMi}
          options={urunOneCikanSecenekleri}
          onValueChange={(value) => filtreDegistir("oneCikanMi", value)}
        />
      </div>

      <div className="w-full sm:w-[150px]">
        <Select
          value={filtreler.satisBirimi}
          options={satisBirimiFiltreSecenekleri}
          onValueChange={(value) => filtreDegistir("satisBirimi", value)}
        />
      </div>

      <div className="w-full sm:w-[190px]">
        <Select
          value={filtreler.siralama}
          options={urunSiralamaSecenekleri}
          onValueChange={(value) => filtreDegistir("siralama", value)}
        />
      </div>

      {aktifFiltreVarMi && (
        <button
          type="button"
          onClick={filtreleriTemizle}
          className="

            inline-flex

            h-11

            items-center

            justify-center

            gap-2

            rounded-ui

            border

            border-border

            bg-white

            px-3.5

            text-xs

            font-extrabold

            text-text-secondary

            transition

            hover:border-red-200

            hover:bg-red-50

            hover:text-red-600

          "
        >
          <FilterCloseIcon />
          Temizle
        </button>
      )}
    </>
  );

  return (
    <>
      <DataTable
        data={urunler}
        columns={columns}
        selectable
        selectedRowIds={seciliUrunIdleri}
        onSelectionChange={urunSecimleriDegisti}
        isRowSelectable={() => !topluSilmeDevamEdiyor}
        bulkActions={({ selectedCount }) => (
          <button
            type="button"
            disabled={topluSilmeDevamEdiyor || selectedCount === 0}
            onClick={topluSilmeModaliniAc}
            className="
              inline-flex
              h-9
              items-center
              justify-center
              gap-2
              rounded-ui
              border
              border-red-200
              bg-red-50
              px-3.5
              text-xs
              font-extrabold
              text-red-600
              transition-all

              hover:border-red-300
              hover:bg-red-100

              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {topluSilmeDevamEdiyor ? <LoadingIcon /> : <TrashIcon />}
            {selectedCount} Kaydı Sil
          </button>
        )}
        searchValue={filtreler.aramaMetni}
        onSearchChange={(value) => filtreDegistir("aramaMetni", value)}
        searchPlaceholder="Ürün adı, ürün kodu veya özellik ara..."
        toolbarRight={toolbarRight}
        paginationMode="server"
        currentPage={sayfalama.sayfaNo}
        pageSize={sayfalama.sayfaBoyutu}
        totalItems={sayfalama.toplamKayitSayisi}
        totalPages={sayfalama.toplamSayfaSayisi}
        onPageChange={sayfaDegistir}
        onPageSizeChange={sayfaBoyutuDegistir}
        pageSizeOptions={[10, 20, 50]}
        hasActiveFilters={aktifFiltreVarMi}
        onClearFilters={filtreleriTemizle}
        loading={yukleniyorMu}
        tableMinWidth="1300px"
        rowClassName={(urun) => (urun.aktifMi ? "" : "bg-slate-50/50")}
        emptyTitle="Henüz ürün bulunmuyor"
        emptyDescription="Ürün kataloğunuzda henüz herhangi bir ürün bulunmuyor."
        noResultTitle="Ürün bulunamadı"
        noResultDescription="Arama veya filtre kriterlerinize uygun bir ürün bulunamadı."
      />

      <GorselOnizlemeModal
        open={Boolean(gorselOnizleme)}
        src={gorselOnizleme?.src}
        alt={gorselOnizleme?.alt}
        baslik={gorselOnizleme?.baslik}
        onClose={gorselOnizlemeyiKapat}
      />
    </>
  );
}

function UrunBilgisi({ urun, onGorselAc }) {
  const gorselUrl = urunGorselUrlOlustur(urun.gorselYolu);

  const urunKodu = typeof urun.urunKodu === "string" ? urun.urunKodu.trim() : "";

  return (
    <div
      className="
        flex
        min-w-0
        items-center
        gap-3
      "
    >
      {gorselUrl ? (
        <button
          type="button"
          onClick={onGorselAc}
          title="Görseli büyüt"
          aria-label={`${urun.urunAdi} görselini büyüt`}
          className="
            group/gorsel
            relative
            flex
            h-12
            w-12
            shrink-0
            cursor-zoom-in
            items-center
            justify-center
            overflow-hidden
            rounded-xl
            border
            border-border
            bg-white
            transition-all

            hover:border-brand-blue/30
            hover:shadow-[0_5px_15px_rgba(37,99,235,0.12)]
          "
        >
          <img
            src={gorselUrl}
            alt={urun.urunAdi}
            loading="lazy"
            className="
              h-full
              w-full
              object-contain
              object-center
              p-0.5
              transition-transform
              duration-300

              group-hover/gorsel:scale-[1.08]
            "
          />
        </button>
      ) : (
        <div
          className="
            relative
            flex
            h-12
            w-12
            shrink-0
            items-center
            justify-center
            overflow-hidden
            rounded-xl
            border
            border-border
            bg-surface-soft
          "
        >
          <ProductIcon />
        </div>
      )}

      <div className="min-w-0">
        <p
          className="
            truncate
            text-sm
            font-extrabold
            text-text-primary
          "
          title={urun.urunAdi}
        >
          {urun.urunAdi}
        </p>

        {(urunKodu || urun.oneCikanMi) && (
          <div
            className="
              mt-1
              flex
              min-w-0
              items-center
              gap-2
            "
          >
            {urunKodu && (
              <span
                className="
                  truncate
                  text-xs
                  font-semibold
                  text-text-muted
                "
              >
                {urunKodu}
              </span>
            )}

            {urunKodu && urun.oneCikanMi && (
              <span
                className="
                  h-1
                  w-1
                  shrink-0
                  rounded-full
                  bg-slate-300
                "
              />
            )}

            {urun.oneCikanMi && (
              <span
                className="
                  whitespace-nowrap
                  text-[11px]
                  font-bold
                  text-amber-600
                "
              >
                Öne çıkan
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function TeknikDetaySayisi({ sayi }) {
  return (
    <div
      className="

        inline-flex

        items-center

        gap-2

      "
    >
      <div
        className="

          flex

          h-8

          w-8

          items-center

          justify-center

          rounded-lg

          bg-indigo-50

          text-indigo-600

        "
      >
        <SlidersIcon />
      </div>

      <div>
        <p
          className="

            text-sm

            font-extrabold

            leading-none

            text-text-primary

          "
        >
          {sayi}
        </p>

        <p
          className="

            mt-1

            whitespace-nowrap

            text-[10px]

            font-semibold

            text-text-muted

          "
        >
          değer
        </p>
      </div>
    </div>
  );
}

function DurumButonu({ urun, loading, onClick }) {
  const aktifMi = Boolean(urun.aktifMi);

  return (
    <button
      type="button"
      disabled={loading}
      onClick={onClick}
      title={aktifMi ? "Pasif hale getir" : "Aktif hale getir"}
      className={`

        inline-flex

        min-w-[86px]

        items-center

        justify-center

        gap-2

        rounded-full

        border

        px-3

        py-1.5

        text-xs

        font-extrabold

        transition

        disabled:cursor-wait

        disabled:opacity-60

        ${
          aktifMi
            ? `

              border-emerald-200

              bg-emerald-50

              text-emerald-700

              hover:bg-emerald-100

            `
            : `

              border-slate-200

              bg-slate-100

              text-slate-600

              hover:bg-slate-200

            `
        }

      `}
    >
      {loading ? (
        <LoadingIcon />
      ) : (
        <span
          className={`

            h-2

            w-2

            rounded-full

            ${aktifMi ? "bg-emerald-500" : "bg-slate-400"}

          `}
        />
      )}

      {aktifMi ? "Aktif" : "Pasif"}
    </button>
  );
}

function IslemButonlari({ onDetail, onEdit, onDelete }) {
  return (
    <div
      className="

        flex

        items-center

        justify-end

        gap-1.5

      "
    >
      <button
        type="button"
        onClick={onDetail}
        title="Ürün detayını görüntüle"
        aria-label="Ürün detayını görüntüle"
        className="

          flex

          h-9

          w-9

          items-center

          justify-center

          rounded-lg

          border

          border-border

          bg-white

          text-text-muted

          transition

          hover:border-indigo-200

          hover:bg-indigo-50

          hover:text-indigo-600

        "
      >
        <EyeIcon />
      </button>

      <button
        type="button"
        onClick={onEdit}
        title="Ürünü düzenle"
        aria-label="Ürünü düzenle"
        className="

          flex

          h-9

          w-9

          items-center

          justify-center

          rounded-lg

          border

          border-border

          bg-white

          text-text-muted

          transition

          hover:border-brand-blue/30

          hover:bg-brand-blue/[0.05]

          hover:text-brand-blue

        "
      >
        <EditIcon />
      </button>

      <button
        type="button"
        onClick={onDelete}
        title="Ürünü sil"
        aria-label="Ürünü sil"
        className="

          flex

          h-9

          w-9

          items-center

          justify-center

          rounded-lg

          border

          border-border

          bg-white

          text-text-muted

          transition

          hover:border-red-200

          hover:bg-red-50

          hover:text-red-600

        "
      >
        <TrashIcon />
      </button>
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

  const ayrac = temizYol.startsWith("/") ? "" : "/";

  return `${sunucuBaseUrl}${ayrac}${temizYol}`;
}

function ProductIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="

        h-5

        w-5

        text-text-muted

      "
      aria-hidden="true"
    >
      <path d="M5 7.5 12 4l7 3.5v9L12 20l-7-3.5v-9Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />

      <path d="m5 7.5 7 3.5 7-3.5M12 11v9" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

function SlidersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M4 7h10M18 7h2M4 17h2M10 17h10M14 4v6M10 14v6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
      <path d="m12 2.75 2.77 5.62 6.2.9-4.49 4.37 1.06 6.18L12 16.9l-5.54 2.92 1.06-6.18-4.49-4.37 6.2-.9L12 2.75Z" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M2.8 12s3.3-6 9.2-6 9.2 6 9.2 6-3.3 6-9.2 6-9.2-6-9.2-6Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M13.5 6.5 17.5 10.5M5 19l1-4 9.5-9.5a1.5 1.5 0 0 1 2.12 0l.88.88a1.5 1.5 0 0 1 0 2.12L9 18l-4 1Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M9 3h6m-9 4h12m-1 0-.65 12.03A2 2 0 0 1 14.35 21h-4.7a2 2 0 0 1-2-1.97L7 7m3 4v6m4-6v6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LoadingIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="

        h-3.5

        w-3.5

        animate-spin

      "
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" className="opacity-25" />

      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function FilterCloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path d="M4 5h16M7 12h10M10 19h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />

      <path d="m17 16 4 4m0-4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function kategoriFiltreSecenekleriniOlustur(kategoriSecenekleri) {
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
          kategori.ustKategoriId !== undefined && kategori.ustKategoriId !== null && kategori.ustKategoriId !== ""
            ? Number(kategori.ustKategoriId)
            : null,

        siraNo: Number(kategori.siraNo ?? 0),

        aktifMi: kategori.aktifMi !== false,
      };
    })

    .filter((kategori) => Number.isInteger(kategori.id) && kategori.id > 0 && kategori.kategoriAdi);

  const kategoriIdleri = new Set(kategoriler.map((kategori) => kategori.id));

  const altKategoriSozlugu = new Map();

  kategoriler.forEach((kategori) => {
    const ustKategoriId = kategori.ustKategoriId;

    const gecerliUstKategoriId =
      ustKategoriId && kategoriIdleri.has(ustKategoriId) && ustKategoriId !== kategori.id ? ustKategoriId : null;

    if (!altKategoriSozlugu.has(gecerliUstKategoriId)) {
      altKategoriSozlugu.set(gecerliUstKategoriId, []);
    }

    altKategoriSozlugu.get(gecerliUstKategoriId).push(kategori);
  });

  for (const liste of altKategoriSozlugu.values()) {
    liste.sort(kategoriFiltreSirala);
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

      label: kategoriFiltreLabelOlustur(kategori, seviye),

      bold: seviye === 0,

      seviye,

      aktifMi: kategori.aktifMi,
    });

    const altKategoriler = altKategoriSozlugu.get(kategori.id) ?? [];

    altKategoriler.forEach((altKategori) => kategoriEkle(altKategori, seviye + 1));
  }

  const kokKategoriler = altKategoriSozlugu.get(null) ?? [];

  kokKategoriler.forEach((kategori) => kategoriEkle(kategori, 0));

  /*

   * Parent ilişkisi bozuk olan kategorilerin

   * filtreden tamamen kaybolmasını engeller.

   */

  kategoriler

    .filter((kategori) => !ziyaretEdilenler.has(kategori.id))

    .sort(kategoriFiltreSirala)

    .forEach((kategori) => kategoriEkle(kategori, 0));

  return sonuc;
}

function kategoriFiltreLabelOlustur(kategori, seviye) {
  const girinti = seviye > 0 ? `${"\u00A0\u00A0\u00A0".repeat(seviye)}↳ ` : "";

  const pasifMetni = kategori.aktifMi === false ? "  •  Pasif" : "";

  return `${girinti}${kategori.kategoriAdi}${pasifMetni}`;
}

function kategoriFiltreSirala(a, b) {
  const siraFarki = (a.siraNo ?? 0) - (b.siraNo ?? 0);

  if (siraFarki !== 0) {
    return siraFarki;
  }

  return a.kategoriAdi.localeCompare(b.kategoriAdi, "tr", {
    sensitivity: "base",
  });
}

function OneCikanButonu({ urun, loading, onClick }) {
  const oneCikanMi = Boolean(urun.oneCikanMi);

  return (
    <button
      type="button"
      disabled={loading}
      onClick={onClick}
      title={oneCikanMi ? "Öne çıkanlardan kaldır" : "Öne çıkanlara ekle"}
      className={`
        inline-flex
        min-w-[92px]
        items-center
        justify-center
        gap-2
        rounded-full
        border
        px-3
        py-1.5
        text-xs
        font-extrabold
        transition

        disabled:cursor-wait
        disabled:opacity-60

        ${
          oneCikanMi
            ? `
                border-amber-200
                bg-amber-50
                text-amber-700

                hover:bg-amber-100
              `
            : `
                border-slate-200
                bg-slate-100
                text-slate-600

                hover:bg-slate-200
              `
        }
      `}
    >
      {loading ? <LoadingIcon /> : <StarIcon />}

      {oneCikanMi ? "Evet" : "Hayır"}
    </button>
  );
}
