import { Link, NavLink } from "react-router";

import { usePublicSite } from "../../../contexts/PublicSiteContext";

function PublicFooter() {
  const {
    firmaBilgisi,
    tamAdres,
    whatsappBaglantisi,
    telefonBaglantisi,
    epostaBaglantisi,
  } = usePublicSite();

  const yil = new Date().getFullYear();

  return (
    <footer
      className="
        border-t
        border-white/[0.07]
        bg-[#060810]
        text-white
      "
    >
      <div
        className="
          mx-auto
          max-w-[1440px]
          px-5
          py-14

          sm:px-6
          lg:px-8
          lg:py-16
        "
      >
        <div
          className="
            grid
            gap-10

            sm:grid-cols-2
            lg:grid-cols-[1.35fr_0.8fr_0.9fr_1.15fr]
          "
        >
          <div>
            <Link to="/" className="inline-flex">
              <img
                src="/logo/header2.png"
                alt="Özmen Zımpara Market"
                className="h-14 w-auto"
              />
            </Link>

            <p
              className="
                mt-5
                max-w-sm
                text-sm
                leading-7
                text-white/45
              "
            >
              Profesyonel zımpara, aşındırıcı ve yüzey işleme çözümlerinde
              güvenilir ürün tedariki.
            </p>

            {whatsappBaglantisi && (
              <a
                href={whatsappBaglantisi}
                target="_blank"
                rel="noreferrer"
                className="
                  mt-6
                  inline-flex
                  h-11
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-[#25D366]
                  px-4
                  text-xs
                  font-extrabold
                  text-white
                  transition

                  hover:bg-[#20bd5a]
                "
              >
                <WhatsAppIcon />
                WhatsApp'tan Ulaşın
              </a>
            )}
          </div>

          <FooterKolonu baslik="Hızlı Erişim">
            <FooterLink to="/">Ana Sayfa</FooterLink>

            <FooterLink to="/urunler">Ürünlerimiz</FooterLink>

            <FooterLink to="/iletisim">Bize Ulaşın</FooterLink>
          </FooterKolonu>

          <FooterKolonu baslik="Kurumsal">
            <FooterLink to="/hakkimizda">Hakkımızda</FooterLink>

            <FooterLink to="/hakkimizda#vizyonumuz">Vizyonumuz</FooterLink>

            <FooterLink to="/hakkimizda#misyonumuz">Misyonumuz</FooterLink>

            <FooterLink to="/hakkimizda#stratejimiz">Stratejimiz</FooterLink>

            <FooterLink to="/hakkimizda#kalite-politikamiz">
              Kalite Politikamız
            </FooterLink>
          </FooterKolonu>

          <FooterKolonu baslik="İletişim">
            {firmaBilgisi.iletisimNo && telefonBaglantisi && (
              <IletisimLinki
                href={telefonBaglantisi}
                baslik="Telefon"
                deger={firmaBilgisi.iletisimNo}
              />
            )}

            {firmaBilgisi.eposta && epostaBaglantisi && (
              <IletisimLinki
                href={epostaBaglantisi}
                baslik="E-posta"
                deger={firmaBilgisi.eposta}
              />
            )}

            {tamAdres && (
              <div className="pt-1">
                <p
                  className="
                    text-[10px]
                    font-extrabold
                    uppercase
                    tracking-[0.12em]
                    text-white/30
                  "
                >
                  Adres
                </p>

                <p
                  className="
                    mt-1.5
                    text-xs
                    leading-6
                    text-white/55
                  "
                >
                  {tamAdres}
                </p>
              </div>
            )}
          </FooterKolonu>
        </div>

        <div
          className="
            mt-12
            flex
            flex-col
            gap-4
            border-t
            border-white/[0.07]
            pt-6
            text-xs
            text-white/35

            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <p>
            © {yil} {firmaBilgisi.sirketAdi || "Özmen Zımpara Market"}. Tüm
            hakları saklıdır.
          </p>

          <Link
            to="/hakkimizda#kvkk"
            className="
              font-semibold
              transition-colors

              hover:text-purple-300
            "
          >
            KVKK
          </Link>
        </div>
      </div>
    </footer>
  );
}

function FooterKolonu({ baslik, children }) {
  return (
    <div>
      <h3
        className="
          text-xs
          font-extrabold
          uppercase
          tracking-[0.14em]
          text-white/85
        "
      >
        {baslik}
      </h3>

      <div
        className="
          mt-5
          flex
          flex-col
          gap-3
        "
      >
        {children}
      </div>
    </div>
  );
}

function FooterLink({ to, children }) {
  return (
    <NavLink
      to={to}
      className="
        w-fit
        text-sm
        font-medium
        text-white/45
        transition-colors

        hover:text-purple-300
      "
    >
      {children}
    </NavLink>
  );
}

function IletisimLinki({ href, baslik, deger }) {
  return (
    <a
      href={href}
      className="
        group
        block
        w-fit
      "
    >
      <p
        className="
          text-[10px]
          font-extrabold
          uppercase
          tracking-[0.12em]
          text-white/30
        "
      >
        {baslik}
      </p>

      <p
        className="
          mt-1
          text-xs
          font-semibold
          text-white/55
          transition-colors

          group-hover:text-purple-300
        "
      >
        {deger}
      </p>
    </a>
  );
}

function WhatsAppIcon() {
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
        d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4A8 8 0 1 1 20 11.5Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path d="M9 8.5c.5 2.5 2 4 4.5 5" strokeLinecap="round" />
    </svg>
  );
}

export default PublicFooter;
