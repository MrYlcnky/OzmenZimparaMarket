import { NavLink } from "react-router";

import Container from "./Container";

function PublicFooter() {
  const yil = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-brand-black text-text-light">
      <Container>
        <div className="grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-16 lg:py-16">
          {/* Marka */}
          <div>
            <NavLink
              to="/"
              className="inline-flex"
              aria-label="Özmen Zımpara Market Ana Sayfa"
            >
              <img
                src="/logo/header2.png"
                alt="Özmen Zımpara Market"
                className="h-14 w-auto object-contain"
              />
            </NavLink>

            <p className="mt-6 max-w-md text-sm leading-7 text-text-light-muted">
              Profesyonel ve endüstriyel uygulamalar için zımpara, aşındırıcı ve
              yüzey işleme çözümleri sunan güvenilir tedarik ortağınız.
            </p>

            <div className="mt-6 h-px w-20 bg-gradient-to-r from-brand-blue to-brand-purple" />
          </div>

          {/* Navigasyon */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-white">
              Hızlı Erişim
            </h2>

            <nav className="mt-5 flex flex-col items-start gap-3">
              <NavLink
                to="/"
                className="text-sm text-text-light-muted transition-colors hover:text-white"
              >
                Ana Sayfa
              </NavLink>

              <NavLink
                to="/urunler"
                className="text-sm text-text-light-muted transition-colors hover:text-white"
              >
                Ürünler
              </NavLink>

              <NavLink
                to="/hakkimizda"
                className="text-sm text-text-light-muted transition-colors hover:text-white"
              >
                Hakkımızda
              </NavLink>

              <NavLink
                to="/iletisim"
                className="text-sm text-text-light-muted transition-colors hover:text-white"
              >
                İletişim
              </NavLink>
            </nav>
          </div>

          {/* İletişim yönlendirmesi */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-white">
              İletişim
            </h2>

            <p className="mt-5 text-sm leading-7 text-text-light-muted">
              Ürün seçimi, teknik ihtiyaçlar ve teklif talepleriniz için bizimle
              iletişime geçebilirsiniz.
            </p>

            <NavLink
              to="/iletisim"
              className="
                mt-5 inline-flex items-center gap-2
                text-sm font-semibold text-brand-blue-light
                transition-colors hover:text-white
              "
            >
              İletişim bilgilerini görüntüle
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

        <div className="border-t border-white/10 py-6">
          <div className="flex flex-col gap-4 text-xs text-text-light-muted sm:flex-row sm:items-center sm:justify-between">
            <p>© {yil} Özmen Zımpara Market. Tüm hakları saklıdır.</p>

            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <span>Profesyonel Zımpara Tedarikçisi</span>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default PublicFooter;
