import Modal from "../../ui/Modal";

const FORM_ID = "kendi-sifremi-degistir-formu";

function KullaniciSifreDegistirModal({
  open,

  form,
  alanHatalari = {},

  loading = false,

  onClose,
  onFieldChange,
  onSubmit,
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      eyebrow="Hesap Güvenliği"
      title="Şifremi Değiştir"
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

            {loading ? "Değiştiriliyor..." : "Şifremi Değiştir"}
          </button>
        </div>
      }
    >
      <form id={FORM_ID} onSubmit={onSubmit} className="space-y-5">
        <SifreAlani
          label="Mevcut Şifre"
          value={form.mevcutSifre}
          error={alanHatalari.mevcutSifre}
          autoComplete="current-password"
          onChange={(deger) => onFieldChange("mevcutSifre", deger)}
        />

        <div
          className="
            border-t
            border-border
            pt-5
          "
        >
          <div className="space-y-5">
            <SifreAlani
              label="Yeni Şifre"
              value={form.yeniSifre}
              error={alanHatalari.yeniSifre}
              autoComplete="new-password"
              onChange={(deger) => onFieldChange("yeniSifre", deger)}
            />

            <SifreAlani
              label="Yeni Şifre Tekrar"
              value={form.yeniSifreTekrar}
              error={alanHatalari.yeniSifreTekrar}
              autoComplete="new-password"
              onChange={(deger) => onFieldChange("yeniSifreTekrar", deger)}
            />
          </div>
        </div>

        <div
          className="
            rounded-ui-lg
            border
            border-brand-blue/15
            bg-brand-blue/[0.035]
            px-4
            py-3
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
            Yeni şifreniz mevcut şifrenizden farklı ve en az 8 karakter
            olmalıdır.
          </p>
        </div>
      </form>
    </Modal>
  );
}

function SifreAlani({ label, value, error, autoComplete, onChange }) {
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
        autoComplete={autoComplete}
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

export default KullaniciSifreDegistirModal;
