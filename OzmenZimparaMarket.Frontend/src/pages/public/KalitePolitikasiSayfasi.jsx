import { Link } from "react-router";

import { usePublicSite } from "../../contexts/PublicSiteContext";

function KalitePolitikasiSayfasi() {
  const { firmaBilgisi, yukleniyorMu } = usePublicSite();

  const kalitePolitikasi =
    firmaBilgisi?.kalitePolitikamiz?.trim() ||
    "Özmen Zımpara Market olarak kalite anlayışımızın temelinde müşteri ihtiyaçlarını doğru anlamak, kullanım alanına uygun ürünler sunmak, güvenilir tedarik süreçleri oluşturmak ve hizmet kalitemizi sürekli geliştirmek yer almaktadır.";

  return (
    <>
      <KaliteHero />

      <main
        className="
          w-full
          bg-[#f6f7f9]
        "
      >
        {/* Ana kalite politikası */}
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
              grid
              w-full
              max-w-[1440px]
              gap-8
              px-5

              sm:px-6

              lg:grid-cols-[0.78fr_1.22fr]
              lg:items-start
              lg:gap-14
              lg:px-8
            "
          >
            {/* Sol */}
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
                Kalite Yaklaşımımız
              </p>

              <h2
                className="
                  mt-3
                  max-w-[540px]
                  text-[30px]
                  font-extrabold
                  leading-[1.2]
                  tracking-[-0.04em]
                  text-zinc-950

                  sm:text-[36px]
                  lg:text-[42px]
                "
              >
                Kaliteyi yalnızca üründe değil,
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
                  tüm süreçte önemsiyoruz.
                </span>
              </h2>

              <p
                className="
                  mt-4
                  max-w-[540px]
                  text-[14px]
                  leading-7
                  text-zinc-500
                "
              >
                Ürün seçiminden tedarik sürecine, iletişimden uzun vadeli iş
                ilişkilerine kadar her aşamada güvenilir ve sürdürülebilir bir
                hizmet anlayışını benimsiyoruz.
              </p>
            </div>

            {/* Sağ */}
            <div
              className="
                rounded-[26px]
                border
                border-zinc-200/80
                bg-white
                p-6
                shadow-[0_18px_50px_rgba(15,23,42,0.045)]

                sm:p-8
                lg:p-9
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-3
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
                    bg-gradient-to-br
                    from-blue-50
                    to-purple-100
                    text-purple-600
                  "
                >
                  <QualityIcon />
                </div>

                <div>
                  <p
                    className="
                      text-[10px]
                      font-extrabold
                      uppercase
                      tracking-[0.13em]
                      text-purple-600
                    "
                  >
                    Özmen Zımpara Market
                  </p>

                  <h3
                    className="
                      mt-1
                      text-[19px]
                      font-extrabold
                      text-zinc-950
                    "
                  >
                    Kalite Politikamız
                  </h3>
                </div>
              </div>

              {yukleniyorMu ? (
                <KaliteSkeleton />
              ) : (
                <p
                  className="
                    mt-6
                    whitespace-pre-line
                    text-[14px]
                    leading-7
                    text-zinc-600

                    sm:text-[15px]
                    sm:leading-8
                  "
                >
                  {kalitePolitikasi}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Kalite ilkeleri */}
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
            <div className="max-w-[760px]">
              <p
                className="
                  text-[11px]
                  font-extrabold
                  uppercase
                  tracking-[0.16em]
                  text-purple-600
                "
              >
                Temel İlkelerimiz
              </p>

              <h2
                className="
                  mt-3
                  text-[30px]
                  font-extrabold
                  tracking-[-0.04em]
                  text-zinc-950

                  sm:text-[36px]
                "
              >
                Kalite anlayışımızı oluşturan değerler
              </h2>

              <p
                className="
                  mt-4
                  text-[14px]
                  leading-7
                  text-zinc-500
                "
              >
                Hizmet kalitemizi ürün, süreç ve müşteri ilişkileri açısından
                birlikte değerlendiriyoruz.
              </p>
            </div>

            <div
              className="
                mt-10
                grid
                gap-4

                sm:grid-cols-2
                xl:grid-cols-4
              "
            >
              <KaliteIlkesi
                numara="01"
                baslik="Doğru Ürün"
                aciklama="Uygulama, yüzey ve kullanım koşullarına uygun ürün seçimini ön planda tutuyoruz."
                icon={<ProductIcon />}
              />

              <KaliteIlkesi
                numara="02"
                baslik="Güvenilir Tedarik"
                aciklama="Müşterilerimizin iş süreçlerini destekleyen düzenli ve güvenilir ürün tedariğini önemsiyoruz."
                icon={<SupplyIcon />}
              />

              <KaliteIlkesi
                numara="03"
                baslik="Müşteri Memnuniyeti"
                aciklama="İhtiyaçları doğru anlamaya, açık iletişime ve sürdürülebilir iş ilişkilerine önem veriyoruz."
                icon={<CustomerIcon />}
              />

              <KaliteIlkesi
                numara="04"
                baslik="Sürekli Gelişim"
                aciklama="Ürün çeşitliliğimizi, hizmet anlayışımızı ve iş süreçlerimizi sürekli geliştirmeyi hedefliyoruz."
                icon={<DevelopmentIcon />}
              />
            </div>
          </div>
        </section>

        {/* Taahhütler */}
        <section
          className="
            py-16

            lg:py-24
          "
        >
          <div
            className="
              mx-auto
              grid
              w-full
              max-w-[1440px]
              gap-10
              px-5

              sm:px-6

              lg:grid-cols-[0.75fr_1.25fr]
              lg:items-start
              lg:gap-16
              lg:px-8
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
                Kalite Taahhüdümüz
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
                Her aşamada
                <span
                  className="
                    block
                    pb-2
                    text-purple-600
                  "
                >
                  tutarlı kalite.
                </span>
              </h2>

              <p
                className="
                  mt-4
                  max-w-[520px]
                  text-[14px]
                  leading-7
                  text-zinc-500
                "
              >
                Kalite anlayışımız yalnızca teslim edilen ürünle sınırlı
                değildir. Müşteri iletişiminden ürün seçimine ve tedarik
                sürecine kadar bütün aşamaları aynı yaklaşımın parçası olarak
                değerlendiriyoruz.
              </p>
            </div>

            <div
              className="
                overflow-hidden
                rounded-[24px]
                border
                border-zinc-200
                bg-white
              "
            >
              <TaahhutSatiri
                numara="01"
                baslik="Ürün Uygunluğu"
                aciklama="Müşteri ihtiyacına ve uygulama koşullarına uygun ürün seçeneklerinin sunulması."
              />

              <TaahhutSatiri
                numara="02"
                baslik="Açık ve Güvenilir İletişim"
                aciklama="Ürün ve tedarik süreçlerinde anlaşılır, şeffaf ve güvenilir iletişim kurulması."
              />

              <TaahhutSatiri
                numara="03"
                baslik="Süreklilik"
                aciklama="Müşterilerimizin uzun vadeli ürün ihtiyaçlarını destekleyen tedarik yaklaşımının sürdürülmesi."
              />

              <TaahhutSatiri
                numara="04"
                baslik="Gelişim"
                aciklama="Değişen sektör ihtiyaçlarını ve yeni ürün çözümlerini takip ederek hizmet kalitesinin geliştirilmesi."
                son
              />
            </div>
          </div>
        </section>

        {/* Koyu bölüm */}
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
              -right-32
              -top-40
              absolute
              h-[420px]
              w-[420px]
              rounded-full
              bg-purple-600/[0.11]
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
                grid
                gap-8

                lg:grid-cols-[1fr_1fr]
                lg:items-center
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
                    text-purple-400
                  "
                >
                  Kalite • Güven • Performans
                </p>

                <h2
                  className="
                    mt-3
                    max-w-[640px]
                    text-[30px]
                    font-extrabold
                    leading-[1.2]
                    tracking-[-0.04em]
                    text-white

                    sm:text-[36px]
                  "
                >
                  Profesyonel uygulamalar için güvenilir çözümler.
                </h2>
              </div>

              <p
                className="
                  max-w-[620px]
                  text-[14px]
                  leading-7
                  text-white/50
                "
              >
                Ürünlerimizin farklı yüzey ve uygulama ihtiyaçlarına uygun
                şekilde değerlendirilmesine, doğru ürün seçimine ve güvenilir
                tedarik süreçlerine önem veriyoruz.
              </p>
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
                  Profesyonel aşındırıcı ürünlerimizi inceleyin.
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

function KaliteHero() {
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
      <img
        src="/images/hero/hero-kalite.png"
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

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          -z-20
          bg-black/10
        "
      />

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
              leading-[1.15]
              tracking-[-0.045em]
              text-white

              sm:text-[46px]
              lg:text-[54px]
            "
          >
            Kalite
            <span
              className="
                block
                pb-2
                bg-gradient-to-r
                from-blue-300
                via-indigo-300
                to-purple-300
                bg-clip-text
                text-transparent
              "
            >
              Politikamız
            </span>
          </h1>

          <p
            className="
              mt-4
              max-w-[650px]
              text-[15px]
              leading-7
              text-white/70

              sm:text-[16px]
              sm:leading-8
            "
          >
            Ürün, hizmet ve tedarik süreçlerinde güvenilirliği, sürekliliği ve
            müşteri memnuniyetini temel alan kalite yaklaşımımız.
          </p>
        </div>
      </div>
    </section>
  );
}

function KaliteIlkesi({ numara, baslik, aciklama, icon }) {
  return (
    <article
      className="
        group
        rounded-[20px]
        border
        border-zinc-200/80
        bg-[#fafafa]
        p-5
        transition-all
        duration-300

        hover:-translate-y-1
        hover:border-purple-200
        hover:bg-white
        hover:shadow-[0_16px_40px_rgba(15,23,42,0.06)]
      "
    >
      <div
        className="
          flex
          items-start
          justify-between
          gap-3
        "
      >
        <div
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            bg-gradient-to-br
            from-blue-50
            to-purple-100
            text-purple-600
          "
        >
          {icon}
        </div>

        <span
          className="
            text-[10px]
            font-extrabold
            tracking-[0.12em]
            text-zinc-300
          "
        >
          {numara}
        </span>
      </div>

      <h3
        className="
          mt-5
          text-[16px]
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

function TaahhutSatiri({ numara, baslik, aciklama, son = false }) {
  return (
    <div
      className={`
        grid
        gap-3
        px-5
        py-5

        sm:grid-cols-[52px_180px_minmax(0,1fr)]
        sm:items-start
        sm:gap-5
        sm:px-6

        ${son ? "" : "border-b border-zinc-100"}
      `}
    >
      <span
        className="
          text-[10px]
          font-extrabold
          tracking-[0.12em]
          text-purple-600
        "
      >
        {numara}
      </span>

      <h3
        className="
          text-[13px]
          font-extrabold
          text-zinc-900
        "
      >
        {baslik}
      </h3>

      <p
        className="
          text-[12px]
          leading-6
          text-zinc-500
        "
      >
        {aciklama}
      </p>
    </div>
  );
}

function KaliteSkeleton() {
  return (
    <div className="mt-6 space-y-3">
      <div
        className="
          h-4
          w-full
          animate-pulse
          rounded
          bg-zinc-100
        "
      />

      <div
        className="
          h-4
          w-full
          animate-pulse
          rounded
          bg-zinc-100
        "
      />

      <div
        className="
          h-4
          w-5/6
          animate-pulse
          rounded
          bg-zinc-100
        "
      />

      <div
        className="
          h-4
          w-3/4
          animate-pulse
          rounded
          bg-zinc-100
        "
      />
    </div>
  );
}

function QualityIcon() {
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
        d="m12 3 2.2 2.1 3-.3.7 3 2.6 1.5-1.2 2.8 1.2 2.8-2.6 1.5-.7 3-3-.3L12 21l-2.2-2.1-3 .3-.7-3-2.6-1.5 1.2-2.8-1.2-2.8 2.6-1.5.7-3 3 .3L12 3Z"
        strokeLinejoin="round"
      />

      <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ProductIcon() {
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

      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function SupplyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M4 7h11v9H4zM15 10h3l2 3v3h-5z" strokeLinejoin="round" />

      <circle cx="8" cy="18" r="1.5" />

      <circle cx="17" cy="18" r="1.5" />
    </svg>
  );
}

function CustomerIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="3" />

      <path d="M5.5 19c.8-3.3 3-5 6.5-5s5.7 1.7 6.5 5" strokeLinecap="round" />
    </svg>
  );
}

function DevelopmentIcon() {
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
        d="M5 17 10 12l3 3 6-8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path d="M15 7h4v4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default KalitePolitikasiSayfasi;
