import { useState } from "react";

import { useTeklifSepeti } from "../../../contexts/TeklifSepetiContext";

function UrunTeklifAlani({ urun }) {
  const { urunEkle, sepetteMi } = useTeklifSepeti();

  const [miktar, setMiktar] = useState(1);

  if (!urun) {
    return null;
  }

  const miktarAdimi = satisBirimiMetreMi(urun.satisBirimiAdi) ? 0.1 : 1;

  const urunSepetteMi = sepetteMi(urun.id);

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

  function miktarDegistir(event) {
    const yeniMiktar = Number(event.target.value);

    if (!Number.isFinite(yeniMiktar)) {
      return;
    }

    setMiktar(yeniMiktar);
  }

  function miktarKontrolEt() {
    if (!Number.isFinite(miktar) || miktar <= 0) {
      setMiktar(miktarAdimi);
    }
  }

  function sepeteEkle() {
    urunEkle(
      {
        id: urun.id,
        kategoriAdi: urun.kategoriAdi,
        urunAdi: urun.urunAdi,
        urunKodu: urun.urunKodu,
        seoUrl: urun.seoUrl,
        gorselYolu: urun.gorselYolu,
        satisBirimi: urun.satisBirimi,
        satisBirimiAdi: urun.satisBirimiAdi,
      },
      {
        miktar,
        secimler: [],
      },
    );
  }

  return (
    <div className="mt-6">
      <div
        className="
          flex
          flex-col
          gap-4
          rounded-[17px]
          border
          border-zinc-200
          bg-zinc-50
          p-4

          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <div>
          <p
            className="
              text-[10px]
              font-extrabold
              uppercase
              tracking-[0.10em]
              text-zinc-400
            "
          >
            Teklif Miktarı
          </p>

          <p
            className="
              mt-1
              text-[13px]
              font-extrabold
              text-zinc-800
            "
          >
            {urun.satisBirimiAdi}
          </p>
        </div>

        <div
          className="
            flex
            shrink-0
            items-center
            overflow-hidden
            rounded-xl
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
              h-10
              w-10
              items-center
              justify-center
              text-[16px]
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
            onChange={miktarDegistir}
            onBlur={miktarKontrolEt}
            className="
              h-10
              w-16
              border-x
              border-zinc-200
              bg-transparent
              text-center
              text-[12px]
              font-extrabold
              text-zinc-900
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
              h-10
              w-10
              items-center
              justify-center
              text-[16px]
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

      <button
        type="button"
        onClick={sepeteEkle}
        className="
          mt-3
          flex
          min-h-[48px]
          w-full
          items-center
          justify-center
          gap-2.5
          rounded-[13px]
          bg-gradient-to-r
          from-[#7446ef]
          to-[#7c4dff]
          px-5
          text-[12px]
          font-extrabold
          text-white
          shadow-[0_10px_25px_rgba(116,70,239,0.20)]
          transition-all

          hover:-translate-y-0.5
          hover:shadow-[0_14px_32px_rgba(116,70,239,0.28)]
        "
      >
        <CartIcon />

        {urunSepetteMi ? "Tekrar Sepete Ekle" : "Teklif Sepetine Ekle"}
      </button>
    </div>
  );
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

function CartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
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

export default UrunTeklifAlani;
