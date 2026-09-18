import Button from "../../ui/Button";
import Modal from "../../ui/Modal";

import UrunOzelligiFormu from "./UrunOzelligiFormu";

function UrunOzelligiFormModal({
  open,
  onClose,
  duzenlenenUrunOzelligi,
  form,
  formHatalari,
  kaydediliyor,
  onAlanDegisti,
  onKaydet,
}) {
  const duzenlemeModu = Boolean(duzenlenenUrunOzelligi);

  async function formGonderildi(event) {
    event.preventDefault();

    if (kaydediliyor) {
      return;
    }

    await onKaydet();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      eyebrow="ÜRÜN ÖZELLİKLERİ"
      title={duzenlemeModu ? "Ürün Özelliğini Düzenle" : "Yeni Ürün Özelliği"}
      maxWidth="900px"
      closeDisabled={kaydediliyor}
      footer={
        <div
          className="
            flex
            w-full
            flex-col-reverse
            gap-3

            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <p
            className="
              text-xs
              text-text-muted
            "
          >
            <span
              className="
                font-extrabold
                text-red-500
              "
            >
              *
            </span>{" "}
            işaretli alanlar zorunludur.
          </p>

          <div
            className="
              flex
              items-center
              justify-end
              gap-2.5
            "
          >
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={kaydediliyor}
            >
              Vazgeç
            </Button>

            <Button
              type="submit"
              form="urun-ozelligi-formu"
              variant="primary"
              disabled={kaydediliyor}
            >
              {kaydediliyor
                ? "Kaydediliyor..."
                : duzenlemeModu
                  ? "Değişiklikleri Kaydet"
                  : "Ürün Özelliği Ekle"}
            </Button>
          </div>
        </div>
      }
    >
      <form id="urun-ozelligi-formu" onSubmit={formGonderildi} noValidate>
        <div
          className="
            mb-6

            rounded-xl

            border
            border-blue-100

            bg-blue-50/60

            px-4
            py-3.5
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
                mt-0.5

                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center

                rounded-lg

                bg-blue-100

                text-brand-blue
              "
            >
              <InfoIcon />
            </div>

            <div>
              <p
                className="
                  text-[13px]
                  font-extrabold
                  text-slate-800
                "
              >
                {duzenlemeModu
                  ? "Özellik ayarlarını güncelleyin"
                  : "Yeni teknik özellik oluşturun"}
              </p>

              <p
                className="
                  mt-0.5

                  text-[12px]
                  leading-5
                  text-slate-600
                "
              >
                {duzenlemeModu
                  ? "Özelliğin adını, kullanım davranışlarını ve yayın durumunu buradan düzenleyebilirsiniz."
                  : "Ürünlerde kullanılacak özelliğin adını, filtre davranışını ve teklif sepetindeki kullanımını belirleyin."}
              </p>
            </div>
          </div>
        </div>

        <UrunOzelligiFormu
          form={form}
          formHatalari={formHatalari}
          onAlanDegisti={onAlanDegisti}
          disabled={kaydediliyor}
        />
      </form>
    </Modal>
  );
}

function InfoIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />

      <path strokeLinecap="round" d="M12 11v5" />

      <path strokeLinecap="round" d="M12 8h.01" />
    </svg>
  );
}

export default UrunOzelligiFormModal;
