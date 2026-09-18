import { useRef, useState } from "react";

import Modal from "../../ui/Modal";

function ExcelImportModal({
  open,
  onClose,

  baslik = "Excel'den İçe Aktar",
  eyebrow = "Excel İşlemleri",

  dosya,
  onDosyaDegistir,

  analizSonucu,
  analizEdiliyorMu = false,

  onAnalizEt,

  onIceAktar,

  aktariliyorMu = false,
}) {
  const inputRef = useRef(null);

  const [surukleniyorMu, setSurukleniyorMu] = useState(false);

  const islemDevamEdiyor = analizEdiliyorMu || aktariliyorMu;

  function dosyaSecildi(event) {
    const secilenDosya = event.target.files?.[0];

    event.target.value = "";

    if (!secilenDosya) {
      return;
    }

    onDosyaDegistir?.(secilenDosya);
  }

  function dosyaBirakildi(event) {
    event.preventDefault();

    setSurukleniyorMu(false);

    if (islemDevamEdiyor) {
      return;
    }

    const secilenDosya = event.dataTransfer.files?.[0];

    if (!secilenDosya) {
      return;
    }

    onDosyaDegistir?.(secilenDosya);
  }

  function dosyaSeciciyiAc() {
    if (islemDevamEdiyor) {
      return;
    }

    inputRef.current?.click();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      eyebrow={eyebrow}
      title={baslik}
      maxWidth="1100px"
      closeDisabled={islemDevamEdiyor}
      footer={
        <ModalFooter
          dosya={dosya}
          analizSonucu={analizSonucu}
          analizEdiliyorMu={analizEdiliyorMu}
          aktariliyorMu={aktariliyorMu}
          onClose={onClose}
          onAnalizEt={onAnalizEt}
          onIceAktar={onIceAktar}
        />
      }
    >
      <div
        className="
          space-y-6
          p-5
          sm:p-6
        "
      >
        <div>
          <h3
            className="
              text-sm
              font-extrabold
              text-text-primary
            "
          >
            Excel Dosyası
          </h3>

          <p
            className="
              mt-1
              text-xs
              leading-5
              text-text-muted
            "
          >
            Doldurduğunuz .xlsx dosyasını yükleyin. Veriler aktarılmadan önce
            kontrol edilecek ve size önizleme gösterilecektir.
          </p>
        </div>

        <button
          type="button"
          onClick={dosyaSeciciyiAc}
          onDragEnter={(event) => {
            event.preventDefault();

            if (!islemDevamEdiyor) {
              setSurukleniyorMu(true);
            }
          }}
          onDragOver={(event) => {
            event.preventDefault();
          }}
          onDragLeave={() => setSurukleniyorMu(false)}
          onDrop={dosyaBirakildi}
          disabled={islemDevamEdiyor}
          className={`
            flex
            min-h-[190px]
            w-full
            flex-col
            items-center
            justify-center
            rounded-ui-lg
            border-2
            border-dashed
            px-6
            py-8
            text-center
            transition-all

            ${
              surukleniyorMu
                ? `
                  border-brand-blue
                  bg-brand-blue/[0.05]
                `
                : `
                  border-border
                  bg-surface-soft/60
                  hover:border-brand-blue/40
                  hover:bg-brand-blue/[0.025]
                `
            }

            disabled:cursor-not-allowed
            disabled:opacity-60
          `}
        >
          <div
            className="
              flex
              h-12 w-12
              items-center
              justify-center
              rounded-full
              bg-brand-blue/10
              text-brand-blue
            "
          >
            <UploadIcon />
          </div>

          <p
            className="
              mt-4
              text-sm
              font-extrabold
              text-text-primary
            "
          >
            {dosya ? dosya.name : "Excel dosyanızı buraya bırakın"}
          </p>

          <p
            className="
              mt-1
              text-xs
              text-text-muted
            "
          >
            {dosya
              ? dosyaBoyutuYaz(dosya.size)
              : "veya bilgisayarınızdan dosya seçin"}
          </p>

          <span
            className="
              mt-4
              inline-flex
              h-9
              items-center
              justify-center
              rounded-ui
              border
              border-brand-blue/20
              bg-white
              px-4
              text-xs
              font-bold
              text-brand-blue
            "
          >
            {dosya ? "Dosyayı Değiştir" : "Dosya Seç"}
          </span>
        </button>

        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          className="hidden"
          onChange={dosyaSecildi}
        />

        {analizEdiliyorMu && <AnalizLoading />}

        {!analizEdiliyorMu && analizSonucu && (
          <AnalizSonucu sonuc={analizSonucu} />
        )}
      </div>
    </Modal>
  );
}

function AnalizSonucu({ sonuc }) {
  const satirlar = Array.isArray(sonuc?.satirlar) ? sonuc.satirlar : [];

  return (
    <div
      className="
        space-y-5
        border-t
        border-border
        pt-6
      "
    >
      <div>
        <h3
          className="
            text-sm
            font-extrabold
            text-text-primary
          "
        >
          Analiz Sonucu
        </h3>

        <p
          className="
            mt-1
            text-xs
            leading-5
            text-text-muted
          "
        >
          Excel içerisindeki kayıtlar mevcut verilerle karşılaştırıldı.
        </p>
      </div>

      <div
        className="
          grid
          gap-3
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >
        <OzetKarti baslik="Toplam Satır" deger={sonuc.toplamSatirSayisi ?? 0} />

        <OzetKarti baslik="Mevcut" deger={sonuc.mevcutKategoriSayisi ?? 0} />

        <OzetKarti
          baslik="Oluşturulacak"
          deger={sonuc.olusturulacakKategoriSayisi ?? 0}
        />

        <OzetKarti
          baslik="Hatalı"
          deger={sonuc.hataliSatirSayisi ?? 0}
          hata={Number(sonuc.hataliSatirSayisi) > 0}
        />
      </div>

      <div
        className="
          overflow-hidden
          rounded-ui-lg
          border
          border-border
          bg-white
        "
      >
        <div
          className="
            max-h-[360px]
            overflow-auto
          "
        >
          <table
            className="
              min-w-[820px]
              w-full
              border-collapse
            "
          >
            <thead
              className="
                sticky
                top-0
                z-10
                bg-slate-50
              "
            >
              <tr>
                <TabloBasligi>Satır</TabloBasligi>

                <TabloBasligi>Kategori</TabloBasligi>

                <TabloBasligi>Durum</TabloBasligi>

                <TabloBasligi>Sıra No</TabloBasligi>

                <TabloBasligi>SEO URL</TabloBasligi>
              </tr>
            </thead>

            <tbody>
              {satirlar.map((satir) => (
                <tr
                  key={satir.satirNo}
                  className="
                      border-t
                      border-border
                    "
                >
                  <TabloHucre>{satir.satirNo}</TabloHucre>

                  <TabloHucre>
                    <div
                      className="
                          font-bold
                          text-text-primary
                        "
                    >
                      {satir.kategoriAdi || "-"}
                    </div>

                    {satir.kategoriYolu && (
                      <div
                        className="
                            mt-1
                            text-[11px]
                            text-text-muted
                          "
                      >
                        {satir.kategoriYolu}
                      </div>
                    )}

                    {Array.isArray(satir.hatalar) &&
                      satir.hatalar.length > 0 && (
                        <div
                          className="
                              mt-2
                              space-y-1
                            "
                        >
                          {satir.hatalar.map((hata, index) => (
                            <p
                              key={`${satir.satirNo}-${index}`}
                              className="
                                    text-[11px]
                                    font-semibold
                                    text-danger
                                  "
                            >
                              {hata}
                            </p>
                          ))}
                        </div>
                      )}
                  </TabloHucre>

                  <TabloHucre>
                    <DurumRozeti durum={satir.durum} />
                  </TabloHucre>

                  <TabloHucre>{satir.hesaplananSiraNo ?? "-"}</TabloHucre>

                  <TabloHucre>{satir.hesaplananSeoUrl || "-"}</TabloHucre>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div
        className={`
          rounded-ui-lg
          border
          px-4
          py-3

          ${
            sonuc.aktarimaHazirMi
              ? `
                border-success/20
                bg-success/[0.06]
              `
              : `
                border-border
                bg-surface-soft
              `
          }
        `}
      >
        <p
          className={`
            text-sm
            font-bold

            ${sonuc.aktarimaHazirMi ? "text-success" : "text-text-secondary"}
          `}
        >
          {sonuc.aktarimaHazirMi
            ? "Excel dosyası içe aktarmaya hazır."
            : sonuc.hataliSatirSayisi > 0
              ? "Hatalı satırlar düzeltilmeden içe aktarma yapılamaz."
              : "İçe aktarılacak yeni kategori bulunmuyor."}
        </p>
      </div>
    </div>
  );
}

function OzetKarti({ baslik, deger, hata = false }) {
  return (
    <div
      className={`
        rounded-ui-lg
        border
        p-4

        ${
          hata
            ? `
              border-danger/20
              bg-danger/[0.04]
            `
            : `
              border-border
              bg-surface-soft/60
            `
        }
      `}
    >
      <p
        className="
          text-[11px]
          font-bold
          uppercase
          tracking-wide
          text-text-muted
        "
      >
        {baslik}
      </p>

      <p
        className={`
          mt-2
          text-2xl
          font-extrabold

          ${hata ? "text-danger" : "text-text-primary"}
        `}
      >
        {deger}
      </p>
    </div>
  );
}

function DurumRozeti({ durum }) {
  const normalized = String(durum ?? "")
    .trim()
    .toLocaleLowerCase("tr-TR");

  let className = "bg-slate-100 text-slate-600";

  if (normalized === "yeni") {
    className = "bg-brand-blue/10 text-brand-blue";
  }

  if (normalized === "mevcut") {
    className = "bg-success/10 text-success";
  }

  if (normalized === "hatalı" || normalized === "hatali") {
    className = "bg-danger/10 text-danger";
  }

  return (
    <span
      className={`
        inline-flex
        rounded-full
        px-2.5
        py-1
        text-[10px]
        font-extrabold
        uppercase
        tracking-wide
        ${className}
      `}
    >
      {durum || "Bilinmiyor"}
    </span>
  );
}

function AnalizLoading() {
  return (
    <div
      className="
        flex
        min-h-[170px]
        items-center
        justify-center
        rounded-ui-lg
        border
        border-border
        bg-surface-soft/50
      "
    >
      <div className="text-center">
        <div
          className="
            mx-auto
            h-8 w-8
            animate-spin
            rounded-full
            border-[3px]
            border-brand-blue/15
            border-t-brand-blue
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
          Excel dosyası analiz ediliyor...
        </p>
      </div>
    </div>
  );
}

function ModalFooter({
  dosya,
  analizSonucu,
  analizEdiliyorMu,
  aktariliyorMu,

  onClose,
  onAnalizEt,
  onIceAktar,
}) {
  const aktarimAktifMi = Boolean(analizSonucu?.aktarimaHazirMi);

  return (
    <div
      className="
        flex
        flex-col
        gap-3
        sm:flex-row
        sm:justify-end
      "
    >
      <button
        type="button"
        onClick={onClose}
        disabled={analizEdiliyorMu || aktariliyorMu}
        className="
          h-11
          rounded-ui
          border
          border-border
          bg-white
          px-5
          text-sm
          font-bold
          text-text-secondary

          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        Vazgeç
      </button>

      {!analizSonucu && (
        <button
          type="button"
          onClick={onAnalizEt}
          disabled={!dosya || analizEdiliyorMu}
          className="
            inline-flex
            h-11
            items-center
            justify-center
            gap-2
            rounded-ui
            bg-gradient-to-r
            from-brand-blue
            to-brand-purple
            px-6
            text-sm
            font-bold
            text-white

            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {analizEdiliyorMu && (
            <span
              className="
                h-4 w-4
                animate-spin
                rounded-full
                border-2
                border-white/30
                border-t-white
              "
            />
          )}

          {analizEdiliyorMu ? "Analiz Ediliyor..." : "Dosyayı Analiz Et"}
        </button>
      )}

      {analizSonucu && (
        <button
          type="button"
          onClick={onIceAktar}
          disabled={!aktarimAktifMi || aktariliyorMu}
          className="
            inline-flex
            h-11
            items-center
            justify-center
            gap-2
            rounded-ui
            bg-gradient-to-r
            from-brand-blue
            to-brand-purple
            px-6
            text-sm
            font-bold
            text-white

            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {aktariliyorMu
            ? "İçe Aktarılıyor..."
            : `${analizSonucu.olusturulacakKategoriSayisi ?? 0} Kategoriyi İçe Aktar`}
        </button>
      )}
    </div>
  );
}

function TabloBasligi({ children }) {
  return (
    <th
      className="
        px-4
        py-3
        text-left
        text-[10px]
        font-extrabold
        uppercase
        tracking-wide
        text-text-muted
      "
    >
      {children}
    </th>
  );
}

function TabloHucre({ children }) {
  return (
    <td
      className="
        px-4
        py-3
        align-top
        text-xs
        text-text-secondary
      "
    >
      {children}
    </td>
  );
}

function UploadIcon() {
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
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 20V8m0 0-4 4m4-4 4 4M5 4h14"
      />
    </svg>
  );
}

function dosyaBoyutuYaz(byte) {
  if (!Number.isFinite(byte) || byte <= 0) {
    return "";
  }

  if (byte < 1024) {
    return `${byte} B`;
  }

  if (byte < 1024 * 1024) {
    return `${(byte / 1024).toFixed(1)} KB`;
  }

  return `${(byte / (1024 * 1024)).toFixed(1)} MB`;
}

export default ExcelImportModal;
