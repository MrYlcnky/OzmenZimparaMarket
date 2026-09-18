import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";

import KategoriAgaci from "../../components/public/urunler/KategoriAgaci";
import UrunFiltreleri from "../../components/public/urunler/UrunFiltreleri";
import UrunListesi from "../../components/public/urunler/UrunListesi";

import Container from "../../components/ui/Container";
import Section from "../../components/ui/Section";

const geciciKategoriler = [
  {
    id: 1,
    kategoriAdi: "Zımpara Bantları",
    seoUrl: "zimpara-bantlari",
    altKategoriler: [
      {
        id: 11,
        kategoriAdi: "Dar Bantlar",
        seoUrl: "dar-bantlar",
      },
      {
        id: 12,
        kategoriAdi: "Geniş Bantlar",
        seoUrl: "genis-bantlar",
      },
      {
        id: 13,
        kategoriAdi: "Eğeler",
        seoUrl: "egeler",
      },
    ],
  },
  {
    id: 2,
    kategoriAdi: "Zımpara Diskleri",
    seoUrl: "zimpara-diskleri",
    altKategoriler: [],
  },
  {
    id: 3,
    kategoriAdi: "Zımpara Ruloları",
    seoUrl: "zimpara-rulolari",
    altKategoriler: [],
  },
  {
    id: 4,
    kategoriAdi: "Yüzey İşleme Ürünleri",
    seoUrl: "yuzey-isleme-urunleri",
    altKategoriler: [],
  },
];

const geciciUrunler = [
  {
    id: 1,
    urunAdi: "Seramik Zımpara Bant",
    urunKodu: "OZM-BANT-001",
    kategoriAdi: "Zımpara Bantları",
    kategoriSeoUrl: "zimpara-bantlari",
    kisaAciklama:
      "Profesyonel metal işleme uygulamaları için yüksek performanslı zımpara bant çözümü.",
    seoUrl: "seramik-zimpara-bant",
    gorselYolu: null,
  },
  {
    id: 2,
    urunAdi: "Dar Zımpara Bant",
    urunKodu: "OZM-BANT-002",
    kategoriAdi: "Dar Bantlar",
    kategoriSeoUrl: "dar-bantlar",
    kisaAciklama:
      "Dar yüzeylerde ve hassas uygulamalarda kontrollü aşındırma için zımpara bant çözümü.",
    seoUrl: "dar-zimpara-bant",
    gorselYolu: null,
  },
  {
    id: 3,
    urunAdi: "Profesyonel Zımpara Disk",
    urunKodu: "OZM-DISK-001",
    kategoriAdi: "Zımpara Diskleri",
    kategoriSeoUrl: "zimpara-diskleri",
    kisaAciklama:
      "Metal ve farklı yüzeylerde profesyonel aşındırma ve finisaj uygulamalarına uygun disk.",
    seoUrl: "profesyonel-zimpara-disk",
    gorselYolu: null,
  },
  {
    id: 4,
    urunAdi: "Endüstriyel Zımpara Rulo",
    urunKodu: "OZM-RULO-001",
    kategoriAdi: "Zımpara Ruloları",
    kategoriSeoUrl: "zimpara-rulolari",
    kisaAciklama:
      "İhtiyaca göre kullanılabilen profesyonel ve endüstriyel zımpara rulosu.",
    seoUrl: "endustriyel-zimpara-rulo",
    gorselYolu: null,
  },
];

function UrunlerSayfasi() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobilFiltreAcik, setMobilFiltreAcik] = useState(false);

  const seciliKategori = searchParams.get("kategori");

  const filtrelenmisUrunler = useMemo(() => {
    if (!seciliKategori) {
      return geciciUrunler;
    }

    return geciciUrunler.filter(
      (urun) => urun.kategoriSeoUrl === seciliKategori,
    );
  }, [seciliKategori]);

  function kategoriSec(seoUrl) {
    if (!seoUrl) {
      setSearchParams({});
    } else {
      setSearchParams({
        kategori: seoUrl,
      });
    }

    setMobilFiltreAcik(false);
  }

  return (
    <>
      {/* Sayfa başlığı */}
      <section className="border-b border-border bg-surface-soft">
        <Container>
          <div className="py-12 sm:py-16">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand-blue">
              Ürün Kataloğu
            </p>

            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-text-primary sm:text-5xl">
              Ürünler
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-text-secondary">
              Kategori ve teknik özelliklere göre filtreleyerek ihtiyacınıza
              uygun profesyonel zımpara ürünlerini inceleyin.
            </p>
          </div>
        </Container>
      </section>

      <Section>
        <Container>
          {/* Mobil filtre butonu */}
          <div className="mb-6 lg:hidden">
            <button
              type="button"
              onClick={() => setMobilFiltreAcik(!mobilFiltreAcik)}
              className="
                flex w-full items-center justify-between
                rounded-ui border border-border
                bg-white px-4 py-3
                text-sm font-bold text-text-primary
                shadow-card
              "
            >
              <span>Kategori ve Filtreler</span>

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className={`
                  h-5 w-5 transition-transform
                  ${mobilFiltreAcik ? "rotate-180" : ""}
                `}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m6 9 6 6 6-6"
                />
              </svg>
            </button>

            {mobilFiltreAcik && (
              <div className="mt-3 rounded-ui-lg border border-border bg-white p-5 shadow-card">
                <KategoriAgaci
                  kategoriler={geciciKategoriler}
                  seciliKategori={seciliKategori}
                  onKategoriSec={kategoriSec}
                />

                <div className="mt-6">
                  <UrunFiltreleri />
                </div>
              </div>
            )}
          </div>

          <div className="grid gap-10 lg:grid-cols-[280px_minmax(0,1fr)] xl:gap-12">
            {/* Desktop sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-[110px] rounded-ui-lg border border-border bg-white p-5 shadow-card">
                <KategoriAgaci
                  kategoriler={geciciKategoriler}
                  seciliKategori={seciliKategori}
                  onKategoriSec={kategoriSec}
                />

                <div className="mt-6">
                  <UrunFiltreleri />
                </div>
              </div>
            </aside>

            {/* Ürün alanı */}
            <div>
              <div className="mb-6 flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-text-muted">Gösterilen ürün</p>

                  <p className="mt-1 text-lg font-bold text-text-primary">
                    {filtrelenmisUrunler.length} ürün
                  </p>
                </div>

                {seciliKategori && (
                  <button
                    type="button"
                    onClick={() => kategoriSec(null)}
                    className="text-left text-sm font-semibold text-brand-blue transition-colors hover:text-brand-purple"
                  >
                    Kategori filtresini temizle
                  </button>
                )}
              </div>

              <UrunListesi urunler={filtrelenmisUrunler} />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

export default UrunlerSayfasi;
