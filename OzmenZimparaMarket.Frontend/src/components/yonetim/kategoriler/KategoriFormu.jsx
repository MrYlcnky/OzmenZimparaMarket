import { dosyaUrlOlustur } from "../../../api/servisler/dosyaServisi";

import Select from "../../ui/Select";

function KategoriFormu({
  formId = "kategori-formu",

  form,
  kategoriler,

  onChange,
  onSelectChange,
  onSubmit,

  onGorselYukle,
  onGorselKaldir,

  kaydediliyor,
  gorselYukleniyor,

  hataMesaji,
  basariMesaji,
  alanHatalari,
}) {
  const formDevreDisi = kaydediliyor || gorselYukleniyor;

  function alanHatasiGetir(alanAdi) {
    if (!alanHatalari) {
      return null;
    }

    const eslesenAnahtar = Object.keys(alanHatalari).find(
      (anahtar) => anahtar.toLowerCase() === alanAdi.toLowerCase(),
    );

    if (!eslesenAnahtar) {
      return null;
    }

    const hatalar = alanHatalari[eslesenAnahtar];

    if (Array.isArray(hatalar)) {
      return hatalar[0] ?? null;
    }

    if (typeof hatalar === "string") {
      return hatalar;
    }

    return null;
  }

  async function dosyaSecildi(event) {
    const dosya = event.target.files?.[0];

    event.target.value = "";

    if (!dosya) {
      return;
    }

    await onGorselYukle(dosya);
  }

  const ustKategoriOptions = kategoriler.map((kategori) => ({
    value: kategori.id,

    label: kategori.kategoriYolu ?? kategori.kategoriAdi,

    emphasized: (kategori.seviye ?? 0) === 0,
  }));
  return (
    <form id={formId} onSubmit={onSubmit}>
      <div
        className="
          space-y-8
          p-5
          sm:p-6
        "
      >
        {(hataMesaji || basariMesaji) && (
          <div className="space-y-3">
            {hataMesaji && (
              <MesajKutusu
                tur="hata"
                baslik="İşlem tamamlanamadı"
                mesaj={hataMesaji}
              />
            )}

            {basariMesaji && (
              <MesajKutusu
                tur="basari"
                baslik="İşlem başarılı"
                mesaj={basariMesaji}
              />
            )}
          </div>
        )}

        <FormBolumu
          baslik="Temel Bilgiler"
          aciklama="Kategori adı, hiyerarşi ve açıklama bilgilerini yönetin."
        >
          <div className="grid gap-5">
            <InputAlani
              id="kategoriAdi"
              label="Kategori Adı"
              value={form.kategoriAdi}
              onChange={onChange}
              disabled={formDevreDisi}
              hata={alanHatasiGetir("KategoriAdi")}
              maxLength={200}
              required
            />

            <Select
              id="ustKategoriId"
              label="Üst Kategori"
              value={form.ustKategoriId}
              emptyLabel="Ana kategori olarak oluştur"
              placeholder="Üst kategori seçiniz"
              searchable
              searchPlaceholder="Kategori ara..."
              noResultsText="Kategori bulunamadı"
              options={ustKategoriOptions}
              onValueChange={(value) => onSelectChange("ustKategoriId", value)}
              disabled={formDevreDisi}
              hata={alanHatasiGetir("UstKategoriId")}
              aciklama="Üst kategori seçmezseniz bu kayıt ana kategori olarak oluşturulur."
            />

            <MetinAlani
              id="aciklama"
              label="Kategori Açıklaması"
              value={form.aciklama}
              onChange={onChange}
              disabled={formDevreDisi}
              hata={alanHatasiGetir("Aciklama")}
              rows={5}
              maxLength={2000}
            />
          </div>
        </FormBolumu>

        <Ayirici />

        <FormBolumu
          baslik="Kategori Görseli"
          aciklama="Kategori kartlarında kullanılacak JPG, PNG veya WebP görselini yönetin."
        >
          {form.gorselYolu ? (
            <div className="space-y-4">
              <div
                className="
                  relative
                  aspect-[16/7]
                  overflow-hidden
                  rounded-ui-lg
                  border
                  border-border
                  bg-surface-soft
                "
              >
                <img
                  src={dosyaUrlOlustur(form.gorselYolu)}
                  alt={form.kategoriAdi || "Kategori görseli"}
                  className="
                    h-full w-full
                    object-cover
                  "
                />

                <div
                  className="
                    pointer-events-none
                    absolute inset-0
                    bg-gradient-to-t
                    from-black/15
                    to-transparent
                  "
                />
              </div>

              <p
                className="
                  break-all
                  text-xs
                  leading-5
                  text-text-muted
                "
              >
                {form.gorselYolu}
              </p>

              <div
                className="
                  flex flex-wrap
                  gap-2
                "
              >
                <label
                  className={`
                    inline-flex
                    h-10
                    items-center
                    justify-center
                    rounded-ui
                    border
                    border-brand-blue/20
                    bg-brand-blue/[0.05]
                    px-4
                    text-xs
                    font-bold
                    text-brand-blue
                    transition-colors

                    ${
                      formDevreDisi
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer hover:bg-brand-blue/10"
                    }
                  `}
                >
                  {gorselYukleniyor ? "Yükleniyor..." : "Görseli Değiştir"}

                  <input
                    type="file"
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                    disabled={formDevreDisi}
                    onChange={dosyaSecildi}
                  />
                </label>

                <button
                  type="button"
                  disabled={formDevreDisi}
                  onClick={onGorselKaldir}
                  className="
                    h-10
                    rounded-ui
                    border
                    border-danger/15
                    bg-danger/[0.04]
                    px-4
                    text-xs
                    font-bold
                    text-danger
                    transition-colors

                    hover:bg-danger/10

                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  Formdan Kaldır
                </button>
              </div>
            </div>
          ) : (
            <label
              className={`
                flex min-h-[170px]
                flex-col
                items-center
                justify-center
                rounded-ui-lg
                border-2
                border-dashed
                border-border
                bg-surface-soft/70
                px-6 py-8
                text-center
                transition-all

                ${
                  formDevreDisi
                    ? "cursor-not-allowed opacity-60"
                    : "cursor-pointer hover:border-brand-blue/40 hover:bg-brand-blue/[0.025]"
                }
              `}
            >
              <div
                className="
                  flex h-12 w-12
                  items-center
                  justify-center
                  rounded-full
                  bg-brand-blue/10
                  text-brand-blue
                "
              >
                {gorselYukleniyor ? (
                  <span
                    className="
                      h-5 w-5
                      animate-spin
                      rounded-full
                      border-2
                      border-brand-blue/20
                      border-t-brand-blue
                    "
                  />
                ) : (
                  <UploadIcon />
                )}
              </div>

              <p
                className="
                  mt-4
                  text-sm
                  font-bold
                  text-text-primary
                "
              >
                {gorselYukleniyor
                  ? "Görsel yükleniyor..."
                  : "Kategori görseli seç"}
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  text-text-muted
                "
              >
                JPG, JPEG, PNG veya WEBP
              </p>

              <input
                type="file"
                className="hidden"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                disabled={formDevreDisi}
                onChange={dosyaSecildi}
              />
            </label>
          )}

          {alanHatasiGetir("GorselYolu") && (
            <p
              className="
                mt-2
                text-xs
                font-semibold
                text-danger
              "
            >
              {alanHatasiGetir("GorselYolu")}
            </p>
          )}
        </FormBolumu>

        <Ayirici />

        <FormBolumu
          baslik="SEO Ayarları"
          aciklama="Boş bırakılan SEO alanları backend tarafından otomatik olarak oluşturulur."
        >
          <div className="grid gap-5">
            <InputAlani
              id="seoUrl"
              label="SEO URL"
              value={form.seoUrl}
              onChange={onChange}
              disabled={formDevreDisi}
              hata={alanHatasiGetir("SeoUrl")}
              maxLength={250}
              aciklama="Boş bırakırsanız kategori adından otomatik oluşturulur."
            />

            <InputAlani
              id="seoBasligi"
              label="SEO Başlığı"
              value={form.seoBasligi}
              onChange={onChange}
              disabled={formDevreDisi}
              hata={alanHatasiGetir("SeoBasligi")}
              maxLength={250}
              aciklama="Boş bırakırsanız kategori adı ve firma adı kullanılır."
            />

            <MetinAlani
              id="seoAciklamasi"
              label="SEO Açıklaması"
              value={form.seoAciklamasi}
              onChange={onChange}
              disabled={formDevreDisi}
              hata={alanHatasiGetir("SeoAciklamasi")}
              rows={4}
              maxLength={500}
              aciklama="Boş bırakırsanız kategori açıklaması kullanılır."
            />
          </div>
        </FormBolumu>

        <Ayirici />

        <FormBolumu
          baslik="Yayın Ayarları"
          aciklama="Kategori sırası ve görünürlük durumunu belirleyin."
        >
          <InputAlani
            id="siraNo"
            label="Sıra Numarası"
            type="number"
            min="0"
            value={form.siraNo}
            onChange={onChange}
            disabled={formDevreDisi}
            hata={alanHatasiGetir("SiraNo")}
            aciklama="Düşük sıra numarası listelerde daha önce gösterilir."
          />

          <div
            className="
              mt-5
              grid gap-3
              sm:grid-cols-2
            "
          >
            <CheckboxAlani
              id="aktifMi"
              label="Kategori Aktif"
              aciklama="Kategori public tarafta kullanılabilir."
              checked={form.aktifMi}
              onChange={onChange}
              disabled={formDevreDisi}
            />

            <CheckboxAlani
              id="anaSayfadaGosterilsinMi"
              label="Ana Sayfada Göster"
              aciklama="Kategori ana sayfadaki kategori alanında gösterilebilir."
              checked={form.anaSayfadaGosterilsinMi}
              onChange={onChange}
              disabled={formDevreDisi}
            />
          </div>
        </FormBolumu>
      </div>
    </form>
  );
}

function FormBolumu({ baslik, aciklama, children }) {
  return (
    <section>
      <div className="mb-4">
        <h3
          className="
            text-sm
            font-extrabold
            text-text-primary
          "
        >
          {baslik}
        </h3>

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
      </div>

      {children}
    </section>
  );
}

function Ayirici() {
  return (
    <div
      className="
        border-t
        border-border
      "
    />
  );
}

function InputAlani({
  id,
  label,
  type = "text",
  value,
  onChange,
  disabled,
  hata,
  maxLength,
  aciklama,
  required = false,
  min,
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="
          flex items-center
          gap-1
          text-[13px]
          font-bold
          text-text-primary
        "
      >
        {label}

        {required && <span className="text-danger">*</span>}
      </label>

      <input
        id={id}
        name={id}
        type={type}
        min={min}
        value={value}
        onChange={onChange}
        disabled={disabled}
        maxLength={maxLength}
        className={`
          mt-2.5
          h-11 w-full
          rounded-ui
          border
          px-3.5
          text-sm
          text-text-primary
          outline-none
          transition-all

          disabled:cursor-not-allowed
          disabled:opacity-60

          ${
            hata
              ? "border-danger/60 bg-danger/[0.025] focus:border-danger focus:ring-4 focus:ring-danger/10"
              : "border-border bg-[#fafafa] hover:border-[#d4d4d8] focus:border-brand-blue focus:bg-white focus:ring-4 focus:ring-brand-blue/10"
          }
        `}
      />

      {aciklama && !hata && (
        <p
          className="
              mt-2
              text-xs
              leading-5
              text-text-muted
            "
        >
          {aciklama}
        </p>
      )}

      {hata && (
        <p
          className="
            mt-2
            text-xs
            font-semibold
            text-danger
          "
        >
          {hata}
        </p>
      )}
    </div>
  );
}

function MetinAlani({
  id,
  label,
  value,
  onChange,
  disabled,
  hata,
  rows = 5,
  maxLength,
  aciklama,
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="
          text-[13px]
          font-bold
          text-text-primary
        "
      >
        {label}
      </label>

      <textarea
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        className={`
          mt-2.5
          w-full
          resize-y
          rounded-ui
          border
          px-3.5
          py-3
          text-sm
          leading-6
          text-text-primary
          outline-none
          transition-all

          disabled:cursor-not-allowed
          disabled:opacity-60

          ${
            hata
              ? "border-danger/60 bg-danger/[0.025] focus:border-danger focus:ring-4 focus:ring-danger/10"
              : "border-border bg-[#fafafa] hover:border-[#d4d4d8] focus:border-brand-blue focus:bg-white focus:ring-4 focus:ring-brand-blue/10"
          }
        `}
      />

      {aciklama && !hata && (
        <p
          className="
              mt-2
              text-xs
              leading-5
              text-text-muted
            "
        >
          {aciklama}
        </p>
      )}

      {hata && (
        <p
          className="
            mt-2
            text-xs
            font-semibold
            text-danger
          "
        >
          {hata}
        </p>
      )}
    </div>
  );
}

function CheckboxAlani({ id, label, aciklama, checked, onChange, disabled }) {
  return (
    <label
      htmlFor={id}
      className={`
        flex
        items-start
        gap-3
        rounded-ui
        border
        border-border
        bg-surface-soft/50
        p-4
        transition-colors

        ${
          disabled
            ? "cursor-not-allowed opacity-60"
            : "cursor-pointer hover:border-brand-blue/20 hover:bg-brand-blue/[0.025]"
        }
      `}
    >
      <input
        id={id}
        name={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="
          mt-1
          h-4 w-4
          accent-blue-600
        "
      />

      <span>
        <span
          className="
            block
            text-sm
            font-bold
            text-text-primary
          "
        >
          {label}
        </span>

        <span
          className="
            mt-1
            block
            text-xs
            leading-5
            text-text-muted
          "
        >
          {aciklama}
        </span>
      </span>
    </label>
  );
}

function MesajKutusu({ tur, baslik, mesaj }) {
  const basarili = tur === "basari";

  return (
    <div
      className={`
        rounded-ui-lg
        border
        px-4 py-3

        ${
          basarili
            ? "border-success/20 bg-success/[0.06]"
            : "border-danger/20 bg-danger/[0.06]"
        }
      `}
    >
      <p
        className={`
          text-sm
          font-bold

          ${basarili ? "text-success" : "text-danger"}
        `}
      >
        {baslik}
      </p>

      <p
        className={`
          mt-1
          text-xs
          leading-5

          ${basarili ? "text-success/80" : "text-danger/80"}
        `}
      >
        {mesaj}
      </p>
    </div>
  );
}

function UploadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 16V4m0 0-4 4m4-4 4 4M5 14v5h14v-5"
      />
    </svg>
  );
}

export default KategoriFormu;
