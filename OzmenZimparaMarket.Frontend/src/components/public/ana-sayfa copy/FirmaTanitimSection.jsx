import { NavLink } from "react-router";

import Container from "../../ui/Container";
import Section from "../../ui/Section";

function FirmaTanitimSection() {
  return (
    <Section className="bg-surface">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          {/* Görsel / Marka alanı */}
          <div className="relative">
            <div
              className="absolute -inset-6 rounded-[32px] bg-gradient-to-br from-brand-blue/10 via-transparent to-brand-purple/10 blur-2xl"
              aria-hidden="true"
            />

            <div className="relative overflow-hidden rounded-[28px] border border-border bg-brand-black p-8 shadow-panel sm:p-10 lg:p-12">
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.035]
                [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)]
                [background-size:44px_44px]"
                aria-hidden="true"
              />

              <div className="relative">
                <img
                  src="/logo/header2.png"
                  alt="Özmen Zımpara Market"
                  className="h-16 w-auto object-contain sm:h-20"
                />

                <div className="mt-10 h-px w-full bg-gradient-to-r from-brand-blue via-brand-purple to-transparent" />

                <p className="mt-8 max-w-md text-base leading-7 text-text-light-muted">
                  Profesyonel ve endüstriyel uygulamalara yönelik zımpara,
                  aşındırıcı ve yüzey işleme ürünlerinin tedarikinde çözüm
                  odaklı yaklaşım.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-ui border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-sm font-bold text-white">
                      Profesyonel Ürünler
                    </p>

                    <p className="mt-1 text-xs leading-5 text-text-light-muted">
                      Endüstriyel kullanım ihtiyaçlarına yönelik ürün grupları.
                    </p>
                  </div>

                  <div className="rounded-ui border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-sm font-bold text-white">
                      Teknik Yaklaşım
                    </p>

                    <p className="mt-1 text-xs leading-5 text-text-light-muted">
                      Uygulamaya ve yüzeye uygun ürün seçenekleri.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Metin */}
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand-blue">
              Özmen Zımpara Market
            </p>

            <h2 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl">
              Profesyonel zımpara tedarikinde çözüm odaklı yaklaşım.
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-8 text-text-secondary">
              Özmen Zımpara Market; profesyonel ve endüstriyel uygulamalarda
              kullanılan zımpara, aşındırıcı ve yüzey işleme ürünlerini doğru
              ihtiyaçlarla buluşturmayı hedefleyen bir tedarikçidir.
            </p>

            <p className="mt-4 max-w-2xl text-base leading-8 text-text-secondary">
              Ürün seçimini yalnızca ürün adı üzerinden değil; kullanım alanı,
              yüzey yapısı, ölçü ve teknik özellikler doğrultusunda ele alarak
              müşterilerin ihtiyaçlarına uygun seçeneklere daha kolay ulaşmasını
              amaçlıyoruz.
            </p>

            <NavLink
              to="/hakkimizda"
              className="
                mt-8 inline-flex h-12 items-center justify-center gap-2
                rounded-ui border border-border
                bg-white px-6
                text-sm font-bold text-text-primary
                shadow-card
                transition-all duration-200
                hover:-translate-y-0.5
                hover:border-brand-blue/30
                hover:text-brand-blue
                hover:shadow-card-hover
              "
            >
              Firmamızı Tanıyın
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
        </div>
      </Container>
    </Section>
  );
}

export default FirmaTanitimSection;
