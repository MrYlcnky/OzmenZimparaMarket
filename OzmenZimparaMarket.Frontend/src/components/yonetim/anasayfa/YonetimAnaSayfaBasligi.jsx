import Container from "../../ui/Container";

function YonetimAnaSayfaBasligi({
  kullaniciAdi,
  yenileniyorMu = false,
  onYenile,
}) {
  return (
    <>
      <div className="border-b border-border bg-white">
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
                <span className="font-semibold text-text-muted">Yönetim</span>

                <span className="text-border">/</span>

                <span className="font-semibold text-brand-blue">Ana Sayfa</span>
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
                Yönetim Paneli
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
                Hoş geldiniz,{" "}
                <strong className="font-extrabold text-text-primary">
                  {kullaniciAdi}
                </strong>
                . Özmen Zımpara Market katalog ve yönetim sisteminin genel
                durumunu buradan takip edebilirsiniz.
              </p>
            </div>

            <button
              type="button"
              disabled={yenileniyorMu}
              onClick={onYenile}
              className="
                inline-flex
                h-11
                items-center
                justify-center
                gap-2
                self-start
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

                disabled:cursor-not-allowed
                disabled:opacity-60

                sm:self-auto
              "
            >
              <RefreshIcon loading={yenileniyorMu} />

              {yenileniyorMu ? "Yenileniyor..." : "Verileri Yenile"}
            </button>
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

function RefreshIcon({ loading }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={`
        h-4
        w-4

        ${loading ? "animate-spin" : ""}
      `}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 7v5h-5M4 17v-5h5"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.1 9a7 7 0 0 1 11.7-2L20 12M4 12l2.2 5a7 7 0 0 0 11.7-2"
      />
    </svg>
  );
}

export default YonetimAnaSayfaBasligi;
