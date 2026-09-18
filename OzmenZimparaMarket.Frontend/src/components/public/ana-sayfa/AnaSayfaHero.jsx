import { Link } from "react-router";

import { usePublicSite } from "../../../contexts/PublicSiteContext";

function AnaSayfaHero() {
  const { whatsappBaglantisi } = usePublicSite();

  return (
    <section
      className="
        relative
        isolate
        min-h-[calc(100svh-76px)]
        overflow-hidden
        bg-[#050711]
      "
    >
      {/* Ana arka plan görseli */}
      <div
        className="
          absolute
          inset-0
          -z-30
        "
      >
        <img
          src="/images/hero/hero-main.png"
          alt=""
          className="
            h-full
            w-full
            object-cover
            object-center
          "
          aria-hidden="true"
        />
      </div>

      {/* Sol tarafta metin okunabilirliği */}
      <div
        className="
          absolute
          inset-0
          -z-20
          bg-gradient-to-r
          from-[#050711]
          via-[#050711]/95
          via-[42%]
          to-[#050711]/25
        "
      />

      {/* Alt karartma */}
      <div
        className="
          absolute
          inset-0
          -z-20
          bg-gradient-to-t
          from-[#050711]/95
          via-transparent
          to-[#050711]/30
        "
      />

      {/* Mor atmosfer */}
      <div
        className="
          absolute
          -left-40
          top-1/3
          -z-10
          h-[520px]
          w-[520px]
          rounded-full
          bg-purple-600/[0.13]
          blur-[150px]
        "
      />

      {/* Mavi atmosfer */}
      <div
        className="
          absolute
          right-[12%]
          top-[18%]
          -z-10
          h-[420px]
          w-[420px]
          rounded-full
          bg-blue-600/[0.10]
          blur-[150px]
        "
      />

      {/* Çok hafif grid */}
      <div
        className="
          absolute
          inset-0
          -z-10
          opacity-[0.035]
        "
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
        }}
      />

      <div
        className="
          mx-auto
          flex
          min-h-[calc(100svh-76px)]
          max-w-[1440px]
          items-center
          px-5
          py-16

          sm:px-6

          lg:px-8
          lg:py-20
        "
      >
        <div
          className="
            w-full
            max-w-[760px]
          "
        >
          {/* Eyebrow */}
          <div
            className="
              inline-flex
              items-center
              gap-3
            "
          >
            <span
              className="
                h-px
                w-10
                bg-gradient-to-r
                from-blue-500
                to-purple-500
              "
            />

            <span
              className="
                text-[11px]
                font-extrabold
                uppercase
                tracking-[0.22em]
                text-purple-300

                sm:text-xs
              "
            >
              Profesyonel Aşındırıcı Çözümler
            </span>
          </div>

          {/* Başlık */}
          <h1
            className="
              mt-7
              max-w-[760px]
              text-[42px]
              font-extrabold
              leading-[1.02]
              tracking-[-0.045em]
              text-white

              sm:text-[54px]

              lg:text-[68px]

              xl:text-[76px]
            "
          >
            Endüstriyel Zımpara
            <br />
            Çözümlerinde
            <br />
            <span
              className="
                bg-gradient-to-r
                from-[#8b5cf6]
                via-[#9b6cff]
                to-[#6f8cff]
                bg-clip-text
                text-transparent
              "
            >
              Güvenilir Tedarikçiniz
            </span>
          </h1>

          {/* Açıklama */}
          <p
            className="
              mt-7
              max-w-[650px]
              text-[15px]
              leading-7
              text-white/58

              sm:text-base
              sm:leading-8

              lg:text-[17px]
            "
          >
            Profesyonel kullanım için geniş zımpara ve aşındırıcı ürün
            yelpazesi, teknik ürün seçenekleri ve ihtiyaçlarınıza uygun
            endüstriyel yüzey işleme çözümleri.
          </p>

          {/* CTA */}
          <div
            className="
              mt-9
              flex
              flex-col
              gap-3

              sm:flex-row
              sm:items-center
            "
          >
            <Link
              to="/urunler"
              className="
                group
                inline-flex
                h-13
                items-center
                justify-center
                gap-2.5
                rounded-xl
                bg-gradient-to-r
                from-[#7446ef]
                to-[#6d4af4]
                px-6
                text-sm
                font-extrabold
                text-white
                shadow-[0_16px_45px_rgba(116,70,239,0.28)]
                transition-all
                duration-300

                hover:-translate-y-0.5
                hover:shadow-[0_20px_55px_rgba(116,70,239,0.38)]
              "
            >
              Ürünleri İncele
              <ArrowIcon />
            </Link>

            {whatsappBaglantisi ? (
              <a
                href={whatsappBaglantisi}
                target="_blank"
                rel="noreferrer"
                className="
                  inline-flex
                  h-13
                  items-center
                  justify-center
                  gap-2.5
                  rounded-xl
                  bg-[#25D366]
                  px-6
                  text-sm
                  font-extrabold
                  text-white
                  shadow-[0_16px_45px_rgba(37,211,102,0.18)]
                  transition-all
                  duration-300

                  hover:-translate-y-0.5
                  hover:bg-[#20bd5a]
                  hover:shadow-[0_20px_55px_rgba(37,211,102,0.25)]
                "
              >
                <WhatsAppIcon />
                WhatsApp'tan Teklif Al
              </a>
            ) : (
              <Link
                to="/iletisim"
                className="
                  inline-flex
                  h-13
                  items-center
                  justify-center
                  gap-2.5
                  rounded-xl
                  border
                  border-white/15
                  bg-white/[0.06]
                  px-6
                  text-sm
                  font-extrabold
                  text-white
                  backdrop-blur-md
                  transition-all

                  hover:bg-white/[0.10]
                "
              >
                Bize Ulaşın
              </Link>
            )}
          </div>

          {/* Güven noktaları */}
          <div
            className="
              mt-10
              flex
              flex-wrap
              gap-x-7
              gap-y-4
            "
          >
            <GuvenNoktasi>Profesyonel Ürün Yelpazesi</GuvenNoktasi>

            <GuvenNoktasi>Teknik Ürün Seçimi</GuvenNoktasi>

            <GuvenNoktasi>Hızlı Teklif Desteği</GuvenNoktasi>
          </div>
        </div>
      </div>

      {/* Hero alt geçiş */}
      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          bottom-0
          h-28
          bg-gradient-to-t
          from-[#050711]
          to-transparent
        "
      />
    </section>
  );
}

function GuvenNoktasi({ children }) {
  return (
    <div
      className="
        flex
        items-center
        gap-2.5
      "
    >
      <span
        className="
          flex
          h-5
          w-5
          shrink-0
          items-center
          justify-center
          rounded-full
          border
          border-purple-400/25
          bg-purple-400/[0.08]
          text-purple-300
        "
      >
        <CheckIcon />
      </span>

      <span
        className="
          text-xs
          font-semibold
          text-white/52
        "
      >
        {children}
      </span>
    </div>
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
        transition-transform
        duration-300

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

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-[18px] w-[18px]"
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

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-3 w-3"
      aria-hidden="true"
    >
      <path d="m7 12 3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default AnaSayfaHero;
