import { useMemo } from "react";

import DataTable from "../../ui/DataTable";
import Select from "../../ui/Select";

import { kullaniciDurumSecenekleri } from "./useKullaniciYonetimi";

function KullaniciListesi({
  kullanicilar = [],

  aramaMetni = "",
  durumFiltresi = "tum",

  aktifKullaniciSayisi = 0,
  pasifKullaniciSayisi = 0,

  aktifFiltreVarMi = false,

  yukleniyorMu = false,

  durumDegistirilenKullaniciId = null,

  onAramaMetniDegistir,
  onDurumFiltresiDegistir,
  onFiltreleriTemizle,

  onDurumDegistir,

  onDuzenle,
  onSifreSifirla,
  onSil,
}) {
  const columns = useMemo(
    () => [
      {
        key: "kullanici",
        header: "Kullanıcı",
        width: "330px",

        render: (kullanici) => <KullaniciBilgisi kullanici={kullanici} />,
      },

      {
        key: "kullaniciAdi",
        header: "Kullanıcı Adı",
        width: "190px",

        render: (kullanici) => (
          <span
            className="
              font-mono
              text-sm
              font-bold
              text-text-secondary
            "
          >
            {kullanici.kullaniciAdi || "-"}
          </span>
        ),
      },

      {
        key: "olusturmaTarihi",
        header: "Oluşturulma",
        width: "170px",

        render: (kullanici) => (
          <TarihBilgisi tarih={kullanici.olusturmaTarihi} />
        ),
      },

      {
        key: "guncellemeTarihi",
        header: "Son Güncelleme",
        width: "170px",

        render: (kullanici) => (
          <TarihBilgisi tarih={kullanici.guncellemeTarihi} />
        ),
      },

      {
        key: "aktifMi",
        header: "Durum",
        width: "130px",

        render: (kullanici) => (
          <DurumButonu
            aktifMi={Boolean(kullanici.aktifMi)}
            loading={durumDegistirilenKullaniciId === kullanici.id}
            onClick={() => onDurumDegistir?.(kullanici)}
          />
        ),
      },

      {
        key: "islemler",
        header: "İşlemler",
        width: "180px",
        headerClassName: "text-right",
        cellClassName: "text-right",

        render: (kullanici) => (
          <IslemButonlari
            onEdit={() => onDuzenle?.(kullanici)}
            onPassword={() => onSifreSifirla?.(kullanici)}
            onDelete={() => onSil?.(kullanici)}
          />
        ),
      },
    ],
    [
      durumDegistirilenKullaniciId,
      onDurumDegistir,
      onDuzenle,
      onSifreSifirla,
      onSil,
    ],
  );

  const toolbarRight = (
    <>
      <div className="w-full sm:w-[160px]">
        <Select
          value={durumFiltresi}
          options={kullaniciDurumSecenekleri}
          onValueChange={onDurumFiltresiDegistir}
        />
      </div>

      {aktifFiltreVarMi && (
        <button
          type="button"
          onClick={onFiltreleriTemizle}
          className="
            inline-flex
            h-11
            items-center
            justify-center
            gap-2
            rounded-ui
            border
            border-border
            bg-white
            px-3.5
            text-xs
            font-extrabold
            text-text-secondary
            transition

            hover:border-red-200
            hover:bg-red-50
            hover:text-red-600
          "
        >
          <FilterCloseIcon />
          Temizle
        </button>
      )}
    </>
  );

  return (
    <div className="space-y-4">
      <KullaniciOzetleri
        toplam={aktifKullaniciSayisi + pasifKullaniciSayisi}
        aktif={aktifKullaniciSayisi}
        pasif={pasifKullaniciSayisi}
      />

      <DataTable
        data={kullanicilar}
        columns={columns}
        searchValue={aramaMetni}
        onSearchChange={onAramaMetniDegistir}
        searchPlaceholder="Ad soyad veya kullanıcı adı ara..."
        toolbarRight={toolbarRight}
        pageSizeOptions={[10, 20, 50]}
        loading={yukleniyorMu}
        tableMinWidth="1180px"
        rowClassName={(kullanici) =>
          kullanici.aktifMi ? "" : "bg-slate-50/60"
        }
        emptyTitle="Henüz kullanıcı bulunmuyor"
        emptyDescription="Yönetim panelinde henüz herhangi bir kullanıcı bulunmuyor."
        noResultTitle="Kullanıcı bulunamadı"
        noResultDescription="Arama veya filtre kriterlerinize uygun bir kullanıcı bulunamadı."
      />
    </div>
  );
}

function KullaniciOzetleri({ toplam, aktif, pasif }) {
  return (
    <div
      className="
        grid
        gap-3

        sm:grid-cols-3
      "
    >
      <OzetKarti baslik="Toplam Kullanıcı" deger={toplam} />

      <OzetKarti baslik="Aktif Kullanıcı" deger={aktif} tip="aktif" />

      <OzetKarti baslik="Pasif Kullanıcı" deger={pasif} tip="pasif" />
    </div>
  );
}

function OzetKarti({ baslik, deger, tip }) {
  let iconClassName = "bg-brand-blue/10 text-brand-blue";

  if (tip === "aktif") {
    iconClassName = "bg-emerald-50 text-emerald-600";
  }

  if (tip === "pasif") {
    iconClassName = "bg-slate-100 text-slate-500";
  }

  return (
    <div
      className="
        flex
        items-center
        gap-4
        rounded-ui-lg
        border
        border-border
        bg-white
        p-4
        shadow-sm
      "
    >
      <div
        className={`
          flex
          h-11
          w-11
          shrink-0
          items-center
          justify-center
          rounded-xl
          ${iconClassName}
        `}
      >
        <UserIcon />
      </div>

      <div>
        <p
          className="
            text-xs
            font-bold
            text-text-muted
          "
        >
          {baslik}
        </p>

        <p
          className="
            mt-1
            text-2xl
            font-extrabold
            text-text-primary
          "
        >
          {deger}
        </p>
      </div>
    </div>
  );
}

function KullaniciBilgisi({ kullanici }) {
  const adSoyad =
    kullanici.adSoyad?.trim() || kullanici.kullaniciAdi || "Kullanıcı";

  return (
    <div
      className="
        flex
        min-w-0
        items-center
        gap-3
      "
    >
      <div
        className="
          flex
          h-11
          w-11
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-gradient-to-br
          from-brand-blue/10
          to-brand-purple/10
          text-sm
          font-extrabold
          text-brand-blue
        "
      >
        {kullaniciBasHarfleriGetir(adSoyad)}
      </div>

      <div className="min-w-0">
        <p
          className="
            truncate
            text-sm
            font-extrabold
            text-text-primary
          "
          title={adSoyad}
        >
          {adSoyad}
        </p>

        <p
          className="
            mt-1
            truncate
            text-xs
            font-semibold
            text-text-muted
          "
        >
          Yönetim paneli kullanıcısı
        </p>
      </div>
    </div>
  );
}

function TarihBilgisi({ tarih }) {
  if (!tarih) {
    return <BosDeger />;
  }

  const date = new Date(tarih);

  if (Number.isNaN(date.getTime())) {
    return <BosDeger />;
  }

  return (
    <div>
      <p
        className="
          text-sm
          font-bold
          text-text-secondary
        "
      >
        {date.toLocaleDateString("tr-TR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}
      </p>

      <p
        className="
          mt-1
          text-[11px]
          font-semibold
          text-text-muted
        "
      >
        {date.toLocaleTimeString("tr-TR", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </div>
  );
}

function BosDeger() {
  return (
    <span
      className="
        text-sm
        font-semibold
        text-text-muted
      "
    >
      -
    </span>
  );
}

function DurumButonu({ aktifMi, loading, onClick }) {
  return (
    <button
      type="button"
      disabled={loading}
      onClick={onClick}
      title={aktifMi ? "Pasif hale getir" : "Aktif hale getir"}
      className={`
        inline-flex
        min-w-[86px]
        items-center
        justify-center
        gap-2
        rounded-full
        border
        px-3
        py-1.5
        text-xs
        font-extrabold
        transition

        disabled:cursor-wait
        disabled:opacity-60

        ${
          aktifMi
            ? `
              border-emerald-200
              bg-emerald-50
              text-emerald-700

              hover:bg-emerald-100
            `
            : `
              border-slate-200
              bg-slate-100
              text-slate-600

              hover:bg-slate-200
            `
        }
      `}
    >
      {loading ? (
        <LoadingIcon />
      ) : (
        <span
          className={`
            h-2
            w-2
            rounded-full

            ${aktifMi ? "bg-emerald-500" : "bg-slate-400"}
          `}
        />
      )}

      {aktifMi ? "Aktif" : "Pasif"}
    </button>
  );
}

function IslemButonlari({ onEdit, onPassword, onDelete }) {
  return (
    <div
      className="
        flex
        items-center
        justify-end
        gap-1.5
      "
    >
      <button
        type="button"
        onClick={onEdit}
        title="Kullanıcıyı düzenle"
        aria-label="Kullanıcıyı düzenle"
        className="
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-lg
          border
          border-border
          bg-white
          text-text-muted
          transition

          hover:border-brand-blue/30
          hover:bg-brand-blue/[0.05]
          hover:text-brand-blue
        "
      >
        <EditIcon />
      </button>

      <button
        type="button"
        onClick={onPassword}
        title="Şifreyi sıfırla"
        aria-label="Şifreyi sıfırla"
        className="
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-lg
          border
          border-border
          bg-white
          text-text-muted
          transition

          hover:border-amber-200
          hover:bg-amber-50
          hover:text-amber-600
        "
      >
        <KeyIcon />
      </button>

      <button
        type="button"
        onClick={onDelete}
        title="Kullanıcıyı sil"
        aria-label="Kullanıcıyı sil"
        className="
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-lg
          border
          border-border
          bg-white
          text-text-muted
          transition

          hover:border-red-200
          hover:bg-red-50
          hover:text-red-600
        "
      >
        <TrashIcon />
      </button>
    </div>
  );
}

function kullaniciBasHarfleriGetir(metin) {
  const parcalar = String(metin ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parcalar.length === 0) {
    return "?";
  }

  if (parcalar.length === 1) {
    return parcalar[0].slice(0, 2).toLocaleUpperCase("tr-TR");
  }

  return (parcalar[0][0] + parcalar[parcalar.length - 1][0]).toLocaleUpperCase(
    "tr-TR",
  );
}

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 20a7.5 7.5 0 0 1 15 0"
      />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M13.5 6.5 17.5 10.5M5 19l1-4 9.5-9.5a1.5 1.5 0 0 1 2.12 0l.88.88a1.5 1.5 0 0 1 0 2.12L9 18l-4 1Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function KeyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <circle cx="8" cy="15" r="4" />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m11 12 8-8m-3 3 2 2m-5 1 2 2"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M9 3h6m-9 4h12m-1 0-.65 12.03A2 2 0 0 1 14.35 21h-4.7a2 2 0 0 1-2-1.97L7 7m3 4v6m4-6v6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LoadingIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="
        h-3.5
        w-3.5
        animate-spin
      "
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="3"
        className="opacity-25"
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

function FilterCloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M4 5h16M7 12h10M10 19h4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <path
        d="m17 16 4 4m0-4-4 4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default KullaniciListesi;
