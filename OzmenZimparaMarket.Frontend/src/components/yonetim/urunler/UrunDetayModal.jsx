import Modal from "../../ui/Modal";

function UrunDetayModal({ open, urun, loading = false, onClose, onEdit }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      eyebrow="Ürün Yönetimi"
      title="Ürün Detayı"
      maxWidth="980px"
      closeDisabled={loading}
      footer={
        !loading && urun ? (
          <div className="flex w-full items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="
                inline-flex
                h-10
                items-center
                justify-center
                rounded-ui
                border border-border
                bg-white
                px-4
                text-sm
                font-bold
                text-text-secondary
                transition

                hover:border-slate-300
                hover:bg-surface-soft
              "
            >
              Kapat
            </button>

            {onEdit && (
              <button
                type="button"
                onClick={onEdit}
                className="
                  inline-flex
                  h-10
                  items-center
                  justify-center
                  gap-2
                  rounded-ui
                  bg-gradient-to-r
                  from-brand-blue
                  to-brand-purple
                  px-4
                  text-sm
                  font-bold
                  text-white
                  shadow-[0_8px_20px_rgba(37,99,235,0.16)]
                  transition-all

                  hover:-translate-y-0.5
                  hover:shadow-[0_12px_24px_rgba(37,99,235,0.22)]
                "
              >
                <EditIcon />
                Düzenle
              </button>
            )}
          </div>
        ) : null
      }
    >
      {loading ? (
        <Yukleniyor />
      ) : !urun ? (
        <BosDurum />
      ) : (
        <div className="space-y-6">
          <UrunOzet urun={urun} />

          <Bolum
            baslik="Temel Bilgiler"
            aciklama="Ürünün katalog ve satış bilgileri."
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Bilgi etiket="Kategori" deger={urun.kategoriAdi} />

              <Bilgi etiket="Ürün Kodu" deger={urun.urunKodu} />

              <Bilgi
                etiket="Satış Birimi"
                deger={
                  urun.satisBirimiAdi || satisBirimiAdiGetir(urun.satisBirimi)
                }
              />

              <Bilgi etiket="Sıra No" deger={urun.siraNo ?? 0} />
            </div>

            {urun.kisaAciklama && (
              <div className="mt-5">
                <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.08em] text-text-muted">
                  Kısa Açıklama
                </p>

                <p className="text-sm leading-7 text-text-secondary">
                  {urun.kisaAciklama}
                </p>
              </div>
            )}
          </Bolum>

          <Bolum
            baslik="Teknik Özellikler"
            aciklama="Ürüne tanımlanmış teknik özellik ve değerler."
          >
            <TeknikOzellikler teknikDetaylar={urun.teknikDetaylar} />
          </Bolum>

          {urun.detayliAciklama && (
            <Bolum
              baslik="Detaylı Açıklama"
              aciklama="Ürün hakkında katalogda kullanılacak detaylı içerik."
            >
              <div
                className="
                  rounded-xl
                  border border-border
                  bg-surface-soft/50
                  px-5 py-4

                  text-sm
                  leading-7
                  text-text-secondary

                  [&_h1]:font-extrabold
                  [&_h1]:text-text-primary
                  [&_h2]:font-extrabold
                  [&_h2]:text-text-primary
                  [&_h3]:font-bold
                  [&_h3]:text-text-primary
                  [&_p+p]:mt-3
                  [&_ul]:list-disc
                  [&_ul]:pl-5
                  [&_ol]:list-decimal
                  [&_ol]:pl-5
                "
                dangerouslySetInnerHTML={{
                  __html: urun.detayliAciklama,
                }}
              />
            </Bolum>
          )}

          <Bolum
            baslik="SEO Bilgileri"
            aciklama="Arama motorlarında kullanılacak ürün bilgileri."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Bilgi etiket="SEO URL" deger={urun.seoUrl} />

              <Bilgi etiket="SEO Başlığı" deger={urun.seoBasligi} />

              <div className="sm:col-span-2">
                <Bilgi etiket="SEO Açıklaması" deger={urun.seoAciklamasi} />
              </div>
            </div>
          </Bolum>

          <Bolum
            baslik="Yayın Ayarları"
            aciklama="Ürünün panel ve katalogdaki yayın durumu."
          >
            <div className="flex flex-wrap gap-3">
              <DurumRozeti aktifMi={urun.aktifMi} />

              <OneCikanRozeti oneCikanMi={urun.oneCikanMi} />
            </div>
          </Bolum>
        </div>
      )}
    </Modal>
  );
}

function UrunOzet({ urun }) {
  const gorselUrl = urunGorselUrlOlustur(urun.gorselYolu);

  return (
    <div
      className="
        flex flex-col
        gap-5
        rounded-2xl
        border border-border
        bg-gradient-to-br
        from-white
        to-surface-soft/60
        p-5

        sm:flex-row
        sm:items-center
      "
    >
      <div
        className="
          flex h-28 w-28
          shrink-0
          items-center
          justify-center
          overflow-hidden
          rounded-2xl
          border border-border
          bg-white
        "
      >
        {gorselUrl ? (
          <img
            src={gorselUrl}
            alt={urun.urunAdi}
            className="h-full w-full object-contain"
          />
        ) : (
          <ProductIcon />
        )}
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h2
            className="
              text-xl
              font-extrabold
              tracking-tight
              text-text-primary
              sm:text-2xl
            "
          >
            {urun.urunAdi}
          </h2>

          {urun.oneCikanMi && (
            <span
              className="
                inline-flex
                items-center
                gap-1.5
                rounded-full
                border border-amber-200
                bg-amber-50
                px-2.5 py-1
                text-[11px]
                font-extrabold
                text-amber-700
              "
            >
              <StarIcon />
              Öne Çıkan
            </span>
          )}
        </div>

        {urun.urunKodu && (
          <p className="mt-1 text-sm font-semibold text-text-muted">
            {urun.urunKodu}
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span
            className="
              inline-flex
              items-center
              rounded-lg
              border border-border
              bg-white
              px-3 py-1.5
              text-xs
              font-bold
              text-text-secondary
            "
          >
            {urun.kategoriAdi || "-"}
          </span>

          <DurumRozeti aktifMi={urun.aktifMi} />
        </div>
      </div>
    </div>
  );
}

function Bolum({ baslik, aciklama, children }) {
  return (
    <section
      className="
        rounded-2xl
        border border-border
        bg-white
        p-5
        sm:p-6
      "
    >
      <div className="mb-5">
        <h3
          className="
            text-base
            font-extrabold
            text-text-primary
          "
        >
          {baslik}
        </h3>

        {aciklama && (
          <p
            className="
              mt-1
              text-xs
              leading-5
              text-text-muted
            "
          >
            {aciklama}
          </p>
        )}
      </div>

      {children}
    </section>
  );
}

function Bilgi({ etiket, deger }) {
  const gosterilecekDeger =
    deger === null || deger === undefined || deger === "" ? "-" : deger;

  return (
    <div
      className="
        rounded-xl
        border border-border
        bg-surface-soft/50
        px-4 py-3.5
      "
    >
      <p
        className="
          text-[10px]
          font-extrabold
          uppercase
          tracking-[0.08em]
          text-text-muted
        "
      >
        {etiket}
      </p>

      <p
        className="
          mt-1.5
          break-words
          text-sm
          font-bold
          leading-6
          text-text-primary
        "
      >
        {gosterilecekDeger}
      </p>
    </div>
  );
}

function TeknikOzellikler({ teknikDetaylar = [] }) {
  if (!Array.isArray(teknikDetaylar) || teknikDetaylar.length === 0) {
    return (
      <div
        className="
          rounded-xl
          border border-dashed
          border-border
          bg-surface-soft/40
          px-5 py-8
          text-center
        "
      >
        <p className="text-sm font-bold text-text-secondary">
          Teknik özellik bulunmuyor.
        </p>

        <p className="mt-1 text-xs text-text-muted">
          Bu ürüne henüz herhangi bir teknik özellik tanımlanmamış.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border overflow-hidden rounded-xl border border-border">
      {teknikDetaylar.map((grup) => (
        <div
          key={grup.urunDetayTanimiId}
          className="
              grid
              gap-3
              px-4 py-4
              sm:grid-cols-[220px_1fr]
              sm:items-start
            "
        >
          <div>
            <p
              className="
                  text-sm
                  font-extrabold
                  text-text-primary
                "
            >
              {grup.detayAdi}
            </p>

            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {grup.cokluDegerMi && <MiniRozet>Çoklu</MiniRozet>}

              {grup.filtredeGosterilsinMi && <MiniRozet>Filtre</MiniRozet>}

              {grup.sepetteSecilebilirMi && (
                <MiniRozet>Sepette Seçilebilir</MiniRozet>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {grup.degerler?.length > 0 ? (
              grup.degerler.map((deger) => (
                <span
                  key={deger.urunDetayiId}
                  className={`
                        inline-flex
                        items-center
                        gap-2
                        rounded-lg
                        border
                        px-3 py-1.5
                        text-xs
                        font-bold

                        ${
                          deger.aktifMi
                            ? `
                              border-indigo-100
                              bg-indigo-50
                              text-indigo-700
                            `
                            : `
                              border-slate-200
                              bg-slate-100
                              text-slate-500
                            `
                        }
                      `}
                >
                  <span
                    className={`
                          h-1.5 w-1.5
                          rounded-full

                          ${deger.aktifMi ? "bg-indigo-500" : "bg-slate-400"}
                        `}
                  />

                  {deger.detayDegeri}
                </span>
              ))
            ) : (
              <span className="text-sm text-text-muted">Değer bulunmuyor.</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function MiniRozet({ children }) {
  return (
    <span
      className="
        inline-flex
        rounded-md
        bg-slate-100
        px-2 py-0.5
        text-[9px]
        font-extrabold
        uppercase
        tracking-wide
        text-slate-500
      "
    >
      {children}
    </span>
  );
}

function DurumRozeti({ aktifMi }) {
  return (
    <span
      className={`
        inline-flex
        items-center
        gap-2
        rounded-full
        border
        px-3 py-1.5
        text-xs
        font-extrabold

        ${
          aktifMi
            ? `
              border-emerald-200
              bg-emerald-50
              text-emerald-700
            `
            : `
              border-slate-200
              bg-slate-100
              text-slate-600
            `
        }
      `}
    >
      <span
        className={`
          h-2 w-2
          rounded-full

          ${aktifMi ? "bg-emerald-500" : "bg-slate-400"}
        `}
      />

      {aktifMi ? "Aktif" : "Pasif"}
    </span>
  );
}

function OneCikanRozeti({ oneCikanMi }) {
  return (
    <span
      className={`
        inline-flex
        items-center
        gap-2
        rounded-full
        border
        px-3 py-1.5
        text-xs
        font-extrabold

        ${
          oneCikanMi
            ? `
              border-amber-200
              bg-amber-50
              text-amber-700
            `
            : `
              border-slate-200
              bg-slate-50
              text-slate-500
            `
        }
      `}
    >
      {oneCikanMi && <StarIcon />}

      {oneCikanMi ? "Öne Çıkan" : "Öne Çıkmıyor"}
    </span>
  );
}

function Yukleniyor() {
  return (
    <div
      className="
        flex
        min-h-[340px]
        flex-col
        items-center
        justify-center
      "
    >
      <div
        className="
          h-9 w-9
          animate-spin
          rounded-full
          border-[3px]
          border-brand-blue/15
          border-t-brand-blue
        "
      />

      <p
        className="
          mt-4
          text-sm
          font-bold
          text-text-secondary
        "
      >
        Ürün bilgileri yükleniyor...
      </p>
    </div>
  );
}

function BosDurum() {
  return (
    <div
      className="
        min-h-[260px]
        px-5 py-16
        text-center
      "
    >
      <p
        className="
          text-sm
          font-bold
          text-text-secondary
        "
      >
        Ürün bilgisi bulunamadı.
      </p>
    </div>
  );
}

function satisBirimiAdiGetir(satisBirimi) {
  switch (Number(satisBirimi)) {
    case 1:
      return "Adet";

    case 2:
      return "Paket";

    case 3:
      return "Kutu";

    case 4:
      return "Metre";

    case 5:
      return "Rulo";

    default:
      return "-";
  }
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
      className="h-10 w-10 text-text-muted"
      aria-hidden="true"
    >
      <path
        d="M5 7.5 12 4l7 3.5v9L12 20l-7-3.5v-9Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      <path
        d="m5 7.5 7 3.5 7-3.5M12 11v9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-3.5 w-3.5"
      aria-hidden="true"
    >
      <path d="m12 2.75 2.77 5.62 6.2.9-4.49 4.37 1.06 6.18L12 16.9l-5.54 2.92 1.06-6.18-4.49-4.37 6.2-.9L12 2.75Z" />
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

export default UrunDetayModal;
