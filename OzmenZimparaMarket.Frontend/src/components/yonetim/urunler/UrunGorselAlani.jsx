import { useEffect, useRef, useState } from "react";

import { toast } from "react-toastify";

import {
  mevcutGorseliUrunGorselineDonustur,
  urunGorselleriniGetir,
  urunGorseliYukle,
} from "../../../api/servisler/urunGorselServisi";

function UrunGorselAlani({ gorselYolu, hata, onChange, disabled = false }) {
  const dosyaInputRef = useRef(null);

  const [yukleniyorMu, setYukleniyorMu] = useState(false);

  const [galeriAcikMi, setGaleriAcikMi] = useState(false);

  const [galeriYukleniyorMu, setGaleriYukleniyorMu] = useState(false);

  const [gorselSeciliyorMu, setGorselSeciliyorMu] = useState(false);

  const [mevcutGorseller, setMevcutGorseller] = useState([]);

  const [galeriFiltresi, setGaleriFiltresi] = useState("tum");

  const gorselUrl = gorselUrlOlustur(gorselYolu);

  const filtrelenmisGorseller = mevcutGorseller.filter((gorsel) => {
    if (galeriFiltresi === "urun") {
      return urunGorseliMi(gorsel.dosyaYolu);
    }

    if (galeriFiltresi === "kategori") {
      return kategoriGorseliMi(gorsel.dosyaYolu);
    }

    return true;
  });

  const urunGorseliSayisi = mevcutGorseller.filter((gorsel) =>
    urunGorseliMi(gorsel.dosyaYolu),
  ).length;

  const kategoriGorseliSayisi = mevcutGorseller.filter((gorsel) =>
    kategoriGorseliMi(gorsel.dosyaYolu),
  ).length;

  useEffect(() => {
    if (!galeriAcikMi) {
      return;
    }

    let iptalEdildiMi = false;

    Promise.resolve().then(async () => {
      if (iptalEdildiMi) {
        return;
      }

      setGaleriYukleniyorMu(true);

      try {
        const gorseller = await urunGorselleriniGetir();

        if (!iptalEdildiMi) {
          setMevcutGorseller(Array.isArray(gorseller) ? gorseller : []);
        }
      } catch (error) {
        if (!iptalEdildiMi) {
          setMevcutGorseller([]);

          toast.error(
            apiHataMesajiGetir(error, "Mevcut görseller yüklenemedi."),
          );
        }
      } finally {
        if (!iptalEdildiMi) {
          setGaleriYukleniyorMu(false);
        }
      }
    });

    return () => {
      iptalEdildiMi = true;
    };
  }, [galeriAcikMi]);

  async function dosyaSecildi(event) {
    const dosya = event.target.files?.[0];

    event.target.value = "";

    if (!dosya) {
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(dosya.type)) {
      toast.error("Yalnızca JPG, PNG veya WEBP görseller yüklenebilir.");

      return;
    }

    const maksimumBoyut = 5 * 1024 * 1024;

    if (dosya.size > maksimumBoyut) {
      toast.error("Görsel boyutu en fazla 5 MB olabilir.");

      return;
    }

    setYukleniyorMu(true);

    try {
      const sonuc = await urunGorseliYukle(dosya);

      if (!sonuc?.dosyaYolu) {
        throw new Error("Dosya yolu alınamadı.");
      }

      onChange(sonuc.dosyaYolu);

      toast.success("Ürün görseli başarıyla yüklendi.");
    } catch (error) {
      toast.error(
        apiHataMesajiGetir(error, "Ürün görseli yüklenirken bir hata oluştu."),
      );
    } finally {
      setYukleniyorMu(false);
    }
  }

  async function mevcutGorseliSec(gorsel) {
    if (!gorsel?.dosyaYolu || gorselSeciliyorMu) {
      return;
    }

    setGorselSeciliyorMu(true);

    try {
      const kategoriMi = kategoriGorseliMi(gorsel.dosyaYolu);

      const sonuc = await mevcutGorseliUrunGorselineDonustur(gorsel.dosyaYolu);

      if (!sonuc?.dosyaYolu) {
        throw new Error("Ürün görsel yolu alınamadı.");
      }

      onChange(sonuc.dosyaYolu);

      setGaleriAcikMi(false);

      if (kategoriMi) {
        toast.success(
          "Kategori görseli ürün görsellerine kopyalandı ve seçildi.",
        );
      }
    } catch (error) {
      toast.error(
        apiHataMesajiGetir(error, "Görsel seçilirken bir hata oluştu."),
      );
    } finally {
      setGorselSeciliyorMu(false);
    }
  }

  function gorseliKaldir() {
    onChange("");
  }

  function galeriyiAcKapat() {
    setGaleriAcikMi((mevcut) => !mevcut);
  }

  const islemlerDevreDisi = disabled || yukleniyorMu || gorselSeciliyorMu;

  return (
    <div className="space-y-5">
      <div
        className="
          grid
          gap-5
          md:grid-cols-[190px_1fr]
          md:items-start
        "
      >
        <div
          className="
            relative
            flex
            aspect-square
            w-full
            max-w-[190px]
            items-center
            justify-center
            overflow-hidden
            rounded-2xl
            border border-border
            bg-surface-soft
          "
        >
          {gorselUrl ? (
            <img
              src={gorselUrl}
              alt="Ürün görseli önizlemesi"
              className="
                h-full
                w-full
                object-contain
              "
            />
          ) : (
            <BosGorsel />
          )}

          {yukleniyorMu && <YuklemeKatmani metin="Yükleniyor..." />}

          {gorselSeciliyorMu && (
            <YuklemeKatmani metin="Görsel hazırlanıyor..." />
          )}
        </div>

        <div>
          <h4
            className="
              text-sm
              font-extrabold
              text-text-primary
            "
          >
            Ana Ürün Görseli
          </h4>

          <p
            className="
              mt-1
              max-w-xl
              text-xs
              leading-5
              text-text-muted
            "
          >
            Bilgisayarınızdan yeni bir görsel yükleyebilir veya daha önce
            yüklenmiş ürün ve kategori görsellerinden birini seçebilirsiniz.
          </p>

          <div
            className="
              mt-4
              flex
              flex-wrap
              gap-2
            "
          >
            <button
              type="button"
              disabled={islemlerDevreDisi}
              onClick={() => dosyaInputRef.current?.click()}
              className="
                inline-flex
                h-10
                items-center
                justify-center
                gap-2
                rounded-ui
                bg-gradient-to-r
                from-brand-blue
                to-brand-purple
                px-4
                text-xs
                font-extrabold
                text-white
                transition

                hover:-translate-y-0.5

                disabled:cursor-not-allowed
                disabled:opacity-50
                disabled:hover:translate-y-0
              "
            >
              <UploadIcon />
              Bilgisayardan Yükle
            </button>

            <button
              type="button"
              disabled={islemlerDevreDisi}
              onClick={galeriyiAcKapat}
              className="
                inline-flex
                h-10
                items-center
                justify-center
                gap-2
                rounded-ui
                border border-border
                bg-white
                px-4
                text-xs
                font-extrabold
                text-text-secondary
                transition

                hover:border-brand-blue/30
                hover:bg-brand-blue/[0.04]
                hover:text-brand-blue

                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <GalleryIcon />
              Mevcutlardan Seç
            </button>

            {gorselYolu && (
              <button
                type="button"
                disabled={islemlerDevreDisi}
                onClick={gorseliKaldir}
                className="
                  inline-flex
                  h-10
                  items-center
                  justify-center
                  rounded-ui
                  border border-red-100
                  bg-white
                  px-4
                  text-xs
                  font-extrabold
                  text-red-600
                  transition

                  hover:bg-red-50

                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                Görseli Kaldır
              </button>
            )}
          </div>

          <input
            ref={dosyaInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            onChange={dosyaSecildi}
            className="hidden"
          />

          <p
            className="
              mt-3
              text-[11px]
              font-semibold
              text-text-muted
            "
          >
            JPG, JPEG, PNG veya WEBP • Maksimum 5 MB
          </p>

          {hata && (
            <p
              className="
                mt-2
                text-xs
                font-semibold
                text-red-600
              "
            >
              {hata}
            </p>
          )}
        </div>
      </div>

      {galeriAcikMi && (
        <div
          className="
            rounded-2xl
            border border-border
            bg-surface-soft/40
            p-4
          "
        >
          <div
            className="
              flex
              flex-col
              gap-4
              sm:flex-row
              sm:items-start
              sm:justify-between
            "
          >
            <div>
              <h4
                className="
                  text-sm
                  font-extrabold
                  text-text-primary
                "
              >
                Mevcut Görseller
              </h4>

              <p
                className="
                  mt-1
                  text-xs
                  leading-5
                  text-text-muted
                "
              >
                Kullanmak istediğiniz görselin üzerine tıklayın.
              </p>
            </div>

            <button
              type="button"
              disabled={gorselSeciliyorMu}
              onClick={() => setGaleriAcikMi(false)}
              className="
                text-xs
                font-extrabold
                text-text-muted
                transition

                hover:text-text-primary

                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              Kapat
            </button>
          </div>

          {!galeriYukleniyorMu && (
            <div
              className="
                mt-4
                flex
                flex-wrap
                items-center
                gap-2
              "
            >
              <GaleriFiltreButonu
                aktif={galeriFiltresi === "tum"}
                onClick={() => setGaleriFiltresi("tum")}
              >
                Tümü
                <FiltreSayisi>{mevcutGorseller.length}</FiltreSayisi>
              </GaleriFiltreButonu>

              <GaleriFiltreButonu
                aktif={galeriFiltresi === "urun"}
                onClick={() => setGaleriFiltresi("urun")}
              >
                Ürün Fotoğrafları
                <FiltreSayisi>{urunGorseliSayisi}</FiltreSayisi>
              </GaleriFiltreButonu>

              <GaleriFiltreButonu
                aktif={galeriFiltresi === "kategori"}
                onClick={() => setGaleriFiltresi("kategori")}
              >
                Kategori Fotoğrafları
                <FiltreSayisi>{kategoriGorseliSayisi}</FiltreSayisi>
              </GaleriFiltreButonu>
            </div>
          )}

          <div className="mt-4">
            {galeriYukleniyorMu ? (
              <div
                className="
                  flex
                  min-h-[180px]
                  flex-col
                  items-center
                  justify-center
                "
              >
                <YukleniyorIcon />

                <p
                  className="
                    mt-3
                    text-xs
                    font-bold
                    text-text-muted
                  "
                >
                  Görseller yükleniyor...
                </p>
              </div>
            ) : filtrelenmisGorseller.length === 0 ? (
              <div
                className="
                  rounded-xl
                  border border-dashed
                  border-border
                  bg-white
                  px-5
                  py-10
                  text-center
                "
              >
                <GalleryIcon
                  className="
                    mx-auto
                    h-7 w-7
                    text-text-muted
                  "
                />

                <p
                  className="
                    mt-3
                    text-sm
                    font-bold
                    text-text-secondary
                  "
                >
                  Bu filtrede görsel bulunamadı.
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    text-text-muted
                  "
                >
                  Farklı bir görsel filtresi seçebilirsiniz.
                </p>
              </div>
            ) : (
              <div
                className="
                  max-h-[390px]
                  overflow-y-auto
                  pr-2
                "
              >
                <div
                  className="
                    grid
                    grid-cols-2
                    gap-3
                    sm:grid-cols-3
                    md:grid-cols-4
                    lg:grid-cols-5
                  "
                >
                  {filtrelenmisGorseller.map((gorsel) => {
                    const kategoriMi = kategoriGorseliMi(gorsel.dosyaYolu);

                    const seciliMi = gorsel.dosyaYolu === gorselYolu;

                    return (
                      <button
                        key={gorsel.dosyaYolu}
                        type="button"
                        disabled={gorselSeciliyorMu}
                        onClick={() => mevcutGorseliSec(gorsel)}
                        title={
                          kategoriMi
                            ? "Kategori görselini ürün görseli olarak kullan"
                            : "Ürün görselini seç"
                        }
                        className={`
                            group
                            relative
                            overflow-hidden
                            rounded-xl
                            border
                            bg-white
                            p-2
                            text-left
                            transition

                            disabled:cursor-wait
                            disabled:opacity-60

                            ${
                              seciliMi
                                ? `
                                  border-brand-blue
                                  ring-2
                                  ring-brand-blue/15
                                `
                                : `
                                  border-border
                                  hover:border-brand-blue/40
                                  hover:shadow-sm
                                `
                            }
                          `}
                      >
                        <div
                          className="
                              flex
                              aspect-square
                              items-center
                              justify-center
                              overflow-hidden
                              rounded-lg
                              bg-surface-soft
                            "
                        >
                          <img
                            src={gorselUrlOlustur(gorsel.dosyaYolu)}
                            alt={
                              kategoriMi ? "Kategori görseli" : "Ürün görseli"
                            }
                            loading="lazy"
                            className="
                                h-full
                                w-full
                                object-contain
                                transition-transform
                                duration-200

                                group-hover:scale-[1.03]
                              "
                          />
                        </div>

                        <span
                          className={`
                              absolute
                              left-3
                              top-3
                              inline-flex
                              items-center
                              rounded-md
                              px-2
                              py-1
                              text-[9px]
                              font-extrabold
                              shadow-sm

                              ${
                                kategoriMi
                                  ? `
                                    bg-purple-100
                                    text-purple-700
                                  `
                                  : `
                                    bg-blue-100
                                    text-blue-700
                                  `
                              }
                            `}
                        >
                          {kategoriMi ? "Kategori" : "Ürün"}
                        </span>

                        {seciliMi && (
                          <span
                            className="
                                absolute
                                bottom-3
                                right-3
                                flex
                                h-7
                                w-7
                                items-center
                                justify-center
                                rounded-full
                                bg-brand-blue
                                text-xs
                                font-extrabold
                                text-white
                                shadow
                              "
                          >
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function GaleriFiltreButonu({ aktif, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        inline-flex
        h-9
        items-center
        justify-center
        gap-2
        rounded-lg
        border
        px-3.5
        text-xs
        font-extrabold
        transition

        ${
          aktif
            ? `
              border-brand-blue
              bg-brand-blue
              text-white
              shadow-sm
            `
            : `
              border-border
              bg-white
              text-text-secondary

              hover:border-brand-blue/30
              hover:bg-brand-blue/[0.03]
              hover:text-brand-blue
            `
        }
      `}
    >
      {children}
    </button>
  );
}

function FiltreSayisi({ children }) {
  return (
    <span
      className="
        inline-flex
        min-w-5
        items-center
        justify-center
        rounded-full
        bg-black/10
        px-1.5
        py-0.5
        text-[9px]
        font-extrabold
      "
    >
      {children}
    </span>
  );
}

function YuklemeKatmani({ metin }) {
  return (
    <div
      className="
        absolute
        inset-0
        flex
        flex-col
        items-center
        justify-center
        bg-white/90
        backdrop-blur-[1px]
      "
    >
      <YukleniyorIcon />

      <span
        className="
          mt-2
          text-xs
          font-bold
          text-text-secondary
        "
      >
        {metin}
      </span>
    </div>
  );
}

function kategoriGorseliMi(dosyaYolu) {
  return Boolean(dosyaYolu?.includes("/uploads/kategoriler/"));
}

function urunGorseliMi(dosyaYolu) {
  return Boolean(dosyaYolu?.includes("/uploads/urunler/"));
}

function gorselUrlOlustur(gorselYolu) {
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

  const sunucuBaseUrl = apiBaseUrl.replace(/\/api\/?$/i, "");

  if (!sunucuBaseUrl) {
    return temizYol;
  }

  return `${sunucuBaseUrl}${temizYol.startsWith("/") ? "" : "/"}${temizYol}`;
}

function apiHataMesajiGetir(error, varsayilanMesaj) {
  const veri = error?.response?.data;

  if (typeof veri?.mesaj === "string" && veri.mesaj.trim()) {
    return veri.mesaj;
  }

  if (typeof veri?.message === "string" && veri.message.trim()) {
    return veri.message;
  }

  if (typeof veri === "string" && veri.trim()) {
    return veri;
  }

  return varsayilanMesaj;
}

function BosGorsel() {
  return (
    <div className="text-center">
      <GalleryIcon
        className="
          mx-auto
          h-8 w-8
          text-text-muted
        "
      />

      <p
        className="
          mt-2
          text-[11px]
          font-bold
          text-text-muted
        "
      >
        Görsel seçilmedi
      </p>
    </div>
  );
}

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M5 15.5V19h14v-3.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GalleryIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="3"
        y="4"
        width="18"
        height="16"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <circle cx="8.5" cy="9" r="1.5" stroke="currentColor" strokeWidth="1.7" />

      <path
        d="m5 18 5-5 3 3 2-2 4 4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function YukleniyorIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="
        h-6
        w-6
        animate-spin
        text-brand-blue
      "
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="3"
        className="opacity-20"
      />

      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default UrunGorselAlani;
