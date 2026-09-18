import Modal from "../../ui/Modal";

import KategoriFormu from "./KategoriFormu";

const KATEGORI_FORM_ID = "kategori-formu";

function KategoriFormModal({
  open,
  onClose,

  duzenlenenKategoriId,

  form,
  kategoriler,

  onChange,
  onSelectChange,
  onSubmit,

  onGorselYukle,
  onGorselKaldir,

  detayYukleniyor,
  kaydediliyor,
  gorselYukleniyor,

  hataMesaji,
  basariMesaji,
  alanHatalari,

  closeDisabled,
}) {
  const duzenlemeModu = Boolean(duzenlenenKategoriId);

  return (
    <Modal
      open={open}
      onClose={onClose}
      eyebrow={duzenlemeModu ? "Kategori Düzenleme" : "Yeni Kategori"}
      title={
        duzenlemeModu ? "Kategori Bilgilerini Düzenle" : "Yeni Kategori Oluştur"
      }
      maxWidth="860px"
      closeDisabled={closeDisabled}
      footer={
        !detayYukleniyor ? (
          <ModalFooter
            duzenlemeModu={duzenlemeModu}
            kaydediliyor={kaydediliyor}
            disabled={closeDisabled}
            onClose={onClose}
          />
        ) : null
      }
    >
      {detayYukleniyor ? (
        <KategoriDetayLoading />
      ) : (
        <KategoriFormu
          formId={KATEGORI_FORM_ID}
          form={form}
          kategoriler={kategoriler}
          onChange={onChange}
          onSelectChange={onSelectChange}
          onSubmit={onSubmit}
          onGorselYukle={onGorselYukle}
          onGorselKaldir={onGorselKaldir}
          kaydediliyor={kaydediliyor}
          gorselYukleniyor={gorselYukleniyor}
          hataMesaji={hataMesaji}
          basariMesaji={basariMesaji}
          alanHatalari={alanHatalari}
        />
      )}
    </Modal>
  );
}

function ModalFooter({ duzenlemeModu, kaydediliyor, disabled, onClose }) {
  return (
    <div
      className="
        flex flex-col
        gap-3
        sm:flex-row
        sm:justify-end
      "
    >
      <button
        type="button"
        onClick={onClose}
        disabled={disabled}
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
        form={KATEGORI_FORM_ID}
        disabled={disabled}
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
          transition-all

          hover:-translate-y-0.5
          hover:shadow-[0_14px_30px_rgba(37,99,235,0.24)]

          disabled:cursor-not-allowed
          disabled:opacity-60
          disabled:hover:translate-y-0
        "
      >
        {kaydediliyor && (
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

        {kaydediliyor
          ? "Kaydediliyor..."
          : duzenlemeModu
            ? "Değişiklikleri Kaydet"
            : "Kategoriyi Oluştur"}
      </button>
    </div>
  );
}

function KategoriDetayLoading() {
  return (
    <div
      className="
        flex
        min-h-[360px]
        items-center
        justify-center
      "
    >
      <div className="text-center">
        <div
          className="
            mx-auto
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
            font-semibold
            text-text-muted
          "
        >
          Kategori bilgileri yükleniyor...
        </p>
      </div>
    </div>
  );
}

export default KategoriFormModal;
