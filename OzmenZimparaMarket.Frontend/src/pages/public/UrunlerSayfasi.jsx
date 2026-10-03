import { useState } from "react";
import { useSearchParams } from "react-router";

import UrunKategoriFiltresi from "../../components/public/urunler/UrunKategoriFiltresi";
import UrunListesi from "../../components/public/urunler/UrunListesi";
import UrunTeknikFiltreleri from "../../components/public/urunler/UrunTeknikFiltreleri";
import Select from "../../components/ui/select";

const SIRALAMA_SECENEKLERI = [
  {
    value: 1,
    label: "Önerilen Sıralama",
  },
  {
    value: 2,
    label: "Sıra No Azalan",
  },
  {
    value: 3,
    label: "Ürün Adı A-Z",
  },
  {
    value: 4,
    label: "Ürün Adı Z-A",
  },
  {
    value: 5,
    label: "Yeni Eklenenler",
  },
  {
    value: 6,
    label: "Eski Eklenenler",
  },
];

function UrunlerSayfasi() {
  const [aramaParametreleri, setAramaParametreleri] = useSearchParams();

  const [teknikDetayFiltreleri, setTeknikDetayFiltreleri] = useState([]);
  const [aramaMetni, setAramaMetni] = useState("");
  const [uygulananAramaMetni, setUygulananAramaMetni] = useState("");
  const [siralama, setSiralama] = useState(1);

  const [mobilFiltreAcikMi, setMobilFiltreAcikMi] = useState(false);

  const kategoriParametresi = Number(aramaParametreleri.get("kategoriId"));

  const seciliKategoriId =
    Number.isInteger(kategoriParametresi) && kategoriParametresi > 0
      ? kategoriParametresi
      : null;

  const seciliTeknikDegerSayisi = teknikDetayFiltreleri.reduce(
    (toplam, filtre) => {
      const degerler = Array.isArray(filtre?.degerler) ? filtre.degerler : [];

      return toplam + degerler.length;
    },
    0,
  );

  const aktifFiltreSayisi =
    (seciliKategoriId !== null ? 1 : 0) +
    seciliTeknikDegerSayisi +
    (uygulananAramaMetni ? 1 : 0) +
    (siralama !== 1 ? 1 : 0);

  const filtreAktifMi = aktifFiltreSayisi > 0;

  const katalogBasligi = uygulananAramaMetni
    ? "Arama Sonuçları"
    : seciliKategoriId !== null
      ? "Kategori Ürünleri"
      : "Tüm Ürünler";

  function kategoriDegistir(kategoriId) {
    const yeniParametreler = new URLSearchParams(aramaParametreleri);

    if (kategoriId) {
      yeniParametreler.set("kategoriId", String(kategoriId));
    } else {
      yeniParametreler.delete("kategoriId");
    }

    setAramaParametreleri(yeniParametreler);

    setTeknikDetayFiltreleri([]);

    setMobilFiltreAcikMi(false);
  }

  function aramaYap(event) {
    event.preventDefault();

    setUygulananAramaMetni(aramaMetni.trim());
  }

  function aramayiTemizle() {
    setAramaMetni("");
    setUygulananAramaMetni("");
  }

  function siralamaDegistir(value) {
    setSiralama(Number(value));
  }

  function tumFiltreleriTemizle() {
    const yeniParametreler = new URLSearchParams(aramaParametreleri);

    yeniParametreler.delete("kategoriId");

    setAramaParametreleri(yeniParametreler);

    setTeknikDetayFiltreleri([]);

    setAramaMetni("");
    setUygulananAramaMetni("");

    setSiralama(1);

    setMobilFiltreAcikMi(false);
  }

  return (
    <>
      <UrunlerHero />

      <section
        className="
          relative
          isolate
          w-full
          max-w-full
          overflow-hidden
          bg-[#f6f7f9]
          py-10

          sm:py-14
          lg:py-20
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
          <div
            className="
              grid
              min-w-0
              gap-6

              lg:grid-cols-[340px_minmax(0,1fr)]
              lg:items-start
              lg:gap-8
            "
          >
            {/* Sol filtre alanı */}
            <aside
              className="
                min-w-0
                overflow-hidden
                rounded-[22px]
                border
                border-zinc-200/80
                bg-white
                shadow-[0_16px_45px_rgba(15,23,42,0.045)]

                lg:rounded-[26px]
              "
            >
              {/* Filtre başlığı */}
              <div
                className="
                  border-b
                  border-zinc-100
                  px-4
                  py-4

                  sm:px-5
                  sm:py-5

                  lg:px-6
                  lg:py-6
                "
              >
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-3
                  "
                >
                  {/* Mobil aç/kapat */}
                  <button
                    type="button"
                    onClick={() => setMobilFiltreAcikMi((mevcut) => !mevcut)}
                    className="
                      flex
                      min-w-0
                      flex-1
                      items-center
                      gap-3
                      text-left

                      lg:pointer-events-none
                    "
                    aria-expanded={mobilFiltreAcikMi}
                    aria-controls="urun-filtre-icerigi"
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

                        lg:h-11
                        lg:w-11
                      "
                    >
                      <FilterIcon />
                    </div>

                    <div className="min-w-0">
                      <div
                        className="
                          flex
                          flex-wrap
                          items-center
                          gap-2
                        "
                      >
                        <h2
                          className="
                            text-[16px]
                            font-extrabold
                            tracking-[-0.025em]
                            text-zinc-950

                            lg:text-[17px]
                          "
                        >
                          Filtreler
                        </h2>

                        {filtreAktifMi && (
                          <span
                            className="
                              rounded-full
                              bg-purple-50
                              px-2
                              py-1
                              text-[10px]
                              font-extrabold
                              text-purple-600
                            "
                          >
                            {aktifFiltreSayisi} aktif
                          </span>
                        )}
                      </div>

                      <p
                        className="
                          mt-0.5
                          text-[11px]
                          font-medium
                          text-zinc-400

                          sm:text-[12px]
                        "
                      >
                        Ürünleri ihtiyacınıza göre daraltın
                      </p>
                    </div>
                  </button>

                  <div
                    className="
                      flex
                      shrink-0
                      items-center
                      gap-1
                    "
                  >
                    {filtreAktifMi && (
                      <button
                        type="button"
                        onClick={tumFiltreleriTemizle}
                        className="
                          rounded-lg
                          px-2
                          py-1.5
                          text-[10px]
                          font-extrabold
                          text-purple-600
                          transition-colors

                          hover:bg-purple-50
                          hover:text-purple-800

                          sm:text-[11px]
                        "
                      >
                        Temizle
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setMobilFiltreAcikMi((mevcut) => !mevcut)}
                      className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-lg
                        bg-zinc-50
                        text-zinc-500
                        transition-colors

                        hover:bg-purple-50
                        hover:text-purple-700

                        lg:hidden
                      "
                      aria-label={
                        mobilFiltreAcikMi ? "Filtreleri kapat" : "Filtreleri aç"
                      }
                    >
                      <span
                        className={`
                          transition-transform
                          duration-200

                          ${mobilFiltreAcikMi ? "rotate-180" : ""}
                        `}
                      >
                        <ChevronDownIcon />
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Açılır filtre içeriği */}
              <div
                id="urun-filtre-icerigi"
                className={`
                  ${mobilFiltreAcikMi ? "block" : "hidden"}

                  lg:block
                `}
              >
                {/* Kategoriler */}
                <div
                  className="
                    p-5

                    lg:p-6
                  "
                >
                  <div
                    className="
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
                      Kategoriler
                    </span>

                    <span
                      className="
                        h-1.5
                        w-1.5
                        shrink-0
                        rounded-full
                        bg-purple-500
                      "
                    />
                  </div>

                  <div className="mt-5">
                    <UrunKategoriFiltresi
                      seciliKategoriId={seciliKategoriId}
                      onKategoriDegistir={kategoriDegistir}
                    />
                  </div>
                </div>

                {/* Ayırıcı */}
                <div
                  className="
                    mx-5
                    h-px
                    bg-zinc-100

                    lg:mx-6
                  "
                />

                {/* Teknik filtreler */}
                <div
                  className="
                    p-5

                    lg:p-6
                  "
                >
                  <UrunTeknikFiltreleri
                    key={
                      seciliKategoriId === null
                        ? "tum-teknik-filtreler"
                        : `teknik-${seciliKategoriId}`
                    }
                    kategoriId={seciliKategoriId}
                    seciliFiltreler={teknikDetayFiltreleri}
                    onFiltrelerDegistir={setTeknikDetayFiltreleri}
                  />
                </div>
              </div>
            </aside>

            {/* Sağ ürün alanı */}
            <main className="min-w-0">
              {/* Üst araç çubuğu */}
              <div
                className="
                  flex
                  flex-col
                  gap-5
                  rounded-[22px]
                  border
                  border-zinc-200/80
                  bg-white
                  px-4
                  py-5
                  shadow-[0_12px_35px_rgba(15,23,42,0.035)]

                  sm:px-6

                  xl:flex-row
                  xl:items-center
                  xl:justify-between
                "
              >
                {/* Başlık */}
                <div className="min-w-0">
                  <p
                    className="
                      text-[10px]
                      font-extrabold
                      uppercase
                      tracking-[0.12em]
                      text-purple-600

                      sm:text-[11px]
                    "
                  >
                    Ürün Kataloğu
                  </p>

                  <h2
                    className="
                      mt-1.5
                      text-[19px]
                      font-extrabold
                      tracking-[-0.03em]
                      text-zinc-950

                      sm:text-[20px]
                    "
                  >
                    {katalogBasligi}
                  </h2>

                  {uygulananAramaMetni && (
                    <p
                      className="
                        mt-1
                        text-[11px]
                        font-medium
                        text-zinc-400
                      "
                    >
                      “{uygulananAramaMetni}” için sonuçlar
                    </p>
                  )}
                </div>

                {/* Arama + sıralama */}
                <div
                  className="
                    flex
                    w-full
                    flex-col
                    gap-3

                    md:flex-row
                    md:items-center

                    xl:w-auto
                  "
                >
                  {/* Arama */}
                  <form
                    onSubmit={aramaYap}
                    className="
                      flex
                      min-h-[50px]
                      min-w-0
                      flex-1
                      items-center
                      overflow-hidden
                      rounded-[14px]
                      border
                      border-zinc-200
                      bg-zinc-50
                      transition-all

                      focus-within:border-purple-300
                      focus-within:bg-white
                      focus-within:shadow-[0_0_0_3px_rgba(124,58,237,0.06)]

                      md:min-w-[390px]
                      xl:min-w-[430px]
                    "
                  >
                    <div
                      className="
                        flex
                        shrink-0
                        items-center
                        justify-center
                        pl-4
                        text-zinc-400
                      "
                    >
                      <SearchIcon />
                    </div>

                    <input
                      type="text"
                      inputMode="search"
                      value={aramaMetni}
                      onChange={(event) => setAramaMetni(event.target.value)}
                      placeholder="Ürün adı, kodu veya özellik ara..."
                      autoComplete="off"
                      className="
                        min-w-0
                        flex-1
                        bg-transparent
                        px-3
                        py-3
                        text-[13px]
                        font-semibold
                        text-zinc-800
                        outline-none

                        placeholder:font-medium
                        placeholder:text-zinc-400

                        sm:text-[14px]
                      "
                    />

                    {aramaMetni && (
                      <button
                        type="button"
                        onClick={aramayiTemizle}
                        className="
                          mr-1
                          flex
                          h-9
                          w-9
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          text-zinc-400
                          transition-colors

                          hover:bg-zinc-100
                          hover:text-zinc-700
                        "
                        aria-label="Aramayı temizle"
                      >
                        <CloseIcon />
                      </button>
                    )}

                    <button
                      type="submit"
                      className="
                        m-1
                        min-h-[40px]
                        shrink-0
                        rounded-[10px]
                        bg-[#0b0e18]
                        px-4
                        text-[11px]
                        font-extrabold
                        text-white
                        transition-all

                        hover:bg-purple-700

                        sm:min-h-[42px]
                        sm:px-5
                        sm:text-[12px]
                      "
                    >
                      Ara
                    </button>
                  </form>

                  {/* Sıralama */}
                  <div
                    className="
                      w-full

                      md:w-[240px]
                    "
                  >
                    <Select
                      id="urun-siralama"
                      value={siralama}
                      onValueChange={siralamaDegistir}
                      options={SIRALAMA_SECENEKLERI}
                      placeholder="Sıralama"
                    />
                  </div>
                </div>
              </div>

              {/* Aktif arama */}
              {uygulananAramaMetni && (
                <div
                  className="
                    mt-4
                    flex
                    flex-wrap
                    items-center
                    gap-2.5
                  "
                >
                  <span
                    className="
                      text-[12px]
                      font-semibold
                      text-zinc-500
                    "
                  >
                    Arama:
                  </span>

                  <button
                    type="button"
                    onClick={aramayiTemizle}
                    className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-full
                      border
                      border-purple-100
                      bg-purple-50
                      px-3.5
                      py-2
                      text-[12px]
                      font-bold
                      text-purple-700
                      transition-colors

                      hover:bg-purple-100
                    "
                  >
                    “{uygulananAramaMetni}”
                    <CloseIcon />
                  </button>
                </div>
              )}

              {/* Ürünler */}
              <div
                className="
                  mt-5
                  min-h-[560px]
                  overflow-hidden
                  rounded-[22px]
                  border
                  border-zinc-200/70
                  bg-white
                  p-4
                  shadow-[0_16px_45px_rgba(15,23,42,0.035)]

                  sm:p-5
                  lg:rounded-[24px]
                  lg:p-7
                "
              >
                <UrunListesi
                  key={`${seciliKategoriId ?? "tum"}-${JSON.stringify(
                    teknikDetayFiltreleri,
                  )}-${uygulananAramaMetni}-${siralama}`}
                  kategoriId={seciliKategoriId}
                  aramaMetni={uygulananAramaMetni}
                  siralama={siralama}
                  teknikDetayFiltreleri={teknikDetayFiltreleri}
                />
              </div>
            </main>
          </div>
        </div>
      </section>
    </>
  );
}

function UrunlerHero() {
  return (
    <section
      className="
        relative
        isolate
        w-full
        max-w-full
        overflow-hidden
        bg-[#060913]
        py-14

        sm:py-20
        lg:py-24
      "
    >
      <div
        className="
          pointer-events-none
          absolute
          left-[-180px]
          top-[-160px]
          h-[440px]
          w-[440px]
          rounded-full
          bg-blue-600/[0.10]
          blur-[130px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          bottom-[-180px]
          right-[-120px]
          h-[460px]
          w-[460px]
          rounded-full
          bg-purple-600/[0.12]
          blur-[130px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.035]
          [background-image:linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.8)_1px,transparent_1px)]
          [background-size:48px_48px]
        "
      />

      <div
        className="
          relative
          mx-auto
          w-full
          max-w-[1560px]
          px-5

          sm:px-6
          lg:px-8
        "
      >
        <div className="max-w-[820px]">
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
                from-blue-400
                to-purple-500
              "
            />

            <span
              className="
                text-[11px]
                font-extrabold
                uppercase
                tracking-[0.17em]
                text-purple-400

                sm:text-[12px]
              "
            >
              Ürünlerimiz
            </span>
          </div>

          <h1
            className="
              mt-5
              text-[34px]
              font-extrabold
              leading-[1.13]
              tracking-[-0.045em]
              text-white

              sm:text-[46px]
              lg:text-[54px]
            "
          >
            Profesyonel Zımpara ve
            <span
              className="
                mt-1
                block
                bg-gradient-to-r
                from-blue-400
                via-indigo-400
                to-purple-400
                bg-clip-text
                pb-1
                text-transparent
              "
            >
              Aşındırıcı Ürünler
            </span>
          </h1>

          <p
            className="
              mt-5
              max-w-[720px]
              text-[14px]
              leading-7
              text-white/55

              sm:text-[16px]
              sm:leading-8
            "
          >
            Farklı sektör, yüzey ve uygulama ihtiyaçlarına yönelik profesyonel
            zımpara ve aşındırıcı ürün gruplarımızı inceleyin. İhtiyacınıza
            uygun ürünü kategori ve teknik özelliklerine göre filtreleyin.
          </p>
        </div>
      </div>
    </section>
  );
}

function FilterIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="
        h-[18px]
        w-[18px]
        shrink-0
      "
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="6" />

      <path d="m16 16 4 4" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M7 7l10 10M17 7 7 17" strokeLinecap="round" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default UrunlerSayfasi;
