import { useEffect, useMemo, useState } from "react";

import { kategoriAgaciniGetir } from "../../../api/servisler/kategoriServisi";
import UrunKatalogKategori from "./UrunKatalogKategori";

function UrunKatalogPaneli({
  aktifKategoriId,
  aktifUrunId,
  onKategoriSec,
  onUrunSec,
}) {
  const [kategoriler, setKategoriler] = useState([]);
  const [yukleniyorMu, setYukleniyorMu] = useState(true);
  const [hataMesaji, setHataMesaji] = useState("");

  useEffect(() => {
    let iptalEdildiMi = false;

    Promise.resolve().then(async () => {
      if (iptalEdildiMi) {
        return;
      }

      setYukleniyorMu(true);
      setHataMesaji("");

      try {
        const veri = await kategoriAgaciniGetir();

        if (iptalEdildiMi) {
          return;
        }

        setKategoriler(kategorileriHazirla(Array.isArray(veri) ? veri : []));
      } catch (error) {
        if (iptalEdildiMi) {
          return;
        }

        setKategoriler([]);

        setHataMesaji(apiHataMesajiGetir(error, "Ürün kataloğu yüklenemedi."));
      } finally {
        if (!iptalEdildiMi) {
          setYukleniyorMu(false);
        }
      }
    });

    return () => {
      iptalEdildiMi = true;
    };
  }, []);

  const aktifYolIdleri = useMemo(() => {
    if (!aktifKategoriId) {
      return new Set();
    }

    const yol = kategoriYolunuBul(kategoriler, Number(aktifKategoriId));

    return new Set(yol.map((kategori) => Number(kategori.id)));
  }, [kategoriler, aktifKategoriId]);

  return (
    <aside
      className="
        min-w-0
        overflow-hidden
        rounded-[24px]
        border
        border-zinc-200/80
        bg-white
        shadow-[0_16px_45px_rgba(15,23,42,0.045)]

        lg:sticky
        lg:top-[96px]
      "
    >
      {/* Başlık */}
      <div
        className="
          border-b
          border-zinc-100
          px-5
          py-5
        "
      >
        <div
          className="
            flex
            items-center
            gap-3
          "
        >
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-gradient-to-br
              from-blue-50
              to-purple-100
              text-purple-600
            "
          >
            <CatalogIcon />
          </div>

          <div className="min-w-0">
            <p
              className="
                text-[10px]
                font-extrabold
                uppercase
                tracking-[0.13em]
                text-purple-600
              "
            >
              Ürün Kataloğu
            </p>

            <h2
              className="
                mt-0.5
                text-[16px]
                font-extrabold
                tracking-[-0.02em]
                text-zinc-950
              "
            >
              Kategoriler & Ürünler
            </h2>
          </div>
        </div>
      </div>

      {/* Tüm ürünler */}
      <div
        className="
          border-b
          border-zinc-100
          p-3
        "
      >
        <button
          type="button"
          onClick={() => onKategoriSec(null)}
          className={`
            flex
            min-h-[44px]
            w-full
            items-center
            gap-3
            rounded-xl
            px-3
            text-left
            text-[12px]
            transition-all

            ${
              aktifKategoriId === null
                ? "bg-purple-50 font-extrabold text-purple-700"
                : "font-bold text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950"
            }
          `}
        >
          <span
            className="
              flex
              h-7
              w-7
              shrink-0
              items-center
              justify-center
              rounded-lg
              bg-purple-100
              text-purple-600
            "
          >
            <GridIcon />
          </span>

          <span className="flex-1">Tüm Ürünler</span>
        </button>
      </div>

      {/* Katalog */}
      <div
        className="
          max-h-[calc(100vh-230px)]
          overflow-y-auto
          px-3
          py-3
        "
      >
        {yukleniyorMu ? (
          <KatalogSkeleton />
        ) : hataMesaji ? (
          <div
            className="
              rounded-xl
              border
              border-red-100
              bg-red-50
              px-4
              py-4
            "
          >
            <p
              className="
                text-[12px]
                font-semibold
                leading-5
                text-red-500
              "
            >
              {hataMesaji}
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {kategoriler.map((kategori) => (
              <UrunKatalogKategori
                key={kategori.id}
                kategori={kategori}
                seviye={0}
                aktifKategoriId={aktifKategoriId}
                aktifUrunId={aktifUrunId}
                aktifYolIdleri={aktifYolIdleri}
                onKategoriSec={onKategoriSec}
                onUrunSec={onUrunSec}
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

function kategorileriHazirla(kategoriler) {
  return kategoriler
    .filter((kategori) => kategori?.aktifMi)
    .map((kategori) => ({
      ...kategori,

      altKategoriler: kategorileriHazirla(
        Array.isArray(kategori.altKategoriler) ? kategori.altKategoriler : [],
      ),
    }))
    .sort((a, b) => {
      const siraFarki = Number(a?.siraNo ?? 0) - Number(b?.siraNo ?? 0);

      if (siraFarki !== 0) {
        return siraFarki;
      }

      return String(a?.kategoriAdi ?? "").localeCompare(
        String(b?.kategoriAdi ?? ""),
        "tr-TR",
      );
    });
}

function kategoriYolunuBul(kategoriler, arananId, yol = []) {
  for (const kategori of kategoriler) {
    const yeniYol = [...yol, kategori];

    if (Number(kategori.id) === Number(arananId)) {
      return yeniYol;
    }

    const sonuc = kategoriYolunuBul(
      kategori.altKategoriler ?? [],
      arananId,
      yeniYol,
    );

    if (sonuc.length > 0) {
      return sonuc;
    }
  }

  return [];
}

function KatalogSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({
        length: 7,
      }).map((_, index) => (
        <div
          key={index}
          className="
            h-10
            animate-pulse
            rounded-xl
            bg-zinc-100
          "
        />
      ))}
    </div>
  );
}

function apiHataMesajiGetir(error, varsayilanMesaj) {
  const veri = error?.response?.data;

  if (typeof veri?.mesaj === "string" && veri.mesaj.trim()) {
    return veri.mesaj;
  }

  if (typeof veri?.message === "string" && veri.message.trim()) {
    return veri.message;
  }

  if (typeof veri?.title === "string" && veri.title.trim()) {
    return veri.title;
  }

  if (typeof veri === "string" && veri.trim()) {
    return veri;
  }

  return varsayilanMesaj;
}

function CatalogIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <rect x="4" y="4" width="6" height="6" rx="1" />

      <rect x="14" y="4" width="6" height="6" rx="1" />

      <rect x="4" y="14" width="6" height="6" rx="1" />

      <rect x="14" y="14" width="6" height="6" rx="1" />
    </svg>
  );
}

export default UrunKatalogPaneli;
