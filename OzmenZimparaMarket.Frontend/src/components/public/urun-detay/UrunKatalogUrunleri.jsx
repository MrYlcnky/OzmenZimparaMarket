import { useEffect, useRef, useState } from "react";

import { urunleriFiltrele } from "../../../api/servisler/urunServisi";

const SAYFA_BOYUTU = 50;

function UrunKatalogUrunleri({
  kategoriId = null,
  altKategorilerDahilMi = true,
  gorunum = "grid",
  aktifUrunId = null,
  onUrunSec,
}) {
  const [urunler, setUrunler] = useState([]);
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
        const tumUrunler = await kategoriUrunleriniGetir({
          kategoriId,
          altKategorilerDahilMi,
        });

        if (iptalEdildiMi || istekSirasi !== istekSirasiRef.current) {
          return;
        }

        setUrunler(tumUrunler);
      } catch (error) {
        if (iptalEdildiMi || istekSirasi !== istekSirasiRef.current) {
          return;
        }

        setUrunler([]);

        setHataMesaji(apiHataMesajiGetir(error, "Ürünler yüklenemedi."));
      } finally {
        if (!iptalEdildiMi && istekSirasi === istekSirasiRef.current) {
          setYukleniyorMu(false);
        }
      }
    });

    return () => {
      iptalEdildiMi = true;
    };
  }, [kategoriId, altKategorilerDahilMi]);

  if (gorunum === "sidebar") {
    if (yukleniyorMu) {
      return <SidebarSkeleton />;
    }

    if (hataMesaji || urunler.length === 0) {
      return null;
    }

    return (
      <div
        className="
          ml-5
          mt-1
          space-y-0.5
          border-l
          border-zinc-100
          pl-2
        "
      >
        {urunler.map((urun) => {
          const aktifMi = Number(urun.id) === Number(aktifUrunId);

          return (
            <button
              key={urun.id}
              type="button"
              onClick={() => onUrunSec(urun)}
              className={`
                flex
                min-h-[36px]
                w-full
                items-center
                gap-2
                rounded-lg
                px-2.5
                py-1.5
                text-left
                text-[11px]
                transition-all

                ${
                  aktifMi
                    ? "bg-[#0b0e18] font-extrabold text-white"
                    : "font-semibold text-zinc-500 hover:bg-purple-50 hover:text-purple-700"
                }
              `}
            >
              <ProductMiniIcon />

              <span
                className="
                  min-w-0
                  flex-1
                  truncate
                "
              >
                {urun.urunAdi}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  if (yukleniyorMu) {
    return <GridSkeleton />;
  }

  if (hataMesaji) {
    return (
      <div
        className="
          rounded-[18px]
          border
          border-red-100
          bg-red-50
          px-5
          py-5
        "
      >
        <p
          className="
            text-[12px]
            font-semibold
            text-red-500
          "
        >
          {hataMesaji}
        </p>
      </div>
    );
  }

  if (urunler.length === 0) {
    return (
      <div
        className="
          flex
          min-h-[360px]
          items-center
          justify-center
          rounded-[22px]
          border
          border-dashed
          border-zinc-200
          bg-zinc-50/60
          px-6
          text-center
        "
      >
        <div>
          <div
            className="
              mx-auto
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-2xl
              bg-purple-50
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
              text-zinc-400
            "
          >
            Bu kategoride gösterilebilecek aktif ürün bulunmuyor.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        className="
          mb-5
          flex
          items-center
          justify-between
          gap-3
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
            {urunler.length}
          </span>{" "}
          ürün bulundu
        </p>
      </div>

      <div
        className="
          grid
          grid-cols-1
          gap-5

          sm:grid-cols-2
          xl:grid-cols-3
        "
      >
        {urunler.map((urun) => (
          <KatalogUrunKarti key={urun.id} urun={urun} onUrunSec={onUrunSec} />
        ))}
      </div>
    </div>
  );
}

async function kategoriUrunleriniGetir({ kategoriId, altKategorilerDahilMi }) {
  const ilkSayfa = await urunleriFiltrele({
    kategoriId: kategoriId ?? null,

    altKategorilerDahilMi,

    aramaMetni: null,
    oneCikanMi: null,
    satisBirimi: null,
    teknikDetayFiltreleri: [],

    sayfaNo: 1,
    sayfaBoyutu: SAYFA_BOYUTU,
    siralama: 1,
  });

  const ilkKayitlar = Array.isArray(ilkSayfa?.kayitlar)
    ? ilkSayfa.kayitlar
    : [];

  const toplamSayfaSayisi = Number(ilkSayfa?.toplamSayfaSayisi) || 1;

  if (toplamSayfaSayisi <= 1) {
    return ilkKayitlar;
  }

  const istekler = [];

  for (let sayfaNo = 2; sayfaNo <= toplamSayfaSayisi; sayfaNo += 1) {
    istekler.push(
      urunleriFiltrele({
        kategoriId: kategoriId ?? null,

        altKategorilerDahilMi,

        aramaMetni: null,
        oneCikanMi: null,
        satisBirimi: null,
        teknikDetayFiltreleri: [],

        sayfaNo,
        sayfaBoyutu: SAYFA_BOYUTU,
        siralama: 1,
      }),
    );
  }

  const kalanSayfalar = await Promise.all(istekler);

  return [
    ...ilkKayitlar,

    ...kalanSayfalar.flatMap((sayfa) =>
      Array.isArray(sayfa?.kayitlar) ? sayfa.kayitlar : [],
    ),
  ];
}

function KatalogUrunKarti({ urun, onUrunSec }) {
  const gorselUrl = urunGorselUrlOlustur(urun.gorselYolu);

  return (
    <button
      type="button"
      onClick={() => onUrunSec(urun)}
      className="
        group
        min-w-0
        overflow-hidden
        rounded-[18px]
        border
        border-zinc-200
        bg-white
        text-left
        transition-all
        duration-300

        hover:-translate-y-1
        hover:border-purple-200
        hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)]
      "
    >
      <div
        className="
          relative
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
              alt={urun.urunAdi}
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
              to-[#24143d]
              text-white/20
            "
          >
            <ProductIcon />
          </div>
        )}
      </div>

      <div className="p-4">
        {urun.kategoriAdi && (
          <p
            className="
              truncate
              text-[10px]
              font-extrabold
              uppercase
              tracking-[0.10em]
              text-purple-600
            "
          >
            {urun.kategoriAdi}
          </p>
        )}

        <h3
          className="
            mt-2
            line-clamp-2
            min-h-[40px]
            text-[16px]
            font-extrabold
            leading-5
            text-zinc-950
          "
        >
          {urun.urunAdi}
        </h3>

        {urun.urunKodu && (
          <p
            className="
              mt-2
              truncate
              text-[11px]
              font-semibold
              text-zinc-400
            "
          >
            Ürün Kodu: {urun.urunKodu}
          </p>
        )}

        <div
          className="
            mt-4
            flex
            items-center
            justify-between
            border-t
            border-zinc-100
            pt-3
          "
        >
          <span
            className="
              text-[11px]
              font-extrabold
              text-zinc-700
            "
          >
            Ürünü Aç
          </span>

          <ArrowIcon />
        </div>
      </div>
    </button>
  );
}

function SidebarSkeleton() {
  return (
    <div
      className="
        ml-5
        mt-2
        space-y-2
        pl-2
      "
    >
      {[1, 2].map((item) => (
        <div
          key={item}
          className="
            h-8
            animate-pulse
            rounded-lg
            bg-zinc-100
          "
        />
      ))}
    </div>
  );
}

function GridSkeleton() {
  return (
    <div
      className="
        grid
        grid-cols-1
        gap-5

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
            overflow-hidden
            rounded-[18px]
            border
            border-zinc-200
            bg-white
          "
        >
          <div
            className="
              aspect-[3/4]
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
                w-3/4
                animate-pulse
                rounded
                bg-zinc-100
              "
            />
          </div>
        </div>
      ))}
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

function ProductMiniIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-3.5 w-3.5 shrink-0"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="6" />

      <circle cx="12" cy="12" r="2" />
    </svg>
  );
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
        text-zinc-400
        transition-transform

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

export default UrunKatalogUrunleri;
