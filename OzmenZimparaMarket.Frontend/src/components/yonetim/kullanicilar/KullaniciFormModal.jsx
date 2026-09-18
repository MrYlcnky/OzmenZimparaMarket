import Modal from "../../ui/Modal";

const FORM_ID = "panel-kullanicisi-formu";

function KullaniciFormModal({
  open,
  mode = "ekle",

  form,
  alanHatalari = {},

  mevcutKullaniciMi = false,

  saving = false,

  onClose,
  onFieldChange,
  onSubmit,
}) {
  const duzenlemeModu = mode === "duzenle";

  return (
    <Modal
      open={open}
      onClose={onClose}
      eyebrow={duzenlemeModu ? "Kullanıcı Düzenleme" : "Yeni Kullanıcı"}
      title={
        duzenlemeModu
          ? "Kullanıcı Bilgilerini Düzenle"
          : "Yeni Panel Kullanıcısı Oluştur"
      }
      maxWidth="680px"
      closeDisabled={saving}
      footer={
        <div
          className="
            flex
            flex-col
            gap-3

            sm:flex-row
            sm:justify-end
          "
        >
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="
              h-11
              rounded-ui
              border
              border-border
              bg-white
              px-5
              text-sm
              font-bold
              text-text-secondary
              transition-colors

              hover:bg-surface-soft

              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            Vazgeç
          </button>

          <button
            type="submit"
            form={FORM_ID}
            disabled={saving}
            className="
              inline-flex
              h-11
              items-center
              justify-center
              gap-2
              rounded-ui
              bg-gradient-to-r
              from-brand-blue
              to-brand-purple
              px-6
              text-sm
              font-bold
              text-white
              shadow-[0_10px_25px_rgba(37,99,235,0.18)]

              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {saving && <LoadingIcon />}

            {saving
              ? "Kaydediliyor..."
              : duzenlemeModu
                ? "Değişiklikleri Kaydet"
                : "Kullanıcıyı Oluştur"}
          </button>
        </div>
      }
    >
      <form id={FORM_ID} onSubmit={onSubmit} className="space-y-6">
        <div
          className="
            grid
            gap-5

            sm:grid-cols-2
          "
        >
          <FormAlani label="Ad Soyad" required error={alanHatalari.adSoyad}>
            <input
              type="text"
              value={form.adSoyad}
              onChange={(event) => onFieldChange("adSoyad", event.target.value)}
              autoComplete="name"
              maxLength={200}
              placeholder="Örn. Mehmet Yalçınkaya"
              className={inputClassName(Boolean(alanHatalari.adSoyad))}
            />
          </FormAlani>

          <FormAlani
            label="Kullanıcı Adı"
            required
            error={alanHatalari.kullaniciAdi}
          >
            <input
              type="text"
              value={form.kullaniciAdi}
              onChange={(event) =>
                onFieldChange("kullaniciAdi", event.target.value)
              }
              autoComplete="username"
              maxLength={100}
              placeholder="Örn. mehmet"
              className={inputClassName(Boolean(alanHatalari.kullaniciAdi))}
            />
          </FormAlani>
        </div>

        {!duzenlemeModu && (
          <FormAlani
            label="İlk Şifre"
            required
            error={alanHatalari.sifre}
            description="Yeni kullanıcı ilk girişinde bu şifreyi kullanacaktır. En az 8 karakter girin."
          >
            <input
              type="password"
              value={form.sifre}
              onChange={(event) => onFieldChange("sifre", event.target.value)}
              autoComplete="new-password"
              maxLength={100}
              placeholder="En az 8 karakter"
              className={inputClassName(Boolean(alanHatalari.sifre))}
            />
          </FormAlani>
        )}

        {duzenlemeModu && (
          <div
            className="
              rounded-ui-lg
              border
              border-brand-blue/15
              bg-brand-blue/[0.035]
              px-4
              py-3.5
            "
          >
            <p
              className="
                text-xs
                font-semibold
                leading-5
                text-text-secondary
              "
            >
              Kullanıcının şifresi bu ekrandan değiştirilmez. Şifre değiştirmek
              için kullanıcı listesindeki anahtar simgesini kullanın.
            </p>
          </div>
        )}

        <div
          className="
            rounded-ui-lg
            border
            border-border
            bg-surface-soft/60
            p-4
          "
        >
          <label
            className="
              flex
              cursor-pointer
              items-center
              justify-between
              gap-4
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
                Kullanıcı aktif
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  leading-5
                  text-text-muted
                "
              >
                Pasif kullanıcılar yönetim paneline giriş yapamaz.
              </p>

              {mevcutKullaniciMi && (
                <p
                  className="
                    mt-2
                    text-xs
                    font-bold
                    text-amber-600
                  "
                >
                  Giriş yaptığınız kendi hesabınızı pasife alamazsınız.
                </p>
              )}
            </div>

            <input
              type="checkbox"
              checked={Boolean(form.aktifMi)}
              disabled={mevcutKullaniciMi && form.aktifMi}
              onChange={(event) =>
                onFieldChange("aktifMi", event.target.checked)
              }
              className="
                h-5
                w-5
                shrink-0
                accent-brand-blue
              "
            />
          </label>
        </div>
      </form>
    </Modal>
  );
}

function FormAlani({ label, required = false, error, description, children }) {
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

        {required && <span className="ml-1 text-danger">*</span>}
      </label>

      {children}

      {error ? (
        <p
          className="
            mt-1.5
            text-xs
            font-semibold
            text-danger
          "
        >
          {error}
        </p>
      ) : description ? (
        <p
          className="
            mt-1.5
            text-xs
            leading-5
            text-text-muted
          "
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

function inputClassName(hataliMi) {
  return `
    h-11
    w-full
    rounded-ui
    border
    bg-white
    px-3.5
    text-sm
    font-semibold
    text-text-primary
    outline-none
    transition

    placeholder:font-normal
    placeholder:text-text-muted

    focus:ring-4
    focus:ring-brand-blue/10

    ${
      hataliMi
        ? `
          border-danger
          focus:border-danger
        `
        : `
          border-border
          focus:border-brand-blue/40
        `
    }
  `;
}

function LoadingIcon() {
  return (
    <span
      className="
        h-4
        w-4
        animate-spin
        rounded-full
        border-2
        border-white/30
        border-t-white
      "
    />
  );
}

export default KullaniciFormModal;
