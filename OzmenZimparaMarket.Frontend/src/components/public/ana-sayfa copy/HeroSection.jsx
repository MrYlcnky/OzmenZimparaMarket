import { NavLink } from "react-router";

import Container from "../../ui/Container";

function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-brand-black text-text-light">
      {/* Arka plan atmosferi */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-40 top-0 h-[520px] w-[520px] rounded-full bg-brand-blue/12 blur-[140px]" />

        <div className="absolute -right-40 bottom-[-120px] h-[560px] w-[560px] rounded-full bg-brand-purple/12 blur-[150px]" />

        <div
          className="
            absolute inset-0 opacity-[0.03]
            [background-image:linear-gradient(rgba(255,255,255,.75)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.75)_1px,transparent_1px)]
            [background-size:48px_48px]
          "
        />

        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      </div>

      <Container className="relative">
        <div className="grid min-h-[calc(100vh-84px)] items-center gap-14 py-14 lg:grid-cols-[1.05fr_.95fr] lg:gap-16 lg:py-20">
          {/* Sol içerik */}
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-brand-blue-light shadow-[0_0_18px_rgba(59,130,246,.8)]" />

              <span className="text-xs font-bold uppercase tracking-[0.16em] text-text-light-muted sm:text-sm">
                Profesyonel Zımpara Tedarikçisi
              </span>
            </div>

            <h1 className="max-w-4xl text-4xl font-extrabold leading-[1.06] tracking-[-0.04em] sm:text-5xl lg:text-6xl xl:text-7xl">
              Profesyonel yüzeyler için
              <span className="block bg-gradient-to-r from-brand-blue-light via-brand-blue to-brand-purple-light bg-clip-text text-transparent">
                doğru zımpara çözümleri.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-text-light-muted sm:text-lg">
              Endüstriyel ve profesyonel uygulamalar için zımpara bantları,
              diskler, rulolar ve yüzey işleme ürünlerini teknik ihtiyacınıza
              uygun seçeneklerle keşfedin.
            </p>

            {/* CTA */}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
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
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-brand-blue-light
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-brand-black
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
                  inline-flex h-12 items-center justify-center
                  rounded-ui border border-white/12
                  bg-white/[0.04] px-6
                  text-sm font-bold text-white
                  backdrop-blur-sm
                  transition-all duration-200
                  hover:border-white/20
                  hover:bg-white/[0.07]
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-white/40
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-brand-black
                "
              >
                Bizimle İletişime Geç
              </NavLink>
            </div>

            {/* Güven mesajları */}
            <div className="mt-12 grid max-w-2xl grid-cols-1 gap-5 border-t border-white/10 pt-7 sm:grid-cols-3">
              <div>
                <p className="text-sm font-bold text-white">Profesyonel</p>

                <p className="mt-1 text-xs leading-5 text-text-light-muted">
                  Endüstriyel ürün seçenekleri
                </p>
              </div>

              <div>
                <p className="text-sm font-bold text-white">Teknik</p>

                <p className="mt-1 text-xs leading-5 text-text-light-muted">
                  İhtiyaca uygun ürün seçimi
                </p>
              </div>

              <div>
                <p className="text-sm font-bold text-white">Güvenilir</p>

                <p className="mt-1 text-xs leading-5 text-text-light-muted">
                  Hızlı iletişim ve tedarik
                </p>
              </div>
            </div>
          </div>

          {/* Hero görseli */}
          <div className="relative mx-auto w-full max-w-[620px] lg:mx-0">
            <div
              className="absolute -inset-6 rounded-[32px] bg-gradient-to-br from-brand-blue/15 via-transparent to-brand-purple/15 blur-2xl"
              aria-hidden="true"
            />

            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-surface-dark shadow-panel">
              <img
                src="/images/hero/hero-main.png"
                alt="Profesyonel zımpara ve yüzey işleme çözümleri"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="
                  aspect-[4/5] w-full
                  object-cover object-center
                  sm:aspect-[5/4]
                  lg:aspect-[4/5]
                "
              />

              {/* Fotoğraf üzeri tonlama */}
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-black/10"
                aria-hidden="true"
              />

              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-blue/10 via-transparent to-brand-purple/10"
                aria-hidden="true"
              />

              {/* Alt bilgi */}
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 lg:p-7">
                <div className="max-w-sm">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-blue-light sm:text-xs">
                    Profesyonel Aşındırıcı Çözümler
                  </p>

                  <p className="mt-2 text-sm font-medium leading-6 text-white/85 sm:text-base">
                    Bant, disk, rulo ve profesyonel yüzey işleme ürünleri.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default HeroSection;
