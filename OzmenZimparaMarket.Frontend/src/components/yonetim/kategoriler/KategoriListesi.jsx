import { useMemo, useState } from "react";

import { dosyaUrlOlustur } from "../../../api/servisler/dosyaServisi";

import DataTable from "../../ui/DataTable";
import Select from "../../ui/Select";

function metniNormalizeEt(deger) {
  return String(deger ?? "")
    .trim()
    .toLocaleLowerCase("tr-TR");
}

function kategoriYoluOlustur(kategori, kategoriMap) {
  const yol = [kategori.kategoriAdi];

  const ziyaretEdilenler = new Set([kategori.id]);

  let ustKategoriId = kategori.ustKategoriId;

  while (ustKategoriId) {
    if (ziyaretEdilenler.has(ustKategoriId)) {
      break;
    }

    ziyaretEdilenler.add(ustKategoriId);

    const ustKategori = kategoriMap.get(ustKategoriId);

    if (!ustKategori) {
      break;
    }

    yol.unshift(ustKategori.kategoriAdi);

    ustKategoriId = ustKategori.ustKategoriId;
  }

  return yol.join(" / ");
}

function kategoriSeviyesiBul(kategori, kategoriMap) {
  let seviye = 0;

  let ustKategoriId = kategori.ustKategoriId;

  const ziyaretEdilenler = new Set([kategori.id]);

  while (ustKategoriId) {
    if (ziyaretEdilenler.has(ustKategoriId)) {
      break;
    }

    ziyaretEdilenler.add(ustKategoriId);

    const ustKategori = kategoriMap.get(ustKategoriId);

    if (!ustKategori) {
      break;
    }

    seviye += 1;

    ustKategoriId = ustKategori.ustKategoriId;
  }

  return seviye;
}

function kategorileriSirala(kategoriler) {
  const kategoriMap = new Map();

  kategoriler.forEach((kategori) => {
    kategoriMap.set(kategori.id, {
      ...kategori,
      altKategoriler: [],
    });
  });

  const kokKategoriler = [];

  kategoriler.forEach((kategori) => {
    const mevcutKategori = kategoriMap.get(kategori.id);

    if (kategori.ustKategoriId && kategoriMap.has(kategori.ustKategoriId)) {
      kategoriMap
        .get(kategori.ustKategoriId)
        .altKategoriler.push(mevcutKategori);

      return;
    }

    kokKategoriler.push(mevcutKategori);
  });

  function listeyiSirala(liste) {
    liste.sort((a, b) => {
      if (a.siraNo !== b.siraNo) {
        return a.siraNo - b.siraNo;
      }

      return a.kategoriAdi.localeCompare(b.kategoriAdi, "tr");
    });

    liste.forEach((kategori) => {
      listeyiSirala(kategori.altKategoriler);
    });
  }

  listeyiSirala(kokKategoriler);

  const sonuc = [];

  function duzlestir(liste, seviye = 0) {
    liste.forEach((kategori) => {
      sonuc.push({
        ...kategori,
        seviye,
      });

      duzlestir(kategori.altKategoriler, seviye + 1);
    });
  }

  duzlestir(kokKategoriler);

  return sonuc;
}

function KategoriListesi({
  kategoriler,

  onDuzenle,
  onDurumDegistir,
  onSil,

  islemdekiKategoriId,

  seciliKategoriIdleri = [],
  onSecimDegistir,
  onTopluSil,

  topluSilmeDevamEdiyor = false,
}) {
  const [aramaMetni, setAramaMetni] = useState("");

  const [durumFiltresi, setDurumFiltresi] = useState("tumu");

  const [turFiltresi, setTurFiltresi] = useState("tumu");

  const kategoriMap = useMemo(
    () => new Map(kategoriler.map((kategori) => [kategori.id, kategori])),
    [kategoriler],
  );

  const hazirlanmisKategoriler = useMemo(() => {
    const siraliKategoriler = kategorileriSirala(kategoriler);

    let anaKategoriZebraIndex = 0;
    let altKategoriZebraIndex = 0;

    return siraliKategoriler.map((kategori) => {
      const seviye = kategoriSeviyesiBul(kategori, kategoriMap);

      const zebraIndex =
        seviye === 0 ? anaKategoriZebraIndex++ : altKategoriZebraIndex++;

      return {
        ...kategori,

        kategoriYolu: kategoriYoluOlustur(kategori, kategoriMap),

        seviye,
        zebraIndex,
      };
    });
  }, [kategoriler, kategoriMap]);

  const filtrelenmisKategoriler = useMemo(() => {
    const arama = metniNormalizeEt(aramaMetni);

    return hazirlanmisKategoriler.filter((kategori) => {
      if (durumFiltresi === "aktif" && !kategori.aktifMi) {
        return false;
      }

      if (durumFiltresi === "pasif" && kategori.aktifMi) {
        return false;
      }

      if (turFiltresi === "ana" && kategori.ustKategoriId) {
        return false;
      }

      if (turFiltresi === "alt" && !kategori.ustKategoriId) {
        return false;
      }

      if (!arama) {
        return true;
      }

      const aranabilirMetin = [
        kategori.id,
        kategori.kategoriAdi,
        kategori.kategoriYolu,
        kategori.seoUrl,
        kategori.seoBasligi,
        kategori.seoAciklamasi,
        kategori.aciklama,
      ]
        .map(metniNormalizeEt)
        .join(" ");

      return aranabilirMetin.includes(arama);
    });
  }, [hazirlanmisKategoriler, aramaMetni, durumFiltresi, turFiltresi]);

  const columns = useMemo(
    () => [
      {
        key: "kategori",
        header: "Kategori",
        width: "38%",

        render: (kategori) => <KategoriBilgisi kategori={kategori} />,
      },

      {
        key: "tur",
        header: "Tür",
        width: "13%",

        render: (kategori) =>
          kategori.ustKategoriId ? (
            <Rozet tur="purple">Alt Kategori</Rozet>
          ) : (
            <Rozet tur="blue">Ana Kategori</Rozet>
          ),
      },

      {
        key: "seoUrl",
        header: "SEO",
        width: "18%",

        render: (kategori) => (
          <div className="min-w-0">
            <p
              className="
                truncate
                font-semibold
                text-text-primary
              "
              title={kategori.seoUrl}
            >
              /{kategori.seoUrl}
            </p>

            {kategori.anaSayfadaGosterilsinMi && (
              <p
                className="
                  mt-1
                  text-[11px]
                  font-bold
                  text-warning
                "
              >
                Ana sayfada
              </p>
            )}
          </div>
        ),
      },

      {
        key: "siraNo",
        header: "Sıra",
        width: "8%",

        cellClassName: "whitespace-nowrap",

        render: (kategori) => (
          <span
            className="
              font-bold
              text-text-primary
            "
          >
            {kategori.siraNo}
          </span>
        ),
      },

      {
        key: "durum",
        header: "Durum",
        width: "10%",

        render: (kategori) => {
          const islemde = islemdekiKategoriId === kategori.id;

          return (
            <button
              type="button"
              disabled={islemde || topluSilmeDevamEdiyor}
              onClick={() => onDurumDegistir(kategori)}
              className={`
                inline-flex
                h-9
                items-center
                gap-2
                rounded-ui
                border
                px-3
                text-xs
                font-bold
                transition-colors

                disabled:cursor-not-allowed
                disabled:opacity-50

                ${
                  kategori.aktifMi
                    ? `
                      border-success/20
                      bg-success/[0.06]
                      text-success
                      hover:bg-success/10
                    `
                    : `
                      border-border
                      bg-surface-soft
                      text-text-muted
                      hover:border-brand-blue/30
                      hover:text-brand-blue
                    `
                }
              `}
            >
              <span
                className={`
                  h-2 w-2
                  rounded-full

                  ${kategori.aktifMi ? "bg-success" : "bg-text-muted"}
                `}
              />

              {kategori.aktifMi ? "Aktif" : "Pasif"}
            </button>
          );
        },
      },

      {
        key: "islemler",
        header: "İşlemler",
        width: "13%",

        headerClassName: "text-right",

        cellClassName: "text-right whitespace-nowrap",

        render: (kategori) => {
          const islemde = islemdekiKategoriId === kategori.id;

          const devreDisi = islemde || topluSilmeDevamEdiyor;

          return (
            <div
              className="
                flex
                items-center
                justify-end
                gap-2
              "
            >
              <button
                type="button"
                disabled={devreDisi}
                onClick={() => onDuzenle(kategori.id)}
                className="
                  inline-flex
                  h-9
                  items-center
                  justify-center
                  rounded-ui
                  border
                  border-border
                  bg-white
                  px-3
                  text-xs
                  font-bold
                  text-text-primary
                  transition-colors

                  hover:border-brand-blue/30
                  hover:bg-brand-blue/[0.04]
                  hover:text-brand-blue

                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                Düzenle
              </button>

              <button
                type="button"
                disabled={devreDisi}
                onClick={() => onSil(kategori)}
                className="
                  inline-flex
                  h-9
                  items-center
                  justify-center
                  rounded-ui
                  border
                  border-danger/15
                  bg-danger/[0.04]
                  px-3
                  text-xs
                  font-bold
                  text-danger
                  transition-colors

                  hover:border-danger/30
                  hover:bg-danger/10

                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                Sil
              </button>
            </div>
          );
        },
      },
    ],
    [
      islemdekiKategoriId,
      topluSilmeDevamEdiyor,
      onDuzenle,
      onDurumDegistir,
      onSil,
    ],
  );

  function filtreleriTemizle() {
    setDurumFiltresi("tumu");

    setTurFiltresi("tumu");
  }

  function kategoriSatirSinifi(kategori) {
    const ciftZebra = kategori.zebraIndex % 2 === 0;

    if (kategori.seviye === 0) {
      return ciftZebra
        ? `
          bg-white
          hover:bg-slate-50
        `
        : `
          bg-slate-50/80
          hover:bg-slate-100/80
        `;
    }

    return ciftZebra
      ? `
        bg-brand-blue/[0.035]
        hover:bg-brand-blue/[0.075]
      `
      : `
        bg-brand-purple/[0.035]
        hover:bg-brand-purple/[0.07]
      `;
  }

  return (
    <DataTable
      data={filtrelenmisKategoriler}
      columns={columns}
      getRowId={(kategori) => kategori.id}
      rowClassName={kategoriSatirSinifi}
      selectable
      selectedRowIds={seciliKategoriIdleri}
      onSelectionChange={onSecimDegistir}
      isRowSelectable={() => !topluSilmeDevamEdiyor}
      bulkActions={({ selectedCount }) => (
        <button
          type="button"
          disabled={selectedCount === 0 || topluSilmeDevamEdiyor}
          onClick={onTopluSil}
          className="
            inline-flex
            h-9
            items-center
            justify-center
            gap-2
            rounded-ui
            border
            border-danger/20
            bg-danger/[0.06]
            px-4
            text-xs
            font-bold
            text-danger
            transition-all

            hover:border-danger/35
            hover:bg-danger/10

            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {topluSilmeDevamEdiyor ? (
            <>
              <span
                className="
                  h-3.5 w-3.5
                  animate-spin
                  rounded-full
                  border-2
                  border-danger/20
                  border-t-danger
                "
              />
              Siliniyor...
            </>
          ) : (
            <>
              <TrashIcon />
              {selectedCount} Kaydı Sil
            </>
          )}
        </button>
      )}
      searchValue={aramaMetni}
      onSearchChange={setAramaMetni}
      searchPlaceholder="Kategori, SEO veya ID ara..."
      pageResetKey={`${durumFiltresi}-${turFiltresi}`}
      hasActiveFilters={durumFiltresi !== "tumu" || turFiltresi !== "tumu"}
      onClearFilters={filtreleriTemizle}
      defaultPageSize={10}
      pageSizeOptions={[10, 20, 50]}
      emptyTitle="Henüz kategori bulunmuyor"
      emptyDescription="İlk kategorinizi oluşturmak için Yeni Kategori butonunu kullanabilirsiniz."
      noResultTitle="Kategori bulunamadı"
      noResultDescription="Arama veya filtre kriterlerinize uygun kategori bulunamadı."
      tableMinWidth="1110px"
      loading={topluSilmeDevamEdiyor}
      toolbarRight={
        <>
          <div
            className="
              w-full
              sm:w-[170px]
            "
          >
            <Select
              value={durumFiltresi}
              options={[
                {
                  value: "tumu",
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
              ]}
              onValueChange={setDurumFiltresi}
            />
          </div>

          <div
            className="
              w-full
              sm:w-[190px]
            "
          >
            <Select
              value={turFiltresi}
              options={[
                {
                  value: "tumu",
                  label: "Tüm Kategoriler",
                },
                {
                  value: "ana",
                  label: "Ana Kategoriler",
                },
                {
                  value: "alt",
                  label: "Alt Kategoriler",
                },
              ]}
              onValueChange={setTurFiltresi}
            />
          </div>
        </>
      }
    />
  );
}

function KategoriBilgisi({ kategori }) {
  const seviye = kategori.seviye ?? 0;

  const girinti = Math.min(seviye, 4) * 28;

  return (
    <div
      className="
        flex
        min-w-[260px]
        items-center
        gap-3.5
      "
      style={{
        paddingLeft: `${girinti}px`,
      }}
    >
      <KategoriGorseli kategori={kategori} />

      <div className="min-w-0">
        <div
          className="
            flex
            items-center
            gap-2
          "
        >
          {seviye > 0 && (
            <span
              className="
                flex
                h-5 w-5
                shrink-0
                items-center
                justify-center
                text-text-muted/50
              "
              aria-hidden="true"
            >
              <HierarchyIcon />
            </span>
          )}

          <p
            className="
              truncate
              text-sm
              font-extrabold
              text-text-primary
            "
          >
            {kategori.kategoriAdi}
          </p>
        </div>

        <p
          className="
            mt-1
            truncate
            text-xs
            text-text-muted
          "
          title={kategori.kategoriYolu}
        >
          {kategori.kategoriYolu}
        </p>

        <p
          className="
            mt-1
            text-[10px]
            font-semibold
            text-text-muted/80
          "
        >
          ID: {kategori.id}
        </p>
      </div>
    </div>
  );
}

function KategoriGorseli({ kategori }) {
  if (!kategori.gorselYolu) {
    return (
      <div
        className="
          flex
          h-12 w-12
          shrink-0
          items-center
          justify-center
          rounded-ui
          border
          border-border
          bg-surface-soft
          text-text-muted
        "
      >
        <ImageIcon />
      </div>
    );
  }

  return (
    <div
      className="
        h-12 w-12
        shrink-0
        overflow-hidden
        rounded-ui
        border
        border-border
        bg-surface-soft
      "
    >
      <img
        src={dosyaUrlOlustur(kategori.gorselYolu)}
        alt={kategori.kategoriAdi}
        className="
          h-full w-full
          object-cover
        "
      />
    </div>
  );
}

function Rozet({ tur, children }) {
  const stiller = {
    blue: "bg-brand-blue/10 text-brand-blue",

    purple: "bg-brand-purple/10 text-brand-purple",
  };

  return (
    <span
      className={`
        inline-flex
        whitespace-nowrap
        rounded-full
        px-2.5
        py-1
        text-[10px]
        font-bold

        ${stiller[tur]}
      `}
    >
      {children}
    </span>
  );
}

function TrashIcon() {
  return (
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
        d="M4 7h16M9 7V4h6v3m3 0-1 13H7L6 7"
      />

      <path strokeLinecap="round" d="M10 11v5M14 11v5" />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="16" rx="2" />

      <circle cx="9" cy="10" r="2" />

      <path
        d="
          m4 17
          5-5
          4 4
          2-2
          5 4
        "
      />
    </svg>
  );
}

function HierarchyIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 3v6a4 4 0 0 0 4 4h7"
      />

      <path strokeLinecap="round" strokeLinejoin="round" d="m12 10 3 3-3 3" />
    </svg>
  );
}

export default KategoriListesi;
