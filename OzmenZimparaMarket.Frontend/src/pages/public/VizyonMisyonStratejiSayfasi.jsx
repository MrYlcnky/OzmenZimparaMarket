import { Link } from "react-router";

import { usePublicSite } from "../../contexts/PublicSiteContext";

function VizyonMisyonStratejiSayfasi() {
  const { firmaBilgisi, yukleniyorMu } = usePublicSite();

  const vizyonMetni =
    firmaBilgisi?.vizyonumuz?.trim() ||
    "Profesyonel aşındırıcı ürünler alanında güvenilir, sürdürülebilir ve çözüm odaklı tedarik anlayışıyla müşterilerimizin tercih ettiği iş ortaklarından biri olmayı hedefliyoruz.";

  const misyonMetni =
    firmaBilgisi?.misyonumuz?.trim() ||
    "Farklı sektör ve uygulama ihtiyaçlarına uygun aşındırıcı ürünleri güvenilir tedarik anlayışıyla sunmak, müşterilerimizin doğru ürüne daha kolay ulaşmasını sağlamak ve uzun vadeli iş ilişkileri geliştirmektir.";

  const stratejiMetni =
    firmaBilgisi?.stratejimiz?.trim() ||
    "Ürün çeşitliliğimizi geliştirmek, müşteri ihtiyaçlarını doğru analiz etmek, teknik ürün seçimini desteklemek ve güvenilir tedarik süreçleriyle sürdürülebilir büyüme sağlamaktır.";

  return (
    <>
      <VizyonHero />

      <main
        className="
          w-full
          bg-[#f6f7f9]
        "
      >
        {/* Giriş */}
        <section
          className="
            py-14

            sm:py-16
            lg:py-20
          "
        >
          <div
            className="
              mx-auto
              w-full
              max-w-[1440px]
              px-5

              sm:px-6
              lg:px-8
            "
          >
            <div
              className="
                grid
                gap-8

                lg:grid-cols-[0.8fr_1.2fr]
                lg:items-end
                lg:gap-14
              "
            >
              <div>
                <p
                  className="
                    text-[11px]
                    font-extrabold
                    uppercase
                    tracking-[0.16em]
                    text-purple-600
                  "
                >
                  Kurumsal Yaklaşımımız
                </p>

                <h2
                  className="
    mt-3
    max-w-[560px]
    text-[30px]
    font-extrabold
    leading-[1.22]
    tracking-[-0.04em]
    text-zinc-950

    sm:text-[36px]
    lg:text-[42px]
    lg:leading-[1.18]
  "
                >
                  <span className="block">Bugünü doğru yönetiyor,</span>

                  <span
                    className="
      block
      pb-2
      bg-gradient-to-r
      from-blue-600
      to-purple-600
      bg-clip-text
      text-transparent
    "
                  >
                    geleceği planlıyoruz.
                  </span>
                </h2>
              </div>

              <p
                className="
                  max-w-[720px]
                  text-[14px]
                  leading-7
                  text-zinc-500

                  sm:text-[15px]
                  sm:leading-8
                "
              >
                Özmen Zımpara Market olarak faaliyetlerimizi yalnızca ürün
                tedariki üzerinden değil; güvenilir hizmet, doğru ürün seçimi,
                sürdürülebilir iş ilişkileri ve uzun vadeli gelişim anlayışı
                üzerinden şekillendiriyoruz.
              </p>
            </div>
          </div>
        </section>

        {/* Vizyon / Misyon / Strateji */}
        <section
          className="
            border-y
            border-zinc-200/70
            bg-white
            py-16

            lg:py-20
          "
        >
          <div
            className="
              mx-auto
              w-full
              max-w-[1440px]
              px-5

              sm:px-6
              lg:px-8
            "
          >
            {yukleniyorMu ? (
              <KurumsalKartlarSkeleton />
            ) : (
              <div
                className="
                  grid
                  gap-5

                  lg:grid-cols-3
                "
              >
                <KurumsalKart
                  numara="01"
                  ustBaslik="Geleceğe Bakışımız"
                  baslik="Vizyonumuz"
                  metin={vizyonMetni}
                  icon={<VisionIcon />}
                  vurgu="blue"
                />

                <KurumsalKart
                  numara="02"
                  ustBaslik="Bugünkü Sorumluluğumuz"
                  baslik="Misyonumuz"
                  metin={misyonMetni}
                  icon={<MissionIcon />}
                  vurgu="purple"
                />

                <KurumsalKart
                  numara="03"
                  ustBaslik="İlerleme Yolumuz"
                  baslik="Stratejimiz"
                  metin={stratejiMetni}
                  icon={<StrategyIcon />}
                  vurgu="mixed"
                />
              </div>
            )}
          </div>
        </section>

        {/* Yaklaşımımız */}
        <section
          className="
            py-16

            lg:py-24
          "
        >
          <div
            className="
              mx-auto
              w-full
              max-w-[1440px]
              px-5

              sm:px-6
              lg:px-8
            "
          >
            <div
              className="
                grid
                gap-10

                lg:grid-cols-[0.7fr_1.3fr]
                lg:items-start
                lg:gap-16
              "
            >
              <div>
                <p
                  className="
                    text-[11px]
                    font-extrabold
                    uppercase
                    tracking-[0.16em]
                    text-purple-600
                  "
                >
                  Temel Yaklaşımımız
                </p>

                <h2
                  className="
                    mt-3
                    text-[30px]
                    font-extrabold
                    leading-[1.2]
                    tracking-[-0.04em]
                    text-zinc-950

                    sm:text-[36px]
                  "
                >
                  Güvenilir tedarikten
                  <span
                    className="
                      block
                      text-purple-600
                    "
                  >
                    sürdürülebilir iş ortaklığına.
                  </span>
                </h2>

                <p
                  className="
                    mt-5
                    max-w-[540px]
                    text-[14px]
                    leading-7
                    text-zinc-500
                  "
                >
                  Çalışma modelimizi müşterinin ihtiyacını doğru anlamak,
                  uygulamaya uygun ürünü sunmak ve ürün tedarik sürecini
                  güvenilir şekilde sürdürmek üzerine kuruyoruz.
                </p>
              </div>

              <div
                className="
                  grid
                  gap-4

                  sm:grid-cols-2
                "
              >
                <YaklasimKarti
                  numara="01"
                  baslik="Doğru Ürün"
                  aciklama="Yüzey, uygulama ve kullanım koşullarına uygun ürün seçimini ön planda tutuyoruz."
                />

                <YaklasimKarti
                  numara="02"
                  baslik="Güvenilir Tedarik"
                  aciklama="Ürün ihtiyacının düzenli ve profesyonel şekilde karşılanmasına önem veriyoruz."
                />

                <YaklasimKarti
                  numara="03"
                  baslik="Teknik Yaklaşım"
                  aciklama="Ürünleri yalnızca isimleriyle değil, kullanım amaçları ve teknik özellikleriyle değerlendiriyoruz."
                />

                <YaklasimKarti
                  numara="04"
                  baslik="Sürdürülebilir İlişki"
                  aciklama="Tek seferlik satış yerine uzun vadeli ve güvene dayalı iş ilişkileri geliştirmeyi hedefliyoruz."
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stratejik odaklar */}
        <section
          className="
            relative
            overflow-hidden
            bg-[#090c16]
            py-16

            lg:py-20
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              -right-40
              -top-40
              h-[420px]
              w-[420px]
              rounded-full
              bg-purple-600/[0.10]
              blur-[130px]
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-48
              left-[-100px]
              h-[420px]
              w-[420px]
              rounded-full
              bg-blue-600/[0.08]
              blur-[130px]
            "
          />

          <div
            className="
              relative
              mx-auto
              w-full
              max-w-[1440px]
              px-5

              sm:px-6
              lg:px-8
            "
          >
            <div
              className="
                flex
                flex-col
                gap-6

                lg:flex-row
                lg:items-end
                lg:justify-between
              "
            >
              <div>
                <p
                  className="
                    text-[11px]
                    font-extrabold
                    uppercase
                    tracking-[0.16em]
                    text-purple-400
                  "
                >
                  Stratejik Odaklarımız
                </p>

                <h2
                  className="
                    mt-3
                    max-w-[680px]
                    text-[30px]
                    font-extrabold
                    leading-[1.2]
                    tracking-[-0.04em]
                    text-white

                    sm:text-[36px]
                  "
                >
                  Değer üretmeye odaklanan bir gelişim anlayışı.
                </h2>
              </div>

              <p
                className="
                  max-w-[540px]
                  text-[13px]
                  leading-7
                  text-white/50
                "
              >
                Ürün çeşitliliğinden müşteri deneyimine kadar her aşamada daha
                güçlü, erişilebilir ve güvenilir bir yapı oluşturmayı
                hedefliyoruz.
              </p>
            </div>

            <div
              className="
                mt-10
                grid
                gap-3

                sm:grid-cols-2
                xl:grid-cols-4
              "
            >
              <StratejiKarti
                baslik="Ürün Çeşitliliği"
                aciklama="Farklı uygulama ve sektörlere yönelik ürün seçeneklerini geliştirmek."
              />

              <StratejiKarti
                baslik="Müşteri Odaklılık"
                aciklama="Gerçek kullanım ihtiyacını anlayarak uygun çözümü sunmak."
              />

              <StratejiKarti
                baslik="Tedarik Sürekliliği"
                aciklama="İş süreçlerini destekleyen düzenli ve güvenilir ürün tedariği sağlamak."
              />

              <StratejiKarti
                baslik="Sürekli Gelişim"
                aciklama="Ürün, hizmet ve iş süreçlerini değişen ihtiyaçlara göre geliştirmek."
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section
          className="
            py-16

            lg:py-20
          "
        >
          <div
            className="
              mx-auto
              w-full
              max-w-[1440px]
              px-5

              sm:px-6
              lg:px-8
            "
          >
            <div
              className="
                relative
                overflow-hidden
                rounded-[28px]
                bg-gradient-to-br
                from-[#0b0f1c]
                to-[#171025]
                px-6
                py-10

                sm:px-9

                lg:flex
                lg:items-center
                lg:justify-between
                lg:gap-10
                lg:px-12
                lg:py-12
              "
            >
              <div>
                <p
                  className="
                    text-[11px]
                    font-extrabold
                    uppercase
                    tracking-[0.15em]
                    text-purple-400
                  "
                >
                  Özmen Zımpara Market
                </p>

                <h2
                  className="
                    mt-3
                    max-w-[700px]
                    text-[26px]
                    font-extrabold
                    leading-[1.2]
                    tracking-[-0.035em]
                    text-white

                    sm:text-[32px]
                  "
                >
                  Profesyonel aşındırıcı çözümlerimizi inceleyin.
                </h2>
              </div>

              <div
                className="
                  mt-7
                  flex
                  flex-wrap
                  gap-3

                  lg:mt-0
                  lg:shrink-0
                "
              >
                <Link
                  to="/urunler"
                  className="
                    inline-flex
                    min-h-[46px]
                    items-center
                    justify-center
                    rounded-xl
                    bg-gradient-to-r
                    from-blue-600
                    to-purple-600
                    px-5
                    text-[12px]
                    font-extrabold
                    text-white
                    transition-all

                    hover:-translate-y-0.5
                  "
                >
                  Ürünleri İncele
                </Link>

                <Link
                  to="/iletisim"
                  className="
                    inline-flex
                    min-h-[46px]
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-white/[0.10]
                    bg-white/[0.04]
                    px-5
                    text-[12px]
                    font-extrabold
                    text-white
                    transition-colors

                    hover:bg-white/[0.08]
                  "
                >
                  Bize Ulaşın
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

function VizyonHero() {
  return (
    <section
      className="
        relative
        isolate
        min-h-[340px]
        overflow-hidden
        bg-[#060913]

        sm:min-h-[380px]
        lg:min-h-[400px]
      "
    >
      {/* Hero görseli */}
      <img
        src="/images/hero/hero-vizyon.png"
        alt=""
        aria-hidden="true"
        className="
          absolute
          inset-0
          -z-30
          h-full
          w-full
          object-cover
          object-center
        "
      />

      {/* Soldan sağa okunabilirlik katmanı */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          -z-20
          bg-gradient-to-r
          from-[#050711]/95
          via-[#050711]/82
          to-[#050711]/35
        "
      />

      {/* Genel ton */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          -z-20
          bg-black/10
        "
      />

      {/* Mavi vurgu */}
      <div
        className="
          pointer-events-none
          absolute
          -left-40
          -top-36
          -z-10
          h-[400px]
          w-[400px]
          rounded-full
          bg-blue-600/[0.10]
          blur-[130px]
        "
      />

      {/* Mor vurgu */}
      <div
        className="
          pointer-events-none
          absolute
          -bottom-32
          right-[-80px]
          -z-10
          h-[380px]
          w-[380px]
          rounded-full
          bg-purple-600/[0.15]
          blur-[120px]
        "
      />

      <div
        className="
          relative
          mx-auto
          flex
          min-h-[340px]
          w-full
          max-w-[1440px]
          items-center
          px-5

          sm:min-h-[380px]
          sm:px-6

          lg:min-h-[400px]
          lg:px-8
        "
      >
        <div className="max-w-[760px]">
          <p
            className="
              text-[11px]
              font-extrabold
              uppercase
              tracking-[0.17em]
              text-purple-300
            "
          >
            Kurumsal
          </p>

          <h1
            className="
              mt-4
              text-[36px]
              font-extrabold
              leading-[1.12]
              tracking-[-0.045em]
              text-white

              sm:text-[46px]
              lg:text-[54px]
            "
          >
            Vizyon, Misyon
            <span
              className="
                block
                bg-gradient-to-r
                from-blue-300
                via-indigo-300
                to-purple-300
                bg-clip-text
                text-transparent
              "
            >
              & Strateji
            </span>
          </h1>

          <p
            className="
              mt-5
              max-w-[650px]
              text-[15px]
              leading-7
              text-white/70

              sm:text-[16px]
              sm:leading-8
            "
          >
            Geleceğe yönelik hedeflerimizi, bugünkü sorumluluklarımızı ve
            sürdürülebilir gelişim anlayışımızı şekillendiren temel
            yaklaşımımız.
          </p>
        </div>
      </div>
    </section>
  );
}

function KurumsalKart({ numara, ustBaslik, baslik, metin, icon, vurgu }) {
  const vurguSinifi =
    vurgu === "blue"
      ? "from-blue-50 to-blue-100 text-blue-600"
      : vurgu === "purple"
        ? "from-purple-50 to-purple-100 text-purple-600"
        : "from-blue-50 to-purple-100 text-purple-600";

  return (
    <article
      className="
        group
        flex
        min-h-[360px]
        flex-col
        rounded-[24px]
        border
        border-zinc-200/80
        bg-[#fafafa]
        p-6
        transition-all
        duration-300

        hover:-translate-y-1
        hover:border-purple-200
        hover:bg-white
        hover:shadow-[0_20px_50px_rgba(15,23,42,0.07)]

        sm:p-7
      "
    >
      <div
        className="
          flex
          items-start
          justify-between
          gap-4
        "
      >
        <div
          className={`
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-2xl
            bg-gradient-to-br

            ${vurguSinifi}
          `}
        >
          {icon}
        </div>

        <span
          className="
            text-[11px]
            font-extrabold
            tracking-[0.14em]
            text-zinc-300
          "
        >
          {numara}
        </span>
      </div>

      <p
        className="
          mt-8
          text-[10px]
          font-extrabold
          uppercase
          tracking-[0.13em]
          text-purple-600
        "
      >
        {ustBaslik}
      </p>

      <h2
        className="
          mt-2
          text-[24px]
          font-extrabold
          tracking-[-0.035em]
          text-zinc-950
        "
      >
        {baslik}
      </h2>

      <p
        className="
          mt-5
          whitespace-pre-line
          text-[14px]
          leading-7
          text-zinc-500
        "
      >
        {metin}
      </p>
    </article>
  );
}

function YaklasimKarti({ numara, baslik, aciklama }) {
  return (
    <article
      className="
        rounded-[20px]
        border
        border-zinc-200
        bg-white
        p-5
        transition-all

        hover:border-purple-200
        hover:shadow-[0_14px_35px_rgba(15,23,42,0.05)]
      "
    >
      <div
        className="
          flex
          items-center
          justify-between
          gap-4
        "
      >
        <span
          className="
            text-[11px]
            font-extrabold
            tracking-[0.12em]
            text-purple-600
          "
        >
          {numara}
        </span>

        <span
          className="
            h-px
            flex-1
            bg-gradient-to-r
            from-purple-200
            to-transparent
          "
        />
      </div>

      <h3
        className="
          mt-5
          text-[17px]
          font-extrabold
          text-zinc-950
        "
      >
        {baslik}
      </h3>

      <p
        className="
          mt-2
          text-[12px]
          leading-6
          text-zinc-500
        "
      >
        {aciklama}
      </p>
    </article>
  );
}

function StratejiKarti({ baslik, aciklama }) {
  return (
    <article
      className="
        rounded-[18px]
        border
        border-white/[0.08]
        bg-white/[0.035]
        p-5
        backdrop-blur-sm
        transition-all

        hover:border-purple-400/25
        hover:bg-white/[0.06]
      "
    >
      <div
        className="
          h-1.5
          w-1.5
          rounded-full
          bg-purple-400
        "
      />

      <h3
        className="
          mt-5
          text-[15px]
          font-extrabold
          text-white
        "
      >
        {baslik}
      </h3>

      <p
        className="
          mt-2
          text-[12px]
          leading-6
          text-white/45
        "
      >
        {aciklama}
      </p>
    </article>
  );
}

function KurumsalKartlarSkeleton() {
  return (
    <div
      className="
        grid
        gap-5

        lg:grid-cols-3
      "
    >
      {Array.from({
        length: 3,
      }).map((_, index) => (
        <div
          key={index}
          className="
            min-h-[360px]
            animate-pulse
            rounded-[24px]
            border
            border-zinc-200
            bg-zinc-50
            p-7
          "
        >
          <div
            className="
              h-12
              w-12
              rounded-2xl
              bg-zinc-100
            "
          />

          <div
            className="
              mt-9
              h-3
              w-28
              rounded
              bg-zinc-100
            "
          />

          <div
            className="
              mt-4
              h-7
              w-1/2
              rounded
              bg-zinc-100
            "
          />

          <div className="mt-6 space-y-3">
            <div
              className="
                h-4
                w-full
                rounded
                bg-zinc-100
              "
            />

            <div
              className="
                h-4
                w-full
                rounded
                bg-zinc-100
              "
            />

            <div
              className="
                h-4
                w-4/5
                rounded
                bg-zinc-100
              "
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function VisionIcon() {
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
        d="M2.5 12s3.5-5 9.5-5 9.5 5 9.5 5-3.5 5-9.5 5-9.5-5-9.5-5Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

function MissionIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="7" />

      <circle cx="12" cy="12" r="3" />

      <path d="m16.5 7.5 3-3" strokeLinecap="round" />
    </svg>
  );
}

function StrategyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M5 18V9M12 18V5M19 18v-7" strokeLinecap="round" />

      <path d="M3 18h18" strokeLinecap="round" />
    </svg>
  );
}

export default VizyonMisyonStratejiSayfasi;
