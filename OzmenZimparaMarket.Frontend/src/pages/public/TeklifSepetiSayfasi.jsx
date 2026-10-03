import { Link } from "react-router";

import { usePublicSite } from "../../contexts/PublicSiteContext";
import { useTeklifSepeti } from "../../contexts/TeklifSepetiContext";

import { whatsappTeklifBaglantisiOlustur } from "../../utils/whatsappTeklif";

function TeklifSepetiSayfasi() {
  const { whatsappBaglantisi } = usePublicSite();

  const {
    sepetUrunleri,
    sepetKalemSayisi,
    sepetBosMu,
    urunKaldir,
    miktarDegistir,
    sepetiTemizle,
  } = useTeklifSepeti();

  const teklifWhatsappBaglantisi = whatsappTeklifBaglantisiOlustur(
    whatsappBaglantisi,
    sepetUrunleri,
  );

  if (sepetBosMu) {
    return <BosSepet />;
  }

  return (
    <section
      className="
        min-h-[calc(100vh-76px)]
        bg-[#f5f6f8]
        py-12

        sm:py-16
        lg:py-20
      "
    >
      <div
        className="
          mx-auto
          max-w-[1320px]
          px-5

          sm:px-6
          lg:px-8
        "
      >
        {/* Sayfa başlığı */}
        <div className="max-w-3xl">
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
                from-blue-600
                to-purple-600
              "
            />

            <span
              className="
                text-[10px]
                font-extrabold
                uppercase
                tracking-[0.18em]
                text-purple-600
              "
            >
              Teklif Listeniz
            </span>
          </div>

          <h1
            className="
              mt-5
              text-[34px]
              font-extrabold
              leading-[1.08]
              tracking-[-0.04em]
              text-zinc-950

              sm:text-[42px]
              lg:text-[50px]
            "
          >
            Teklif Sepeti
          </h1>

          <p
            className="
              mt-4
              max-w-2xl
              text-sm
              leading-7
              text-zinc-500

              sm:text-[15px]
            "
          >
            Teklif almak istediğiniz ürünleri, miktarlarını ve satış birimlerini
            kontrol edin. Hazır olduğunuzda ürün listenizi WhatsApp üzerinden
            bize iletebilirsiniz.
          </p>
        </div>

        {/* Ana düzen */}
        <div
          className="
            mt-10
            grid
            gap-7

            lg:grid-cols-[minmax(0,1fr)_360px]
            lg:items-start
          "
        >
          {/* Sol taraf */}
          <div
            className="
              overflow-hidden
              rounded-[24px]
              border
              border-zinc-200/80
              bg-white
              shadow-[0_18px_50px_rgba(15,23,42,0.06)]
            "
          >
            {/* Liste üstü */}
            <div
              className="
                flex
                flex-col
                gap-4
                border-b
                border-zinc-100
                px-5
                py-5

                sm:flex-row
                sm:items-center
                sm:justify-between

                lg:px-6
              "
            >
              <div>
                <h2
                  className="
                    text-[16px]
                    font-extrabold
                    text-zinc-950
                  "
                >
                  Sepetteki Ürünler
                </h2>

                <p
                  className="
                    mt-1
                    text-[11px]
                    text-zinc-400
                  "
                >
                  {sepetKalemSayisi} farklı ürün teklif listenizde
                </p>
              </div>

              <button
                type="button"
                onClick={sepetiTemizle}
                className="
                  inline-flex
                  w-fit
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-red-100
                  bg-red-50
                  px-3.5
                  py-2.5
                  text-[10px]
                  font-extrabold
                  text-red-600
                  transition-all

                  hover:border-red-200
                  hover:bg-red-100
                "
              >
                <TrashIcon />
                Sepeti Temizle
              </button>
            </div>

            {/* Ürünler */}
            <div className="p-3 sm:p-4">
              <div className="space-y-3">
                {sepetUrunleri.map((urun, index) => (
                  <SepetSatiri
                    key={urun.satirAnahtari}
                    urun={urun}
                    sira={index}
                    onUrunKaldir={urunKaldir}
                    onMiktarDegistir={miktarDegistir}
                  />
                ))}
              </div>
            </div>

            {/* Alt link */}
            <div
              className="
                border-t
                border-zinc-100
                px-5
                py-4

                lg:px-6
              "
            >
              <Link
                to="/urunler"
                className="
                  group
                  inline-flex
                  items-center
                  gap-2
                  text-[11px]
                  font-extrabold
                  text-zinc-600
                  transition-colors

                  hover:text-purple-700
                "
              >
                <BackIcon />
                Ürünlere Dön
              </Link>
            </div>
          </div>

          {/* Sağ teklif özeti */}
          <aside
            className="
              overflow-hidden
              rounded-[24px]
              border
              border-white/[0.07]
              bg-[#090c16]
              text-white
              shadow-[0_22px_60px_rgba(15,23,42,0.16)]

              lg:sticky
              lg:top-[100px]
            "
          >
            <div
              className="
                relative
                overflow-hidden
                border-b
                border-white/[0.07]
                px-6
                py-6
              "
            >
              <div
                className="
                  pointer-events-none
                  absolute
                  right-[-45px]
                  top-[-45px]
                  h-36
                  w-36
                  rounded-full
                  bg-purple-600/20
                  blur-[60px]
                "
              />

              <div className="relative">
                <p
                  className="
                    text-[10px]
                    font-extrabold
                    uppercase
                    tracking-[0.14em]
                    text-purple-400
                  "
                >
                  Teklif Özeti
                </p>

                <h2
                  className="
                    mt-3
                    text-[21px]
                    font-extrabold
                    tracking-[-0.025em]
                  "
                >
                  Teklif Talebiniz
                </h2>

                <p
                  className="
                    mt-3
                    text-[11px]
                    leading-5
                    text-white/45
                  "
                >
                  Sepetinizdeki ürün bilgileri ve miktarlar WhatsApp mesajına
                  otomatik olarak eklenecektir.
                </p>
              </div>
            </div>

            <div className="px-6 py-6">
              <div className="space-y-4">
                <OzetSatiri
                  baslik="Ürün Sayısı"
                  deger={`${sepetKalemSayisi} farklı ürün`}
                />

                <OzetSatiri baslik="Teklif Kanalı" deger="WhatsApp" />

                <OzetSatiri baslik="Sipariş Türü" deger="Teklif Talebi" />
              </div>

              <div
                className="
                  my-6
                  h-px
                  bg-white/[0.07]
                "
              />

              <div
                className="
                  rounded-2xl
                  border
                  border-white/[0.06]
                  bg-white/[0.03]
                  p-4
                "
              >
                <div
                  className="
                    flex
                    items-start
                    gap-3
                  "
                >
                  <div
                    className="
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-purple-500/10
                      text-purple-300
                    "
                  >
                    <InfoIcon />
                  </div>

                  <p
                    className="
                      text-[10px]
                      leading-5
                      text-white/45
                    "
                  >
                    Bu ekran ödeme veya online sipariş işlemi yapmaz. Ürün
                    listeniz firmaya teklif talebi olarak gönderilir.
                  </p>
                </div>
              </div>

              {teklifWhatsappBaglantisi && (
                <a
                  href={teklifWhatsappBaglantisi}
                  target="_blank"
                  rel="noreferrer"
                  className="
                    mt-6
                    flex
                    h-13
                    w-full
                    items-center
                    justify-center
                    gap-2.5
                    rounded-2xl
                    bg-[#25D366]
                    px-5
                    py-4
                    text-[12px]
                    font-extrabold
                    text-white
                    shadow-[0_14px_35px_rgba(37,211,102,0.20)]
                    transition-all
                    duration-200

                    hover:-translate-y-0.5
                    hover:bg-[#20bd5a]
                    hover:shadow-[0_18px_40px_rgba(37,211,102,0.26)]
                  "
                >
                  <WhatsAppIcon />
                  WhatsApp'tan Teklif Al
                </a>
              )}

              <p
                className="
                  mt-3
                  text-center
                  text-[9px]
                  leading-4
                  text-white/30
                "
              >
                Mesajınız gönderilmeden önce WhatsApp üzerinden görüntülenebilir
                ve düzenlenebilir.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function SepetSatiri({ urun, sira, onUrunKaldir, onMiktarDegistir }) {
  const gorselUrl = urunGorselUrlOlustur(urun.gorselYolu);

  const hedefYol = urun.seoUrl
    ? `/urunler/${encodeURIComponent(urun.seoUrl)}`
    : "/urunler";

  const birimAdi = String(urun.satisBirimiAdi ?? "").trim();

  const miktar = Number(urun.miktar);

  const miktarAdimi = satisBirimiMetreMi(birimAdi) ? 0.1 : 1;

  const zebraSinifi =
    sira % 2 === 0
      ? "bg-zinc-50/90 border-zinc-100"
      : "bg-white border-zinc-100";

  function azalt() {
    const yeniMiktar = sayiyiDuzenle(miktar - miktarAdimi);

    if (yeniMiktar <= 0) {
      return;
    }

    onMiktarDegistir(urun.satirAnahtari, yeniMiktar);
  }

  function artir() {
    const yeniMiktar = sayiyiDuzenle(miktar + miktarAdimi);

    onMiktarDegistir(urun.satirAnahtari, yeniMiktar);
  }

  function inputDegistir(event) {
    const yeniMiktar = Number(event.target.value);

    if (!Number.isFinite(yeniMiktar) || yeniMiktar <= 0) {
      return;
    }

    onMiktarDegistir(urun.satirAnahtari, yeniMiktar);
  }

  return (
    <article
      className={`
        rounded-[20px]
        border
        p-3.5
        transition-all
        duration-200

        ${zebraSinifi}

        hover:border-purple-200
        hover:shadow-[0_10px_30px_rgba(15,23,42,0.05)]

        sm:p-4
      `}
    >
      <div
        className="
          flex
          flex-col
          gap-4

          sm:flex-row
          sm:items-center
        "
      >
        <Link
          to={hedefYol}
          className="
            h-[120px]
            w-full
            shrink-0
            overflow-hidden
            rounded-2xl
            bg-[#080a12]

            sm:h-[100px]
            sm:w-[120px]
          "
        >
          {gorselUrl ? (
            <img
              src={gorselUrl}
              alt={urun.urunAdi}
              className="
                h-full
                w-full
                object-cover
                object-center
              "
            />
          ) : (
            <div
              className="
                flex
                h-full
                w-full
                items-center
                justify-center
                bg-gradient-to-br
                from-[#111426]
                to-[#24143d]
                text-white/20
              "
            >
              <ProductIcon />
            </div>
          )}
        </Link>

        <div className="min-w-0 flex-1">
          {urun.kategoriAdi && (
            <p
              className="
                line-clamp-1
                text-[9px]
                font-extrabold
                uppercase
                tracking-[0.10em]
                text-purple-600
              "
            >
              {urun.kategoriAdi}
            </p>
          )}

          <Link
            to={hedefYol}
            className="
              mt-1.5
              block
              text-[15px]
              font-extrabold
              leading-5
              text-zinc-950
              transition-colors

              hover:text-purple-700
            "
          >
            {urun.urunAdi}
          </Link>

          {urun.urunKodu && (
            <p
              className="
                mt-1.5
                text-[10px]
                font-medium
                text-zinc-400
              "
            >
              Ürün Kodu: {urun.urunKodu}
            </p>
          )}

          <Secimler secimler={urun.secimler} />
        </div>

        <div
          className="
            flex
            shrink-0
            items-center
            justify-between
            gap-3

            sm:justify-end
          "
        >
          <div>
            <p
              className="
                mb-1.5
                text-center
                text-[8px]
                font-extrabold
                uppercase
                tracking-[0.08em]
                text-zinc-400
              "
            >
              {birimAdi || "Miktar"}
            </p>

            <div
              className="
                flex
                items-center
                overflow-hidden
                rounded-xl
                border
                border-zinc-200
                bg-white
                shadow-sm
              "
            >
              <button
                type="button"
                onClick={azalt}
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  text-sm
                  font-bold
                  text-zinc-500
                  transition-colors

                  hover:bg-zinc-50
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
                value={urun.miktar}
                onChange={inputDegistir}
                className="
                  h-10
                  w-[64px]
                  border-x
                  border-zinc-200
                  bg-white
                  text-center
                  text-[12px]
                  font-extrabold
                  text-zinc-900
                  outline-none

                  [appearance:textfield]
                  [&::-webkit-inner-spin-button]:appearance-none
                  [&::-webkit-outer-spin-button]:appearance-none
                "
                aria-label={`Miktar ${birimAdi}`}
              />

              <button
                type="button"
                onClick={artir}
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  text-sm
                  font-bold
                  text-zinc-500
                  transition-colors

                  hover:bg-zinc-50
                  hover:text-purple-700
                "
                aria-label="Miktarı artır"
              >
                +
              </button>
            </div>

            {birimAdi && (
              <p
                className="
                  mt-1.5
                  text-center
                  text-[10px]
                  font-bold
                  text-purple-600
                "
              >
                {miktariFormatla(urun.miktar)} {birimAdi}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => onUrunKaldir(urun.satirAnahtari)}
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
              border-red-100
              bg-red-50
              text-red-400
              transition-all

              hover:border-red-200
              hover:bg-red-100
              hover:text-red-600
            "
            aria-label={`${urun.urunAdi} ürününü sepetten kaldır`}
          >
            <TrashIcon />
          </button>
        </div>
      </div>
    </article>
  );
}

function Secimler({ secimler }) {
  if (!Array.isArray(secimler) || secimler.length === 0) {
    return null;
  }

  return (
    <div
      className="
        mt-3
        flex
        flex-wrap
        gap-1.5
      "
    >
      {secimler.map((secim, index) => {
        const baslik = secim?.detayAdi ?? secim?.baslik ?? secim?.adi;

        const deger = secim?.detayDegeri ?? secim?.deger ?? secim?.seciliDeger;

        if (!baslik || !deger) {
          return null;
        }

        return (
          <span
            key={`${baslik}-${index}`}
            className="
              rounded-lg
              bg-purple-50
              px-2
              py-1
              text-[9px]
              font-semibold
              text-purple-700
            "
          >
            {baslik}: {deger}
          </span>
        );
      })}
    </div>
  );
}

function OzetSatiri({ baslik, deger }) {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        gap-4
      "
    >
      <span
        className="
          text-[10px]
          font-medium
          text-white/40
        "
      >
        {baslik}
      </span>

      <span
        className="
          text-right
          text-[11px]
          font-extrabold
          text-white
        "
      >
        {deger}
      </span>
    </div>
  );
}

function BosSepet() {
  return (
    <section
      className="
        flex
        min-h-[calc(100vh-76px)]
        items-center
        bg-[#f5f6f8]
        px-5
        py-16
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-[620px]
          rounded-[28px]
          border
          border-zinc-200/80
          bg-white
          px-6
          py-14
          text-center
          shadow-[0_20px_60px_rgba(15,23,42,0.07)]

          sm:px-10
        "
      >
        <div
          className="
            mx-auto
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-2xl
            bg-gradient-to-br
            from-blue-50
            to-purple-100
            text-purple-600
          "
        >
          <CartIcon />
        </div>

        <h1
          className="
            mt-6
            text-[27px]
            font-extrabold
            tracking-[-0.035em]
            text-zinc-950
          "
        >
          Teklif Sepetiniz Boş
        </h1>

        <p
          className="
            mx-auto
            mt-3
            max-w-md
            text-[13px]
            leading-6
            text-zinc-500
          "
        >
          İlgilendiğiniz zımpara ve aşındırıcı ürünlerini teklif sepetinize
          ekleyerek WhatsApp üzerinden hızlıca fiyat ve tedarik bilgisi
          isteyebilirsiniz.
        </p>

        <Link
          to="/urunler"
          className="
            mt-7
            inline-flex
            h-12
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-gradient-to-r
            from-blue-600
            to-purple-600
            px-6
            text-[11px]
            font-extrabold
            text-white
            shadow-[0_12px_30px_rgba(124,77,255,0.20)]
            transition-all

            hover:-translate-y-0.5
            hover:shadow-[0_16px_35px_rgba(124,77,255,0.28)]
          "
        >
          Ürünleri İncele
          <ArrowIcon />
        </Link>
      </div>
    </section>
  );
}

function satisBirimiMetreMi(satisBirimiAdi) {
  const birim = String(satisBirimiAdi ?? "")
    .trim()
    .toLocaleLowerCase("tr-TR");

  return birim === "metre" || birim === "meter";
}

function miktariFormatla(miktar) {
  const sayi = Number(miktar);

  if (!Number.isFinite(sayi)) {
    return "1";
  }

  return new Intl.NumberFormat("tr-TR", {
    maximumFractionDigits: 2,
  }).format(sayi);
}

function sayiyiDuzenle(sayi) {
  return Number(Number(sayi).toFixed(2));
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

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4A8 8 0 1 1 20 11.5Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path d="M9 8.5c.5 2.5 2 4 4.5 5" strokeLinecap="round" />
    </svg>
  );
}

function TrashIcon() {
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
        d="M5 7h14M9 7V5h6v2M8 10v7M12 10v7M16 10v7M6.5 7l.8 13h9.4l.8-13"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" strokeLinecap="round" />
    </svg>
  );
}

function ProductIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-7 w-7"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="7" />
      <circle cx="12" cy="12" r="2" />
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
      className="h-7 w-7"
      aria-hidden="true"
    >
      <path
        d="M3 4h2l2 11h10l2-7H6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="19" r="1" />
      <circle cx="17" cy="19" r="1" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="
        h-4
        w-4
        transition-transform

        group-hover:-translate-x-1
      "
      aria-hidden="true"
    >
      <path
        d="M19 12H5M11 18l-6-6 6-6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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
      className="h-4 w-4"
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

export default TeklifSepetiSayfasi;
