import { useEffect, useState } from "react";

import { urunFiltreSecenekleriniGetir } from "../../../api/servisler/urunServisi";
import MultiSelect from "../../ui/multi-select";

function UrunTeknikFiltreleri({
  kategoriId,
  seciliFiltreler,
  onFiltrelerDegistir,
}) {
  const [filtreGruplari, setFiltreGruplari] = useState([]);

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
        const veri = await urunFiltreSecenekleriniGetir(kategoriId, true);

        if (iptalEdildiMi) {
          return;
        }

        setFiltreGruplari(Array.isArray(veri) ? veri : []);
      } catch (error) {
        if (iptalEdildiMi) {
          return;
        }

        setFiltreGruplari([]);

        setHataMesaji(
          apiHataMesajiGetir(error, "Teknik filtreler yüklenemedi."),
        );
      } finally {
        if (!iptalEdildiMi) {
          setYukleniyorMu(false);
        }
      }
    });

    return () => {
      iptalEdildiMi = true;
    };
  }, [kategoriId]);

  function filtreDegistir(grup, yeniDegerler) {
    const digerFiltreler = seciliFiltreler.filter(
      (filtre) => filtre.urunDetayTanimiId !== grup.urunDetayTanimiId,
    );

    if (!Array.isArray(yeniDegerler) || yeniDegerler.length === 0) {
      onFiltrelerDegistir(digerFiltreler);

      return;
    }

    onFiltrelerDegistir([
      ...digerFiltreler,

      {
        urunDetayTanimiId: grup.urunDetayTanimiId,

        degerler: yeniDegerler,
      },
    ]);
  }

  function seciliDegerleriGetir(urunDetayTanimiId) {
    const filtre = seciliFiltreler.find(
      (item) => item.urunDetayTanimiId === urunDetayTanimiId,
    );

    return Array.isArray(filtre?.degerler) ? filtre.degerler : [];
  }

  if (yukleniyorMu) {
    return <FiltreSkeleton />;
  }

  if (hataMesaji) {
    return (
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
    );
  }

  if (filtreGruplari.length === 0) {
    return null;
  }

  return (
    <div>
      {/* Başlık */}
      <div
        className="
          mb-5
          flex
          items-center
          justify-between
          gap-3
        "
      >
        <span
          className="
            text-[12px]
            font-extrabold
            uppercase
            tracking-[0.10em]
            text-zinc-500
          "
        >
          Teknik Özellikler
        </span>

        {seciliFiltreler.length > 0 && (
          <button
            type="button"
            onClick={() => onFiltrelerDegistir([])}
            className="
              text-[11px]
              font-extrabold
              text-purple-600
              transition-colors

              hover:text-purple-800
            "
          >
            Tümünü Temizle
          </button>
        )}
      </div>

      {/* Teknik özellikler */}
      <div className="space-y-5">
        {filtreGruplari.map((grup) => {
          const seciliDegerler = seciliDegerleriGetir(grup.urunDetayTanimiId);

          const secenekler = Array.isArray(grup.secenekler)
            ? grup.secenekler.map((secenek) => ({
                value: secenek.deger,

                label: secenek.deger,

                searchText: secenek.deger,

                count: secenek.urunSayisi,
              }))
            : [];

          return (
            <MultiSelect
              key={grup.urunDetayTanimiId}
              id={`teknik-filtre-${grup.urunDetayTanimiId}`}
              label={grup.detayAdi}
              value={seciliDegerler}
              onValueChange={(yeniDegerler) =>
                filtreDegistir(grup, yeniDegerler)
              }
              options={secenekler}
              placeholder={`${grup.detayAdi} seçin`}
              multiple={grup.cokluDegerMi}
              searchable={secenekler.length > 5}
              searchPlaceholder={`${grup.detayAdi} ara...`}
              noResultsText="Uygun seçenek bulunamadı"
              maxVisibleValues={2}
            />
          );
        })}
      </div>
    </div>
  );
}

function FiltreSkeleton() {
  return (
    <div>
      <div
        className="
          mb-5
          h-4
          w-32
          animate-pulse
          rounded
          bg-zinc-100
        "
      />

      <div className="space-y-5">
        {[1, 2, 3, 4].map((item) => (
          <div key={item}>
            <div
              className="
                  mb-2.5
                  h-4
                  w-28
                  animate-pulse
                  rounded
                  bg-zinc-100
                "
            />

            <div
              className="
                  h-[46px]
                  animate-pulse
                  rounded-xl
                  bg-zinc-100
                "
            />
          </div>
        ))}
      </div>
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

export default UrunTeknikFiltreleri;
