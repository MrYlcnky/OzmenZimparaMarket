import { useEffect, useRef, useState } from "react";

import { urunleriFiltrele } from "../../../api/servisler/urunServisi";
import UrunKarti from "./UrunKarti";

const BASLANGIC_SAYFA_BOYUTU = 12;

const BOS_TEKNIK_DETAY_FILTRELERI = [];

const BOS_SONUC = {
  kayitlar: [],
  sayfaNo: 1,
  sayfaBoyutu: BASLANGIC_SAYFA_BOYUTU,
  toplamKayitSayisi: 0,
  toplamSayfaSayisi: 0,
};

function UrunListesi({
  kategoriId,
  aramaMetni = "",
  siralama = 1,
  teknikDetayFiltreleri = BOS_TEKNIK_DETAY_FILTRELERI,
}) {
  const [sonuc, setSonuc] = useState(BOS_SONUC);
  const [sayfaNo, setSayfaNo] = useState(1);
  const [yukleniyorMu, setYukleniyorMu] = useState(true);
  const [hataMesaji, setHataMesaji] = useState("");

  const istekSirasiRef = useRef(0);

  useEffect(() => {
    let iptalEdildiMi = false;

    Promise.resolve().then(async () => {
      if (iptalEdildiMi) {
        return;
      }

      const istekSirasi = ++istekSirasiRef.current;

      setYukleniyorMu(true);
      setHataMesaji("");

      try {
        const veri = await urunleriFiltrele({
          kategoriId: kategoriId ?? null,
          altKategorilerDahilMi: true,

          aramaMetni: String(aramaMetni ?? "").trim() || null,

          oneCikanMi: null,
          satisBirimi: null,

          teknikDetayFiltreleri: Array.isArray(teknikDetayFiltreleri)
            ? teknikDetayFiltreleri
            : [],

          sayfaNo,
          sayfaBoyutu: BASLANGIC_SAYFA_BOYUTU,
          siralama,
        });

        if (iptalEdildiMi || istekSirasi !== istekSirasiRef.current) {
          return;
        }

        setSonuc({
          kayitlar: Array.isArray(veri?.kayitlar) ? veri.kayitlar : [],

          sayfaNo: Number(veri?.sayfaNo) || 1,

          sayfaBoyutu: Number(veri?.sayfaBoyutu) || BASLANGIC_SAYFA_BOYUTU,

          toplamKayitSayisi: Number(veri?.toplamKayitSayisi) || 0,

          toplamSayfaSayisi: Number(veri?.toplamSayfaSayisi) || 0,
        });
      } catch (error) {
        if (iptalEdildiMi || istekSirasi !== istekSirasiRef.current) {
          return;
        }

        setSonuc({
          ...BOS_SONUC,
        });

        setHataMesaji(
          apiHataMesajiGetir(error, "Ürünler yüklenirken bir hata oluştu."),
        );
      } finally {
        if (!iptalEdildiMi && istekSirasi === istekSirasiRef.current) {
          setYukleniyorMu(false);
        }
      }
    });

    return () => {
      iptalEdildiMi = true;
    };
  }, [kategoriId, aramaMetni, sayfaNo, siralama, teknikDetayFiltreleri]);

  if (yukleniyorMu) {
    return <UrunListesiSkeleton />;
  }

  if (hataMesaji) {
    return <UrunHataDurumu hataMesaji={hataMesaji} />;
  }

  if (sonuc.kayitlar.length === 0) {
    return <UrunBulunamadi />;
  }

  return (
    <div>
      {/* Liste üst bilgisi */}
      <div
        className="
          mb-6
          flex
          flex-col
          gap-2

          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <p
          className="
            text-[13px]
            font-semibold
            text-zinc-500
          "
        >
          <span
            className="
              font-extrabold
              text-zinc-950
            "
          >
            {sonuc.toplamKayitSayisi}
          </span>{" "}
          ürün bulundu
        </p>

        {sonuc.toplamSayfaSayisi > 1 && (
          <p
            className="
              text-[11px]
              font-semibold
              text-zinc-400
            "
          >
            Sayfa {sonuc.sayfaNo} / {sonuc.toplamSayfaSayisi}
          </p>
        )}
      </div>

      {/* Ürün grid */}
      <div
        className="
          grid
          min-w-0
          grid-cols-1
          gap-6

          sm:grid-cols-2
          xl:grid-cols-3
        "
      >
        {sonuc.kayitlar.map((urun) => (
          <UrunKarti key={urun.id} urun={urun} />
        ))}
      </div>

      {/* Sayfalama */}
      {sonuc.toplamSayfaSayisi > 1 && (
        <Sayfalama
          sayfaNo={sonuc.sayfaNo}
          toplamSayfaSayisi={sonuc.toplamSayfaSayisi}
          onSayfaDegistir={setSayfaNo}
        />
      )}
    </div>
  );
}

function Sayfalama({ sayfaNo, toplamSayfaSayisi, onSayfaDegistir }) {
  const sayfalar = sayfaNumaralariniOlustur(sayfaNo, toplamSayfaSayisi);

  function sayfayaGit(yeniSayfa) {
    if (
      yeniSayfa < 1 ||
      yeniSayfa > toplamSayfaSayisi ||
      yeniSayfa === sayfaNo
    ) {
      return;
    }

    onSayfaDegistir(yeniSayfa);

    window.requestAnimationFrame(() => {
      window.scrollTo({
        top: Math.max(0, document.documentElement.clientHeight * 0.25),
        behavior: "smooth",
      });
    });
  }

  return (
    <nav
      className="
        mt-9
        flex
        flex-wrap
        items-center
        justify-center
        gap-2
        border-t
        border-zinc-100
        pt-7
      "
      aria-label="Ürün sayfaları"
    >
      <button
        type="button"
        disabled={sayfaNo <= 1}
        onClick={() => sayfayaGit(sayfaNo - 1)}
        className="
          flex
          h-10
          items-center
          justify-center
          gap-1.5
          rounded-xl
          border
          border-zinc-200
          bg-white
          px-3.5
          text-[11px]
          font-extrabold
          text-zinc-600
          transition-all

          hover:border-purple-200
          hover:text-purple-700

          disabled:cursor-not-allowed
          disabled:opacity-35
        "
      >
        <PreviousIcon />
        Önceki
      </button>

      {sayfalar.map((sayfa, index) => {
        if (sayfa === "...") {
          return (
            <span
              key={`ellipsis-${index}`}
              className="
                flex
                h-10
                w-8
                items-center
                justify-center
                text-[11px]
                font-bold
                text-zinc-400
              "
            >
              ...
            </span>
          );
        }

        const aktifMi = sayfa === sayfaNo;

        return (
          <button
            key={sayfa}
            type="button"
            onClick={() => sayfayaGit(sayfa)}
            className={`
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
              text-[11px]
              font-extrabold
              transition-all

              ${
                aktifMi
                  ? "border-purple-600 bg-purple-600 text-white shadow-[0_8px_20px_rgba(124,58,237,0.20)]"
                  : "border-zinc-200 bg-white text-zinc-600 hover:border-purple-200 hover:text-purple-700"
              }
            `}
          >
            {sayfa}
          </button>
        );
      })}

      <button
        type="button"
        disabled={sayfaNo >= toplamSayfaSayisi}
        onClick={() => sayfayaGit(sayfaNo + 1)}
        className="
          flex
          h-10
          items-center
          justify-center
          gap-1.5
          rounded-xl
          border
          border-zinc-200
          bg-white
          px-3.5
          text-[11px]
          font-extrabold
          text-zinc-600
          transition-all

          hover:border-purple-200
          hover:text-purple-700

          disabled:cursor-not-allowed
          disabled:opacity-35
        "
      >
        Sonraki
        <NextIcon />
      </button>
    </nav>
  );
}

function sayfaNumaralariniOlustur(aktifSayfa, toplamSayfa) {
  if (toplamSayfa <= 7) {
    return Array.from(
      {
        length: toplamSayfa,
      },
      (_, index) => index + 1,
    );
  }

  if (aktifSayfa <= 4) {
    return [1, 2, 3, 4, 5, "...", toplamSayfa];
  }

  if (aktifSayfa >= toplamSayfa - 3) {
    return [
      1,
      "...",
      toplamSayfa - 4,
      toplamSayfa - 3,
      toplamSayfa - 2,
      toplamSayfa - 1,
      toplamSayfa,
    ];
  }

  return [
    1,
    "...",
    aktifSayfa - 1,
    aktifSayfa,
    aktifSayfa + 1,
    "...",
    toplamSayfa,
  ];
}

function UrunListesiSkeleton() {
  return (
    <div>
      <div
        className="
          mb-6
          h-4
          w-32
          animate-pulse
          rounded-md
          bg-zinc-100
        "
      />

      <div
        className="
          grid
          grid-cols-1
          gap-6

          sm:grid-cols-2
          xl:grid-cols-3
        "
      >
        {Array.from({
          length: 6,
        }).map((_, index) => (
          <div
            key={index}
            className="
              mx-auto
              w-full
              max-w-[350px]
              overflow-hidden
              rounded-[18px]
              border
              border-zinc-200/70
              bg-white
            "
          >
            <div
              className="
                aspect-[16/10]
                animate-pulse
                bg-zinc-100
              "
            />

            <div className="p-4">
              <div
                className="
                  h-3
                  w-24
                  animate-pulse
                  rounded
                  bg-zinc-100
                "
              />

              <div
                className="
                  mt-3
                  h-5
                  w-4/5
                  animate-pulse
                  rounded
                  bg-zinc-100
                "
              />

              <div
                className="
                  mt-3
                  h-10
                  animate-pulse
                  rounded
                  bg-zinc-50
                "
              />

              <div
                className="
                  mt-4
                  h-14
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
                    h-10
                    animate-pulse
                    rounded-xl
                    bg-zinc-100
                  "
                />

                <div
                  className="
                    h-10
                    animate-pulse
                    rounded-xl
                    bg-zinc-100
                  "
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UrunBulunamadi() {
  return (
    <div
      className="
        flex
        min-h-[420px]
        items-center
        justify-center
        rounded-[20px]
        border
        border-dashed
        border-zinc-200
        bg-zinc-50/50
        px-6
        text-center
      "
    >
      <div className="max-w-[360px]">
        <div
          className="
            mx-auto
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-2xl
            bg-gradient-to-br
            from-blue-50
            to-purple-100
            text-purple-600
          "
        >
          <ProductIcon />
        </div>

        <h3
          className="
            mt-4
            text-[16px]
            font-extrabold
            text-zinc-900
          "
        >
          Ürün bulunamadı
        </h3>

        <p
          className="
            mt-2
            text-[12px]
            leading-5
            text-zinc-400
          "
        >
          Seçtiğiniz kategori veya filtrelerle eşleşen aktif bir ürün
          bulunamadı.
        </p>
      </div>
    </div>
  );
}

function UrunHataDurumu({ hataMesaji }) {
  return (
    <div
      className="
        rounded-[20px]
        border
        border-red-100
        bg-red-50
        px-5
        py-5
      "
    >
      <p
        className="
          text-[13px]
          font-bold
          text-red-600
        "
      >
        Ürünler yüklenemedi
      </p>

      <p
        className="
          mt-1.5
          text-[12px]
          leading-5
          text-red-500
        "
      >
        {hataMesaji}
      </p>
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

function ProductIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="7" />

      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function PreviousIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-3.5 w-3.5"
      aria-hidden="true"
    >
      <path d="m14 7-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function NextIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-3.5 w-3.5"
      aria-hidden="true"
    >
      <path d="m10 7 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default UrunListesi;
