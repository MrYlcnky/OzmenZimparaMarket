import { NavLink } from "react-router";

import KategoriKarti from "../../public/kategoriler/KategoriKarti";
import Container from "../../ui/Container";
import Section from "../../ui/Section";

const geciciKategoriler = [
  {
    id: 1,
    kategoriAdi: "Zımpara Bantları",
    aciklama:
      "Profesyonel ve endüstriyel uygulamalar için farklı ölçü ve özelliklerde zımpara bantları.",
    seoUrl: "zimpara-bantlari",
    gorselYolu: null,
  },
  {
    id: 2,
    kategoriAdi: "Zımpara Diskleri",
    aciklama:
      "Metal, ahşap ve farklı yüzey uygulamalarına uygun profesyonel zımpara diskleri.",
    seoUrl: "zimpara-diskleri",
    gorselYolu: null,
  },
  {
    id: 3,
    kategoriAdi: "Zımpara Ruloları",
    aciklama:
      "Kesilebilir ve farklı uygulama ihtiyaçlarına göre kullanılabilir zımpara ruloları.",
    seoUrl: "zimpara-rulolari",
    gorselYolu: null,
  },
  {
    id: 4,
    kategoriAdi: "Yüzey İşleme Ürünleri",
    aciklama:
      "Profesyonel yüzey hazırlama, finisaj ve aşındırma uygulamalarına yönelik çözümler.",
    seoUrl: "yuzey-isleme-urunleri",
    gorselYolu: null,
  },
];

function KategorilerSection() {
  return (
    <Section className="bg-surface">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand-blue">
              Ürün Grupları
            </p>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl">
              İhtiyacınıza uygun zımpara ürünlerini keşfedin.
            </h2>

            <p className="mt-4 max-w-xl text-base leading-7 text-text-secondary">
              Profesyonel uygulamalar için farklı kullanım alanlarına, ölçülere
              ve teknik ihtiyaçlara yönelik ürün gruplarımızı inceleyin.
            </p>
          </div>

          <NavLink
            to="/urunler"
            className="
              inline-flex items-center gap-2
              text-sm font-bold text-brand-blue
              transition-colors hover:text-brand-purple
            "
          >
            Tüm Ürünleri Gör
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

        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {geciciKategoriler.map((kategori) => (
            <KategoriKarti
              key={kategori.id}
              kategoriAdi={kategori.kategoriAdi}
              aciklama={kategori.aciklama}
              seoUrl={kategori.seoUrl}
              gorselYolu={kategori.gorselYolu}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}

export default KategorilerSection;
