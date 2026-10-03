import { Link } from "react-router";

import { usePublicSite } from "../../../contexts/PublicSiteContext";

function AnaSayfaIletisimCTA() {
  const { whatsappBaglantisi } = usePublicSite();

  return (
    <section
      className="
        relative
        overflow-hidden
        bg-[#f7f8fa]
        px-5
        pb-16
        pt-0

        sm:px-6
        sm:pb-20

        lg:px-8
        lg:pb-24
      "
    >
      <div
        className="
          relative
          mx-auto
          max-w-[1320px]
          overflow-hidden
          rounded-[30px]
          border
          border-white/[0.05]
          bg-[#070a13]
          px-6
          py-10
          shadow-[0_26px_70px_rgba(15,23,42,0.16)]

          sm:px-9
          sm:py-11

          lg:px-12
          lg:py-12
        "
      >
        {/* Arka plan ışıkları */}
        <div
          className="
            pointer-events-none
            absolute
            right-[-100px]
            top-[-150px]
            h-[380px]
            w-[380px]
            rounded-full
            bg-purple-600/[0.14]
            blur-[120px]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            bottom-[-170px]
            left-[18%]
            h-[360px]
            w-[360px]
            rounded-full
            bg-blue-600/[0.09]
            blur-[120px]
          "
        />

        {/* Grid dokusu */}
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            opacity-[0.035]
            [background-image:linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.8)_1px,transparent_1px)]
            [background-size:48px_48px]
          "
        />

        <div
          className="
            relative
            grid
            min-w-0
            gap-8

            lg:grid-cols-[1fr_auto]
            lg:items-center
            lg:gap-14
          "
        >
          {/* Sol */}
          <div className="min-w-0 max-w-[720px]">
            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <span
                className="
                  h-px
                  w-9
                  bg-gradient-to-r
                  from-blue-400
                  to-purple-500
                "
              />

              <span
                className="
                  text-[9px]
                  font-extrabold
                  uppercase
                  tracking-[0.18em]
                  text-purple-400

                  sm:text-[10px]
                "
              >
                Bizimle İletişime Geçin
              </span>
            </div>

            <h2
              className="
                mt-5
                text-[30px]
                font-extrabold
                leading-[1.13]
                tracking-[-0.04em]
                text-white

                sm:text-[38px]
                lg:text-[42px]
              "
            >
              Doğru Aşındırıcı Ürünü
              <span
                className="
                  mt-1
                  block
                  pb-1
                  bg-gradient-to-r
                  from-blue-400
                  via-indigo-400
                  to-purple-400
                  bg-clip-text
                  text-transparent
                "
              >
                Birlikte Belirleyelim
              </span>
            </h2>

            <p
              className="
                mt-4
                max-w-[660px]
                text-[12px]
                leading-6
                text-white/45

                sm:text-[13px]
                sm:leading-7
              "
            >
              Ürün, yüzey veya uygulamanız için uygun zımpara ve aşındırıcı
              çözümü birlikte değerlendirelim.
            </p>
          </div>

          {/* Sağ aksiyonlar */}
          <div
            className="
              flex
              w-full
              flex-col
              gap-3

              sm:w-auto
              sm:flex-row

              lg:min-w-[250px]
              lg:flex-col
            "
          >
            {whatsappBaglantisi && (
              <a
                href={whatsappBaglantisi}
                target="_blank"
                rel="noreferrer"
                className="
                  group
                  inline-flex
                  min-h-[52px]
                  items-center
                  justify-center
                  gap-2.5
                  rounded-2xl
                  bg-[#25D366]
                  px-6
                  text-[11px]
                  font-extrabold
                  text-white
                  shadow-[0_14px_34px_rgba(37,211,102,0.18)]
                  transition-all
                  duration-300

                  hover:-translate-y-0.5
                  hover:bg-[#20bd5a]
                  hover:shadow-[0_18px_42px_rgba(37,211,102,0.25)]
                "
              >
                <WhatsAppIcon />
                WhatsApp ile İletişime Geç
                <ExternalArrowIcon />
              </a>
            )}

            <Link
              to="/urunler"
              className="
                group
                inline-flex
                min-h-[52px]
                items-center
                justify-center
                gap-2.5
                rounded-2xl
                border
                border-white/[0.10]
                bg-white/[0.035]
                px-6
                text-[11px]
                font-extrabold
                text-white
                transition-all
                duration-300

                hover:border-purple-400/25
                hover:bg-white/[0.07]
              "
            >
              Ürünleri İncele
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5 shrink-0"
      aria-hidden="true"
    >
      <path
        d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4A8 8 0 1 1 20 11.5Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path d="M9 8.5c.5 2.5 2 4 4.5 5" strokeLinecap="round" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="
        h-4
        w-4
        shrink-0
        transition-transform
        duration-200

        group-hover:translate-x-1
      "
      aria-hidden="true"
    >
      <path
        d="M5 12h14M13 6l6 6-6 6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ExternalArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="
        h-4
        w-4
        shrink-0
        transition-transform
        duration-200

        group-hover:translate-x-0.5
        group-hover:-translate-y-0.5
      "
      aria-hidden="true"
    >
      <path
        d="M7 17 17 7M9 7h8v8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default AnaSayfaIletisimCTA;
