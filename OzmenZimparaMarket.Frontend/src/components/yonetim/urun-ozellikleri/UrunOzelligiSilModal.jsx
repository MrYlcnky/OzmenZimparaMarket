import Button from "../../ui/Button";
import Modal from "../../ui/Modal";

function UrunOzelligiSilModal({
  open,
  onClose,
  urunOzelligi,
  siliniyor,
  onSil,
}) {
  if (!urunOzelligi) {
    return null;
  }

  async function silmeOnaylandi() {
    if (siliniyor) {
      return;
    }

    await onSil();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      eyebrow="ÜRÜN ÖZELLİKLERİ"
      title="Ürün Özelliğini Sil"
      maxWidth="520px"
      closeDisabled={siliniyor}
      footer={
        <div
          className="
            flex
            w-full
            flex-col-reverse
            gap-2.5

            sm:flex-row
            sm:items-center
            sm:justify-end
          "
        >
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={siliniyor}
          >
            Vazgeç
          </Button>

          <button
            type="button"
            onClick={silmeOnaylandi}
            disabled={siliniyor}
            className="
              inline-flex
              h-10
              items-center
              justify-center
              gap-2

              rounded-xl

              bg-red-600

              px-4

              text-sm
              font-extrabold
              text-white

              shadow-sm

              transition-all

              hover:bg-red-700

              focus:outline-none
              focus:ring-4
              focus:ring-red-600/15

              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {siliniyor ? "Siliniyor..." : "Ürün Özelliğini Sil"}
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <div
          className="
            flex
            h-10
            w-10
            items-center
            justify-center

            rounded-xl

            bg-red-50
            text-red-600
          "
        >
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
              d="M12 9v4m0 4h.01M10.3 3.9 2.7 17.1A2 2 0 0 0 4.43 20h15.14a2 2 0 0 0 1.73-2.9L13.7 3.9a2 2 0 0 0-3.4 0Z"
            />
          </svg>
        </div>

        <div>
          <p
            className="
              text-sm
              leading-6
              text-text-secondary
            "
          >
            <strong className="font-extrabold text-text-primary">
              {urunOzelligi.detayAdi}
            </strong>{" "}
            adlı ürün özelliğini silmek üzeresiniz.
          </p>

          <p
            className="
              mt-1.5
              text-[13px]
              leading-5
              text-text-muted
            "
          >
            Bu işlem geri alınamaz.
          </p>
        </div>

        <div
          className="
            rounded-xl
            border
            border-amber-200
            bg-amber-50/80

            px-4
            py-3
          "
        >
          <div className="flex gap-3">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="
                mt-0.5
                h-4
                w-4
                shrink-0
                text-amber-600
              "
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v4m0 4h.01M10.3 3.9 2.7 17.1A2 2 0 0 0 4.43 20h15.14a2 2 0 0 0 1.73-2.9L13.7 3.9a2 2 0 0 0-3.4 0Z"
              />
            </svg>

            <div>
              <p
                className="
                  text-[12px]
                  font-extrabold
                  text-amber-900
                "
              >
                Kullanımdaki özellikler silinemez
              </p>

              <p
                className="
                  mt-1
                  text-[11px]
                  leading-5
                  text-amber-800
                "
              >
                Bu özellik herhangi bir üründe kullanılıyorsa sistem silme
                işlemini engeller. Böyle bir durumda özelliği pasife
                alabilirsiniz.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default UrunOzelligiSilModal;
