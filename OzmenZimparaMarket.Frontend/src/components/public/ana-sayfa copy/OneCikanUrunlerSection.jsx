import { NavLink } from "react-router";

import UrunKarti from "../../public/urunler/UrunKarti";
import Container from "../../ui/Container";
import Section from "../../ui/Section";

const geciciUrunler = [
  {
    id: 1,
    urunAdi: "Seramik Zımpara Bant",
    urunKodu: "OZM-BANT-001",
    kategoriAdi: "Zımpara Bantları",
    kisaAciklama:
      "Profesyonel metal işleme ve yüksek performans gerektiren uygulamalar için dayanıklı zımpara bant çözümü.",
    seoUrl: "seramik-zimpara-bant",
    gorselYolu: null,
  },
  {
    id: 2,
    urunAdi: "Profesyonel Zımpara Disk",
    urunKodu: "OZM-DISK-001",
    kategoriAdi: "Zımpara Diskleri",
    kisaAciklama:
      "Farklı yüzey uygulamalarında kontrollü aşındırma ve kaliteli finisaj için profesyonel disk çözümü.",
    seoUrl: "profesyonel-zimpara-disk",
    gorselYolu: null,
  },
  {
    id: 3,
    urunAdi: "Endüstriyel Zımpara Rulo",
    urunKodu: "OZM-RULO-001",
    kategoriAdi: "Zımpara Ruloları",
    kisaAciklama:
      "İhtiyaca göre ölçülendirilebilen, profesyonel ve endüstriyel kullanıma uygun zımpara rulosu.",
    seoUrl: "endustriyel-zimpara-rulo",
    gorselYolu: null,
  },
  {
    id: 4,
    urunAdi: "Yüzey Finisaj Ürünü",
    urunKodu: "OZM-FIN-001",
    kategoriAdi: "Yüzey İşleme Ürünleri",
    kisaAciklama:
      "Yüzey hazırlama ve finisaj uygulamalarında kontrollü ve profesyonel sonuçlar için geliştirilmiş çözüm.",
    seoUrl: "yuzey-finisaj-urunu",
    gorselYolu: null,
  },
];

function OneCikanUrunlerSection() {
  return (
    <Section className="bg-surface-soft">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand-purple">
              Öne Çıkan Ürünler
            </p>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl">
              Profesyonel uygulamalar için seçili ürünler.
            </h2>

            <p className="mt-4 max-w-xl text-base leading-7 text-text-secondary">
              Farklı yüzey ve uygulama ihtiyaçlarına yönelik öne çıkan zımpara
              ve aşındırıcı ürünlerimizi inceleyin.
            </p>
          </div>

          <NavLink
            to="/urunler"
            className="
              inline-flex items-center gap-2
              text-sm font-bold text-brand-blue
              transition-colors
              hover:text-brand-purple
            "
          >
            Tüm Ürünleri İncele
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
          {geciciUrunler.map((urun) => (
            <UrunKarti
              key={urun.id}
              urunAdi={urun.urunAdi}
              urunKodu={urun.urunKodu}
              kategoriAdi={urun.kategoriAdi}
              kisaAciklama={urun.kisaAciklama}
              seoUrl={urun.seoUrl}
              gorselYolu={urun.gorselYolu}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}

export default OneCikanUrunlerSection;
