import { useEffect, useState } from "react";
import { Link } from "react-router";

import { kategorileriGetir } from "../../../api/servisler/kategoriServisi";

import KategoriKarti from "../kategoriler/KategoriKarti";

function AnaSayfaKategoriler() {
  const [kategoriler, setKategoriler] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hataVarMi, setHataVarMi] = useState(false);

  useEffect(() => {
    let iptalEdildiMi = false;

    Promise.resolve().then(async () => {
      if (iptalEdildiMi) {
        return;
      }

      try {
        setYukleniyor(true);
        setHataVarMi(false);

        const veri = await kategorileriGetir();

        if (iptalEdildiMi) {
          return;
        }

        const anaSayfaKategorileri = Array.isArray(veri)
          ? veri
              .filter(
                (kategori) =>
                  kategori.aktifMi && kategori.anaSayfadaGosterilsinMi,
              )
              .sort((a, b) => {
                const siraFarki = (a.siraNo ?? 0) - (b.siraNo ?? 0);

                if (siraFarki !== 0) {
                  return siraFarki;
                }

                return (a.id ?? 0) - (b.id ?? 0);
              })
          : [];

        setKategoriler(anaSayfaKategorileri);
      } catch {
        if (!iptalEdildiMi) {
          setHataVarMi(true);
          setKategoriler([]);
        }
      } finally {
        if (!iptalEdildiMi) {
          setYukleniyor(false);
        }
      }
    });

    return () => {
      iptalEdildiMi = true;
    };
  }, []);

  if (!yukleniyor && !hataVarMi && kategoriler.length === 0) {
    return null;
  }

  return (
    <section
      className="
        bg-[#f7f8fa]
        py-20

        sm:py-24
        lg:py-28
      "
    >
      <div
        className="
          mx-auto
          max-w-[1440px]
          px-5

          sm:px-6
          lg:px-8
        "
      >
        {/* Bölüm başlığı */}
        <div
          className="
            flex
            flex-col
            gap-6

            lg:flex-row
            lg:items-end
            lg:justify-between
          "
        >
          <div className="max-w-2xl">
            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <span
                className="
                  h-px
                  w-9
                  bg-gradient-to-r
                  from-blue-600
                  to-purple-600
                "
              />

              <span
                className="
                  text-[10px]
                  font-extrabold
                  uppercase
                  tracking-[0.18em]
                  text-purple-600

                  sm:text-[11px]
                "
              >
                Ürün Kategorileri
              </span>
            </div>

            <h2
              className="
                mt-5
                text-[32px]
                font-extrabold
                leading-[1.08]
                tracking-[-0.04em]
                text-zinc-950

                sm:text-[40px]
                lg:text-[46px]
              "
            >
              Ürün Gruplarımız
            </h2>

            <p
              className="
                mt-4
                max-w-xl
                text-sm
                leading-7
                text-zinc-500

                sm:text-[15px]
              "
            >
              Profesyonel ve endüstriyel uygulamalara yönelik zımpara ve
              aşındırıcı ürün gruplarımızı inceleyin.
            </p>
          </div>

          <Link
            to="/urunler"
            className="
              group
              inline-flex
              w-fit
              items-center
              gap-2
              text-sm
              font-bold
              text-zinc-700
              transition-colors
              duration-300

              hover:text-purple-700
            "
          >
            Tüm Ürünleri İncele
            <ArrowIcon />
          </Link>
        </div>

        {/* Kategori kartları */}
        <div className="mt-12 lg:mt-14">
          {yukleniyor && <KategoriSkeleton />}

          {!yukleniyor && hataVarMi && (
            <div
              className="
                rounded-2xl
                border
                border-zinc-200
                bg-white
                px-6
                py-10
                text-center
              "
            >
              <p
                className="
                  text-sm
                  font-semibold
                  text-zinc-500
                "
              >
                Ürün grupları şu anda görüntülenemiyor.
              </p>
            </div>
          )}

          {!yukleniyor && !hataVarMi && kategoriler.length > 0 && (
            <div
              className="
                  grid
                  gap-4

                  sm:grid-cols-2
                  sm:gap-5

                  lg:grid-cols-4

                  xl:gap-6
                "
            >
              {kategoriler.map((kategori, index) => (
                <KategoriKarti
                  key={kategori.id}
                  kategoriAdi={kategori.kategoriAdi}
                  aciklama={kategori.aciklama}
                  seoUrl={kategori.seoUrl}
                  gorselUrl={kategoriGorselUrlOlustur(kategori.gorselYolu)}
                  siraNo={index + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function kategoriGorselUrlOlustur(gorselYolu) {
  if (!gorselYolu) {
    return null;
  }

  if (/^https?:\/\//i.test(gorselYolu)) {
    return gorselYolu;
  }

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  if (!apiBaseUrl) {
    return gorselYolu;
  }

  const backendBaseUrl = apiBaseUrl.replace(/\/api\/?$/, "");

  const duzeltilmisYol = gorselYolu.startsWith("/")
    ? gorselYolu
    : `/${gorselYolu}`;

  return `${backendBaseUrl}${duzeltilmisYol}`;
}

function KategoriSkeleton() {
  return (
    <div
      className="
        grid
        gap-4

        sm:grid-cols-2
        sm:gap-5

        lg:grid-cols-4

        xl:gap-6
      "
    >
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="
            relative
            aspect-[4/3]
            overflow-hidden
            rounded-[18px]
            bg-zinc-200
          "
        >
          <div
            className="
              absolute
              inset-0
              animate-pulse
              bg-gradient-to-br
              from-zinc-200
              via-zinc-100
              to-zinc-200
            "
          />

          <div
            className="
              absolute
              inset-x-4
              bottom-5
            "
          >
            <div
              className="
                h-4
                w-2/3
                animate-pulse
                rounded
                bg-white/70
              "
            />

            <div
              className="
                mt-3
                h-3
                w-1/3
                animate-pulse
                rounded
                bg-white/50
              "
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="
        h-4
        w-4
        transition-transform
        duration-300

        group-hover:translate-x-1
      "
      aria-hidden="true"
    >
      <path
        d="M5 12h14M13 6l6 6-6 6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default AnaSayfaKategoriler;
