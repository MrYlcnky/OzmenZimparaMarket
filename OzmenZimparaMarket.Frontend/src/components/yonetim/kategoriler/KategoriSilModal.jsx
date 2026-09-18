import Modal from "../../ui/Modal";

function KategoriSilModal({
  kategori,
  open,
  onClose,
  onConfirm,
  islemDevamEdiyor,
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      eyebrow="Dikkat"
      title="Kategori Silme"
      maxWidth="460px"
      closeDisabled={islemDevamEdiyor}
      footer={
        kategori ? (
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
              disabled={islemDevamEdiyor}
              className="
                h-10
                rounded-ui
                border
                border-border
                bg-white
                px-4
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
              type="button"
              onClick={onConfirm}
              disabled={islemDevamEdiyor}
              className="
                inline-flex
                h-10
                items-center
                justify-center
                gap-2
                rounded-ui
                bg-danger
                px-4
                text-sm
                font-bold
                text-white
                transition-opacity

                hover:opacity-90

                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {islemDevamEdiyor && (
                <span
                  className="
                    h-4 w-4
                    animate-spin
                    rounded-full
                    border-2
                    border-white/30
                    border-t-white
                  "
                />
              )}

              {islemDevamEdiyor ? "Siliniyor..." : "Kategoriyi Sil"}
            </button>
          </div>
        ) : null
      }
    >
      {kategori && (
        <div className="p-6">
          <div
            className="
              flex
              h-11 w-11
              items-center
              justify-center
              rounded-full
              bg-danger/10
              text-lg
              font-extrabold
              text-danger
            "
          >
            !
          </div>

          <p
            className="
              mt-5
              text-sm
              leading-6
              text-text-secondary
            "
          >
            <strong
              className="
                text-text-primary
              "
            >
              {kategori.kategoriAdi}
            </strong>{" "}
            kategorisini silmek üzeresiniz. Bu işlem geri alınamaz.
          </p>

          <p
            className="
              mt-3
              text-xs
              leading-5
              text-text-muted
            "
          >
            Alt kategorisi veya ürünü bulunan kategoriler silinemez. Böyle bir
            durumda backend tarafından dönen gerçek hata mesajı gösterilecektir.
          </p>
        </div>
      )}
    </Modal>
  );
}

export default KategoriSilModal;
