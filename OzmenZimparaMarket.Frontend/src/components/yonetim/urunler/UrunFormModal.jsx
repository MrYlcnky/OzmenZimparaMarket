import Modal from "../../ui/Modal";

import UrunSeoAlani from "./UrunSeoAlani";
import UrunTeknikOzellikler from "./UrunTeknikOzellikler";
import UrunTemelBilgiler from "./UrunTemelBilgiler";
import UrunYayinAyarlari from "./UrunYayinAyarlari";
import UrunGorselAlani from "./UrunGorselAlani";

function UrunFormModal({
  open,
  mode = "yeni",

  form,
  formHatalari = {},

  kategoriSecenekleri = [],
  urunDetayTanimlari = [],

  loading = false,
  saving = false,

  onClose,
  onFieldChange,

  onTeknikDetayEkle,
  onTeknikDetayDegistir,
  onTeknikDetaySil,

  onSave,
}) {
  const duzenlemeMi = mode === "duzenle";

  function formuGonder(event) {
    event.preventDefault();

    if (loading || saving) {
      return;
    }

    onSave?.();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      eyebrow="Ürün Yönetimi"
      title={duzenlemeMi ? "Ürünü Düzenle" : "Yeni Ürün"}
      maxWidth="1100px"
      closeDisabled={loading || saving}
      footer={
        <div className="flex w-full items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading || saving}
            className="
              inline-flex
              h-11
              items-center
              justify-center
              rounded-ui
              border border-border
              bg-white
              px-5
              text-sm
              font-bold
              text-text-secondary
              transition

              hover:border-slate-300
              hover:bg-surface-soft

              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            Vazgeç
          </button>

          <button
            type="submit"
            form="urun-formu"
            disabled={loading || saving}
            className="
              inline-flex
              h-11
              min-w-[145px]
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

              shadow-[0_10px_25px_rgba(37,99,235,0.18)]

              transition-all

              hover:-translate-y-0.5
              hover:shadow-[0_14px_30px_rgba(37,99,235,0.24)]

              disabled:cursor-not-allowed
              disabled:opacity-60
              disabled:hover:translate-y-0
            "
          >
            {saving && <LoadingIcon />}

            {saving
              ? "Kaydediliyor..."
              : duzenlemeMi
                ? "Değişiklikleri Kaydet"
                : "Ürünü Kaydet"}
          </button>
        </div>
      }
    >
      {loading ? (
        <FormYukleniyor />
      ) : (
        <form id="urun-formu" onSubmit={formuGonder} className="space-y-6">
          <FormBolumu
            baslik="Temel Bilgiler"
            aciklama="Ürünün katalogda kullanılacak temel bilgilerini tanımlayın."
          >
            <UrunTemelBilgiler
              form={form}
              formHatalari={formHatalari}
              kategoriSecenekleri={kategoriSecenekleri}
              onFieldChange={onFieldChange}
            />
          </FormBolumu>

          <FormBolumu
            baslik="Ürün Görseli"
            aciklama="Ürünün katalogda gösterilecek ana görselini belirleyin."
          >
            <UrunGorselAlani
              gorselYolu={form.gorselYolu}
              hata={formHatalari.gorselYolu}
              disabled={loading || saving}
              onChange={(value) => onFieldChange("gorselYolu", value)}
            />
          </FormBolumu>

          <FormBolumu
            baslik="Teknik Özellikler"
            aciklama="Ürüne ait ölçü, kum türü, kullanım alanı ve diğer teknik değerleri tanımlayın."
          >
            <UrunTeknikOzellikler
              teknikDetaylar={form.teknikDetaylar}
              urunDetayTanimlari={urunDetayTanimlari}
              formHatalari={formHatalari}
              onEkle={onTeknikDetayEkle}
              onDegistir={onTeknikDetayDegistir}
              onSil={onTeknikDetaySil}
            />
          </FormBolumu>

          <FormBolumu
            baslik="Detaylı Açıklama"
            aciklama="Ürünün kullanım alanlarını ve açıklayıcı teknik içeriğini yazın."
          >
            <div>
              <textarea
                value={form.detayliAciklama ?? ""}
                onChange={(event) =>
                  onFieldChange("detayliAciklama", event.target.value)
                }
                rows={8}
                placeholder="Ürün hakkında detaylı açıklama..."
                className="
                  w-full
                  resize-y
                  rounded-ui
                  border border-border
                  bg-white
                  px-4 py-3
                  text-sm
                  leading-7
                  text-text-primary
                  outline-none
                  transition

                  placeholder:text-text-muted

                  hover:border-slate-300

                  focus:border-brand-blue
                  focus:ring-4
                  focus:ring-brand-blue/10
                "
              />

              <AlanHatasi hata={formHatalari.detayliAciklama} />
            </div>
          </FormBolumu>

          <FormBolumu
            baslik="SEO Bilgileri"
            aciklama="Ürünün arama motorlarında kullanılacak bilgilerini yönetin."
          >
            <UrunSeoAlani
              form={form}
              formHatalari={formHatalari}
              onFieldChange={onFieldChange}
            />
          </FormBolumu>

          <FormBolumu
            baslik="Yayın Ayarları"
            aciklama="Ürünün katalog görünürlüğünü ve sıralamasını belirleyin."
          >
            <UrunYayinAyarlari
              form={form}
              formHatalari={formHatalari}
              onFieldChange={onFieldChange}
            />
          </FormBolumu>
        </form>
      )}
    </Modal>
  );
}

function FormBolumu({ baslik, aciklama, children }) {
  return (
    <section
      className="
        rounded-2xl
        border border-border
        bg-white
        p-5
        sm:p-6
      "
    >
      <div
        className="
          mb-5
          border-b border-border
          pb-4
        "
      >
        <h3
          className="
            text-base
            font-extrabold
            text-text-primary
          "
        >
          {baslik}
        </h3>

        <p
          className="
            mt-1
            text-xs
            leading-5
            text-text-muted
          "
        >
          {aciklama}
        </p>
      </div>

      {children}
    </section>
  );
}

function AlanHatasi({ hata }) {
  if (!hata) {
    return null;
  }

  return (
    <p
      className="
        mt-1.5
        text-xs
        font-semibold
        text-red-600
      "
    >
      {hata}
    </p>
  );
}

function FormYukleniyor() {
  return (
    <div
      className="
        flex
        min-h-[420px]
        flex-col
        items-center
        justify-center
      "
    >
      <div
        className="
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
          font-bold
          text-text-secondary
        "
      >
        Ürün bilgileri yükleniyor...
      </p>
    </div>
  );
}

function LoadingIcon() {
  return (
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
      />
    </svg>
  );
}

export default UrunFormModal;
