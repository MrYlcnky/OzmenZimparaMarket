import { usePublicSite } from "../../contexts/PublicSiteContext";

function IletisimSayfasi() {
  const { firmaBilgisi, whatsappBaglantisi, tamAdres, yukleniyorMu } =
    usePublicSite();

  const sirketAdi = firmaBilgisi?.sirketAdi || "Özmen Zımpara Market";

  const iletisimNo = firmaBilgisi?.iletisimNo?.trim() || "";

  const eposta = firmaBilgisi?.eposta?.trim() || "";

  const adres = tamAdres?.trim() || adresOlustur(firmaBilgisi);

  const haritaAramaBaglantisi = adres
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        adres,
      )}`
    : "";

  const haritaEmbedBaglantisi = adres
    ? `https://www.google.com/maps?q=${encodeURIComponent(adres)}&output=embed`
    : "";

  return (
    <>
      <IletisimHero />

      <main
        className="
          w-full
          bg-[#f6f7f9]
        "
      >
        {/* İletişim kanalları */}
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

                lg:grid-cols-[0.72fr_1.28fr]
                lg:items-start
                lg:gap-12
              "
            >
              {/* Sol bilgi */}
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
                  İletişim
                </p>

                <h2
                  className="
                    mt-3
                    max-w-[560px]
                    text-[30px]
                    font-extrabold
                    leading-[1.2]
                    tracking-[-0.04em]
                    text-zinc-950

                    sm:text-[36px]
                    lg:text-[42px]
                  "
                >
                  Size nasıl
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
                    yardımcı olabiliriz?
                  </span>
                </h2>

                <p
                  className="
                    mt-4
                    max-w-[540px]
                    text-[14px]
                    leading-7
                    text-zinc-500

                    sm:text-[15px]
                  "
                >
                  Ürün seçimi, teknik özellikler, ürün tedariği veya genel bilgi
                  talepleriniz için iletişim kanallarımız üzerinden bizimle
                  doğrudan iletişime geçebilirsiniz.
                </p>

                <div
                  className="
                    mt-7
                    rounded-[22px]
                    border
                    border-zinc-200
                    bg-white
                    p-5
                  "
                >
                  <p
                    className="
                      text-[10px]
                      font-extrabold
                      uppercase
                      tracking-[0.12em]
                      text-purple-600
                    "
                  >
                    Firma
                  </p>

                  <h3
                    className="
                      mt-2
                      text-[18px]
                      font-extrabold
                      text-zinc-950
                    "
                  >
                    {sirketAdi}
                  </h3>

                  {adres && (
                    <p
                      className="
                        mt-3
                        text-[12px]
                        leading-6
                        text-zinc-500
                      "
                    >
                      {adres}
                    </p>
                  )}
                </div>
              </div>

              {/* İletişim kartları */}
              <div
                className="
                  grid
                  gap-4

                  sm:grid-cols-2
                "
              >
                {yukleniyorMu ? (
                  <IletisimKartlariSkeleton />
                ) : (
                  <>
                    <IletisimKarti
                      icon={<PhoneIcon />}
                      ustBaslik="Telefon"
                      baslik={iletisimNo || "Telefon bilgisi bulunmuyor"}
                      aciklama="Ürün ve tedarik talepleriniz için bizi arayabilirsiniz."
                      href={
                        iletisimNo ? `tel:${telefonTemizle(iletisimNo)}` : ""
                      }
                    />

                    <IletisimKarti
                      icon={<WhatsAppIcon />}
                      ustBaslik="WhatsApp"
                      baslik="WhatsApp'tan İletişime Geç"
                      aciklama="Ürün, teknik özellik ve teklif taleplerinizi WhatsApp üzerinden iletebilirsiniz."
                      href={whatsappBaglantisi}
                      yeniSekme
                      whatsapp
                    />

                    <IletisimKarti
                      icon={<MailIcon />}
                      ustBaslik="E-posta"
                      baslik={eposta || "E-posta bilgisi bulunmuyor"}
                      aciklama="Kurumsal talepleriniz ve bilgi istekleriniz için e-posta gönderebilirsiniz."
                      href={eposta ? `mailto:${eposta}` : ""}
                    />

                    <IletisimKarti
                      icon={<LocationIcon />}
                      ustBaslik="Adres"
                      baslik={adres || "Adres bilgisi bulunmuyor"}
                      aciklama="Konumumuzu harita üzerinden görüntüleyebilir ve yol tarifi alabilirsiniz."
                      href={haritaAramaBaglantisi}
                      yeniSekme
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Harita */}
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
            <div
              className="
                mb-8
                flex
                flex-col
                gap-5

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
                    text-purple-600
                  "
                >
                  Konum
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
                  Bizi Haritada Bulun
                </h2>
              </div>

              {adres && (
                <p
                  className="
                    max-w-[560px]
                    text-[13px]
                    leading-6
                    text-zinc-500
                  "
                >
                  {adres}
                </p>
              )}
            </div>

            {haritaEmbedBaglantisi ? (
              <div
                className="
                  overflow-hidden
                  rounded-[26px]
                  border
                  border-zinc-200
                  bg-zinc-100
                  shadow-[0_18px_50px_rgba(15,23,42,0.05)]
                "
              >
                <iframe
                  src={haritaEmbedBaglantisi}
                  title={`${sirketAdi} konumu`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="
                    h-[420px]
                    w-full
                    border-0

                    lg:h-[520px]
                  "
                />
              </div>
            ) : (
              <div
                className="
                  flex
                  min-h-[320px]
                  items-center
                  justify-center
                  rounded-[26px]
                  border
                  border-dashed
                  border-zinc-200
                  bg-zinc-50
                  px-6
                  text-center
                "
              >
                <div>
                  <LocationIconLarge />

                  <h3
                    className="
                      mt-4
                      text-[16px]
                      font-extrabold
                      text-zinc-900
                    "
                  >
                    Konum bilgisi bulunamadı
                  </h3>

                  <p
                    className="
                      mt-2
                      text-[12px]
                      text-zinc-500
                    "
                  >
                    Firma adresi yayınlandığında harita burada
                    görüntülenecektir.
                  </p>
                </div>
              </div>
            )}

            {haritaAramaBaglantisi && (
              <div
                className="
                  mt-5
                  flex
                  justify-end
                "
              >
                <a
                  href={haritaAramaBaglantisi}
                  target="_blank"
                  rel="noreferrer"
                  className="
                    inline-flex
                    min-h-[44px]
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-zinc-200
                    bg-white
                    px-4
                    text-[12px]
                    font-extrabold
                    text-zinc-700
                    transition-all

                    hover:border-purple-200
                    hover:text-purple-700
                  "
                >
                  <LocationIconSmall />
                  Google Maps'te Aç
                  <ArrowIcon />
                </a>
              </div>
            )}
          </div>
        </section>

        {/* Hızlı iletişim */}
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
              <div
                className="
                  pointer-events-none
                  absolute
                  -right-28
                  -top-28
                  h-[320px]
                  w-[320px]
                  rounded-full
                  bg-purple-600/[0.14]
                  blur-[100px]
                "
              />

              <div className="relative">
                <p
                  className="
                    text-[11px]
                    font-extrabold
                    uppercase
                    tracking-[0.15em]
                    text-purple-400
                  "
                >
                  Hızlı İletişim
                </p>

                <h2
                  className="
                    mt-3
                    max-w-[720px]
                    text-[26px]
                    font-extrabold
                    leading-[1.2]
                    tracking-[-0.035em]
                    text-white

                    sm:text-[32px]
                  "
                >
                  Ürün ihtiyacınız için bizimle doğrudan iletişime geçin.
                </h2>

                <p
                  className="
                    mt-3
                    max-w-[660px]
                    text-[13px]
                    leading-6
                    text-white/50
                  "
                >
                  Aradığınız ürün veya teknik özellik konusunda bilgi almak için
                  telefon, WhatsApp veya e-posta kanallarımızı
                  kullanabilirsiniz.
                </p>
              </div>

              <div
                className="
                  relative
                  mt-7
                  flex
                  flex-wrap
                  gap-3

                  lg:mt-0
                  lg:shrink-0
                "
              >
                {whatsappBaglantisi && (
                  <a
                    href={whatsappBaglantisi}
                    target="_blank"
                    rel="noreferrer"
                    className="
                      inline-flex
                      min-h-[46px]
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-[#25D366]
                      px-5
                      text-[12px]
                      font-extrabold
                      text-white
                      transition-all

                      hover:-translate-y-0.5
                      hover:bg-[#20bd5a]
                    "
                  >
                    <WhatsAppIcon />
                    WhatsApp
                  </a>
                )}

                {iletisimNo && (
                  <a
                    href={`tel:${telefonTemizle(iletisimNo)}`}
                    className="
                      inline-flex
                      min-h-[46px]
                      items-center
                      justify-center
                      gap-2
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
                    <PhoneIcon />
                    Bizi Arayın
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

function IletisimHero() {
  return (
    <section
      className="
        relative
        isolate
        min-h-[330px]
        overflow-hidden
        bg-[#060913]

        sm:min-h-[370px]
        lg:min-h-[400px]
      "
    >
      {/* Hero arka plan görseli */}
      <img
        src="/images/hero/hero-iletisim.png"
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

      {/* Metin okunabilirliği için koyu overlay */}
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
          -top-40
          -z-10
          h-[430px]
          w-[430px]
          rounded-full
          bg-blue-600/[0.11]
          blur-[130px]
        "
      />

      {/* Sağ mor vurgu */}
      <div
        className="
          pointer-events-none
          absolute
          -bottom-40
          right-[-100px]
          -z-10
          h-[440px]
          w-[440px]
          rounded-full
          bg-purple-600/[0.16]
          blur-[130px]
        "
      />

      <div
        className="
          relative
          mx-auto
          flex
          min-h-[330px]
          w-full
          max-w-[1440px]
          items-center
          px-5

          sm:min-h-[370px]
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
            Bize Ulaşın
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
            İhtiyacınız için
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
              bizimle iletişime geçin.
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
            Ürün, teknik özellik ve tedarik talepleriniz için iletişim
            kanallarımız üzerinden bize kolayca ulaşabilirsiniz.
          </p>
        </div>
      </div>
    </section>
  );
}
function IletisimKarti({
  icon,
  ustBaslik,
  baslik,
  aciklama,
  href,
  yeniSekme = false,
  whatsapp = false,
}) {
  const icerik = (
    <>
      <div
        className={`
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-xl

          ${
            whatsapp
              ? "bg-[#25D366]/10 text-[#20b858]"
              : "bg-gradient-to-br from-blue-50 to-purple-100 text-purple-600"
          }
        `}
      >
        {icon}
      </div>

      <p
        className="
          mt-5
          text-[10px]
          font-extrabold
          uppercase
          tracking-[0.12em]
          text-zinc-400
        "
      >
        {ustBaslik}
      </p>

      <h3
        className="
          mt-1.5
          break-words
          text-[16px]
          font-extrabold
          leading-6
          text-zinc-950
        "
      >
        {baslik}
      </h3>

      <p
        className="
          mt-3
          text-[12px]
          leading-6
          text-zinc-500
        "
      >
        {aciklama}
      </p>

      {href && (
        <div
          className="
            mt-auto
            flex
            items-center
            gap-2
            pt-5
            text-[11px]
            font-extrabold
            text-purple-600
          "
        >
          İletişime Geç
          <ArrowIcon />
        </div>
      )}
    </>
  );

  const className = `
    flex
    min-h-[245px]
    flex-col
    rounded-[22px]
    border
    border-zinc-200/80
    bg-white
    p-5
    transition-all
    duration-300

    ${
      href
        ? "hover:-translate-y-1 hover:border-purple-200 hover:shadow-[0_18px_45px_rgba(15,23,42,0.07)]"
        : ""
    }
  `;

  if (!href) {
    return <article className={className}>{icerik}</article>;
  }

  return (
    <a
      href={href}
      target={yeniSekme ? "_blank" : undefined}
      rel={yeniSekme ? "noreferrer" : undefined}
      className={className}
    >
      {icerik}
    </a>
  );
}

function IletisimKartlariSkeleton() {
  return Array.from({
    length: 4,
  }).map((_, index) => (
    <div
      key={index}
      className="
        min-h-[245px]
        animate-pulse
        rounded-[22px]
        border
        border-zinc-200
        bg-white
        p-5
      "
    >
      <div
        className="
          h-11
          w-11
          rounded-xl
          bg-zinc-100
        "
      />

      <div
        className="
          mt-6
          h-3
          w-20
          rounded
          bg-zinc-100
        "
      />

      <div
        className="
          mt-3
          h-5
          w-3/4
          rounded
          bg-zinc-100
        "
      />

      <div
        className="
          mt-5
          h-14
          rounded
          bg-zinc-50
        "
      />
    </div>
  ));
}

function adresOlustur(firmaBilgisi) {
  if (!firmaBilgisi) {
    return "";
  }

  return [firmaBilgisi.acikAdres, firmaBilgisi.ilce, firmaBilgisi.il]
    .filter((deger) => typeof deger === "string" && deger.trim())
    .join(", ");
}

function telefonTemizle(telefon) {
  return String(telefon ?? "").replace(/[^\d+]/g, "");
}

function PhoneIcon() {
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
        d="M6.5 4h3l1 4-2 1.5a14 14 0 0 0 6 6l1.5-2 4 1v3c0 1.1-.9 2-2 2C10.3 19.5 4.5 13.7 4.5 6c0-1.1.9-2 2-2Z"
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
      className="h-5 w-5"
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

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />

      <path d="m4 7 8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LocationIcon() {
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
        d="M12 21s6-5.5 6-11a6 6 0 1 0-12 0c0 5.5 6 11 6 11Z"
        strokeLinejoin="round"
      />

      <circle cx="12" cy="10" r="2" />
    </svg>
  );
}

function LocationIconSmall() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="M12 21s6-5.5 6-11a6 6 0 1 0-12 0c0 5.5 6 11 6 11Z"
        strokeLinejoin="round"
      />

      <circle cx="12" cy="10" r="2" />
    </svg>
  );
}

function LocationIconLarge() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className="
        mx-auto
        h-10
        w-10
        text-purple-500
      "
      aria-hidden="true"
    >
      <path
        d="M12 21s6-5.5 6-11a6 6 0 1 0-12 0c0 5.5 6 11 6 11Z"
        strokeLinejoin="round"
      />

      <circle cx="12" cy="10" r="2" />
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
      className="h-4 w-4"
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

export default IletisimSayfasi;
