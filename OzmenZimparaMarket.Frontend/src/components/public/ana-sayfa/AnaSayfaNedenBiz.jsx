function AnaSayfaNedenBiz() {
  const avantajlar = [
    {
      baslik: "Geniş Ürün Yelpazesi",
      aciklama:
        "Farklı yüzeyler ve profesyonel uygulamalar için geniş zımpara ve aşındırıcı ürün seçenekleri.",
      icon: <LayersIcon />,
    },
    {
      baslik: "Doğru Ürün Seçimi",
      aciklama:
        "Uygulama ve yüzey ihtiyacına uygun ürün seçiminde çözüm odaklı yaklaşım.",
      icon: <TargetIcon />,
    },
    {
      baslik: "Güvenilir Tedarik",
      aciklama:
        "Profesyonel kullanım ihtiyaçlarına yönelik düzenli ve güvenilir ürün tedariki.",
      icon: <ShieldIcon />,
    },
    {
      baslik: "Hızlı İletişim & Teklif",
      aciklama:
        "Ürün ihtiyacınız için hızlı iletişim, yönlendirme ve teklif desteği.",
      icon: <MessageIcon />,
    },
  ];

  return (
    <section
      className="
        relative
        isolate
        overflow-hidden
        bg-[#050711]
        py-20

        sm:py-24
        lg:py-28
      "
    >
      {/* Arka plan atmosferi */}
      <div
        className="
          pointer-events-none
          absolute
          -left-32
          top-1/3
          -z-10
          h-[420px]
          w-[420px]
          rounded-full
          bg-purple-600/[0.10]
          blur-[140px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-32
          top-0
          -z-10
          h-[460px]
          w-[460px]
          rounded-full
          bg-blue-600/[0.08]
          blur-[150px]
        "
      />

      {/* Hafif grid */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          -z-10
          opacity-[0.025]
        "
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.16) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
        }}
      />

      <div
        className="
          mx-auto
          grid
          max-w-[1440px]
          items-center
          gap-12
          px-5

          sm:px-6

          lg:grid-cols-[0.95fr_1.05fr]
          lg:gap-16
          lg:px-8

          xl:gap-20
        "
      >
        {/* Sol içerik */}
        <div>
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
                from-blue-500
                to-purple-500
              "
            />

            <span
              className="
                text-[10px]
                font-extrabold
                uppercase
                tracking-[0.18em]
                text-purple-300

                sm:text-[11px]
              "
            >
              Neden Biz?
            </span>
          </div>

          <h2
            className="
              mt-5
              max-w-[620px]
              text-[32px]
              font-extrabold
              leading-[1.08]
              tracking-[-0.04em]
              text-white

              sm:text-[40px]
              lg:text-[46px]
            "
          >
            Neden Özmen
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
              Zımpara Market?
            </span>
          </h2>

          <p
            className="
              mt-5
              max-w-[590px]
              text-sm
              leading-7
              text-white/50

              sm:text-[15px]
              sm:leading-7
            "
          >
            Profesyonel zımpara ve aşındırıcı ürün ihtiyaçlarında yalnızca ürün
            sunmak değil, kullanım alanına uygun doğru çözüme ulaşmayı
            kolaylaştırmak için çalışıyoruz.
          </p>

          {/* Avantajlar */}
          <div
            className="
              mt-9
              grid
              gap-x-7
              gap-y-7

              sm:grid-cols-2
            "
          >
            {avantajlar.map((avantaj) => (
              <AvantajKarti
                key={avantaj.baslik}
                baslik={avantaj.baslik}
                aciklama={avantaj.aciklama}
                icon={avantaj.icon}
              />
            ))}
          </div>
        </div>

        {/* Sağ video */}
        <div
          className="
            relative
            mx-auto
            w-full
            max-w-[720px]
          "
        >
          {/* Arka dekor */}
          <div
            className="
              pointer-events-none
              absolute
              -inset-5
              -z-10
              rounded-[32px]
              bg-gradient-to-br
              from-purple-500/[0.10]
              via-transparent
              to-blue-500/[0.10]
              blur-xl
            "
          />

          <div
            className="
              relative
              aspect-[16/10]
              overflow-hidden
              rounded-[24px]
              border
              border-white/[0.08]
              bg-[#090b14]
              shadow-[0_28px_80px_rgba(0,0,0,0.35)]
            "
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="
                h-full
                w-full
                object-cover
              "
              aria-hidden="true"
            >
              <source src="/videos/zimparalar-marka.mp4" type="video/mp4" />
            </video>

            {/* Video okunabilirlik katmanı */}
            <div
              className="
                pointer-events-none
                absolute
                inset-0
                bg-gradient-to-t
                from-[#050711]/45
                via-transparent
                to-black/10
              "
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function AvantajKarti({ baslik, aciklama, icon }) {
  return (
    <div
      className="
        group
        flex
        items-start
        gap-4
      "
    >
      <div
        className="
          flex
          h-11
          w-11
          shrink-0
          items-center
          justify-center
          rounded-xl
          border
          border-white/[0.08]
          bg-white/[0.04]
          text-purple-300
          transition-all
          duration-300

          group-hover:border-purple-400/25
          group-hover:bg-purple-500/[0.08]
        "
      >
        {icon}
      </div>

      <div>
        <h3
          className="
            text-sm
            font-extrabold
            text-white/90

            sm:text-[15px]
          "
        >
          {baslik}
        </h3>

        <p
          className="
            mt-1.5
            text-[12px]
            leading-5
            text-white/42

            sm:text-[13px]
            sm:leading-6
          "
        >
          {aciklama}
        </p>
      </div>
    </div>
  );
}

function LayersIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        d="m12 3 9 5-9 5-9-5 9-5Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path d="m3 12 9 5 9-5" strokeLinecap="round" strokeLinejoin="round" />

      <path d="m3 16 9 5 9-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="8" />

      <circle cx="12" cy="12" r="3" />

      <path d="M12 4V2M20 12h2" strokeLinecap="round" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        d="M12 3 19 6v5c0 4.7-2.8 8-7 10-4.2-2-7-5.3-7-10V6l7-3Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        d="M5 18 3 21l4.5-1.5A9 9 0 1 0 5 18Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path d="M8 12h.01M12 12h.01M16 12h.01" strokeLinecap="round" />
    </svg>
  );
}

export default AnaSayfaNedenBiz;
