import { useMemo } from "react";

function UrunTeknikBilgileri({ teknikDetaylar }) {
  const temizTeknikDetaylar = useMemo(
    () => teknikDetaylariHazirla(teknikDetaylar),
    [teknikDetaylar],
  );

  if (temizTeknikDetaylar.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <div
        className="
          flex
          items-end
          justify-between
          gap-3
        "
      >
        <div>
          <p
            className="
              text-[10px]
              font-extrabold
              uppercase
              tracking-[0.12em]
              text-purple-600
            "
          >
            Teknik Bilgiler
          </p>

          <h2
            className="
              mt-1
              text-[17px]
              font-extrabold
              tracking-[-0.02em]
              text-zinc-950
            "
          >
            Teknik Özellikler
          </h2>
        </div>

        <span
          className="
            rounded-lg
            bg-purple-50
            px-2.5
            py-1.5
            text-[10px]
            font-extrabold
            text-purple-600
          "
        >
          {temizTeknikDetaylar.length} özellik
        </span>
      </div>

      <div
        className="
          mt-4
          grid
          overflow-hidden
          rounded-[16px]
          border
          border-zinc-200

          sm:grid-cols-2
        "
      >
        {temizTeknikDetaylar.map((detay, index) => (
          <TeknikBilgi
            key={detay.urunDetayTanimiId}
            detay={detay}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}

function TeknikBilgi({ detay }) {
  const degerMetni = detay.degerler
    .map((deger) => deger.detayDegeri)
    .join(", ");

  return (
    <div
      className="
        min-w-0
        border-b
        border-zinc-100
        bg-white
        px-4
        py-3

        sm:border-r
      "
    >
      <p
        className="
          text-[10px]
          font-semibold
          text-zinc-400
        "
      >
        {detay.detayAdi}
      </p>

      <p
        className="
          mt-1
          text-[12px]
          font-extrabold
          leading-5
          text-zinc-800
        "
      >
        {degerMetni}
      </p>
    </div>
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
            .sort((a, b) => Number(a?.siraNo ?? 0) - Number(b?.siraNo ?? 0))
        : [],
    }))
    .filter((detay) => detay.degerler.length > 0)
    .sort((a, b) => Number(a?.siraNo ?? 0) - Number(b?.siraNo ?? 0));
}

export default UrunTeknikBilgileri;
