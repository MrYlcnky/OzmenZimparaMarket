import { useState } from "react";
import { Link } from "react-router";

import { useTeklifSepeti } from "../../../contexts/TeklifSepetiContext";

function UrunKarti({ urun }) {
  const { urunEkle, sepetteMi } = useTeklifSepeti();

  const {
    id,
    kategoriAdi,
    urunAdi,
    urunKodu,
    kisaAciklama,
    gorselYolu,
    satisBirimi,
    satisBirimiAdi,
    seoUrl,
    oneCikanMi,
    teknikDetaylar = [],
  } = urun;

  const [miktar, setMiktar] = useState(1);

  const hedefYol = seoUrl
    ? `/urunler/${encodeURIComponent(seoUrl)}`
    : "/urunler";

  const gorselUrl = urunGorselUrlOlustur(gorselYolu);

  const temizTeknikDetaylar = teknikDetaylariHazirla(teknikDetaylar);

  const gosterilecekTeknikDetaylar = temizTeknikDetaylar.slice(0, 4);

  const kalanTeknikDetaySayisi = Math.max(
    0,
    temizTeknikDetaylar.length - gosterilecekTeknikDetaylar.length,
  );

  const urunSepetteMi = sepetteMi(id);

  const miktarAdimi = satisBirimiMetreMi(satisBirimiAdi) ? 0.1 : 1;

  function miktariAzalt() {
    setMiktar((mevcut) => {
      const yeniMiktar = mevcut - miktarAdimi;

      if (yeniMiktar <= 0) {
        return miktarAdimi;
      }

      return sayiyiDuzenle(yeniMiktar);
    });
  }

  function miktariArtir() {
    setMiktar((mevcut) => sayiyiDuzenle(mevcut + miktarAdimi));
  }

  function miktarInputDegistir(event) {
    const yeniMiktar = Number(event.target.value);

    if (!Number.isFinite(yeniMiktar)) {
      return;
    }

    setMiktar(yeniMiktar);
  }

  function miktarInputBitti() {
    if (!Number.isFinite(miktar) || miktar <= 0) {
      setMiktar(miktarAdimi);
    }
  }

  function sepeteEkle() {
    urunEkle(
      {
        id,
        kategoriAdi,
        urunAdi,
        urunKodu,
        seoUrl,
        gorselYolu,
        satisBirimi,
        satisBirimiAdi,
      },
      {
        miktar,
        secimler: [],
      },
    );
  }

  return (
    <article
      className="
        group
        mx-auto
        flex
        h-full
        w-full
        max-w-[350px]
        flex-col
        overflow-hidden
        rounded-[18px]
        border
        border-zinc-200/80
        bg-white
        shadow-[0_10px_30px_rgba(15,23,42,0.05)]
        transition-all
        duration-300

        hover:-translate-y-1
        hover:border-purple-200
        hover:shadow-[0_18px_42px_rgba(15,23,42,0.09)]
      "
    >
      {/* Görsel */}
      <Link
        to={hedefYol}
        className="
    relative
    block
    aspect-[3/4]
    overflow-hidden
    border-b
    border-zinc-100
    bg-white
  "
      >
        {gorselUrl ? (
          <div
            className="
        flex
        h-full
        w-full
        items-center
        justify-center
        p-3

        sm:p-4
      "
          >
            <img
              src={gorselUrl}
              alt={urunAdi}
              loading="lazy"
              className="
          h-full
          w-full
          object-contain
          object-center
          transition-transform
          duration-500

          group-hover:scale-[1.025]
        "
            />
          </div>
        ) : (
          <div
            className="
        flex
        h-full
        w-full
        items-center
        justify-center
        bg-gradient-to-br
        from-[#090b18]
        via-[#101326]
        to-[#24143d]
      "
          >
            <UrunFallbackIcon />
          </div>
        )}

        {oneCikanMi && (
          <span
            className="
        absolute
        left-3
        top-3
        rounded-full
        border
        border-purple-100
        bg-white/95
        px-2.5
        py-1
        text-[9px]
        font-extrabold
        uppercase
        tracking-[0.10em]
        text-purple-700
        shadow-sm
        backdrop-blur-md
      "
          >
            Öne Çıkan
          </span>
        )}
      </Link>
      {/* İçerik */}
      <div
        className="
          flex
          flex-1
          flex-col
          p-4
        "
      >
        {/* Kategori / kod */}
        <div
          className="
            flex
            items-start
            justify-between
            gap-3
          "
        >
          {kategoriAdi && (
            <span
              className="
                line-clamp-1
                min-w-0
                text-[10px]
                font-extrabold
                uppercase
                tracking-[0.10em]
                text-purple-600
              "
            >
              {kategoriAdi}
            </span>
          )}

          {urunKodu && (
            <span
              className="
                shrink-0
                rounded-md
                bg-zinc-100
                px-2
                py-1
                text-[9px]
                font-bold
                text-zinc-500
              "
            >
              {urunKodu}
            </span>
          )}
        </div>

        {/* Ürün adı */}
        <Link
          to={hedefYol}
          className="
            mt-3
            block
          "
        >
          <h3
            className="
              line-clamp-2
              text-[17px]
              font-extrabold
              leading-[1.35]
              tracking-[-0.025em]
              text-zinc-950
              transition-colors

              group-hover:text-purple-700
            "
          >
            {urunAdi}
          </h3>
        </Link>

        {/* Açıklama */}
        {kisaAciklama && (
          <p
            className="
              mt-3
              line-clamp-2
              text-[12px]
              leading-5
              text-zinc-500
            "
          >
            {kisaAciklama}
          </p>
        )}

        {/* Teknik özellikler */}
        {gosterilecekTeknikDetaylar.length > 0 && (
          <div className="mt-4">
            <div
              className="
                flex
                items-center
                justify-between
                gap-3
              "
            >
              <p
                className="
                  text-[10px]
                  font-extrabold
                  uppercase
                  tracking-[0.10em]
                  text-zinc-400
                "
              >
                Teknik Özellikler
              </p>

              {kalanTeknikDetaySayisi > 0 && (
                <span
                  className="
                    text-[9px]
                    font-bold
                    text-purple-600
                  "
                >
                  +{kalanTeknikDetaySayisi}
                </span>
              )}
            </div>

            <div
              className="
                mt-3
                grid
                grid-cols-2
                gap-x-4
                gap-y-3
                border-y
                border-zinc-100
                py-3
              "
            >
              {gosterilecekTeknikDetaylar.map((detay) => (
                <TeknikBilgi
                  key={detay.urunDetayTanimiId}
                  baslik={detay.detayAdi}
                  deger={detay.degerler
                    .map((deger) => deger.detayDegeri)
                    .join(", ")}
                />
              ))}
            </div>
          </div>
        )}

        {/* Miktar */}
        <div
          className="
            mt-4
            flex
            items-center
            justify-between
            gap-3
            rounded-xl
            border
            border-zinc-100
            bg-zinc-50/80
            px-3
            py-2.5
          "
        >
          <div className="min-w-0">
            <p
              className="
                text-[9px]
                font-bold
                uppercase
                tracking-[0.08em]
                text-zinc-400
              "
            >
              Miktar
            </p>

            <p
              className="
                mt-0.5
                truncate
                text-[11px]
                font-bold
                text-zinc-700
              "
            >
              {satisBirimiAdi}
            </p>
          </div>

          <div
            className="
              flex
              shrink-0
              items-center
              overflow-hidden
              rounded-lg
              border
              border-zinc-200
              bg-white
            "
          >
            <button
              type="button"
              onClick={miktariAzalt}
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                text-[15px]
                font-bold
                text-zinc-500
                transition-colors

                hover:bg-zinc-100
                hover:text-purple-700
              "
              aria-label="Miktarı azalt"
            >
              −
            </button>

            <input
              type="number"
              min={miktarAdimi}
              step={miktarAdimi}
              value={miktar}
              onChange={miktarInputDegistir}
              onBlur={miktarInputBitti}
              className="
                h-8
                w-14
                border-x
                border-zinc-200
                bg-transparent
                text-center
                text-[11px]
                font-extrabold
                text-zinc-800
                outline-none

                [appearance:textfield]
                [&::-webkit-inner-spin-button]:appearance-none
                [&::-webkit-outer-spin-button]:appearance-none
              "
            />

            <button
              type="button"
              onClick={miktariArtir}
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                text-[15px]
                font-bold
                text-zinc-500
                transition-colors

                hover:bg-zinc-100
                hover:text-purple-700
              "
              aria-label="Miktarı artır"
            >
              +
            </button>
          </div>
        </div>

        {/* Aksiyonlar */}
        <div
          className="
            mt-auto
            grid
            grid-cols-[0.9fr_1.1fr]
            gap-2
            pt-4
          "
        >
          <Link
            to={hedefYol}
            className="
              group/detay
              flex
              h-10
              items-center
              justify-center
              gap-1.5
              rounded-[10px]
              border
              border-zinc-200
              bg-white
              px-2
              text-[10px]
              font-extrabold
              text-zinc-700
              transition-all

              hover:border-purple-200
              hover:bg-purple-50
              hover:text-purple-700
            "
          >
            İncele
            <ArrowIcon />
          </Link>

          <button
            type="button"
            onClick={sepeteEkle}
            className="
              flex
              h-10
              items-center
              justify-center
              gap-2
              rounded-[10px]
              bg-gradient-to-r
              from-[#7446ef]
              to-[#7c4dff]
              px-2.5
              text-[10px]
              font-extrabold
              text-white
              shadow-[0_8px_20px_rgba(116,70,239,0.16)]
              transition-all

              hover:-translate-y-0.5
              hover:shadow-[0_12px_26px_rgba(116,70,239,0.25)]
            "
          >
            <CartIcon />

            {urunSepetteMi ? "Tekrar Ekle" : "Sepete Ekle"}
          </button>
        </div>
      </div>
    </article>
  );
}

function teknikDetaylariHazirla(teknikDetaylar) {
  if (!Array.isArray(teknikDetaylar)) {
    return [];
  }

  return teknikDetaylar
    .map((detay) => ({
      ...detay,

      degerler: Array.isArray(detay?.degerler)
        ? detay.degerler
            .filter(
              (deger) =>
                deger?.aktifMi &&
                typeof deger.detayDegeri === "string" &&
                deger.detayDegeri.trim(),
            )
            .sort((a, b) => (a.siraNo ?? 0) - (b.siraNo ?? 0))
        : [],
    }))
    .filter((detay) => detay.degerler.length > 0)
    .sort((a, b) => (a.siraNo ?? 0) - (b.siraNo ?? 0));
}

function satisBirimiMetreMi(satisBirimiAdi) {
  const birim = String(satisBirimiAdi ?? "")
    .trim()
    .toLocaleLowerCase("tr-TR");

  return birim === "metre" || birim === "meter";
}

function sayiyiDuzenle(sayi) {
  return Number(Number(sayi).toFixed(2));
}

function TeknikBilgi({ baslik, deger }) {
  return (
    <div className="min-w-0">
      <p
        className="
          truncate
          text-[9px]
          font-medium
          text-zinc-400
        "
        title={baslik}
      >
        {baslik}
      </p>

      <p
        className="
          mt-0.5
          line-clamp-2
          text-[11px]
          font-bold
          leading-4
          text-zinc-800
        "
        title={deger}
      >
        {deger}
      </p>
    </div>
  );
}

function urunGorselUrlOlustur(gorselYolu) {
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

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="
        h-3.5
        w-3.5
        transition-transform

        group-hover/detay:translate-x-0.5
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

function CartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="
        h-3.5
        w-3.5
        shrink-0
      "
      aria-hidden="true"
    >
      <path
        d="M3.5 5h2l1.8 9.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 2-1.6L20.5 8H6.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle cx="9.5" cy="19" r="1" />

      <circle cx="17" cy="19" r="1" />
    </svg>
  );
}

function UrunFallbackIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      className="
        h-14
        w-14
        text-white/20
      "
      aria-hidden="true"
    >
      <circle cx="32" cy="32" r="21" />

      <circle cx="32" cy="32" r="7" />

      <path d="M32 11v14M53 32H39M32 53V39M11 32h14" />
    </svg>
  );
}

export default UrunKarti;
