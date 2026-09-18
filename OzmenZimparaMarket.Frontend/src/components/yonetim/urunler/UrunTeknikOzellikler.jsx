import { teknikDetayHatasiGetir } from "./urunYardimcilari";

function UrunTeknikOzellikler({
  teknikDetaylar = [],
  urunDetayTanimlari = [],
  formHatalari = {},

  onEkle,
  onDegistir,
  onSil,
}) {
  if (!Array.isArray(urunDetayTanimlari) || urunDetayTanimlari.length === 0) {
    return <BosDurum />;
  }

  const siraliTanimlar = [...urunDetayTanimlari].sort(
    (a, b) => (a.siraNo ?? 0) - (b.siraNo ?? 0),
  );

  const toplamDegerSayisi = Array.isArray(teknikDetaylar)
    ? teknikDetaylar.length
    : 0;

  return (
    <div className="space-y-4">
      <TeknikOzellikOzeti
        ozellikSayisi={siraliTanimlar.length}
        degerSayisi={toplamDegerSayisi}
      />

      <div
        className="
    grid
    items-start
    gap-4
    xl:grid-cols-2
  "
      >
        {siraliTanimlar.map((tanim) => {
          const satirlar = teknikDetaylar
            .map((detay, indeks) => ({
              ...detay,
              globalIndeks: indeks,
            }))
            .filter(
              (detay) => Number(detay.urunDetayTanimiId) === Number(tanim.id),
            );

          const yeniDegerEklenebilirMi =
            tanim.aktifMi !== false &&
            (tanim.cokluDegerMi || satirlar.length === 0);

          return (
            <OzellikKarti
              key={tanim.id}
              tanim={tanim}
              satirlar={satirlar}
              formHatalari={formHatalari}
              yeniDegerEklenebilirMi={yeniDegerEklenebilirMi}
              onEkle={onEkle}
              onDegistir={onDegistir}
              onSil={onSil}
            />
          );
        })}
      </div>
    </div>
  );
}

function OzellikKarti({
  tanim,
  satirlar,
  formHatalari,
  yeniDegerEklenebilirMi,

  onEkle,
  onDegistir,
  onSil,
}) {
  const pasifTanim = tanim.aktifMi === false;

  return (
    <div
      className={`
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        bg-white
        transition

        ${
          pasifTanim
            ? `
              border-slate-200
              opacity-75
            `
            : `
              border-border
              hover:border-brand-blue/20
              hover:shadow-[0_12px_34px_rgba(15,23,42,0.06)]
            `
        }
      `}
    >
      <div
        className={`
          absolute
          inset-x-0
          top-0
          h-[3px]

          ${
            pasifTanim
              ? "bg-slate-200"
              : `
                bg-gradient-to-r
                from-brand-blue
                via-brand-purple
                to-brand-blue
              `
          }
        `}
      />

      <div className="p-5">
        <div
          className="
            flex
            items-start
            justify-between
            gap-4
          "
        >
          <div
            className="
              flex
              min-w-0
              items-start
              gap-3
            "
          >
            <div
              className={`
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl

                ${
                  pasifTanim
                    ? `
                      bg-slate-100
                      text-slate-400
                    `
                    : `
                      bg-gradient-to-br
                      from-brand-blue/10
                      to-brand-purple/10
                      text-brand-blue
                    `
                }
              `}
            >
              <OzellikIcon />
            </div>

            <div className="min-w-0">
              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  gap-2
                "
              >
                <h4
                  className="
                    truncate
                    text-sm
                    font-extrabold
                    text-text-primary
                  "
                >
                  {tanim.detayAdi}
                </h4>

                {pasifTanim && (
                  <span
                    className="
                      rounded-full
                      bg-slate-100
                      px-2
                      py-0.5
                      text-[9px]
                      font-extrabold
                      uppercase
                      tracking-wide
                      text-slate-500
                    "
                  >
                    Pasif
                  </span>
                )}
              </div>

              <p
                className="
                  mt-1
                  text-[11px]
                  leading-5
                  text-text-muted
                "
              >
                {tanim.cokluDegerMi
                  ? "Bu özellik için birden fazla değer tanımlanabilir."
                  : "Bu özellik için tek bir değer tanımlanabilir."}
              </p>
            </div>
          </div>

          <div
            className="
    flex
    shrink-0
    items-center
    gap-2
  "
          >
            {satirlar.length > 0 && (
              <span
                className="
        rounded-full
        bg-slate-100
        px-2.5
        py-1
        text-[9px]
        font-extrabold
        uppercase
        tracking-wide
        text-slate-500
      "
              >
                {satirlar.length} Değer
              </span>
            )}

            <DegerTipiRozeti cokluMu={tanim.cokluDegerMi} />
          </div>
        </div>

        <div
          className="
            mt-4
            flex
            flex-wrap
            gap-2
          "
        >
          {tanim.filtredeGosterilsinMi && (
            <BilgiRozeti icon={<FilterIcon />}>Filtrede Gösterilir</BilgiRozeti>
          )}

          {tanim.sepetteSecilebilirMi && (
            <BilgiRozeti icon={<CartIcon />}>Sepette Seçilebilir</BilgiRozeti>
          )}

          {!tanim.filtredeGosterilsinMi && !tanim.sepetteSecilebilirMi && (
            <BilgiRozeti>Standart Özellik</BilgiRozeti>
          )}
        </div>

        <div
          className="
            my-5
            h-px
            bg-border
          "
        />

        <div
          className={`
    space-y-3

    ${
      satirlar.length > 3
        ? `
          max-h-[270px]
          overflow-y-auto
          pr-2
        `
        : ""
    }
  `}
        >
          {satirlar.length === 0 ? (
            <DegerYok />
          ) : (
            satirlar.map((detay, indeks) => (
              <TeknikDegerSatiri
                key={detay.urunDetayiId ?? `${tanim.id}-${detay.globalIndeks}`}
                detay={detay}
                indeks={indeks}
                toplamDeger={satirlar.length}
                pasifTanim={pasifTanim}
                hata={teknikDetayHatasiGetir(
                  formHatalari,
                  detay.globalIndeks,
                  "detayDegeri",
                )}
                onDegistir={onDegistir}
                onSil={onSil}
              />
            ))
          )}
        </div>

        <div className="mt-4">
          <button
            type="button"
            disabled={!yeniDegerEklenebilirMi}
            onClick={() => onEkle(tanim.id)}
            className="
              inline-flex
              h-10
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-dashed
              border-brand-blue/30
              bg-brand-blue/[0.03]
              px-4
              text-xs
              font-extrabold
              text-brand-blue
              transition

              hover:border-brand-blue/50
              hover:bg-brand-blue/[0.07]

              disabled:cursor-not-allowed
              disabled:border-slate-200
              disabled:bg-slate-50
              disabled:text-slate-400
            "
          >
            <PlusIcon />

            {tanim.cokluDegerMi
              ? "Yeni Değer Ekle"
              : satirlar.length > 0
                ? "Değer Tanımlandı"
                : "Değer Ekle"}
          </button>
        </div>
      </div>
    </div>
  );
}

function TeknikDegerSatiri({
  detay,
  indeks,
  toplamDeger,
  pasifTanim,
  hata,

  onDegistir,
  onSil,
}) {
  return (
    <div
      className={`
        relative
        rounded-xl
        border
        p-3
        transition

        ${
          detay.aktifMi
            ? `
              border-border
              bg-surface-soft/30
            `
            : `
              border-slate-200
              bg-slate-50
            `
        }
      `}
    >
      <div
        className="
          flex
          flex-col
          gap-3
          sm:flex-row
          sm:items-start
        "
      >
        <div className="min-w-0 flex-1">
          {toplamDeger > 1 && (
            <div
              className="
                mb-2
                flex
                items-center
                gap-2
              "
            >
              <span
                className="
                  flex
                  h-5
                  min-w-5
                  items-center
                  justify-center
                  rounded-md
                  bg-slate-100
                  px-1.5
                  text-[9px]
                  font-extrabold
                  text-slate-500
                "
              >
                {indeks + 1}
              </span>

              <span
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-wide
                  text-text-muted
                "
              >
                Değer
              </span>
            </div>
          )}

          <div className="relative">
            <input
              type="text"
              value={detay.detayDegeri ?? ""}
              disabled={pasifTanim}
              maxLength={500}
              placeholder="Özellik değerini yazın..."
              onChange={(event) =>
                onDegistir(
                  detay.globalIndeks,
                  "detayDegeri",
                  event.target.value,
                )
              }
              className={`
                h-11
                w-full
                rounded-xl
                border
                bg-white
                px-3.5
                pr-12
                text-sm
                font-semibold
                text-text-primary
                outline-none
                transition

                placeholder:font-normal
                placeholder:text-text-muted

                disabled:cursor-not-allowed
                disabled:bg-slate-100
                disabled:text-slate-500

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
              `}
            />

            <span
              className={`
                pointer-events-none
                absolute
                right-3
                top-1/2
                h-2
                w-2
                -translate-y-1/2
                rounded-full

                ${detay.aktifMi ? "bg-emerald-500" : "bg-slate-300"}
              `}
            />
          </div>

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

        <div
          className="
            flex
            shrink-0
            items-center
            gap-2
          "
        >
          <AktiflikButonu
            aktif={detay.aktifMi}
            disabled={pasifTanim}
            onChange={(aktifMi) =>
              onDegistir(detay.globalIndeks, "aktifMi", aktifMi)
            }
          />

          <button
            type="button"
            onClick={() => onSil(detay.globalIndeks)}
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-red-100
              bg-white
              text-red-400
              transition

              hover:border-red-200
              hover:bg-red-50
              hover:text-red-600
            "
            title="Değeri kaldır"
            aria-label="Değeri kaldır"
          >
            <TrashIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

function AktiflikButonu({ aktif, disabled, onChange }) {
  return (
    <label
      className={`
        inline-flex
        h-11
        select-none
        items-center
        gap-2.5
        rounded-xl
        border
        px-3
        transition

        ${
          disabled
            ? `
              cursor-not-allowed
              border-slate-200
              bg-slate-50
              opacity-60
            `
            : `
              cursor-pointer
              border-border
              bg-white

              hover:border-brand-blue/20
            `
        }
      `}
    >
      <input
        type="checkbox"
        checked={Boolean(aktif)}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="sr-only"
      />

      <span
        className={`
          relative
          inline-flex
          h-5
          w-9
          shrink-0
          rounded-full
          transition

          ${aktif ? "bg-emerald-500" : "bg-slate-300"}
        `}
      >
        <span
          className={`
            absolute
            top-0.5
            h-4
            w-4
            rounded-full
            bg-white
            shadow-sm
            transition-transform

            ${aktif ? "translate-x-[18px]" : "translate-x-0.5"}
          `}
        />
      </span>

      <span
        className={`
          text-[11px]
          font-extrabold

          ${aktif ? "text-emerald-700" : "text-slate-500"}
        `}
      >
        {aktif ? "Aktif" : "Pasif"}
      </span>
    </label>
  );
}

function TeknikOzellikOzeti({ ozellikSayisi, degerSayisi }) {
  return (
    <div
      className="
        flex
        flex-col
        gap-3
        rounded-2xl
        border
        border-brand-blue/10
        bg-gradient-to-r
        from-brand-blue/[0.035]
        via-white
        to-brand-purple/[0.035]
        px-5
        py-4

        sm:flex-row
        sm:items-center
        sm:justify-between
      "
    >
      <div
        className="
          flex
          items-center
          gap-3
        "
      >
        <div
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-gradient-to-br
            from-brand-blue
            to-brand-purple
            text-white
            shadow-sm
          "
        >
          <SlidersIcon />
        </div>

        <div>
          <p
            className="
              text-sm
              font-extrabold
              text-text-primary
            "
          >
            Teknik özellikleri yapılandırın
          </p>

          <p
            className="
              mt-0.5
              text-xs
              text-text-muted
            "
          >
            Kullanım alanları dahil ürünün teknik değerlerini tanımlayın.
          </p>
        </div>
      </div>

      <div
        className="
          flex
          items-center
          gap-2
        "
      >
        <OzetRozeti>{ozellikSayisi} Özellik</OzetRozeti>

        <OzetRozeti>{degerSayisi} Değer</OzetRozeti>
      </div>
    </div>
  );
}

function DegerTipiRozeti({ cokluMu }) {
  return (
    <span
      className={`
        shrink-0
        rounded-full
        border
        px-2.5
        py-1
        text-[9px]
        font-extrabold
        uppercase
        tracking-wide

        ${
          cokluMu
            ? `
              border-purple-100
              bg-purple-50
              text-purple-700
            `
            : `
              border-blue-100
              bg-blue-50
              text-blue-700
            `
        }
      `}
    >
      {cokluMu ? "Çoklu Değer" : "Tek Değer"}
    </span>
  );
}

function BilgiRozeti({ children, icon }) {
  return (
    <span
      className="
        inline-flex
        items-center
        gap-1.5
        rounded-lg
        border
        border-slate-100
        bg-slate-50
        px-2.5
        py-1
        text-[9px]
        font-extrabold
        uppercase
        tracking-wide
        text-slate-600
      "
    >
      {icon}

      {children}
    </span>
  );
}

function OzetRozeti({ children }) {
  return (
    <span
      className="
        whitespace-nowrap
        rounded-lg
        border
        border-border
        bg-white
        px-3
        py-1.5
        text-[10px]
        font-extrabold
        text-text-secondary
        shadow-sm
      "
    >
      {children}
    </span>
  );
}

function DegerYok() {
  return (
    <div
      className="
        flex
        min-h-[76px]
        items-center
        gap-3
        rounded-xl
        border
        border-dashed
        border-slate-200
        bg-slate-50/60
        px-4
        py-3
      "
    >
      <div
        className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-lg
          bg-white
          text-slate-400
          shadow-sm
        "
      >
        <EmptyIcon />
      </div>

      <div>
        <p
          className="
            text-xs
            font-bold
            text-text-secondary
          "
        >
          Henüz değer eklenmedi
        </p>

        <p
          className="
            mt-0.5
            text-[11px]
            text-text-muted
          "
        >
          Bu özellik için bir değer tanımlayın.
        </p>
      </div>
    </div>
  );
}

function BosDurum() {
  return (
    <div
      className="
        rounded-2xl
        border
        border-dashed
        border-border
        bg-surface-soft/50
        px-6
        py-10
        text-center
      "
    >
      <div
        className="
          mx-auto
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-2xl
          bg-white
          text-text-muted
          shadow-sm
        "
      >
        <SlidersIcon />
      </div>

      <p
        className="
          mt-4
          text-sm
          font-extrabold
          text-text-secondary
        "
      >
        Ürün özelliği bulunamadı.
      </p>

      <p
        className="
          mx-auto
          mt-1
          max-w-md
          text-xs
          leading-5
          text-text-muted
        "
      >
        Önce Ürün Özellikleri Yönetimi ekranından kullanım alanları ve diğer
        teknik özellikleri oluşturun.
      </p>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
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

function OzellikIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M8 7h8M8 12h5M8 17h8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M4.5 7h.01M4.5 12h.01M4.5 17h.01"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3" aria-hidden="true">
      <path
        d="M4 6h16M7 12h10M10 18h4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3" aria-hidden="true">
      <path
        d="M4 5h2l2 10h9l2-7H7M10 19.5h.01M17 19.5h.01"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SlidersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M4 7h10M18 7h2M4 17h2M10 17h10M14 4v6M6 14v6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EmptyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default UrunTeknikOzellikler;
