function FirmaFormu({
  form,
  onChange,
  onSubmit,
  kaydediliyor,
  hataMesaji,
  basariMesaji,
  alanHatalari,
}) {
  function alanHatasiGetir(alanAdi) {
    if (!alanHatalari) {
      return null;
    }

    const eslesenAnahtar = Object.keys(alanHatalari).find(
      (anahtar) => anahtar.toLowerCase() === alanAdi.toLowerCase(),
    );

    if (!eslesenAnahtar) {
      return null;
    }

    const hatalar = alanHatalari[eslesenAnahtar];

    if (Array.isArray(hatalar)) {
      return hatalar[0] ?? null;
    }

    if (typeof hatalar === "string") {
      return hatalar;
    }

    return null;
  }

  return (
    <form onSubmit={onSubmit}>
      {/* Genel işlem mesajları */}
      {(hataMesaji || basariMesaji) && (
        <div className="mb-6 space-y-3">
          {hataMesaji && (
            <div
              role="alert"
              className="
                flex items-start gap-3
                rounded-ui-lg
                border border-danger/20
                bg-danger/[0.06]
                px-4 py-4
              "
            >
              <div
                className="
                  mt-0.5 flex h-9 w-9 shrink-0
                  items-center justify-center
                  rounded-full
                  bg-danger/10
                  text-danger
                "
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v4m0 4h.01M10.3 3.8 2.5 18a2 2 0 0 0 1.7 3h15.6a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0Z"
                  />
                </svg>
              </div>

              <div className="min-w-0">
                <p className="text-sm font-bold text-danger">
                  İşlem tamamlanamadı
                </p>

                <p className="mt-1 text-sm leading-6 text-danger/80">
                  {hataMesaji}
                </p>
              </div>
            </div>
          )}

          {basariMesaji && (
            <div
              role="status"
              className="
                flex items-start gap-3
                rounded-ui-lg
                border border-success/20
                bg-success/[0.06]
                px-4 py-4
              "
            >
              <div
                className="
                  mt-0.5 flex h-9 w-9 shrink-0
                  items-center justify-center
                  rounded-full
                  bg-success/10
                  text-success
                "
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m6 12 4 4 8-8"
                  />
                </svg>
              </div>

              <div className="min-w-0">
                <p className="text-sm font-bold text-success">İşlem başarılı</p>

                <p className="mt-1 text-sm leading-6 text-success/80">
                  {basariMesaji}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="space-y-6">
        {/* Genel Bilgiler */}
        <FormBolumu
          baslik="Genel Bilgiler"
          aciklama="Firmanın temel kurumsal bilgisini yönetin."
          icon={<BuildingIcon />}
        >
          <InputAlani
            id="sirketAdi"
            label="Şirket Adı"
            value={form.sirketAdi}
            onChange={onChange}
            disabled={kaydediliyor}
            hata={alanHatasiGetir("SirketAdi")}
            maxLength={200}
            required
          />
        </FormBolumu>

        {/* Kurumsal İçerik */}
        <FormBolumu
          baslik="Kurumsal İçerik"
          aciklama="Web sitesinde gösterilecek kurumsal metinleri düzenleyin."
          icon={<DocumentIcon />}
        >
          <div className="grid gap-6 xl:grid-cols-2">
            <MetinAlani
              id="hakkimizda"
              label="Hakkımızda"
              value={form.hakkimizda}
              onChange={onChange}
              disabled={kaydediliyor}
              hata={alanHatasiGetir("Hakkimizda")}
              required
            />

            <MetinAlani
              id="vizyonumuz"
              label="Vizyonumuz"
              value={form.vizyonumuz}
              onChange={onChange}
              disabled={kaydediliyor}
              hata={alanHatasiGetir("Vizyonumuz")}
              required
            />

            <MetinAlani
              id="misyonumuz"
              label="Misyonumuz"
              value={form.misyonumuz}
              onChange={onChange}
              disabled={kaydediliyor}
              hata={alanHatasiGetir("Misyonumuz")}
              required
            />

            <MetinAlani
              id="stratejimiz"
              label="Stratejimiz"
              value={form.stratejimiz}
              onChange={onChange}
              disabled={kaydediliyor}
              hata={alanHatasiGetir("Stratejimiz")}
              required
            />

            <MetinAlani
              id="kalitePolitikamiz"
              label="Kalite Politikamız"
              value={form.kalitePolitikamiz}
              onChange={onChange}
              disabled={kaydediliyor}
              hata={alanHatasiGetir("KalitePolitikamiz")}
              required
            />

            <MetinAlani
              id="kvkk"
              label="KVKK"
              value={form.kvkk}
              onChange={onChange}
              disabled={kaydediliyor}
              hata={alanHatasiGetir("Kvkk")}
              rows={7}
              required
            />
          </div>
        </FormBolumu>

        {/* İletişim */}
        <FormBolumu
          baslik="İletişim Bilgileri"
          aciklama="Müşterilerin firmaya ulaşmak için kullanacağı iletişim bilgilerini yönetin."
          icon={<ContactIcon />}
        >
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <InputAlani
              id="iletisimNo"
              label="İletişim Numarası"
              value={form.iletisimNo}
              onChange={onChange}
              disabled={kaydediliyor}
              hata={alanHatasiGetir("IletisimNo")}
              maxLength={30}
              required
            />

            <InputAlani
              id="whatsappNo"
              label="WhatsApp Numarası"
              value={form.whatsappNo}
              onChange={onChange}
              disabled={kaydediliyor}
              hata={alanHatasiGetir("WhatsappNo")}
              maxLength={15}
              aciklama="Ülke kodu dahil yalnızca rakam girin. Örnek: 905321234567"
              required
            />

            <InputAlani
              id="eposta"
              label="E-posta Adresi"
              type="email"
              value={form.eposta}
              onChange={onChange}
              disabled={kaydediliyor}
              hata={alanHatasiGetir("Eposta")}
              maxLength={200}
              required
            />
          </div>
        </FormBolumu>

        {/* Adres ve Konum */}
        <FormBolumu
          baslik="Adres ve Konum"
          aciklama="Firma adresi ve Google Haritalar bilgilerini yönetin."
          icon={<LocationIcon />}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <InputAlani
              id="il"
              label="İl"
              value={form.il}
              onChange={onChange}
              disabled={kaydediliyor}
              hata={alanHatasiGetir("Il")}
              maxLength={100}
              required
            />

            <InputAlani
              id="ilce"
              label="İlçe"
              value={form.ilce}
              onChange={onChange}
              disabled={kaydediliyor}
              hata={alanHatasiGetir("Ilce")}
              maxLength={100}
              required
            />

            <div className="md:col-span-2">
              <MetinAlani
                id="acikAdres"
                label="Açık Adres"
                value={form.acikAdres}
                onChange={onChange}
                disabled={kaydediliyor}
                hata={alanHatasiGetir("AcikAdres")}
                rows={4}
                maxLength={1000}
                required
              />
            </div>
          </div>

          <div className="my-7 border-t border-border" />

          <div className="grid gap-5">
            <InputAlani
              id="googleHaritaBaglantisi"
              label="Google Haritalar Bağlantısı"
              value={form.googleHaritaBaglantisi}
              onChange={onChange}
              disabled={kaydediliyor}
              hata={alanHatasiGetir("GoogleHaritaBaglantisi")}
              maxLength={2000}
              aciklama="Kullanıcıyı Google Haritalar üzerindeki firma konumuna yönlendiren bağlantı."
            />

            <MetinAlani
              id="googleHaritaGommeBaglantisi"
              label="Google Haritalar Gömme Bağlantısı"
              value={form.googleHaritaGommeBaglantisi}
              onChange={onChange}
              disabled={kaydediliyor}
              hata={alanHatasiGetir("GoogleHaritaGommeBaglantisi")}
              rows={4}
              maxLength={4000}
              aciklama="Web sitesinde haritanın gömülü olarak gösterilmesi için kullanılacak bağlantı."
            />
          </div>
        </FormBolumu>
      </div>

      {/* Sticky kaydet alanı */}
      <div
        className="
          sticky bottom-0 z-20
          -mx-4 mt-8
          border-t border-border
          bg-white/95 px-4 py-4
          shadow-[0_-12px_35px_rgba(24,24,27,0.06)]
          backdrop-blur-xl
          sm:mx-0
          sm:rounded-ui-lg
          sm:border
        "
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold text-text-primary">
              Firma bilgileri
            </p>

            <p className="mt-0.5 text-xs text-text-muted">
              Değişikliklerin web sitesine yansıması için kaydetmeniz gerekir.
            </p>
          </div>

          <button
            type="submit"
            disabled={kaydediliyor}
            className="
              inline-flex h-11
              items-center justify-center
              gap-2 rounded-ui
              bg-gradient-to-r
              from-brand-blue
              to-brand-purple
              px-6
              text-sm font-bold
              text-white
              shadow-[0_10px_25px_rgba(37,99,235,0.18)]
              transition-all duration-200
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
                  h-4 w-4 animate-spin
                  rounded-full
                  border-2 border-white/30
                  border-t-white
                "
              />
            )}

            {kaydediliyor ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
          </button>
        </div>
      </div>
    </form>
  );
}

function FormBolumu({ baslik, aciklama, icon, children }) {
  return (
    <section
      className="
        overflow-hidden
        rounded-[18px]
        border border-border
        bg-white
        shadow-[0_4px_22px_rgba(24,24,27,0.035)]
      "
    >
      <div
        className="
          flex items-start gap-4
          border-b border-border
          bg-gradient-to-r
          from-surface-soft
          to-white
          px-5 py-5
          sm:px-6
        "
      >
        <div
          className="
            flex h-10 w-10 shrink-0
            items-center justify-center
            rounded-ui
            bg-gradient-to-br
            from-brand-blue/10
            to-brand-purple/10
            text-brand-blue
          "
        >
          {icon}
        </div>

        <div>
          <h2 className="text-base font-extrabold text-text-primary sm:text-lg">
            {baslik}
          </h2>

          <p className="mt-1 text-sm leading-5 text-text-muted">{aciklama}</p>
        </div>
      </div>

      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

function InputAlani({
  id,
  label,
  type = "text",
  value,
  onChange,
  disabled,
  hata,
  maxLength,
  aciklama,
  required = false,
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="
          flex items-center gap-1
          text-[13px] font-bold
          text-text-primary
        "
      >
        {label}

        {required && <span className="text-danger">*</span>}
      </label>

      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        maxLength={maxLength}
        className={`
          mt-2.5 h-11 w-full
          rounded-ui border
          px-3.5
          text-sm text-text-primary
          outline-none
          transition-all duration-200
          placeholder:text-text-muted
          disabled:cursor-not-allowed
          disabled:opacity-60
          ${
            hata
              ? "border-danger/60 bg-danger/[0.025] focus:border-danger focus:ring-4 focus:ring-danger/10"
              : "border-border bg-[#fafafa] hover:border-[#d4d4d8] focus:border-brand-blue focus:bg-white focus:ring-4 focus:ring-brand-blue/10"
          }
        `}
      />

      {aciklama && !hata && (
        <p className="mt-2 text-xs leading-5 text-text-muted">{aciklama}</p>
      )}

      {hata && <p className="mt-2 text-xs font-semibold text-danger">{hata}</p>}
    </div>
  );
}

function MetinAlani({
  id,
  label,
  value,
  onChange,
  disabled,
  hata,
  rows = 6,
  maxLength,
  aciklama,
  required = false,
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="
          flex items-center gap-1
          text-[13px] font-bold
          text-text-primary
        "
      >
        {label}

        {required && <span className="text-danger">*</span>}
      </label>

      <textarea
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        className={`
          mt-2.5 w-full
          resize-y rounded-ui
          border px-3.5 py-3
          text-sm leading-6
          text-text-primary
          outline-none
          transition-all duration-200
          disabled:cursor-not-allowed
          disabled:opacity-60
          ${
            hata
              ? "border-danger/60 bg-danger/[0.025] focus:border-danger focus:ring-4 focus:ring-danger/10"
              : "border-border bg-[#fafafa] hover:border-[#d4d4d8] focus:border-brand-blue focus:bg-white focus:ring-4 focus:ring-brand-blue/10"
          }
        `}
      />

      {aciklama && !hata && (
        <p className="mt-2 text-xs leading-5 text-text-muted">{aciklama}</p>
      )}

      {hata && <p className="mt-2 text-xs font-semibold text-danger">{hata}</p>}
    </div>
  );
}

function BuildingIcon() {
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
        d="M4 21V5l8-2v18M12 8h8v13M8 8h.01M8 12h.01M8 16h.01M16 12h.01M16 16h.01M3 21h18"
      />
    </svg>
  );
}

function DocumentIcon() {
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
        d="M7 3h7l4 4v14H7V3Zm7 0v5h5M10 12h5M10 16h5"
      />
    </svg>
  );
}

function ContactIcon() {
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
        d="M4 5h16v14H4V5Zm0 1 8 7 8-7"
      />
    </svg>
  );
}

function LocationIcon() {
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
        d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"
      />

      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export default FirmaFormu;
