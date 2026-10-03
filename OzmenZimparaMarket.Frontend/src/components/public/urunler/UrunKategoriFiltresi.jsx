import { useEffect, useMemo, useState } from "react";

import { kategoriAgaciniGetir } from "../../../api/servisler/kategoriServisi";
import Select from "../../ui/select";

function UrunKategoriFiltresi({ seciliKategoriId, onKategoriDegistir }) {
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

        setHataMesaji(apiHataMesajiGetir(error, "Kategoriler yüklenemedi."));
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

  const kategoriYolu = useMemo(() => {
    if (seciliKategoriId === null) {
      return [];
    }

    return kategoriYolunuBul(kategoriler, Number(seciliKategoriId));
  }, [kategoriler, seciliKategoriId]);

  const seciliAnaKategori = kategoriYolu[0] ?? null;

  const seciliAltKategori = kategoriYolu.length > 1 ? kategoriYolu[1] : null;

  const altKategoriler = seciliAnaKategori?.altKategoriler ?? [];

  const anaKategoriSecenekleri = useMemo(() => {
    return kategoriler.map((kategori) => ({
      value: kategori.id,
      label: kategori.kategoriAdi,
      searchText: kategori.kategoriAdi,
    }));
  }, [kategoriler]);

  const altKategoriSecenekleri = useMemo(() => {
    return altKategoriler.map((kategori) => ({
      value: kategori.id,
      label: kategori.kategoriAdi,
      searchText: kategori.kategoriAdi,
    }));
  }, [altKategoriler]);

  function anaKategoriDegistir(value) {
    if (!value) {
      onKategoriDegistir(null);
      return;
    }

    onKategoriDegistir(Number(value));
  }

  function altKategoriDegistir(value) {
    if (!seciliAnaKategori) {
      return;
    }

    if (!value) {
      onKategoriDegistir(seciliAnaKategori.id);

      return;
    }

    onKategoriDegistir(Number(value));
  }

  if (yukleniyorMu) {
    return <KategoriSkeleton />;
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

  return (
    <div className="space-y-5">
      {/* Ana kategori */}
      <Select
        id="ana-kategori"
        label="Ana Kategori"
        value={seciliAnaKategori?.id ?? ""}
        onValueChange={anaKategoriDegistir}
        options={anaKategoriSecenekleri}
        emptyLabel="Tüm Kategoriler"
        placeholder="Ana kategori seçin"
        searchable={anaKategoriSecenekleri.length > 6}
        searchPlaceholder="Ana kategori ara..."
        noResultsText="Kategori bulunamadı"
      />

      {/* Alt kategori */}
      <Select
        id="alt-kategori"
        label="Alt Kategori"
        value={seciliAltKategori?.id ?? ""}
        onValueChange={altKategoriDegistir}
        options={altKategoriSecenekleri}
        emptyLabel={
          !seciliAnaKategori
            ? "Önce ana kategori seçin"
            : altKategoriler.length > 0
              ? "Tüm Alt Kategoriler"
              : "Alt kategori bulunmuyor"
        }
        placeholder="Alt kategori seçin"
        disabled={!seciliAnaKategori || altKategoriler.length === 0}
        searchable={altKategoriSecenekleri.length > 6}
        searchPlaceholder="Alt kategori ara..."
        noResultsText="Alt kategori bulunamadı"
      />
    </div>
  );
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

function KategoriSkeleton() {
  return (
    <div className="space-y-5">
      {[1, 2].map((item) => (
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
              h-11
              animate-pulse
              rounded-xl
              bg-zinc-100
            "
          />
        </div>
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

export default UrunKategoriFiltresi;
