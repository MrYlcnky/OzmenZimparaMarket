import { Link } from "react-router";

import { usePublicSite } from "../../contexts/PublicSiteContext";

function KvkkSayfasi() {
  const { firmaBilgisi, yukleniyorMu } = usePublicSite();

  const sirketAdi = firmaBilgisi?.sirketAdi || "Özmen Zımpara Market";

  const kvkkMetni = firmaBilgisi?.kvkk?.trim() || "";

  const eposta = firmaBilgisi?.eposta?.trim() || "";

  const iletisimNo = firmaBilgisi?.iletisimNo?.trim() || "";

  return (
    <>
      <KvkkHero />

      <main className="w-full bg-[#f6f7f9]">
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
              grid
              w-full
              max-w-[1440px]
              gap-8
              px-5

              sm:px-6

              lg:grid-cols-[0.72fr_1.28fr]
              lg:items-start
              lg:gap-14
              lg:px-8
            "
          >
            {/* Sol alan */}
            <div
              className="
                lg:sticky
                lg:top-[110px]
              "
            >
              <p
                className="
                  text-[11px]
                  font-extrabold
                  uppercase
                  tracking-[0.16em]
                  text-purple-600
                "
              >
                Kişisel Verilerin Korunması
              </p>

              <h1
                className="
                  mt-3
                  max-w-[520px]
                  text-[30px]
                  font-extrabold
                  leading-[1.2]
                  tracking-[-0.04em]
                  text-zinc-950

                  sm:text-[36px]
                  lg:text-[42px]
                "
              >
                KVKK
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
                  Aydınlatma Metni
                </span>
              </h1>

              <p
                className="
                  mt-4
                  max-w-[500px]
                  text-[14px]
                  leading-7
                  text-zinc-500
                "
              >
                Kişisel verilerin korunmasına ilişkin bilgilendirme metnimizi bu
                sayfadan inceleyebilirsiniz.
              </p>

              {/* Bilgi kartı */}
              <div
                className="
                  mt-7
                  rounded-[20px]
                  border
                  border-zinc-200
                  bg-white
                  p-5
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
                  <ShieldIcon />
                </div>

                <h2
                  className="
                    mt-4
                    text-[15px]
                    font-extrabold
                    text-zinc-950
                  "
                >
                  {sirketAdi}
                </h2>

                <p
                  className="
                    mt-2
                    text-[12px]
                    leading-6
                    text-zinc-500
                  "
                >
                  KVKK ile ilgili iletişim ve başvuru ihtiyaçlarınız için
                  bizimle iletişime geçebilirsiniz.
                </p>

                {(eposta || iletisimNo) && (
                  <div
                    className="
                      mt-4
                      space-y-2
                      border-t
                      border-zinc-100
                      pt-4
                    "
                  >
                    {eposta && (
                      <a
                        href={`mailto:${eposta}`}
                        className="
                          flex
                          items-center
                          gap-2
                          text-[12px]
                          font-bold
                          text-zinc-600
                          transition-colors

                          hover:text-purple-700
                        "
                      >
                        <MailIcon />

                        {eposta}
                      </a>
                    )}

                    {iletisimNo && (
                      <a
                        href={`tel:${telefonTemizle(iletisimNo)}`}
                        className="
                          flex
                          items-center
                          gap-2
                          text-[12px]
                          font-bold
                          text-zinc-600
                          transition-colors

                          hover:text-purple-700
                        "
                      >
                        <PhoneIcon />

                        {iletisimNo}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* KVKK metni */}
            <article
              className="
                min-w-0
                rounded-[26px]
                border
                border-zinc-200/80
                bg-white
                p-6
                shadow-[0_18px_50px_rgba(15,23,42,0.045)]

                sm:p-8
                lg:p-10
              "
            >
              <div
                className="
                  flex
                  items-start
                  justify-between
                  gap-5
                  border-b
                  border-zinc-100
                  pb-6
                "
              >
                <div>
                  <p
                    className="
                      text-[10px]
                      font-extrabold
                      uppercase
                      tracking-[0.14em]
                      text-purple-600
                    "
                  >
                    Bilgilendirme
                  </p>

                  <h2
                    className="
                      mt-2
                      text-[22px]
                      font-extrabold
                      tracking-[-0.03em]
                      text-zinc-950

                      sm:text-[26px]
                    "
                  >
                    Kişisel Verilerin Korunması ve Aydınlatma Metni
                  </h2>
                </div>

                <div
                  className="
                    hidden
                    h-12
                    w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    bg-purple-50
                    text-purple-600

                    sm:flex
                  "
                >
                  <DocumentIcon />
                </div>
              </div>

              {yukleniyorMu ? (
                <KvkkSkeleton />
              ) : kvkkMetni ? (
                <div
                  className="
                    mt-7
                    whitespace-pre-line
                    text-[14px]
                    leading-8
                    text-zinc-600

                    sm:text-[15px]
                  "
                >
                  {kvkkMetni}
                </div>
              ) : (
                <KvkkBosDurum />
              )}
            </article>
          </div>
        </section>

        {/* Alt bilgi */}
        <section
          className="
            border-y
            border-zinc-200/70
            bg-white
            py-14

            lg:py-16
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
                gap-4

                md:grid-cols-3
              "
            >
              <BilgiKarti
                icon={<TransparencyIcon />}
                baslik="Şeffaflık"
                aciklama="Kişisel verilerin işlenmesine ilişkin bilgilendirmelerin açık ve erişilebilir olmasını önemsiyoruz."
              />

              <BilgiKarti
                icon={<SecurityIcon />}
                baslik="Veri Güvenliği"
                aciklama="Kişisel verilerin korunması ve güvenli şekilde ele alınması süreçlerimizin önemli bir parçasıdır."
              />

              <BilgiKarti
                icon={<ContactIcon />}
                baslik="İletişim"
                aciklama="KVKK ile ilgili soru ve talepleriniz için iletişim kanallarımız üzerinden bize ulaşabilirsiniz."
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
                  İletişim
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
                  KVKK ile ilgili sorularınız için bizimle iletişime geçin.
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
                  to="/iletisim"
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
                  Bize Ulaşın
                </Link>

                <Link
                  to="/"
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
                  Ana Sayfaya Dön
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

function KvkkHero() {
  return (
    <section
      className="
        relative
        isolate
        min-h-[320px]
        overflow-hidden
        bg-[#060913]

        sm:min-h-[360px]
        lg:min-h-[390px]
      "
    >
      {/* Hero arka plan görseli */}
      <img
        src="/images/hero/hero-kvkk.png"
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

      {/* Soldaki metin için koyu overlay */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          -z-20
          bg-gradient-to-r
          from-[#050711]/96
          via-[#050711]/84
          to-[#050711]/35
        "
      />

      {/* Genel kontrast */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          -z-20
          bg-black/10
        "
      />

      {/* Sol mavi vurgu */}
      <div
        className="
          pointer-events-none
          absolute
          -left-40
          -top-36
          -z-10
          h-[420px]
          w-[420px]
          rounded-full
          bg-blue-600/[0.10]
          blur-[130px]
        "
      />

      {/* Sağ mor vurgu */}
      <div
        className="
          pointer-events-none
          absolute
          -bottom-36
          right-[-80px]
          -z-10
          h-[420px]
          w-[420px]
          rounded-full
          bg-purple-600/[0.15]
          blur-[130px]
        "
      />

      <div
        className="
          relative
          mx-auto
          flex
          min-h-[320px]
          w-full
          max-w-[1440px]
          items-center
          px-5

          sm:min-h-[360px]
          sm:px-6

          lg:min-h-[390px]
          lg:px-8
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
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                border
                border-white/[0.08]
                bg-white/[0.05]
                text-purple-300
                backdrop-blur-sm
              "
            >
              <ShieldIcon />
            </div>

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
          </div>

          <h1
            className="
              mt-5
              text-[36px]
              font-extrabold
              leading-[1.15]
              tracking-[-0.045em]
              text-white

              sm:text-[46px]
              lg:text-[54px]
            "
          >
            Kişisel Verilerin
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
              Korunması
            </span>
          </h1>

          <p
            className="
              mt-4
              max-w-[680px]
              text-[15px]
              leading-7
              text-white/70

              sm:text-[16px]
              sm:leading-8
            "
          >
            Kişisel verilerin korunmasına ilişkin bilgilendirme ve KVKK
            aydınlatma metni.
          </p>
        </div>
      </div>
    </section>
  );
}

function BilgiKarti({ icon, baslik, aciklama }) {
  return (
    <article
      className="
        rounded-[20px]
        border
        border-zinc-200/80
        bg-[#fafafa]
        p-5
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

function KvkkBosDurum() {
  return (
    <div
      className="
        mt-7
        rounded-[18px]
        border
        border-dashed
        border-zinc-200
        bg-zinc-50
        px-5
        py-8
        text-center
      "
    >
      <p
        className="
          text-[13px]
          font-extrabold
          text-zinc-800
        "
      >
        KVKK metni henüz yayınlanmadı
      </p>

      <p
        className="
          mt-2
          text-[12px]
          leading-6
          text-zinc-500
        "
      >
        Kişisel verilerin korunmasına ilişkin bilgilendirme metni
        yayınlandığında bu alanda görüntülenecektir.
      </p>
    </div>
  );
}

function KvkkSkeleton() {
  return (
    <div className="mt-7 space-y-4">
      {Array.from({
        length: 9,
      }).map((_, index) => (
        <div
          key={index}
          className={`
            h-4
            animate-pulse
            rounded
            bg-zinc-100

            ${index % 3 === 2 ? "w-4/5" : "w-full"}
          `}
        />
      ))}
    </div>
  );
}

function telefonTemizle(telefon) {
  return String(telefon ?? "").replace(/[^\d+]/g, "");
}

function ShieldIcon() {
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
        d="M12 3 5 6v5c0 4.5 2.8 8 7 10 4.2-2 7-5.5 7-10V6l-7-3Z"
        strokeLinejoin="round"
      />

      <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M6 3h8l4 4v14H6V3Z" strokeLinejoin="round" />

      <path d="M14 3v5h4M9 12h6M9 16h6" strokeLinecap="round" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4 shrink-0"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />

      <path d="m4 7 8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4 shrink-0"
      aria-hidden="true"
    >
      <path
        d="M6.5 4h3l1 4-2 1.5a14 14 0 0 0 6 6l1.5-2 4 1v3c0 1.1-.9 2-2 2C10.3 19.5 4.5 13.7 4.5 6c0-1.1.9-2 2-2Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TransparencyIcon() {
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

function SecurityIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <rect x="6" y="10" width="12" height="9" rx="2" />

      <path d="M9 10V7a3 3 0 0 1 6 0v3" strokeLinecap="round" />
    </svg>
  );
}

function ContactIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M4 5h16v11H8l-4 4V5Z" strokeLinejoin="round" />

      <path d="M8 9h8M8 12h5" strokeLinecap="round" />
    </svg>
  );
}

export default KvkkSayfasi;
