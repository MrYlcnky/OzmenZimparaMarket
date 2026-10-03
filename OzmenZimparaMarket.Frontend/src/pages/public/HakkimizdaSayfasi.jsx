import { Link } from "react-router";

import { usePublicSite } from "../../contexts/PublicSiteContext";

function HakkimizdaSayfasi() {
  const { firmaBilgisi, yukleniyorMu } = usePublicSite();

  const sirketAdi = firmaBilgisi?.sirketAdi || "Özmen Zımpara Market";

  const hakkimizdaMetni =
    firmaBilgisi?.hakkimizda?.trim() ||
    "Özmen Zımpara Market, profesyonel ve endüstriyel zımpara ürünleri alanında müşterilerine güvenilir ürün tedariki ve doğru ürün seçimi konusunda çözüm sunmayı amaçlayan bir kuruluştur.";

  return (
    <>
      <HakkimizdaHero sirketAdi={sirketAdi} />

      <main
        className="
          w-full
          bg-[#f6f7f9]
        "
      >
        {/* Ana hakkımızda alanı */}
        <section
          className="
            py-14

            sm:py-18
            lg:py-24
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

              lg:grid-cols-[0.85fr_1.15fr]
              lg:items-start
              lg:gap-14
              lg:px-8
            "
          >
            {/* Sol başlık + görsel */}
            <div className="min-w-0">
              <p
                className="
      text-[11px]
      font-extrabold
      uppercase
      tracking-[0.16em]
      text-purple-600
    "
              >
                Hakkımızda
              </p>

              <h2
                className="
      mt-3
      max-w-[520px]
      text-[30px]
      font-extrabold
      leading-[1.15]
      tracking-[-0.04em]
      text-zinc-950

      sm:text-[36px]
      lg:text-[42px]
    "
              >
                Profesyonel Aşındırıcı
                <span
                  className="
        block
        bg-gradient-to-r
        from-blue-600
        to-purple-600
        bg-clip-text
        text-transparent
      "
                >
                  Çözümler
                </span>
              </h2>

              <p
                className="
      mt-5
      max-w-[520px]
      text-[14px]
      leading-7
      text-zinc-500
    "
              >
                Endüstriyel yüzey işleme ihtiyaçlarında doğru ürünü, doğru
                uygulamayla buluşturmayı hedefliyoruz. Hangi yüzeyde
                çalışırsanız çalışın, beklentiniz ister pürüzsüz bir bitiş ister
                hızlı bir aşındırma olsun; geniş ürün yelpazemizle ihtiyacınıza
                en uygun, yüksek dayanımlı ürünleri kapınıza getiriyoruz. Siz
                üretiminize odaklanırken, yüzeydeki zorlukları çözmeyi
                profesyonel aşındırıcı ürünlerimize bırakın.
              </p>

              {/* Hakkımızda görseli */}
              <div
                className="
      relative
      mt-10
      max-w-[560px]
      overflow-hidden
      rounded-[24px]
      border
      border-zinc-200/80
      bg-[#0a0d16]
      shadow-[0_20px_50px_rgba(15,23,42,0.10)]
    "
              >
                <div
                  className="
        pointer-events-none
        absolute
        inset-0
        z-10
        bg-gradient-to-t
        from-black/20
        via-transparent
        to-transparent
      "
                />

                <img
                  src="/images/hero/hakkimizda.png"
                  alt="Özmen Zımpara Market profesyonel aşındırıcı çözümleri"
                  loading="lazy"
                  className="
        aspect-[4/3]
        h-auto
        w-full
        object-cover
        object-center
      "
                />

                <div
                  className="
        pointer-events-none
        absolute
        inset-x-0
        bottom-0
        z-20
        h-px
        bg-gradient-to-r
        from-transparent
        via-purple-400/60
        to-transparent
      "
                />
              </div>
            </div>

            {/* Sağ metin */}
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
              {yukleniyorMu ? (
                <HakkimizdaSkeleton />
              ) : (
                <>
                  <h3
                    className="
                      text-[20px]
                      font-extrabold
                      tracking-[-0.025em]
                      text-zinc-950
                    "
                  >
                    {sirketAdi}
                  </h3>

                  <p
                    className="
                      mt-5
                      whitespace-pre-line
                      text-[14px]
                      leading-7
                      text-zinc-600

                      sm:text-[15px]
                      sm:leading-8
                    "
                  >
                    {hakkimizdaMetni}
                  </p>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Neler sunuyoruz */}
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
            <BolumBasligi
              ustBaslik="Hizmet Yaklaşımımız"
              baslik="Neler Sunuyoruz?"
              aciklama="Profesyonel aşındırıcı ürün tedariğinde yalnızca ürün sunmakla kalmıyor, uygulama ihtiyacına uygun çözümün belirlenmesine de önem veriyoruz."
            />

            <div
              className="
                mt-10
                grid
                gap-4

                sm:grid-cols-2
                xl:grid-cols-4
              "
            >
              <OzellikKarti
                icon={<ProductsIcon />}
                baslik="Geniş Ürün Yelpazesi"
                aciklama="Farklı yüzey, sektör ve uygulamalara yönelik profesyonel zımpara ve aşındırıcı ürün seçenekleri."
              />

              <OzellikKarti
                icon={<TechnicalIcon />}
                baslik="Teknik Ürün Seçimi"
                aciklama="Kullanım alanı ve uygulama şartlarına uygun ürünün belirlenmesine yönelik doğru ürün yaklaşımı."
              />

              <OzellikKarti
                icon={<SupplyIcon />}
                baslik="Güvenilir Tedarik"
                aciklama="İş sürekliliğini destekleyen düzenli, güvenilir ve profesyonel ürün tedarik anlayışı."
              />

              <OzellikKarti
                icon={<SupportIcon />}
                baslik="Profesyonel Yaklaşım"
                aciklama="Müşteri ihtiyacını doğru anlamaya ve uzun vadeli iş ilişkileri oluşturmaya odaklanan hizmet anlayışı."
              />
            </div>
          </div>
        </section>

        {/* Çalışma anlayışı */}
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
              gap-8
              px-5

              sm:px-6

              lg:grid-cols-2
              lg:items-center
              lg:gap-14
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
                Çalışma Anlayışımız
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
                Doğru ürün,
                <span
                  className="
                    block
                    text-purple-600
                  "
                >
                  doğru uygulama.
                </span>
              </h2>

              <p
                className="
                  mt-5
                  max-w-[620px]
                  text-[14px]
                  leading-7
                  text-zinc-500

                  sm:text-[15px]
                  sm:leading-8
                "
              >
                Her aşındırıcı ürün her yüzey ve uygulama için aynı sonucu
                vermez. Bu nedenle çalışma anlayışımızın temelinde ürünün
                kullanım alanını, yüzey yapısını ve uygulama ihtiyacını doğru
                değerlendirmek yer alır.
              </p>

              <p
                className="
                  mt-4
                  max-w-[620px]
                  text-[14px]
                  leading-7
                  text-zinc-500

                  sm:text-[15px]
                  sm:leading-8
                "
              >
                Amacımız müşterilerimizin ihtiyaç duyduğu ürüne daha kolay
                ulaşmasını sağlamak, doğru ürün seçimini desteklemek ve
                sürdürülebilir bir tedarik ilişkisi oluşturmaktır.
              </p>
            </div>

            <div
              className="
                grid
                grid-cols-2
                gap-4
              "
            >
              <DegerKarti
                numara="01"
                baslik="Kalite"
                aciklama="Profesyonel kullanıma uygun ürün yaklaşımı."
              />

              <DegerKarti
                numara="02"
                baslik="Güven"
                aciklama="Şeffaf ve sürdürülebilir iş ilişkileri."
              />

              <DegerKarti
                numara="03"
                baslik="Performans"
                aciklama="Uygulamaya uygun doğru ürün seçimi."
              />

              <DegerKarti
                numara="04"
                baslik="Tedarik"
                aciklama="İş süreçlerini destekleyen ürün sürekliliği."
              />
            </div>
          </div>
        </section>

        {/* Sektörel çözümler */}
        <section
          className="
            bg-[#090c16]
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
                  Uygulama Alanları
                </p>

                <h2
                  className="
                    mt-3
                    text-[30px]
                    font-extrabold
                    tracking-[-0.04em]
                    text-white

                    sm:text-[36px]
                  "
                >
                  Farklı Yüzeylere Uygun Ürünler
                </h2>
              </div>

              <p
                className="
                  max-w-[560px]
                  text-[13px]
                  leading-7
                  text-white/50
                "
              >
                Farklı malzeme ve yüzey işleme ihtiyaçlarına yönelik ürün
                gruplarımızla profesyonel uygulamalara çözüm sunuyoruz.
              </p>
            </div>

            <div
              className="
                mt-9
                flex
                flex-wrap
                gap-2.5
              "
            >
              {[
                "Metal",
                "Paslanmaz Çelik",
                "Ahşap",
                "Otomotiv",
                "Mobilya",
                "Makine Sanayi",
                "Kaynak Sonrası İşlemler",
                "Yüzey Temizleme",
                "Çapak Alma",
                "Parlatma",
                "Yüzey Hazırlama",
              ].map((alan) => (
                <span
                  key={alan}
                  className="
                    rounded-full
                    border
                    border-white/[0.08]
                    bg-white/[0.04]
                    px-4
                    py-2.5
                    text-[12px]
                    font-bold
                    text-white/70
                  "
                >
                  {alan}
                </span>
              ))}
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
                  İhtiyacınıza uygun aşındırıcı ürünü birlikte belirleyelim.
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

function HakkimizdaHero({ sirketAdi }) {
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
      {/* Arka plan görseli */}
      <img
        src="/images/hero/hero-hakkimizda.jpg"
        alt=""
        aria-hidden="true"
        className="
          absolute
          inset-0
          -z-30
          h-full
          w-full
          object-cover
          object-[center_62%]
        "
      />

      {/* Soldan sağa koyu katman */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          -z-20
          bg-gradient-to-r
          from-[#050711]
          via-[#050711]/90
          to-[#050711]/30
        "
      />

      {/* Genel hafif koyuluk */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          -z-20
          bg-black/15
        "
      />

      {/* Sağ mor vurgu */}
      <div
        className="
          pointer-events-none
          absolute
          -bottom-24
          right-[-80px]
          -z-10
          h-[360px]
          w-[360px]
          rounded-full
          bg-purple-600/[0.14]
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
        <div className="max-w-[720px]">
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
            {sirketAdi}
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
            Profesyonel zımpara, aşındırıcı ve yüzey işleme ürünlerinde
            güvenilir tedarik ve doğru ürün yaklaşımı.
          </p>
        </div>
      </div>
    </section>
  );
}
function BolumBasligi({ ustBaslik, baslik, aciklama }) {
  return (
    <div
      className="
        max-w-[720px]
      "
    >
      <p
        className="
          text-[11px]
          font-extrabold
          uppercase
          tracking-[0.15em]
          text-purple-600
        "
      >
        {ustBaslik}
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
        {baslik}
      </h2>

      <p
        className="
          mt-4
          text-[14px]
          leading-7
          text-zinc-500
        "
      >
        {aciklama}
      </p>
    </div>
  );
}

function OzellikKarti({ icon, baslik, aciklama }) {
  return (
    <article
      className="
        rounded-[20px]
        border
        border-zinc-200/80
        bg-[#fafafa]
        p-5
        transition-all

        hover:-translate-y-1
        hover:border-purple-200
        hover:bg-white
        hover:shadow-[0_16px_40px_rgba(15,23,42,0.06)]
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

      <h3
        className="
          mt-5
          text-[15px]
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

function DegerKarti({ numara, baslik, aciklama }) {
  return (
    <div
      className="
        rounded-[20px]
        border
        border-zinc-200
        bg-white
        p-5
      "
    >
      <span
        className="
          text-[11px]
          font-extrabold
          text-purple-600
        "
      >
        {numara}
      </span>

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
          leading-5
          text-zinc-500
        "
      >
        {aciklama}
      </p>
    </div>
  );
}

function HakkimizdaSkeleton() {
  return (
    <div>
      <div
        className="
          h-6
          w-56
          animate-pulse
          rounded
          bg-zinc-100
        "
      />

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
            w-4/5
            animate-pulse
            rounded
            bg-zinc-100
          "
        />
      </div>
    </div>
  );
}

function ProductsIcon() {
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

function TechnicalIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M4 7h10M4 17h16M14 7h6M9 12h11M4 12h5" strokeLinecap="round" />
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

function SupportIcon() {
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
        d="M12 4a8 8 0 0 0-8 8v3M20 15v-3a8 8 0 0 0-8-8"
        strokeLinecap="round"
      />

      <path
        d="M4 14h3v5H5a1 1 0 0 1-1-1v-4ZM20 14h-3v5h2a1 1 0 0 0 1-1v-4Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default HakkimizdaSayfasi;
