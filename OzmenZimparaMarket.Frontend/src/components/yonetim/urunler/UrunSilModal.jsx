import Modal from "../../ui/Modal";

export default function UrunSilModal({
  urun,
  open,
  onClose,
  onConfirm,
  loading = false,
}) {
  if (!urun) {
    return null;
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      eyebrow="Ürün Yönetimi"
      title="Ürünü Sil"
      maxWidth="520px"
      closeDisabled={loading}
      footer={
        <div className="flex w-full items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="
              rounded-xl
              border border-slate-200
              bg-white
              px-4 py-2.5
              text-sm font-bold text-slate-700
              transition
              hover:border-slate-300
              hover:bg-slate-50
              disabled:cursor-not-allowed
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
              inline-flex min-w-[112px]
              items-center justify-center gap-2
              rounded-xl
              bg-red-600
              px-4 py-2.5
              text-sm font-extrabold text-white
              transition
              hover:bg-red-700
              focus:outline-none
              focus:ring-4 focus:ring-red-100
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {loading && (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4 animate-spin"
                aria-hidden="true"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="opacity-25"
                />

                <path
                  d="M21 12a9 9 0 0 0-9-9"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="opacity-90"
                />
              </svg>
            )}

            {loading ? "Siliniyor..." : "Ürünü Sil"}
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-6 w-6"
            aria-hidden="true"
          >
            <path
              d="M9 3h6m-9 4h12m-1 0-.65 12.03A2 2 0 0 1 14.35 21h-4.7a2 2 0 0 1-2-1.97L7 7m3 4v6m4-6v6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div>
          <p className="text-sm leading-6 text-slate-600">
            <span className="font-extrabold text-slate-900">
              {urun.urunAdi}
            </span>{" "}
            adlı ürünü kalıcı olarak silmek üzeresiniz.
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Ürüne bağlı teknik detaylar da ürünle birlikte silinecektir. Bu
            işlem geri alınamaz.
          </p>
        </div>

        <div className="rounded-xl border border-red-100 bg-red-50/70 px-4 py-3">
          <div className="flex items-start gap-3">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="mt-0.5 h-5 w-5 shrink-0 text-red-500"
              aria-hidden="true"
            >
              <path
                d="M12 8v5m0 3.25v.01M10.28 4.6 3.63 16.12A2 2 0 0 0 5.36 19h13.28a2 2 0 0 0 1.73-2.88L13.72 4.6a2 2 0 0 0-3.44 0Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <p className="text-xs font-semibold leading-5 text-red-700">
              Silme işlemi tamamlandıktan sonra bu ürün yönetim panelinde ve
              public katalogda artık görüntülenmez.
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
