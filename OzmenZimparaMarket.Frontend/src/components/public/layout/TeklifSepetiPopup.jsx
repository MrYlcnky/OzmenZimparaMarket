import { Link } from "react-router";

function TeklifSepetiPopup({
  open,
  sepetUrunleri,
  sepetKalemSayisi,
  whatsappBaglantisi,
  onUrunKaldir,
  onMiktarDegistir,
  onClose,
}) {
  if (!open) {
    return null;
  }

  const gosterilecekUrunler = sepetUrunleri.slice(0, 6);

  const kalanUrunSayisi = Math.max(
    0,
    sepetKalemSayisi - gosterilecekUrunler.length,
  );

  return (
    <div
      className="
        absolute
        right-0
        top-[calc(100%+12px)]
        z-[70]
        w-[420px]
        overflow-hidden
        rounded-[24px]
        border
        border-white/[0.08]
        bg-[#090c16]/95
        shadow-[0_28px_90px_rgba(0,0,0,0.45)]
        backdrop-blur-2xl
      "
    >
      <div
        className="
          relative
          border-b
          border-white/[0.06]
          px-5
          pb-4
          pt-5
        "
      >
        <div
          className="
            pointer-events-none
            absolute
            right-[-30px]
            top-[-30px]
            h-28
            w-28
            rounded-full
            bg-purple-500/20
            blur-[55px]
          "
        />

        <div
          className="
            relative
            flex
            items-start
            justify-between
            gap-4
          "
        >
          <div>
            <p
              className="
                text-[13px]
                font-extrabold
                text-white
              "
            >
              Teklif Sepeti
            </p>

            <p
              className="
                mt-1
                text-[11px]
                leading-5
                text-white/45
              "
            >
              {sepetKalemSayisi > 0
                ? `${sepetKalemSayisi} ürün teklif listenizde`
                : "Henüz ürün eklenmedi"}
            </p>
          </div>

          <span
            className="
              flex
              h-9
              min-w-9
              items-center
              justify-center
              rounded-full
              bg-gradient-to-r
              from-blue-500
              to-purple-500
              px-2.5
              text-[11px]
              font-extrabold
              text-white
              shadow-[0_10px_25px_rgba(124,77,255,0.28)]
            "
          >
            {sepetKalemSayisi}
          </span>
        </div>
      </div>

      {sepetKalemSayisi === 0 ? (
        <BosSepet onClose={onClose} />
      ) : (
        <>
          <div
            className="
              max-h-[420px]
              overflow-y-auto
              px-4
              py-4
            "
          >
            <div className="space-y-3">
              {gosterilecekUrunler.map((urun, index) => (
                <SepetUrunu
                  key={urun.satirAnahtari}
                  urun={urun}
                  sira={index}
                  onUrunKaldir={onUrunKaldir}
                  onMiktarDegistir={onMiktarDegistir}
                  onClose={onClose}
                />
              ))}
            </div>

            {kalanUrunSayisi > 0 && (
              <div
                className="
                  mt-3
                  rounded-2xl
                  border
                  border-white/[0.06]
                  bg-white/[0.03]
                  px-4
                  py-3
                  text-center
                  text-[10px]
                  font-semibold
                  text-white/45
                "
              >
                + {kalanUrunSayisi} ürün daha
              </div>
            )}
          </div>

          <div
            className="
              border-t
              border-white/[0.06]
              bg-white/[0.02]
              p-4
            "
          >
            <div
              className="
                grid
                grid-cols-2
                gap-3
              "
            >
              <Link
                to="/teklif-sepeti"
                onClick={onClose}
                className="
                  flex
                  h-12
                  items-center
                  justify-center
                  gap-2
                  rounded-2xl
                  border
                  border-white/[0.10]
                  bg-white/[0.04]
                  px-4
                  text-[12px]
                  font-extrabold
                  text-white
                  transition-all

                  hover:border-purple-400/30
                  hover:bg-white/[0.07]
                "
              >
                Sepete Git
                <ArrowIcon />
              </Link>

              {whatsappBaglantisi && (
                <a
                  href={whatsappBaglantisi}
                  target="_blank"
                  rel="noreferrer"
                  onClick={onClose}
                  className="
                    flex
                    h-12
                    items-center
                    justify-center
                    gap-2
                    rounded-2xl
                    bg-[#25D366]
                    px-4
                    text-[12px]
                    font-extrabold
                    text-white
                    shadow-[0_12px_28px_rgba(37,211,102,0.18)]
                    transition-all

                    hover:-translate-y-0.5
                    hover:bg-[#20bd5a]
                  "
                >
                  <WhatsAppIcon />
                  Teklif Al
                </a>
              )}
            </div>

            <p
              className="
                mt-3
                text-center
                text-[9px]
                leading-4
                text-white/30
              "
            >
              Ürün listeniz WhatsApp mesajına otomatik olarak eklenir.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

function SepetUrunu({ urun, sira, onUrunKaldir, onMiktarDegistir, onClose }) {
  const gorselUrl = urunGorselUrlOlustur(urun.gorselYolu);

  const hedefYol = urun.seoUrl
    ? `/urunler/${encodeURIComponent(urun.seoUrl)}`
    : "/urunler";

  const miktarMetni = miktariFormatla(urun.miktar);

  const birimAdi = String(urun.satisBirimiAdi ?? "").trim();

  const adim = satisBirimiMetreMi(birimAdi) ? 0.1 : 1;

  const zebraSinifi =
    sira % 2 === 0
      ? "bg-white/[0.050] border-white/[0.07]"
      : "bg-white/[0.025] border-white/[0.045]";

  function azalt() {
    const yeniMiktar = sayiyiDuzenle(Number(urun.miktar) - adim);

    if (yeniMiktar <= 0) {
      return;
    }

    onMiktarDegistir(urun.satirAnahtari, yeniMiktar);
  }

  function artir() {
    const yeniMiktar = sayiyiDuzenle(Number(urun.miktar) + adim);

    onMiktarDegistir(urun.satirAnahtari, yeniMiktar);
  }

  return (
    <div
      className={`
        group/urun
        rounded-[20px]
        border
        p-3
        transition-all
        duration-200

        ${zebraSinifi}

        hover:border-purple-400/20
        hover:bg-white/[0.065]
      `}
    >
      <div className="flex gap-3">
        <Link
          to={hedefYol}
          onClick={onClose}
          className="
            h-[82px]
            w-[88px]
            shrink-0
            overflow-hidden
            rounded-2xl
            bg-[#050711]
            ring-1
            ring-white/[0.05]
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

        <div
          className="
            min-w-0
            flex-1
          "
        >
          <div
            className="
              flex
              items-start
              justify-between
              gap-2
            "
          >
            <div className="min-w-0">
              {urun.kategoriAdi && (
                <p
                  className="
                    mb-1
                    line-clamp-1
                    text-[8px]
                    font-extrabold
                    uppercase
                    tracking-[0.09em]
                    text-purple-400
                  "
                >
                  {urun.kategoriAdi}
                </p>
              )}

              <Link
                to={hedefYol}
                onClick={onClose}
                className="
                  line-clamp-2
                  text-[12px]
                  font-bold
                  leading-[1.45]
                  text-white
                  transition-colors

                  hover:text-purple-300
                "
              >
                {urun.urunAdi}
              </Link>

              {urun.urunKodu && (
                <p
                  className="
                    mt-1
                    text-[9px]
                    font-medium
                    tracking-[0.03em]
                    text-white/35
                  "
                >
                  Kod: {urun.urunKodu}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => onUrunKaldir(urun.satirAnahtari)}
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-xl
                text-white/30
                transition-all

                hover:bg-red-500/10
                hover:text-red-400
              "
              aria-label={`${urun.urunAdi} ürününü sepetten kaldır`}
            >
              <TrashIcon />
            </button>
          </div>

          <div
            className="
              mt-3
              flex
              items-end
              justify-between
              gap-3
            "
          >
            <div>
              <p
                className="
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.08em]
                  text-white/30
                "
              >
                Miktar
              </p>

              <p
                className="
                  mt-1
                  text-[11px]
                  font-extrabold
                  text-purple-300
                "
              >
                {miktarMetni}
                {birimAdi ? ` ${birimAdi}` : ""}
              </p>
            </div>

            <div
              className="
                flex
                items-center
                overflow-hidden
                rounded-xl
                border
                border-white/[0.09]
                bg-[#111523]
              "
            >
              <button
                type="button"
                onClick={azalt}
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  text-sm
                  font-bold
                  text-white/60

                  hover:bg-white/[0.06]
                  hover:text-white
                "
                aria-label="Miktarı azalt"
              >
                −
              </button>

              <div
                className="
                  flex
                  h-9
                  min-w-[52px]
                  items-center
                  justify-center
                  border-x
                  border-white/[0.08]
                  px-2
                  text-[11px]
                  font-extrabold
                  text-white
                "
              >
                {miktarMetni}
              </div>

              <button
                type="button"
                onClick={artir}
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  text-sm
                  font-bold
                  text-white/60

                  hover:bg-white/[0.06]
                  hover:text-white
                "
                aria-label="Miktarı artır"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BosSepet({ onClose }) {
  return (
    <div
      className="
        flex
        flex-col
        items-center
        px-6
        py-10
        text-center
      "
    >
      <div
        className="
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-2xl
          border
          border-white/[0.07]
          bg-white/[0.035]
          text-white/30
        "
      >
        <CartIcon />
      </div>

      <p
        className="
          mt-4
          text-[13px]
          font-extrabold
          text-white
        "
      >
        Teklif sepetiniz boş
      </p>

      <p
        className="
          mt-2
          max-w-[250px]
          text-[10px]
          leading-5
          text-white/40
        "
      >
        İlgilendiğiniz ürünleri teklif sepetinize ekleyerek hızlıca teklif
        isteyebilirsiniz.
      </p>

      <Link
        to="/urunler"
        onClick={onClose}
        className="
          mt-5
          inline-flex
          h-10
          items-center
          justify-center
          rounded-xl
          bg-gradient-to-r
          from-blue-600
          to-purple-600
          px-5
          text-[10px]
          font-extrabold
          text-white
        "
      >
        Ürünleri İncele
      </Link>
    </div>
  );
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

function satisBirimiMetreMi(satisBirimiAdi) {
  const birim = String(satisBirimiAdi ?? "")
    .trim()
    .toLocaleLowerCase("tr-TR");

  return birim === "metre" || birim === "meter";
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

function WhatsAppIcon() {
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
        d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4A8 8 0 1 1 20 11.5Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path d="M9 8.5c.5 2.5 2 4 4.5 5" strokeLinecap="round" />
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
      className="h-6 w-6"
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

function ProductIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="7" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

export default TeklifSepetiPopup;
