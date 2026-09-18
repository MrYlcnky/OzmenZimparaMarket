import { NavLink } from "react-router";

import Container from "../../ui/Container";
import Section from "../../ui/Section";

function YuzeyIslemeSection() {
  return (
    <Section className="relative isolate overflow-hidden bg-brand-black text-text-light">
      {/* Arka plan atmosferi */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-40 top-0 h-[480px] w-[480px] rounded-full bg-brand-blue/10 blur-[140px]" />

        <div className="absolute -right-40 bottom-0 h-[520px] w-[520px] rounded-full bg-brand-purple/10 blur-[150px]" />

        <div
          className="
            absolute inset-0 opacity-[0.025]
            [background-image:linear-gradient(rgba(255,255,255,.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.7)_1px,transparent_1px)]
            [background-size:56px_56px]
          "
        />
      </div>

      <Container className="relative">
        {/* Başlık */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand-blue-light">
            Profesyonel Yüzey İşleme
          </p>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Doğru aşındırıcı.
            <span className="bg-gradient-to-r from-brand-blue-light to-brand-purple-light bg-clip-text text-transparent">
              {" "}
              Doğru yüzey.
            </span>
            <span className="block">Profesyonel sonuç.</span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-text-light-muted sm:text-lg">
            Farklı uygulama ve yüzey ihtiyaçları için profesyonel zımpara,
            aşındırıcı ve finisaj çözümlerini keşfedin.
          </p>
        </div>

        {/* Video */}
        <div className="relative mx-auto mt-12 max-w-6xl">
          <div
            className="absolute -inset-5 rounded-[32px] bg-gradient-to-r from-brand-blue/10 via-transparent to-brand-purple/10 blur-2xl"
            aria-hidden="true"
          />

          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-surface-dark shadow-panel">
            <div className="relative aspect-video">
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster="/images/video/yuzey-isleme-poster.webp"
                className="h-full w-full object-cover"
                aria-label="Profesyonel zımpara ve yüzey işleme uygulamaları"
              >
                <source src="/videos/yuzey-isleme.mp4" type="video/mp4" />
              </video>

              {/* Video tonlaması */}
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/20"
                aria-hidden="true"
              />

              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-blue/5 via-transparent to-brand-purple/10"
                aria-hidden="true"
              />

              {/* Video alt metni */}
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 lg:p-10">
                <div className="max-w-xl">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-blue-light">
                    Yüzeyden sonuca
                  </p>

                  <p className="mt-2 text-lg font-bold leading-7 text-white sm:text-xl">
                    Profesyonel uygulamalar için doğru ürün seçimi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alt yönlendirme */}
        <div className="mt-10 flex justify-center">
          <NavLink
            to="/urunler"
            className="
              inline-flex h-12 items-center justify-center gap-2
              rounded-ui border border-white/10
              bg-white/[0.04] px-6
              text-sm font-bold text-white
              transition-all duration-200
              hover:border-brand-blue/40
              hover:bg-white/[0.07]
            "
          >
            Ürünleri Keşfet
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
        </div>
      </Container>
    </Section>
  );
}

export default YuzeyIslemeSection;
