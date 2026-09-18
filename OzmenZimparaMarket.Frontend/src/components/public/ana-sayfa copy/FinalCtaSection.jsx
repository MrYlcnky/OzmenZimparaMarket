import { NavLink } from "react-router";

import Container from "../../ui/Container";
import Section from "../../ui/Section";

function FinalCtaSection() {
  return (
    <Section className="relative isolate overflow-hidden bg-brand-black text-text-light">
      {/* Arka plan */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-32 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-brand-blue/15 blur-[130px]" />

        <div className="absolute -right-32 top-1/2 h-[440px] w-[440px] -translate-y-1/2 rounded-full bg-brand-purple/15 blur-[140px]" />

        <div
          className="
            absolute inset-0 opacity-[0.025]
            [background-image:linear-gradient(rgba(255,255,255,.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.7)_1px,transparent_1px)]
            [background-size:52px_52px]
          "
        />
      </div>

      <Container className="relative">
        <div
          className="
            relative overflow-hidden
            rounded-[28px]
            border border-white/10
            bg-white/[0.035]
            px-6 py-12
            backdrop-blur-sm
            sm:px-10 sm:py-14
            lg:px-16 lg:py-16
          "
        >
          <div
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-blue/80 to-brand-purple/80"
            aria-hidden="true"
          />

          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand-blue-light">
              İhtiyacınıza Uygun Çözüm
            </p>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              İhtiyacınıza uygun zımpara çözümünü
              <span className="block bg-gradient-to-r from-brand-blue-light to-brand-purple-light bg-clip-text text-transparent">
                birlikte belirleyelim.
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-text-light-muted sm:text-lg">
              Ürün seçimi, teknik ihtiyaçlarınız ve teklif talepleriniz için
              ürünlerimizi inceleyebilir veya bizimle doğrudan iletişime
              geçebilirsiniz.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <NavLink
                to="/urunler"
                className="
                  inline-flex h-12 items-center justify-center gap-2
                  rounded-ui bg-brand-blue px-6
                  text-sm font-bold text-white
                  shadow-[0_12px_36px_rgba(37,99,235,.25)]
                  transition-all duration-200
                  hover:-translate-y-0.5
                  hover:bg-brand-blue-dark
                  hover:shadow-[0_16px_44px_rgba(37,99,235,.32)]
                "
              >
                Ürünleri İncele
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 12h14M13 6l6 6-6 6"
                  />
                </svg>
              </NavLink>

              <NavLink
                to="/iletisim"
                className="
                  inline-flex h-12 items-center justify-center gap-2
                  rounded-ui border border-white/12
                  bg-white/[0.04] px-6
                  text-sm font-bold text-white
                  transition-all duration-200
                  hover:-translate-y-0.5
                  hover:border-brand-purple/40
                  hover:bg-white/[0.07]
                "
              >
                Bizimle İletişime Geç
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 5.5h14v10H9l-4 3v-13Z"
                  />
                </svg>
              </NavLink>
            </div>

            <p className="mt-6 text-xs text-text-light-muted">
              Teklif sepetinizdeki ürünleri daha sonra WhatsApp üzerinden
              doğrudan iletebileceksiniz.
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}

export default FinalCtaSection;
