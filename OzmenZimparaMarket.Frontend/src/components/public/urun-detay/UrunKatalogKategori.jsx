import { useState } from "react";

import UrunKatalogUrunleri from "./UrunKatalogUrunleri";

function UrunKatalogKategori({
  kategori,
  seviye,
  aktifKategoriId,
  aktifUrunId,
  aktifYolIdleri,
  onKategoriSec,
  onUrunSec,
}) {
  const [manuelAcikMi, setManuelAcikMi] = useState(null);

  const aktifMi = Number(kategori.id) === Number(aktifKategoriId);

  const aktifYoldaMi = aktifYolIdleri.has(Number(kategori.id));

  const altKategoriler = Array.isArray(kategori.altKategoriler)
    ? kategori.altKategoriler
    : [];

  /*
   * Kullanıcı henüz manuel olarak müdahale etmediyse
   * aktif kategori yolu otomatik açık kalır.
   *
   * Kullanıcı oku kullanarak kapattığında ise
   * aktif kategori olsa bile kapanabilir.
   */
  const acikMi = manuelAcikMi ?? aktifYoldaMi;

  function kategoriSec() {
    /*
     * Artık yalnızca ID değil,
     * kategori nesnesinin tamamını gönderiyoruz.
     *
     * Böylece sağ tarafta bu kategorinin
     * alt kategorileri olup olmadığını anlayabiliriz.
     */
    onKategoriSec(kategori);

    /*
     * Kategori adı tıklanmış ve kategori kapalıysa
     * aynı zamanda ağacı açıyoruz.
     */
    if (!acikMi) {
      setManuelAcikMi(true);
    }
  }

  function acKapat() {
    /*
     * Gerçekte ekranda görünen durumun tersini al.
     *
     * Bu sayede aktif/seçili kategori de
     * kullanıcı tarafından serbestçe kapatılabilir.
     */
    setManuelAcikMi(!acikMi);
  }

  return (
    <div>
      <div
        className="
          flex
          items-center
          gap-1
        "
      >
        <button
          type="button"
          onClick={kategoriSec}
          className={`
            flex
            min-h-[42px]
            min-w-0
            flex-1
            items-center
            gap-2.5
            rounded-xl
            py-2
            pr-2
            text-left
            text-[12px]
            transition-all

            ${
              aktifMi
                ? "bg-purple-50 font-extrabold text-purple-700"
                : aktifYoldaMi
                  ? "bg-zinc-50 font-extrabold text-zinc-900"
                  : "font-semibold text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950"
            }
          `}
          style={{
            paddingLeft: 10 + seviye * 15,
          }}
        >
          <span
            className={`
              h-1.5
              w-1.5
              shrink-0
              rounded-full

              ${
                aktifMi
                  ? "bg-purple-600"
                  : aktifYoldaMi
                    ? "bg-purple-300"
                    : "bg-zinc-300"
              }
            `}
          />

          <span
            className="
              min-w-0
              flex-1
              leading-5
            "
          >
            {kategori.kategoriAdi}
          </span>
        </button>

        <button
          type="button"
          onClick={acKapat}
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-lg
            text-zinc-400
            transition-all

            hover:bg-zinc-100
            hover:text-purple-700
          "
          aria-label={
            acikMi
              ? `${kategori.kategoriAdi} kataloğunu kapat`
              : `${kategori.kategoriAdi} kataloğunu aç`
          }
        >
          <span
            className={`
              transition-transform
              duration-200

              ${acikMi ? "rotate-90" : ""}
            `}
          >
            <ChevronIcon />
          </span>
        </button>
      </div>

      {acikMi && (
        <div>
          {/* Bu kategoriye doğrudan bağlı ürünler */}
          <UrunKatalogUrunleri
            kategoriId={kategori.id}
            altKategorilerDahilMi={false}
            gorunum="sidebar"
            aktifUrunId={aktifUrunId}
            onUrunSec={onUrunSec}
          />

          {/* Alt kategoriler */}
          {altKategoriler.length > 0 && (
            <div className="mt-1">
              {altKategoriler.map((altKategori) => (
                <UrunKatalogKategori
                  key={altKategori.id}
                  kategori={altKategori}
                  seviye={seviye + 1}
                  aktifKategoriId={aktifKategoriId}
                  aktifUrunId={aktifUrunId}
                  aktifYolIdleri={aktifYolIdleri}
                  onKategoriSec={onKategoriSec}
                  onUrunSec={onUrunSec}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ChevronIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-3.5 w-3.5"
      aria-hidden="true"
    >
      <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default UrunKatalogKategori;
