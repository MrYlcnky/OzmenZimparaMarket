import { useNavigate } from "react-router";

import HizliIslemler from "../../components/yonetim/anasayfa/HizliIslemler";
import KatalogDurumu from "../../components/yonetim/anasayfa/KatalogDurumu";
import SonEklenenUrunler from "../../components/yonetim/anasayfa/SonEklenenUrunler";
import useYonetimPaneli from "../../components/yonetim/anasayfa/useYonetimPaneli";
import YonetimAnaSayfaBasligi from "../../components/yonetim/anasayfa/YonetimAnaSayfaBasligi";
import YonetimOzetKartlari from "../../components/yonetim/anasayfa/YonetimOzetKartlari";

function YonetimAnaSayfa() {
  const navigate = useNavigate();

  const {
    ozet,
    kullaniciAdi,

    yukleniyorMu,
    yenileniyorMu,

    hataMesaji,

    yenile,
  } = useYonetimPaneli();

  return (
    <div className="min-h-full bg-surface-soft">
      <YonetimAnaSayfaBasligi
        kullaniciAdi={kullaniciAdi}
        yenileniyorMu={yenileniyorMu}
        onYenile={yenile}
      />

      <div
        className="
          space-y-6
          px-6
          py-6

          lg:px-8
        "
      >
        {hataMesaji && !yukleniyorMu && (
          <DashboardHata mesaj={hataMesaji} onRetry={yenile} />
        )}

        <YonetimOzetKartlari ozet={ozet} loading={yukleniyorMu} />

        <div
          className="
            grid
            gap-6

            xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]
          "
        >
          <KatalogDurumu
            kategoriler={ozet.kategoriler}
            urunler={ozet.urunler}
            loading={yukleniyorMu}
          />

          <SonEklenenUrunler
            urunler={ozet.sonEklenenUrunler}
            loading={yukleniyorMu}
            onUrunleriYonet={() => navigate("/ozmen-zimpara-yonetim/urunler")}
          />
        </div>

        <HizliIslemler
          onFirma={() => navigate("/ozmen-zimpara-yonetim/firma")}
          onKategoriler={() => navigate("/ozmen-zimpara-yonetim/kategoriler")}
          onUrunler={() => navigate("/ozmen-zimpara-yonetim/urunler")}
          onTeknikOzellikler={() =>
            navigate("/ozmen-zimpara-yonetim/urun-ozellikleri")
          }
          onKullanicilar={() => navigate("/ozmen-zimpara-yonetim/kullanicilar")}
        />
      </div>
    </div>
  );
}

function DashboardHata({ mesaj, onRetry }) {
  return (
    <div
      className="
        flex
        flex-col
        gap-4
        rounded-ui-lg
        border
        border-red-200
        bg-red-50
        px-5
        py-4

        sm:flex-row
        sm:items-center
        sm:justify-between
      "
    >
      <div>
        <p
          className="
            text-sm
            font-extrabold
            text-red-700
          "
        >
          Dashboard verileri alınamadı
        </p>

        <p
          className="
            mt-1
            text-xs
            leading-5
            text-red-600
          "
        >
          {mesaj}
        </p>
      </div>

      <button
        type="button"
        onClick={onRetry}
        className="
          h-9
          shrink-0
          rounded-ui
          border
          border-red-200
          bg-white
          px-4
          text-xs
          font-extrabold
          text-red-600
          transition

          hover:bg-red-100
        "
      >
        Tekrar Dene
      </button>
    </div>
  );
}

export default YonetimAnaSayfa;
