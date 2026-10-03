import { Link } from "react-router";
const kullanimAlanlari = [
  {
    id: 1,
    baslik: "Metal İşleme",
    aciklama:
      "Çapak alma, kaynak temizleme, yüzey hazırlama ve finisaj işlemleri için yüksek performanslı profesyonel aşındırıcı çözümler.",
    icon: "metal",
  },
  {
    id: 2,
    baslik: "Paslanmaz Çelik",
    aciklama:
      "Kaynak izi giderme, yüzey düzeltme, satinaj ve hassas finisaj uygulamaları için kontrollü aşındırma çözümleri.",
    icon: "steel",
  },
  {
    id: 3,
    baslik: "Ahşap İşleme",
    aciklama:
      "Ham yüzey hazırlığından ara zımparalama ve son kat öncesi finiş işlemlerine kadar profesyonel zımpara çözümleri.",
    icon: "wood",
  },
  {
    id: 4,
    baslik: "Otomotiv & Boya",
    aciklama:
      "Kaporta, macun, astar ve boya yüzeylerinde hazırlık, düzeltme ve finisaj işlemleri için profesyonel aşındırıcı çözümler.",
    icon: "automotive",
  },
];

function AnaSayfaKullanimAlanlari() {
  return (
    <section
      className="
    relative
    isolate
    w-full
    max-w-full
    overflow-hidden
    bg-[#050711]
    py-20

    sm:py-24
    lg:py-28
  "
    >
      {/* Arka plan ışıkları */}
      <div
        className="
          pointer-events-none
          absolute
          left-[-180px]
          top-[10%]
          h-[420px]
          w-[420px]
          rounded-full
          bg-blue-600/[0.07]
          blur-[120px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          bottom-[-180px]
          right-[-120px]
          h-[480px]
          w-[480px]
          rounded-full
          bg-purple-600/[0.09]
          blur-[130px]
        "
      />

      {/* Grid arka plan */}
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
          mx-auto
          max-w-[1320px]
          px-5

          sm:px-6
          lg:px-8
        "
      >
        {/* Başlık alanı */}
        <div
          className="
            flex
            flex-col
            gap-7

            lg:flex-row
            lg:items-end
            lg:justify-between
          "
        >
          <div className="max-w-[760px]">
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
                  text-[10px]
                  font-extrabold
                  uppercase
                  tracking-[0.18em]
                  text-purple-400

                  sm:text-[11px]
                "
              >
                Kullanım Alanları
              </span>
            </div>

            <h2
              className="
    mt-5
    text-[32px]
    font-extrabold
    leading-[1.14]
    tracking-[-0.04em]
    text-white

    sm:text-[40px]
    lg:text-[46px]
  "
            >
              <span className="block">Profesyonel Yüzey İşlemede</span>

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
                Doğru Aşındırıcı Çözümler
              </span>
            </h2>

            <p
              className="
    mt-5
    max-w-[680px]
    text-sm
    leading-7
    text-white/50

    sm:text-[15px]
  "
            >
              Metalden paslanmaz çeliğe, ahşaptan otomotiv uygulamalarına kadar
              farklı yüzey işleme ihtiyaçları için profesyonel zımpara ve
              aşındırıcı çözümleri sunuyoruz. Doğru ürün seçimiyle daha
              kontrollü, verimli ve kaliteli yüzey işleme süreçleri sağlıyoruz.
            </p>
          </div>

          <Link
            to="/urunler"
            className="
              group
              inline-flex
              w-fit
              shrink-0
              items-center
              gap-2
              pb-1
              text-[12px]
              font-extrabold
              text-white/65
              transition-colors
              duration-200

              hover:text-white
            "
          >
            Tüm Ürünleri İncele
            <ArrowIcon />
          </Link>
        </div>

        {/* Video + kullanım alanları */}
        <div
          className="
            mt-12
            grid
            min-w-0
            gap-5

            lg:grid-cols-12
            lg:gap-6
          "
        >
          {/* Video */}
          <div
            className="
              min-w-0

              lg:col-span-7
            "
          >
            <div
              className="
                group/video
                relative
                aspect-video
                w-full
                overflow-hidden
                rounded-[26px]
                border
                border-white/[0.08]
                bg-[#090c16]
                shadow-[0_28px_80px_rgba(0,0,0,0.30)]
              "
            >
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="
                  absolute
                  inset-0
                  h-full
                  w-full
                  object-cover
                  object-center
                "
              >
                <source src="/videos/yuzey-isleme.mp4" type="video/mp4" />
              </video>

              {/* Sadece hafif görüntü katmanı */}
              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-[#050711]/25
                  via-transparent
                  to-black/[0.05]
                "
              />

              {/* İç kenar */}
              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  rounded-[26px]
                  ring-1
                  ring-inset
                  ring-white/[0.04]
                "
              />
            </div>
          </div>

          {/* Kullanım alanı kartları */}
          <div
            className="
              min-w-0

              lg:col-span-5
            "
          >
            <div
              className="
                grid
                h-full
                grid-cols-1
                gap-4

                sm:grid-cols-2

                lg:grid-cols-2
                lg:auto-rows-fr
              "
            >
              {kullanimAlanlari.map((alan, index) => (
                <KullanimAlaniKarti key={alan.id} alan={alan} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function KullanimAlaniKarti({ alan, index }) {
  return (
    <article
      className={`
        group/kart
        relative
        h-full
        min-w-0
        overflow-hidden
        rounded-[22px]
        border
        p-5
        transition-all
        duration-300

        ${
          index % 2 === 0
            ? "border-white/[0.075] bg-white/[0.038]"
            : "border-white/[0.055] bg-white/[0.022]"
        }

        hover:-translate-y-1
        hover:border-purple-400/20
        hover:bg-white/[0.055]
        hover:shadow-[0_18px_45px_rgba(0,0,0,0.16)]
      `}
    >
      {/* Kart atmosferi */}
      <div
        className="
          pointer-events-none
          absolute
          right-[-30px]
          top-[-30px]
          h-28
          w-28
          rounded-full
          bg-purple-500/[0.06]
          blur-[42px]
          transition-all
          duration-300

          group-hover/kart:bg-purple-500/[0.12]
        "
      />

      <div
        className="
          relative
          flex
          h-full
          flex-col
        "
      >
        {/* Icon + sıra */}
        <div
          className="
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
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-white/[0.08]
              bg-white/[0.045]
              text-purple-300
              transition-all
              duration-300

              group-hover/kart:border-purple-400/20
              group-hover/kart:bg-purple-500/[0.08]
            "
          >
            <KullanimAlaniIcon type={alan.icon} />
          </div>

          <span
            className="
              text-[16px]
              font-light
              tracking-[-0.03em]
              text-white/[0.12]
            "
          >
            0{index + 1}
          </span>
        </div>

        {/* İçerik */}
        <h3
          className="
            mt-4
            text-[16px]
            font-extrabold
            tracking-[-0.025em]
            text-white

            xl:text-[17px]
          "
        >
          {alan.baslik}
        </h3>

        <p
          className="
            mt-2.5
            line-clamp-4
            text-[10px]
            leading-[1.75]
            text-white/42

            xl:text-[11px]
          "
        >
          {alan.aciklama}
        </p>

        {/* Alt çizgi */}
        <div className="mt-auto pt-4">
          <div
            className="
              h-px
              w-full
              bg-gradient-to-r
              from-purple-500/25
              via-white/[0.06]
              to-transparent
            "
          />

          <div
            className="
              mt-3
              flex
              items-center
              gap-2
            "
          >
            <span
              className="
                h-1
                w-1
                rounded-full
                bg-purple-400/70
              "
            />

            <span
              className="
                text-[8px]
                font-extrabold
                uppercase
                tracking-[0.11em]
                text-white/25
              "
            >
              Uygulama Alanı
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

function KullanimAlaniIcon({ type }) {
  if (type === "metal") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path
          d="M4 18 18 4M7 20l13-13M4 14l6 6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (type === "steel") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="7" />
        <circle cx="12" cy="12" r="2" />

        <path d="M12 5v3M19 12h-3M12 19v-3M5 12h3" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === "wood") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path d="M5 5h14v14H5z" strokeLinejoin="round" />

        <path
          d="M8 8c2 1 3 3 2 5s0 3 2 4M15 7c-1 2-1 4 1 6"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M5 15h14l-2-5H7l-2 5Z" strokeLinejoin="round" />

      <path d="M7 15v2M17 15v2" strokeLinecap="round" />

      <circle cx="8" cy="17" r="1.5" />
      <circle cx="16" cy="17" r="1.5" />
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

export default AnaSayfaKullanimAlanlari;
