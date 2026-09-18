import Modal from "../../ui/Modal";

const FORM_ID = "kullanici-sifre-sifirlama-formu";

function KullaniciSifreSifirlaModal({
  open,
  kullanici,

  form,
  alanHatalari = {},

  loading = false,

  onClose,
  onFieldChange,
  onSubmit,
}) {
  if (!kullanici) {
    return null;
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      eyebrow="Kullanıcı Güvenliği"
      title="Kullanıcı Şifresini Sıfırla"
      maxWidth="560px"
      closeDisabled={loading}
      footer={
        <div
          className="
            flex
            justify-end
            gap-3
          "
        >
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
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

              disabled:opacity-50
            "
          >
            Vazgeç
          </button>

          <button
            type="submit"
            form={FORM_ID}
            disabled={loading}
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
              px-5
              text-sm
              font-bold
              text-white

              disabled:opacity-50
            "
          >
            {loading && <LoadingIcon />}

            {loading ? "Sıfırlanıyor..." : "Şifreyi Sıfırla"}
          </button>
        </div>
      }
    >
      <form id={FORM_ID} onSubmit={onSubmit} className="space-y-5">
        <div
          className="
            rounded-ui-lg
            border
            border-border
            bg-surface-soft/60
            px-4
            py-3
          "
        >
          <p className="text-sm font-extrabold text-text-primary">
            {kullanici.adSoyad}
          </p>

          <p className="mt-1 text-xs font-semibold text-text-muted">
            @{kullanici.kullaniciAdi}
          </p>
        </div>

        <SifreAlani
          label="Yeni Şifre"
          value={form.yeniSifre}
          error={alanHatalari.yeniSifre}
          onChange={(deger) => onFieldChange("yeniSifre", deger)}
        />

        <SifreAlani
          label="Yeni Şifre Tekrar"
          value={form.yeniSifreTekrar}
          error={alanHatalari.yeniSifreTekrar}
          onChange={(deger) => onFieldChange("yeniSifreTekrar", deger)}
        />

        <p
          className="
            text-xs
            leading-5
            text-text-muted
          "
        >
          Yeni şifre en az 8, en fazla 100 karakter olmalıdır.
        </p>
      </form>
    </Modal>
  );
}

function SifreAlani({ label, value, error, onChange }) {
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
        <span className="ml-1 text-danger">*</span>
      </label>

      <input
        type="password"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete="new-password"
        maxLength={100}
        className={`
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

          focus:ring-4
          focus:ring-brand-blue/10

          ${
            error ? "border-danger" : "border-border focus:border-brand-blue/40"
          }
        `}
      />

      {error && (
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
      )}
    </div>
  );
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

export default KullaniciSifreSifirlaModal;
