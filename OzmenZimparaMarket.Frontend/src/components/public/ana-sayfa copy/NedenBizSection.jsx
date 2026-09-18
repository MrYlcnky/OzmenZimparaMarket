import Container from "../../ui/Container";
import Section from "../../ui/Section";

const avantajlar = [
  {
    id: 1,
    baslik: "Geniş Ürün Çeşitliliği",
    aciklama:
      "Farklı yüzey, ölçü ve uygulama ihtiyaçlarına yönelik profesyonel zımpara ve aşındırıcı ürün grupları.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 5.5h6v6H4v-6ZM14 5.5h6v6h-6v-6ZM4 15.5h6v4H4v-4ZM14 15.5h6v4h-6v-4Z"
        />
      </svg>
    ),
  },
  {
    id: 2,
    baslik: "Teknik İhtiyaca Uygun Seçim",
    aciklama:
      "Ürünleri yalnızca isimlerine göre değil, kullanım alanı ve teknik özellikleri doğrultusunda değerlendiren yaklaşım.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3.75a6.25 6.25 0 0 0-3.7 11.3c.77.56 1.2 1.2 1.2 2v.45h5v-.45c0-.8.42-1.43 1.2-2A6.25 6.25 0 0 0 12 3.75Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.75 20.25h4.5M10 17.5h4"
        />
      </svg>
    ),
  },
  {
    id: 3,
    baslik: "Profesyonel Tedarik Yaklaşımı",
    aciklama:
      "Endüstriyel ve profesyonel uygulamalara uygun ürün gruplarını düzenli, erişilebilir ve anlaşılır biçimde sunan yapı.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5v-9Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m4.5 7.75 7.5 4.25 7.5-4.25M12 12v9"
        />
      </svg>
    ),
  },
  {
    id: 4,
    baslik: "Hızlı İletişim ve Teklif",
    aciklama:
      "İhtiyacınız olan ürünleri teklif sepetine ekleyerek WhatsApp üzerinden hızlı ve doğrudan iletişim kurabilirsiniz.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 5.5h14v10H9l-4 3v-13Z"
        />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 9h8M8 12h5" />
      </svg>
    ),
  },
];

function NedenBizSection() {
  return (
    <Section className="bg-surface-soft">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand-purple">
            Neden Biz?
          </p>

          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl">
            Neden Özmen Zımpara Market?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-text-secondary">
            Ürün çeşitliliğinden teknik ihtiyaca uygun seçime kadar profesyonel
            tedarik sürecini daha anlaşılır ve erişilebilir hale getiriyoruz.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {avantajlar.map((avantaj) => (
            <article
              key={avantaj.id}
              className="
                rounded-ui-lg border border-border
                bg-white p-6 shadow-card
                transition-all duration-300
                hover:-translate-y-1
                hover:border-brand-blue/25
                hover:shadow-card-hover
              "
            >
              <div
                className="
                  flex h-12 w-12 items-center justify-center
                  rounded-ui
                  bg-gradient-to-br
                  from-brand-blue/10
                  to-brand-purple/10
                  text-brand-blue
                "
              >
                {avantaj.icon}
              </div>

              <h3 className="mt-6 text-lg font-bold leading-7 text-text-primary">
                {avantaj.baslik}
              </h3>

              <p className="mt-3 text-sm leading-6 text-text-secondary">
                {avantaj.aciklama}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}

export default NedenBizSection;
