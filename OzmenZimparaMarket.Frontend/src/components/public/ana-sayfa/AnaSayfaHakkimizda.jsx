import { Link } from "react-router";

const avantajlar = [
  {
    id: 1,
    numara: "01",
    baslik: "Geniş Ürün Yelpazesi",
    aciklama:
      "Farklı yüzey ve uygulamalara yönelik profesyonel zımpara ve aşındırıcı seçenekleri.",
    icon: "products",
  },
  {
    id: 2,
    numara: "02",
    baslik: "Uygulamaya Özel Ürün Seçimi",
    aciklama:
      "Yüzey, malzeme ve işlem ihtiyacına göre doğru aşındırıcı çözümün belirlenmesi.",
    icon: "selection",
  },
  {
    id: 3,
    numara: "03",
    baslik: "Sektörel Çözümler",
    aciklama:
      "Mobilya, metal, çelik, paslanmaz ve otomotiv uygulamalarına yönelik ürün seçenekleri.",
    icon: "sector",
  },
  {
    id: 4,
    numara: "04",
    baslik: "Güvenilir Tedarik",
    aciklama:
      "Profesyonel işletmelerin ihtiyaçlarına yönelik düzenli ve güvenilir ürün tedariği.",
    icon: "supply",
  },
];

const sektorler = [
  {
    baslik: "Mobilya & Ahşap İşleme",
    aciklama:
      "Ham ahşap, MDF, panel ve boya öncesi yüzey hazırlama uygulamaları.",
  },
  {
    baslik: "Metal İşleme",
    aciklama:
      "Çapak alma, kaynak temizleme, yüzey hazırlama ve finisaj işlemleri.",
  },
  {
    baslik: "Çelik Kapı & Metal Mobilya",
    aciklama:
      "Yüzey düzeltme, kaynak temizleme ve boya öncesi hazırlık uygulamaları.",
  },
  {
    baslik: "Paslanmaz Çelik",
    aciklama:
      "Kaynak izi giderme, satinaj, yüzey homojenleştirme ve hassas finisaj.",
  },
  {
    baslik: "Makine & Endüstriyel Üretim",
    aciklama:
      "Parça işleme, yüzey temizleme ve üretim sonrası finisaj uygulamaları.",
  },
  {
    baslik: "Otomotiv & Boya",
    aciklama:
      "Kaporta, macun, astar, boya öncesi hazırlık ve finisaj işlemleri.",
  },
  {
    baslik: "Alüminyum & Hafif Metaller",
    aciklama: "Kontrollü aşındırma, yüzey düzeltme ve finisaj uygulamaları.",
  },
  {
    baslik: "Genel Endüstriyel Bakım",
    aciklama: "Temizleme, pas giderme, yüzey yenileme ve bakım uygulamaları.",
  },
];

function AnaSayfaHakkimizda() {
  return (
    <section
      className="
        relative
        overflow-hidden
        bg-[#f7f8fa]
        py-20

        sm:py-24
        lg:py-28
      "
    >
      {/* Arka plan */}
      <div
        className="
          pointer-events-none
          absolute
          left-[-180px]
          top-[-140px]
          h-[420px]
          w-[420px]
          rounded-full
          bg-blue-500/[0.04]
          blur-[120px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          bottom-[-200px]
          right-[-150px]
          h-[480px]
          w-[480px]
          rounded-full
          bg-purple-500/[0.05]
          blur-[130px]
        "
      />

      <div
        className="
          relative
          mx-auto
          max-w-[1320px]
          px-5

          sm:px-6
          lg:px-8
        "
      >
        {/* Üst Hakkımızda */}
        <div
          className="
            grid
            gap-12

            lg:grid-cols-[0.88fr_1.12fr]
            lg:items-end
            lg:gap-16
          "
        >
          <div>
            <div className="flex items-center gap-3">
              <span
                className="
                  h-px
                  w-9
                  bg-gradient-to-r
                  from-blue-600
                  to-purple-600
                "
              />

              <span
                className="
                  text-[10px]
                  font-extrabold
                  uppercase
                  tracking-[0.18em]
                  text-purple-600

                  sm:text-[11px]
                "
              >
                Hakkımızda
              </span>
            </div>

            <h2
              className="
                mt-5
                text-[32px]
                font-extrabold
                leading-[1.13]
                tracking-[-0.04em]
                text-zinc-950

                sm:text-[40px]
                lg:text-[46px]
              "
            >
              Profesyonel
              <span className="block">Aşındırıcı Çözümler</span>
              <span
                className="
                  mt-1
                  block
                  pb-1
                  bg-gradient-to-r
                  from-blue-600
                  via-indigo-600
                  to-purple-600
                  bg-clip-text
                  text-transparent
                "
              >
                Doğru Ürün, Güvenilir Tedarik
              </span>
            </h2>
          </div>

          <div>
            <p
              className="
                max-w-[680px]
                text-[13px]
                leading-7
                text-zinc-500

                sm:text-[15px]
                sm:leading-8
              "
            >
              Özmen Zımpara Market olarak endüstriyel yüzey işleme ihtiyaçlarına
              yönelik profesyonel zımpara ve aşındırıcı ürünler sunuyoruz.
              Farklı sektör, yüzey ve uygulama ihtiyaçlarına uygun ürün
              seçeneklerini doğru ürün seçimi ve güvenilir tedarik anlayışıyla
              müşterilerimizle buluşturuyoruz.
            </p>

            <Link
              to="/hakkimizda"
              className="
                group
                mt-6
                inline-flex
                h-12
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#0b0e18]
                px-5
                text-[11px]
                font-extrabold
                text-white
                shadow-[0_10px_30px_rgba(15,23,42,0.10)]
                transition-all
                duration-300

                hover:-translate-y-0.5
                hover:bg-[#151927]
                hover:shadow-[0_14px_35px_rgba(15,23,42,0.16)]
              "
            >
              Hakkımızda Daha Fazla
              <ArrowIcon />
            </Link>
          </div>
        </div>

        {/* 4 ana özellik */}
        <div
          className="
            mt-14
            grid
            gap-4

            sm:grid-cols-2
            lg:grid-cols-4
          "
        >
          {avantajlar.map((avantaj) => (
            <AvantajKarti key={avantaj.id} avantaj={avantaj} />
          ))}
        </div>

        {/* Çalışma anlayışımız */}
        <div
          className="
            relative
            mt-16
            overflow-hidden
            rounded-[30px]
            bg-[#080b14]
            px-6
            py-10
            text-white
            shadow-[0_24px_70px_rgba(15,23,42,0.16)]

            sm:px-8
            sm:py-12

            lg:px-12
            lg:py-14
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              right-[-100px]
              top-[-100px]
              h-80
              w-80
              rounded-full
              bg-purple-600/10
              blur-[90px]
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              bottom-[-120px]
              left-[25%]
              h-72
              w-72
              rounded-full
              bg-blue-600/[0.07]
              blur-[100px]
            "
          />

          <div
            className="
              relative
              grid
              gap-8

              lg:grid-cols-[0.7fr_1.3fr]
              lg:items-start
            "
          >
            <div>
              <span
                className="
                  text-[9px]
                  font-extrabold
                  uppercase
                  tracking-[0.16em]
                  text-purple-400
                "
              >
                Çalışma Anlayışımız
              </span>

              <h3
                className="
                  mt-4
                  text-[26px]
                  font-extrabold
                  leading-[1.15]
                  tracking-[-0.035em]
                  text-white

                  sm:text-[31px]
                "
              >
                Her Uygulamanın
                <span
                  className="
                    block
                    pb-1
                    bg-gradient-to-r
                    from-blue-400
                    to-purple-400
                    bg-clip-text
                    text-transparent
                  "
                >
                  İhtiyacı Farklıdır
                </span>
              </h3>
            </div>

            <p
              className="
                max-w-[720px]
                text-[12px]
                leading-7
                text-white/48

                sm:text-[14px]
                sm:leading-8
              "
            >
              Her uygulamanın farklı bir yüzey, malzeme ve performans ihtiyacı
              olduğunun bilinciyle hareket ediyoruz. Ürünün yalnızca aşındırma
              kabiliyetini değil; kullanılacağı malzemeyi, işlem türünü, yüzey
              beklentisini ve çalışma koşullarını da dikkate alarak doğru ürün
              seçimini önemsiyoruz.
            </p>
          </div>
        </div>

        {/* Sektörel çözümler */}
        <div className="mt-16">
          <div
            className="
              grid
              gap-6

              lg:grid-cols-[0.72fr_1.28fr]
              lg:items-end
            "
          >
            <div>
              <span
                className="
                  text-[10px]
                  font-extrabold
                  uppercase
                  tracking-[0.16em]
                  text-purple-600
                "
              >
                Sektörel Çözümler
              </span>

              <h3
                className="
                  mt-4
                  text-[28px]
                  font-extrabold
                  leading-[1.15]
                  tracking-[-0.035em]
                  text-zinc-950

                  sm:text-[34px]
                "
              >
                Farklı Sektör ve Yüzeylere
                <span
                  className="
                    block
                    pb-1
                    bg-gradient-to-r
                    from-blue-600
                    to-purple-600
                    bg-clip-text
                    text-transparent
                  "
                >
                  Uygun Çözümler
                </span>
              </h3>
            </div>

            <p
              className="
                max-w-[720px]
                text-[13px]
                leading-7
                text-zinc-500

                lg:justify-self-end
              "
            >
              Mobilyadan metal işlemeye, çelik ve paslanmaz yüzeylerden otomotiv
              uygulamalarına kadar farklı sektörlerin yüzey işleme ihtiyaçlarına
              yönelik profesyonel zımpara ve aşındırıcı ürünler sunuyoruz.
            </p>
          </div>

          <div
            className="
              mt-8
              grid
              gap-3

              sm:grid-cols-2
              lg:grid-cols-4
            "
          >
            {sektorler.map((sektor, index) => (
              <SektorKarti key={sektor.baslik} sektor={sektor} index={index} />
            ))}
          </div>
        </div>

        {/* Alt slogan */}
        <div
          className="
    mt-16
    flex
    flex-col
    items-center
    justify-center
    border-t
    border-zinc-200
    pt-10
    text-center

    sm:pt-12
  "
        >
          <img
            src="/logo/ozmen-zimpara-market-hakkimizda.png"
            alt="Özmen Zımpara Market"
            className="
      h-auto
      w-[300px]
      max-w-full
      object-contain

      sm:w-[380px]
      lg:w-[430px]
    "
          />

          <p
            className="
            ml-9
      mt-4
      text-[17px]
      font-extrabold
      tracking-[0.03em]
      text-zinc-950

      sm:text-[19px]
      lg:text-[20px]
    "
          >
            KALİTE
            <span className="mx-2 text-purple-500">•</span>
            GÜVEN
            <span className="mx-2 text-purple-500">•</span>
            PERFORMANS
          </p>
        </div>
      </div>
    </section>
  );
}

function AvantajKarti({ avantaj }) {
  return (
    <article
      className="
        group
        relative
        overflow-hidden
        rounded-[22px]
        border
        border-zinc-200/80
        bg-white
        p-5
        shadow-[0_12px_35px_rgba(15,23,42,0.045)]
        transition-all
        duration-300

        hover:-translate-y-1
        hover:border-purple-200
        hover:shadow-[0_18px_45px_rgba(15,23,42,0.075)]
      "
    >
      <div
        className="
          pointer-events-none
          absolute
          right-[-40px]
          top-[-40px]
          h-32
          w-32
          rounded-full
          bg-purple-500/[0.045]
          blur-[45px]
        "
      />

      <div
        className="
          relative
          flex
          items-start
          justify-between
          gap-4
        "
      >
        <div
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            bg-gradient-to-br
            from-blue-50
            to-purple-100
            text-purple-600
          "
        >
          <AvantajIcon type={avantaj.icon} />
        </div>

        <span
          className="
            text-[16px]
            font-light
            text-zinc-200
          "
        >
          {avantaj.numara}
        </span>
      </div>

      <h3
        className="
          relative
          mt-5
          text-[14px]
          font-extrabold
          leading-5
          tracking-[-0.02em]
          text-zinc-950
        "
      >
        {avantaj.baslik}
      </h3>

      <p
        className="
          relative
          mt-2.5
          text-[10px]
          leading-5
          text-zinc-500
        "
      >
        {avantaj.aciklama}
      </p>
    </article>
  );
}

function SektorKarti({ sektor, index }) {
  return (
    <article
      className={`
        group
        rounded-[20px]
        border
        p-5
        transition-all
        duration-300

        ${
          index % 2 === 0
            ? "border-zinc-200 bg-white"
            : "border-zinc-200/80 bg-zinc-50"
        }

        hover:-translate-y-0.5
        hover:border-purple-200
        hover:bg-white
        hover:shadow-[0_14px_35px_rgba(15,23,42,0.05)]
      `}
    >
      <div className="flex items-start gap-3">
        <span
          className="
            mt-1
            h-1.5
            w-1.5
            shrink-0
            rounded-full
            bg-gradient-to-r
            from-blue-500
            to-purple-500
          "
        />

        <div>
          <h4
            className="
              text-[11px]
              font-extrabold
              leading-5
              text-zinc-900
            "
          >
            {sektor.baslik}
          </h4>

          <p
            className="
              mt-1.5
              text-[9px]
              leading-[1.7]
              text-zinc-500
            "
          >
            {sektor.aciklama}
          </p>
        </div>
      </div>
    </article>
  );
}

function AvantajIcon({ type }) {
  if (type === "products") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        className="h-4 w-4"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="7" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    );
  }

  if (type === "selection") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        className="h-4 w-4"
        aria-hidden="true"
      >
        <path d="m5 12 4 4L19 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type === "sector") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        className="h-4 w-4"
        aria-hidden="true"
      >
        <path
          d="M4 20V10l5 3V9l5 3V7l6 3v10H4Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="M4 17h16M6 17V9h12v8M8 9V6h8v3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle cx="8" cy="19" r="1.5" />
      <circle cx="16" cy="19" r="1.5" />
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

export default AnaSayfaHakkimizda;
