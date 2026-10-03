import { useMemo, useState } from "react";

import DataTable from "../../ui/DataTable";
import Select from "../../ui/Select";

const durumSecenekleri = [
  {
    value: "tum",
    label: "Tüm Durumlar",
  },
  {
    value: "aktif",
    label: "Aktif",
  },
  {
    value: "pasif",
    label: "Pasif",
  },
];

const kullanimSecenekleri = [
  {
    value: "tum",
    label: "Tüm Özellikler",
  },
  {
    value: "filtre",
    label: "Filtrede Gösterilenler",
  },
  {
    value: "sepet",
    label: "Sepette Seçilebilenler",
  },
  {
    value: "coklu",
    label: "Çoklu Değerler",
  },
];

function metniNormalizeEt(deger) {
  return String(deger ?? "")
    .trim()
    .toLocaleLowerCase("tr-TR");
}

function UrunOzelligiListesi({
  urunOzellikleri = [],
  yukleniyor = false,
  detayYukleniyor = false,
  durumDegistirilenId = null,
  onDuzenle,
  onDurumDegistir,
  onSil,
}) {
  const [aramaMetni, setAramaMetni] = useState("");
  const [durumFiltresi, setDurumFiltresi] = useState("tum");
  const [kullanimFiltresi, setKullanimFiltresi] = useState("tum");

  const filtrelenmisUrunOzellikleri = useMemo(() => {
    const normalizeArama = metniNormalizeEt(aramaMetni);

    return [...urunOzellikleri]
      .filter((urunOzelligi) => {
        if (
          normalizeArama &&
          !metniNormalizeEt(urunOzelligi.detayAdi).includes(normalizeArama)
        ) {
          return false;
        }

        if (durumFiltresi === "aktif" && !urunOzelligi.aktifMi) {
          return false;
        }

        if (durumFiltresi === "pasif" && urunOzelligi.aktifMi) {
          return false;
        }

        if (
          kullanimFiltresi === "filtre" &&
          !urunOzelligi.filtredeGosterilsinMi
        ) {
          return false;
        }

        if (
          kullanimFiltresi === "sepet" &&
          !urunOzelligi.sepetteSecilebilirMi
        ) {
          return false;
        }

        if (kullanimFiltresi === "coklu" && !urunOzelligi.cokluDegerMi) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const siraFarki = Number(a.siraNo ?? 0) - Number(b.siraNo ?? 0);

        if (siraFarki !== 0) {
          return siraFarki;
        }

        return String(a.detayAdi ?? "").localeCompare(
          String(b.detayAdi ?? ""),
          "tr",
        );
      });
  }, [urunOzellikleri, aramaMetni, durumFiltresi, kullanimFiltresi]);

  const kolonlar = useMemo(
    () => [
      {
        key: "detayAdi",
        header: "Özellik",
        render: (urunOzelligi) => (
          <div
            className="
              min-w-[220px]
              py-2
            "
          >
            <p
              className="
                text-sm
                font-extrabold
                text-text-primary
              "
            >
              {urunOzelligi.detayAdi}
            </p>

            <p
              className="
                mt-1
                text-[11px]
                font-medium
                text-text-muted
              "
            >
              ID: {urunOzelligi.id}
            </p>
          </div>
        ),
      },

      {
        key: "cokluDegerMi",
        header: "Değer Yapısı",
        render: (urunOzelligi) => (
          <DegerYapisiRozeti coklu={urunOzelligi.cokluDegerMi} />
        ),
      },

      {
        key: "filtredeGosterilsinMi",
        header: "Filtrede",
        render: (urunOzelligi) => (
          <EvetHayirDurumu aktif={urunOzelligi.filtredeGosterilsinMi} />
        ),
      },

      {
        key: "sepetteSecilebilirMi",
        header: "Teklif Sepeti",
        render: (urunOzelligi) => (
          <EvetHayirDurumu aktif={urunOzelligi.sepetteSecilebilirMi} />
        ),
      },

      {
        key: "siraNo",
        header: "Sıra",
        render: (urunOzelligi) => (
          <span
            className="
              inline-flex
              h-8
              min-w-8
              items-center
              justify-center

              rounded-lg

              border
              border-slate-200

              bg-slate-50

              px-2

              text-xs
              font-extrabold
              text-text-secondary
            "
          >
            {urunOzelligi.siraNo}
          </span>
        ),
      },

      {
        key: "aktifMi",
        header: "Durum",
        render: (urunOzelligi) => (
          <DurumButonu
            aktif={urunOzelligi.aktifMi}
            yukleniyor={durumDegistirilenId === urunOzelligi.id}
            onClick={() => onDurumDegistir(urunOzelligi)}
          />
        ),
      },

      {
        key: "islemler",
        header: "İşlemler",
        align: "right",
        render: (urunOzelligi) => (
          <div
            className="
              flex
              items-center
              justify-end
              gap-1
            "
          >
            <IslemButonu
              title="Düzenle"
              disabled={detayYukleniyor}
              onClick={() => onDuzenle(urunOzelligi.id)}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-[18px] w-[18px]"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.86 3.49 3.65 3.65M5 19l4.15-.83L19.68 7.64a2.58 2.58 0 0 0-3.65-3.65L5.5 14.52 5 19Z"
                />
              </svg>
            </IslemButonu>

            <IslemButonu title="Sil" danger onClick={() => onSil(urunOzelligi)}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-[18px] w-[18px]"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13M10 11v5m4-5v5"
                />
              </svg>
            </IslemButonu>
          </div>
        ),
      },
    ],
    [detayYukleniyor, durumDegistirilenId, onDuzenle, onDurumDegistir, onSil],
  );

  return (
    <div
      className="
        overflow-hidden

        rounded-2xl

        border
        border-border

        bg-white

        shadow-sm
      "
    >
      <div
        className="
          border-b
          border-border

          px-5
          py-5
        "
      >
        <div
          className="
            grid
            grid-cols-1
            gap-4

            lg:grid-cols-[minmax(360px,1fr)_220px_260px_100px]
            lg:items-end
          "
        >
          <div>
            <label
              htmlFor="urun-ozelligi-arama"
              className="
                mb-2
                block

                text-xs
                font-extrabold
                text-text-secondary
              "
            >
              Özellik Ara
            </label>

            <div className="relative">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="
                  pointer-events-none

                  absolute
                  left-4
                  top-1/2

                  h-[18px]
                  w-[18px]

                  -translate-y-1/2

                  text-text-muted
                "
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />

                <path strokeLinecap="round" d="m20 20-4-4" />
              </svg>

              <input
                id="urun-ozelligi-arama"
                type="text"
                inputMode="search"
                value={aramaMetni}
                onChange={(event) => setAramaMetni(event.target.value)}
                placeholder="Özellik adına göre ara..."
                className="
                  h-12
                  w-full

                  rounded-xl

                  border
                  border-border

                  bg-[#fafafa]

                  pl-11
                  pr-4

                  text-sm
                  text-text-primary

                  outline-none

                  transition-all

                  placeholder:text-text-muted

                  hover:border-slate-300
                  hover:bg-white

                  focus:border-brand-blue
                  focus:bg-white
                  focus:ring-4
                  focus:ring-brand-blue/10
                "
              />
            </div>
          </div>

          <Select
            label="Durum"
            value={durumFiltresi}
            onValueChange={setDurumFiltresi}
            options={durumSecenekleri}
          />

          <Select
            label="Kullanım"
            value={kullanimFiltresi}
            onValueChange={setKullanimFiltresi}
            options={kullanimSecenekleri}
          />

          <div
            className="
              flex
              h-12
              items-center
              justify-center

              rounded-xl

              border
              border-slate-200

              bg-slate-50

              px-3

              text-sm
              font-extrabold
              text-text-primary
            "
          >
            {filtrelenmisUrunOzellikleri.length}

            <span
              className="
                ml-1
                font-medium
                text-text-muted
              "
            >
              özellik
            </span>
          </div>
        </div>
      </div>

      <div
        className="
          [&>div]:rounded-none
          [&>div]:border-0
          [&>div]:shadow-none
        "
      >
        <DataTable
          columns={kolonlar}
          data={filtrelenmisUrunOzellikleri}
          loading={yukleniyor}
          getRowKey={(urunOzelligi) => urunOzelligi.id}
          emptyTitle="Ürün özelliği bulunamadı"
          emptyDescription={
            aramaMetni || durumFiltresi !== "tum" || kullanimFiltresi !== "tum"
              ? "Arama veya filtre kriterlerinize uygun ürün özelliği bulunamadı."
              : "Henüz herhangi bir ürün özelliği oluşturulmamış."
          }
          pageSize={10}
          pageSizeOptions={[10, 20, 50]}
          tableMinWidth="1080px"
        />
      </div>
    </div>
  );
}

function DegerYapisiRozeti({ coklu }) {
  return (
    <span
      className={`
        inline-flex
        items-center

        rounded-full

        border

        px-3
        py-1.5

        text-[11px]
        font-extrabold

        ${
          coklu
            ? `
              border-purple-200
              bg-purple-50
              text-purple-700
            `
            : `
              border-slate-200
              bg-slate-50
              text-slate-600
            `
        }
      `}
    >
      {coklu ? "Çoklu Değer" : "Tekli Değer"}
    </span>
  );
}

function EvetHayirDurumu({ aktif }) {
  return (
    <div
      className="
        inline-flex
        items-center
        gap-2
      "
    >
      <span
        className={`
          h-2
          w-2

          rounded-full

          ${aktif ? "bg-emerald-500" : "bg-slate-300"}
        `}
      />

      <span
        className={`
          text-xs
          font-bold

          ${aktif ? "text-emerald-700" : "text-slate-500"}
        `}
      >
        {aktif ? "Evet" : "Hayır"}
      </span>
    </div>
  );
}

function DurumButonu({ aktif, yukleniyor, onClick }) {
  return (
    <button
      type="button"
      disabled={yukleniyor}
      onClick={onClick}
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

        text-[11px]
        font-extrabold

        transition-all

        disabled:cursor-not-allowed
        disabled:opacity-60

        ${
          aktif
            ? `
              border-emerald-200
              bg-emerald-50
              text-emerald-700

              hover:bg-emerald-100
            `
            : `
              border-slate-200
              bg-slate-50
              text-slate-600

              hover:bg-slate-100
            `
        }
      `}
    >
      {yukleniyor ? (
        <span
          className="
            h-3
            w-3

            animate-spin

            rounded-full

            border-2
            border-current
            border-r-transparent
          "
        />
      ) : (
        <span
          className={`
            h-2
            w-2

            rounded-full

            ${aktif ? "bg-emerald-500" : "bg-slate-400"}
          `}
        />
      )}

      {aktif ? "Aktif" : "Pasif"}
    </button>
  );
}

function IslemButonu({
  title,
  children,
  onClick,
  disabled = false,
  danger = false,
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex
        h-9
        w-9
        items-center
        justify-center

        rounded-lg

        transition-colors

        focus:outline-none
        focus:ring-4

        disabled:cursor-not-allowed
        disabled:opacity-50

        ${
          danger
            ? `
              text-slate-400

              hover:bg-red-50
              hover:text-red-600

              focus:ring-red-100
            `
            : `
              text-slate-500

              hover:bg-blue-50
              hover:text-brand-blue

              focus:ring-blue-100
            `
        }
      `}
    >
      {children}
    </button>
  );
}

export default UrunOzelligiListesi;
