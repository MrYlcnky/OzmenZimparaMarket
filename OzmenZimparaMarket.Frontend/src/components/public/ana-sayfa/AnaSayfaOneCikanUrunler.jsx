import { useEffect, useState } from "react";
import { Link } from "react-router";

import {
  oneCikanUrunleriGetir,
  urunSeoUrlIleGetir,
} from "../../../api/servisler/urunServisi";

import UrunKarti from "../urunler/UrunKarti";

function AnaSayfaOneCikanUrunler() {
  const [urunler, setUrunler] = useState([]);
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

        const oneCikanUrunler = await oneCikanUrunleriGetir(6);

        if (iptalEdildiMi) {
          return;
        }

        if (!Array.isArray(oneCikanUrunler)) {
          setUrunler([]);

          return;
        }

        const detaySonuclari = await Promise.allSettled(
          oneCikanUrunler.map((urun) => {
            if (!urun?.seoUrl) {
              return Promise.resolve(urun);
            }

            return urunSeoUrlIleGetir(urun.seoUrl);
          }),
        );

        if (iptalEdildiMi) {
          return;
        }

        const detayliUrunler = detaySonuclari.map((sonuc, index) => {
          if (sonuc.status === "fulfilled") {
            return {
              ...oneCikanUrunler[index],
              ...sonuc.value,
            };
          }

          return oneCikanUrunler[index];
        });

        setUrunler(detayliUrunler);
      } catch {
        if (!iptalEdildiMi) {
          setHataVarMi(true);
          setUrunler([]);
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

  if (!yukleniyor && !hataVarMi && urunler.length === 0) {
    return null;
  }

  return (
    <section
      className="
        bg-[#f3f4f7]
        py-20

        sm:py-24
        lg:py-28
      "
    >
      <div
        className="
          mx-auto
          max-w-[1320px]
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
          <div className="max-w-3xl">
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
                Seçili Ürünler
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
              Öne Çıkan Profesyonel Ürünler
            </h2>

            <p
              className="
                mt-4
                max-w-2xl
                text-sm
                leading-7
                text-zinc-500

                sm:text-[15px]
              "
            >
              Farklı endüstriyel uygulamalara yönelik seçili ürünlerimizi teknik
              detaylarıyla inceleyin ve teklif listenize ekleyin.
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
              text-zinc-800
              transition-colors
              duration-300

              hover:text-purple-700
            "
          >
            Kataloğa Git
            <ArrowIcon />
          </Link>
        </div>

        {/* Ürünler */}
        <div className="mt-12 lg:mt-14">
          {yukleniyor && <UrunSkeleton />}

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
                Öne çıkan ürünler şu anda görüntülenemiyor.
              </p>
            </div>
          )}

          {!yukleniyor && !hataVarMi && urunler.length > 0 && (
            <div
              className="
                  grid
                  gap-5

                  md:grid-cols-2

                  lg:grid-cols-3
                  lg:gap-6
                "
            >
              {urunler.map((urun) => (
                <UrunKarti key={urun.id} urun={urun} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function UrunSkeleton() {
  return (
    <div
      className="
        grid
        gap-5

        md:grid-cols-2

        lg:grid-cols-3
        lg:gap-6
      "
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="
            overflow-hidden
            rounded-[20px]
            border
            border-zinc-200/80
            bg-white
          "
        >
          <div
            className="
              aspect-[16/10]
              animate-pulse
              bg-zinc-200
            "
          />

          <div className="p-5">
            <div
              className="
                flex
                items-center
                justify-between
                gap-4
              "
            >
              <div
                className="
                  h-3
                  w-1/3
                  animate-pulse
                  rounded
                  bg-zinc-200
                "
              />

              <div
                className="
                  h-5
                  w-14
                  animate-pulse
                  rounded
                  bg-zinc-100
                "
              />
            </div>

            <div
              className="
                mt-5
                h-5
                w-3/4
                animate-pulse
                rounded
                bg-zinc-200
              "
            />

            <div
              className="
                mt-3
                h-3
                w-full
                animate-pulse
                rounded
                bg-zinc-100
              "
            />

            <div
              className="
                mt-2
                h-3
                w-4/5
                animate-pulse
                rounded
                bg-zinc-100
              "
            />

            <div
              className="
                mt-5
                flex
                gap-2
              "
            >
              <div
                className="
                  h-6
                  w-20
                  animate-pulse
                  rounded-full
                  bg-zinc-100
                "
              />

              <div
                className="
                  h-6
                  w-24
                  animate-pulse
                  rounded-full
                  bg-zinc-100
                "
              />
            </div>

            <div
              className="
                mt-5
                h-16
                animate-pulse
                rounded
                bg-zinc-100
              "
            />

            <div
              className="
                mt-4
                h-12
                animate-pulse
                rounded-xl
                bg-zinc-100
              "
            />

            <div
              className="
                mt-4
                grid
                grid-cols-2
                gap-2
              "
            >
              <div
                className="
                  h-11
                  animate-pulse
                  rounded-xl
                  bg-zinc-100
                "
              />

              <div
                className="
                  h-11
                  animate-pulse
                  rounded-xl
                  bg-zinc-200
                "
              />
            </div>
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

export default AnaSayfaOneCikanUrunler;
