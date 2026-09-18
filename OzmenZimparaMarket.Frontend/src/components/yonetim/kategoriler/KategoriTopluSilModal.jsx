import Modal from "../../ui/Modal";

function KategoriTopluSilModal({
  open,
  onClose,
  kategoriler = [],
  onConfirm,
  islemDevamEdiyor = false,
}) {
  const kategoriSayisi = kategoriler.length;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Seçilen Kategorileri Sil"
      eyebrow="Toplu Silme"
      maxWidth="620px"
      closeDisabled={islemDevamEdiyor}
      footer={
        <div
          className="
            flex
            w-full
            flex-col-reverse
            gap-3
            sm:flex-row
            sm:items-center
            sm:justify-end
          "
        >
          <button
            type="button"
            disabled={islemDevamEdiyor}
            onClick={onClose}
            className="
              inline-flex
              h-11
              items-center
              justify-center
              rounded-ui
              border
              border-border
              bg-white
              px-5
              text-sm
              font-bold
              text-text-secondary
              transition-all

              hover:border-brand-blue/25
              hover:text-brand-blue

              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            Vazgeç
          </button>

          <button
            type="button"
            disabled={islemDevamEdiyor || kategoriSayisi === 0}
            onClick={onConfirm}
            className="
              inline-flex
              h-11
              items-center
              justify-center
              gap-2
              rounded-ui
              border
              border-danger/20
              bg-danger
              px-5
              text-sm
              font-bold
              text-white
              shadow-[0_6px_18px_rgba(220,38,38,0.16)]
              transition-all

              hover:bg-danger/90

              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {islemDevamEdiyor ? (
              <>
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
                Siliniyor...
              </>
            ) : (
              <>
                <TrashIcon />
                {kategoriSayisi} Kategoriyi Sil
              </>
            )}
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        <div
          className="
            rounded-[14px]
            border
            border-danger/15
            bg-danger/[0.045]
            p-4
          "
        >
          <div
            className="
              flex
              items-start
              gap-3
            "
          >
            <div
              className="
                flex
                h-9 w-9
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-danger/10
                text-danger
              "
            >
              <WarningIcon />
            </div>

            <div>
              <p
                className="
                  text-sm
                  font-extrabold
                  text-text-primary
                "
              >
                {kategoriSayisi} kategori silinmek üzere seçildi.
              </p>

              <p
                className="
                  mt-1
                  text-sm
                  leading-6
                  text-text-muted
                "
              >
                Bu işlem geri alınamaz. Ürünlerle ilişkili veya silinemeyen alt
                kategorilere sahip kayıtlar sistem kurallarına göre
                korunacaktır.
              </p>
            </div>
          </div>
        </div>

        <div>
          <div
            className="
              mb-3
              flex
              items-center
              justify-between
              gap-3
            "
          >
            <p
              className="
                text-xs
                font-extrabold
                uppercase
                tracking-[0.08em]
                text-text-muted
              "
            >
              Seçili Kategoriler
            </p>

            <span
              className="
                rounded-full
                bg-brand-blue/[0.07]
                px-2.5
                py-1
                text-[11px]
                font-extrabold
                text-brand-blue
              "
            >
              {kategoriSayisi} kayıt
            </span>
          </div>

          {kategoriSayisi === 0 ? (
            <div
              className="
                rounded-[14px]
                border
                border-dashed
                border-border
                px-5
                py-8
                text-center
              "
            >
              <p
                className="
                  text-sm
                  font-semibold
                  text-text-muted
                "
              >
                Silinecek kategori seçilmedi.
              </p>
            </div>
          ) : (
            <div
              className="
                max-h-[300px]
                overflow-y-auto
                rounded-[14px]
                border
                border-border
              "
            >
              <div
                className="
                  divide-y
                  divide-border
                "
              >
                {kategoriler.map((kategori) => (
                  <div
                    key={kategori.id}
                    className="
                      flex
                      items-center
                      justify-between
                      gap-4
                      px-4
                      py-3.5
                    "
                  >
                    <div className="min-w-0">
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

                      <p
                        className="
                          mt-1
                          truncate
                          text-xs
                          text-text-muted
                        "
                      >
                        {kategori.kategoriYolu ?? kategori.kategoriAdi}
                      </p>
                    </div>

                    <span
                      className="
                        shrink-0
                        rounded-full
                        bg-surface-soft
                        px-2.5
                        py-1
                        text-[10px]
                        font-bold
                        text-text-muted
                      "
                    >
                      ID: {kategori.id}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div
          className="
            rounded-[12px]
            border
            border-border
            bg-surface-soft/60
            px-4
            py-3
          "
        >
          <p
            className="
              text-xs
              leading-5
              text-text-muted
            "
          >
            Ana kategori ve onun seçili alt kategorileri birlikte silinecekse
            silme işlemi en alt seviyedeki kategorilerden başlayarak yürütülür.
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
      strokeWidth="1.9"
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

function WarningIcon() {
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
        d="M12 3 2.8 19a1.4 1.4 0 0 0 1.2 2h16a1.4 1.4 0 0 0 1.2-2L12 3Z"
      />

      <path strokeLinecap="round" d="M12 9v5" />

      <circle cx="12" cy="17.5" r=".8" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default KategoriTopluSilModal;
