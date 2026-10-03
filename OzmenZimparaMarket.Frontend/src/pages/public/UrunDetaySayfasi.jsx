import { useEffect, useState } from "react";

import { Link, useNavigate, useParams } from "react-router";

import { urunSeoUrlIleGetir } from "../../api/servisler/urunServisi";

import UrunKatalogPaneli from "../../components/public/urun-detay/UrunKatalogPaneli";
import UrunKatalogUrunleri from "../../components/public/urun-detay/UrunKatalogUrunleri";
import UrunDetayPaneli from "../../components/public/urun-detay/UrunDetayPaneli";

function UrunDetaySayfasi() {
  const { seoUrl } = useParams();

  const navigate = useNavigate();

  const [urun, setUrun] = useState(null);

  const [seciliKategoriId, setSeciliKategoriId] = useState(null);

  /*
   * Sağ tarafta kategori bilgilerini kullanabilmek için
   * kategori nesnesini ayrıca tutuyoruz.
   */
  const [seciliKategori, setSeciliKategori] = useState(null);

  /*
   * Ana kategori seçildiğinde varsayılan olarak
   * alt kategoriler gösterilir.
   *
   * Kullanıcı isterse bu buton ile tüm alt kategori
   * ürünlerini birlikte görüntüleyebilir.
   */
  const [tumKategoriUrunleriniGoster, setTumKategoriUrunleriniGoster] =
    useState(false);

  const [gorunum, setGorunum] = useState("detay");

  const [yukleniyorMu, setYukleniyorMu] = useState(true);

  const [hataMesaji, setHataMesaji] = useState("");

  useEffect(() => {
    let iptalEdildiMi = false;

    Promise.resolve().then(async () => {
      if (iptalEdildiMi || !seoUrl) {
        return;
      }

      setYukleniyorMu(true);
      setHataMesaji("");

      try {
        const veri = await urunSeoUrlIleGetir(seoUrl);

        if (iptalEdildiMi) {
          return;
        }

        setUrun(veri);

        setSeciliKategoriId(veri?.kategoriId ? Number(veri.kategoriId) : null);

        setSeciliKategori(null);

        setTumKategoriUrunleriniGoster(false);

        setGorunum("detay");
      } catch (error) {
        if (iptalEdildiMi) {
          return;
        }

        setUrun(null);

        setHataMesaji(apiHataMesajiGetir(error, "Ürün bilgileri yüklenemedi."));
      } finally {
        if (!iptalEdildiMi) {
          setYukleniyorMu(false);
        }
      }
    });

    return () => {
      iptalEdildiMi = true;
    };
  }, [seoUrl]);

  function kategoriSec(kategori) {
    /*
     * "Tüm Ürünler"
     */
    if (kategori === null) {
      setSeciliKategoriId(null);

      setSeciliKategori(null);

      setTumKategoriUrunleriniGoster(false);

      setGorunum("kategori");

      return;
    }

    /*
     * Sol katalogdan kategori seçildi.
     *
     * UrunKatalogKategori artık kategori
     * nesnesinin tamamını gönderiyor.
     */
    if (typeof kategori === "object" && kategori?.id) {
      setSeciliKategoriId(Number(kategori.id));

      setSeciliKategori(kategori);

      setTumKategoriUrunleriniGoster(false);

      setGorunum("kategori");

      return;
    }

    /*
     * Eski ID tabanlı çağrılar için uyumluluk.
     *
     * Örneğin ürün breadcrumb'ındaki kategori butonu.
     */
    const kategoriId = Number(kategori);

    if (!Number.isFinite(kategoriId) || kategoriId <= 0) {
      return;
    }

    setSeciliKategoriId(kategoriId);

    setSeciliKategori(null);

    setTumKategoriUrunleriniGoster(false);

    setGorunum("kategori");
  }

  function urunSec(seciliUrun) {
    if (!seciliUrun?.seoUrl) {
      return;
    }

    if (Number(seciliUrun.id) === Number(urun?.id)) {
      setSeciliKategoriId(Number(seciliUrun.kategoriId));

      setSeciliKategori(null);

      setTumKategoriUrunleriniGoster(false);

      setGorunum("detay");

      return;
    }

    navigate(`/urunler/${encodeURIComponent(seciliUrun.seoUrl)}`);
  }

  if (yukleniyorMu && !urun) {
    return <SayfaSkeleton />;
  }

  if (hataMesaji && !urun) {
    return <UrunBulunamadi hataMesaji={hataMesaji} />;
  }

  const altKategoriler = Array.isArray(seciliKategori?.altKategoriler)
    ? seciliKategori.altKategoriler
    : [];

  /*
   * Seçilen kategorinin altında kategori varsa
   * ilk olarak onları gösteriyoruz.
   *
   * Kullanıcı "Tüm ürünleri gör" dediğinde
   * ürün listesine geçiyoruz.
   */
  const altKategoriGosterilsinMi =
    gorunum === "kategori" &&
    seciliKategoriId !== null &&
    altKategoriler.length > 0 &&
    !tumKategoriUrunleriniGoster;

  const seciliKategoriAdi = seciliKategori?.kategoriAdi?.trim() || "";

  const kategoriBasligi = altKategoriGosterilsinMi
    ? `${seciliKategoriAdi || "Kategori"} Alt Kategorileri`
    : seciliKategoriId !== null
      ? `${seciliKategoriAdi || "Kategori"} Ürünleri`
      : "Tüm Ürünler";

  return (
    <section
      className="
        relative
        w-full
        max-w-full
        overflow-hidden
        bg-[#f6f7f9]
        py-8

        sm:py-10
        lg:py-12
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-[1560px]
          px-5

          sm:px-6
          lg:px-8
        "
      >
        {/* Breadcrumb */}
        <div
          className="
            flex
            flex-wrap
            items-center
            gap-2
            text-[12px]
            font-semibold
            text-zinc-400
          "
        >
          <Link
            to="/"
            className="
              transition-colors

              hover:text-purple-700
            "
          >
            Ana Sayfa
          </Link>

          <span>/</span>

          <Link
            to="/urunler"
            className="
              transition-colors

              hover:text-purple-700
            "
          >
            Ürünler
          </Link>

          {gorunum === "detay" && urun && (
            <>
              {urun.kategoriAdi && (
                <>
                  <span>/</span>

                  <button
                    type="button"
                    onClick={() => kategoriSec(urun.kategoriId)}
                    className="
                      transition-colors

                      hover:text-purple-700
                    "
                  >
                    {urun.kategoriAdi}
                  </button>
                </>
              )}

              <span>/</span>

              <span
                className="
                  font-extrabold
                  text-zinc-800
                "
              >
                {urun.urunAdi}
              </span>
            </>
          )}

          {gorunum === "kategori" && (
            <>
              <span>/</span>

              <span
                className="
                  font-extrabold
                  text-zinc-800
                "
              >
                {seciliKategoriAdi || "Katalog"}
              </span>
            </>
          )}
        </div>

        <div
          className="
            mt-6
            grid
            min-w-0
            gap-6

            lg:grid-cols-[320px_minmax(0,1fr)]
            lg:items-start
          "
        >
          {/* Sol katalog */}
          <UrunKatalogPaneli
            aktifKategoriId={seciliKategoriId}
            aktifUrunId={gorunum === "detay" ? urun?.id : null}
            onKategoriSec={kategoriSec}
            onUrunSec={urunSec}
          />

          {/* Sağ taraf */}
          <main className="min-w-0">
            {gorunum === "detay" && urun ? (
              <UrunDetayPaneli urun={urun} />
            ) : (
              <div
                className="
                  min-w-0
                  rounded-[26px]
                  border
                  border-zinc-200/80
                  bg-white
                  p-5
                  shadow-[0_18px_50px_rgba(15,23,42,0.045)]

                  sm:p-6
                  lg:p-7
                "
              >
                <div
                  className="
                    mb-6
                    border-b
                    border-zinc-100
                    pb-5
                  "
                >
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

                  <h1
                    className="
                      mt-1.5
                      text-[24px]
                      font-extrabold
                      tracking-[-0.035em]
                      text-zinc-950

                      sm:text-[28px]
                    "
                  >
                    {kategoriBasligi}
                  </h1>

                  <p
                    className="
                      mt-2
                      max-w-[680px]
                      text-[12px]
                      leading-6
                      text-zinc-500
                    "
                  >
                    {altKategoriGosterilsinMi
                      ? "İncelemek istediğiniz ürün grubunu seçin. Alt kategori seçiminizden sonra ilgili ürünler görüntülenecektir."
                      : "İncelemek istediğiniz ürünü seçin. Ürün bilgileri, teknik özellikleri ve teklif seçenekleri bu alanda görüntülenecektir."}
                  </p>
                </div>

                {altKategoriGosterilsinMi ? (
                  <AltKategoriListesi
                    kategoriler={altKategoriler}
                    kategoriAdi={seciliKategoriAdi}
                    onKategoriSec={kategoriSec}
                    onTumUrunleriGoster={() =>
                      setTumKategoriUrunleriniGoster(true)
                    }
                  />
                ) : (
                  <UrunKatalogUrunleri
                    kategoriId={seciliKategoriId}
                    altKategorilerDahilMi={
                      seciliKategoriId === null ||
                      tumKategoriUrunleriniGoster ||
                      seciliKategori === null
                    }
                    gorunum="grid"
                    aktifUrunId={null}
                    onUrunSec={urunSec}
                  />
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </section>
  );
}

function AltKategoriListesi({
  kategoriler,
  kategoriAdi,
  onKategoriSec,
  onTumUrunleriGoster,
}) {
  return (
    <div>
      <div
        className="
          grid
          grid-cols-1
          gap-5

          sm:grid-cols-2
          xl:grid-cols-3
        "
      >
        {kategoriler.map((kategori) => (
          <AltKategoriKarti
            key={kategori.id}
            kategori={kategori}
            onClick={() => onKategoriSec(kategori)}
          />
        ))}
      </div>

      <div
        className="
          mt-7
          flex
          justify-center
          border-t
          border-zinc-100
          pt-6
        "
      >
        <button
          type="button"
          onClick={onTumUrunleriGoster}
          className="
            group
            inline-flex
            min-h-[44px]
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-purple-200
            bg-purple-50
            px-5
            text-[12px]
            font-extrabold
            text-purple-700
            transition-all

            hover:border-purple-300
            hover:bg-purple-100
          "
        >
          {kategoriAdi
            ? `${kategoriAdi} Kategorisindeki Tüm Ürünleri Gör`
            : "Tüm Ürünleri Gör"}

          <ArrowIcon />
        </button>
      </div>
    </div>
  );
}

function AltKategoriKarti({ kategori, onClick }) {
  const gorselUrl = kategoriGorselUrlOlustur(kategori.gorselYolu);

  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group
        relative
        isolate
        aspect-[3/2]
        min-w-0
        overflow-hidden
        rounded-[18px]
        bg-[#080a13]
        text-left
        shadow-[0_12px_32px_rgba(15,23,42,0.10)]
        transition-all
        duration-300

        hover:-translate-y-1
        hover:shadow-[0_20px_45px_rgba(15,23,42,0.16)]
      "
    >
      {gorselUrl ? (
        <img
          src={gorselUrl}
          alt={kategori.kategoriAdi}
          loading="lazy"
          className="
            absolute
            inset-0
            h-full
            w-full
            object-cover
            object-center
            transition-transform
            duration-700

            group-hover:scale-[1.04]
          "
        />
      ) : (
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-br
            from-[#090b18]
            via-[#101326]
            to-[#24143d]
          "
        />
      )}

      <div
        className="
          absolute
          inset-0
          bg-gradient-to-t
          from-[#050711]
          via-[#050711]/45
          to-transparent
        "
      />

      <div
        className="
          absolute
          inset-x-0
          bottom-0
          p-5
        "
      >
        <p
          className="
            text-[10px]
            font-extrabold
            uppercase
            tracking-[0.12em]
            text-purple-300
          "
        >
          Ürün Grubu
        </p>

        <h3
          className="
            mt-1.5
            text-[17px]
            font-extrabold
            leading-tight
            text-white
          "
        >
          {kategori.kategoriAdi}
        </h3>

        {kategori.aciklama && (
          <p
            className="
              mt-2
              line-clamp-2
              text-[11px]
              leading-5
              text-white/65
            "
          >
            {kategori.aciklama}
          </p>
        )}

        <span
          className="
            mt-4
            inline-flex
            items-center
            gap-2
            text-[11px]
            font-extrabold
            text-white
          "
        >
          Ürünleri İncele
          <ArrowIcon />
        </span>
      </div>
    </button>
  );
}

function kategoriGorselUrlOlustur(gorselYolu) {
  if (!gorselYolu || typeof gorselYolu !== "string") {
    return null;
  }

  const temizYol = gorselYolu.trim();

  if (!temizYol) {
    return null;
  }

  if (
    temizYol.startsWith("http://") ||
    temizYol.startsWith("https://") ||
    temizYol.startsWith("data:") ||
    temizYol.startsWith("blob:")
  ) {
    return temizYol;
  }

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

  const backendBaseUrl = apiBaseUrl.replace(/\/api\/?$/i, "");

  if (!backendBaseUrl) {
    return temizYol;
  }

  const ayrac = temizYol.startsWith("/") ? "" : "/";

  return `${backendBaseUrl}${ayrac}${temizYol}`;
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
        shrink-0
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

function SayfaSkeleton() {
  return (
    <section
      className="
        bg-[#f6f7f9]
        py-12
      "
    >
      <div
        className="
          mx-auto
          max-w-[1560px]
          px-5

          sm:px-6
          lg:px-8
        "
      >
        <div
          className="
            grid
            gap-6

            lg:grid-cols-[320px_minmax(0,1fr)]
          "
        >
          <div
            className="
              h-[620px]
              animate-pulse
              rounded-[24px]
              bg-white
            "
          />

          <div
            className="
              min-h-[620px]
              animate-pulse
              rounded-[26px]
              bg-white
            "
          />
        </div>
      </div>
    </section>
  );
}

function UrunBulunamadi({ hataMesaji }) {
  return (
    <section
      className="
        flex
        min-h-[600px]
        items-center
        justify-center
        bg-[#f6f7f9]
        px-5
        text-center
      "
    >
      <div
        className="
          max-w-[460px]
          rounded-[24px]
          border
          border-zinc-200
          bg-white
          p-8
        "
      >
        <h1
          className="
            text-[24px]
            font-extrabold
            text-zinc-950
          "
        >
          Ürün bulunamadı
        </h1>

        <p
          className="
            mt-3
            text-[13px]
            leading-6
            text-zinc-500
          "
        >
          {hataMesaji ||
            "Aradığınız ürün mevcut değil veya artık yayında değil."}
        </p>

        <Link
          to="/urunler"
          className="
            mt-6
            inline-flex
            rounded-xl
            bg-[#0b0e18]
            px-5
            py-3
            text-[12px]
            font-extrabold
            text-white
          "
        >
          Ürünlere Dön
        </Link>
      </div>
    </section>
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

export default UrunDetaySayfasi;
