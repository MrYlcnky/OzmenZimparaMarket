import Container from "../../ui/Container";

function KullaniciSayfaBasligi({ onYeniKullanici, onSifreDegistir }) {
  return (
    <>
      <div
        className="
          border-b
          border-border
          bg-white
        "
      >
        <Container>
          <div
            className="
              flex
              flex-col
              gap-5
              py-8

              sm:flex-row
              sm:items-end
              sm:justify-between

              lg:py-10
            "
          >
            <div>
              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-sm
                "
              >
                <span
                  className="
                    font-semibold
                    text-text-muted
                  "
                >
                  Yönetim
                </span>

                <span className="text-border">/</span>

                <span
                  className="
                    font-semibold
                    text-brand-blue
                  "
                >
                  Kullanıcı Yönetimi
                </span>
              </div>

              <h1
                className="
                  mt-3
                  text-3xl
                  font-extrabold
                  tracking-tight
                  text-text-primary

                  lg:text-[38px]
                "
              >
                Kullanıcı Yönetimi
              </h1>

              <p
                className="
                  mt-3
                  max-w-2xl
                  text-sm
                  leading-6
                  text-text-secondary

                  sm:text-base
                "
              >
                Yönetim paneline erişebilen kullanıcıları oluşturun, düzenleyin,
                hesap durumlarını yönetin ve gerekli durumlarda kullanıcı
                şifrelerini sıfırlayın.
              </p>
            </div>

            <div
              className="
                flex
                flex-col
                gap-2

                sm:flex-row
                sm:items-center
              "
            >
              <button
                type="button"
                onClick={onSifreDegistir}
                className="
                  inline-flex
                  h-11
                  items-center
                  justify-center
                  gap-2
                  rounded-ui
                  border
                  border-border
                  bg-white
                  px-4
                  text-sm
                  font-bold
                  text-text-secondary
                  shadow-sm
                  transition-all

                  hover:border-brand-blue/25
                  hover:bg-brand-blue/[0.025]
                  hover:text-brand-blue
                "
              >
                <LockIcon />
                Şifremi Değiştir
              </button>

              <button
                type="button"
                onClick={onYeniKullanici}
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
                  shadow-[0_10px_25px_rgba(37,99,235,0.18)]
                  transition-all

                  hover:-translate-y-0.5
                  hover:shadow-[0_14px_30px_rgba(37,99,235,0.24)]
                "
              >
                <span
                  className="
                    text-lg
                    leading-none
                  "
                >
                  +
                </span>
                Yeni Kullanıcı
              </button>
            </div>
          </div>
        </Container>
      </div>

      <div
        className="
          h-[3px]
          bg-gradient-to-r
          from-brand-blue
          via-brand-purple
          to-transparent
        "
      />
    </>
  );
}

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <rect x="5" y="10" width="14" height="10" rx="2" />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 10V7a4 4 0 0 1 8 0v3"
      />

      <path strokeLinecap="round" d="M12 14v2" />
    </svg>
  );
}

export default KullaniciSayfaBasligi;
