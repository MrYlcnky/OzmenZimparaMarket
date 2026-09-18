import Modal from "../../ui/Modal";

function KullaniciSilModal({
  open,
  kullanici,
  loading = false,

  onClose,
  onConfirm,
}) {
  if (!kullanici) {
    return null;
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      eyebrow="Dikkat"
      title="Kullanıcıyı Sil"
      maxWidth="520px"
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
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="
              inline-flex
              h-11
              items-center
              justify-center
              gap-2
              rounded-ui
              bg-danger
              px-5
              text-sm
              font-bold
              text-white

              disabled:opacity-50
            "
          >
            {loading && <LoadingIcon />}

            {loading ? "Siliniyor..." : "Kullanıcıyı Sil"}
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        <div
          className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-2xl
            bg-danger/10
            text-danger
          "
        >
          <TrashIcon />
        </div>

        <div>
          <p
            className="
              text-sm
              leading-6
              text-text-secondary
            "
          >
            <strong className="text-text-primary">{kullanici.adSoyad}</strong>{" "}
            adlı panel kullanıcısını kalıcı olarak silmek üzeresiniz.
          </p>

          <p
            className="
              mt-2
              text-sm
              leading-6
              text-text-muted
            "
          >
            Kullanıcı adı: <strong>{kullanici.kullaniciAdi}</strong>
          </p>
        </div>

        <div
          className="
            rounded-ui-lg
            border
            border-danger/15
            bg-danger/[0.05]
            px-4
            py-3
          "
        >
          <p
            className="
              text-xs
              font-semibold
              leading-5
              text-danger
            "
          >
            Bu işlem geri alınamaz. Sistemdeki son aktif kullanıcı silinemez.
          </p>
        </div>
      </div>
    </Modal>
  );
}

function TrashIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 3h6m-9 4h12m-1 0-.65 12.03A2 2 0 0 1 14.35 21h-4.7a2 2 0 0 1-2-1.97L7 7m3 4v6m4-6v6"
      />
    </svg>
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

export default KullaniciSilModal;
