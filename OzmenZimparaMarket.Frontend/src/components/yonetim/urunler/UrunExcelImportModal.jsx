import { useRef, useState } from "react";

import Modal from "../../ui/Modal";

function UrunExcelImportModal({
  open,
  onClose,

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
      eyebrow="Ürün Excel İşlemleri"
      title="Excel'den Ürün İçe Aktar"
      maxWidth="1240px"
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
            Ürün Excel Dosyası
          </h3>

          <p
            className="
              mt-1
              max-w-3xl
              text-xs
              leading-5
              text-text-muted
            "
          >
            Doldurduğunuz ürün .xlsx dosyasını yükleyin. Ürünler, kategoriler,
            ürün kodları, SEO adresleri ve teknik özellikler aktarılmadan önce
            kontrol edilir.
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
            min-h-[180px]
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
              h-12
              w-12
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
            {dosya ? dosya.name : "Ürün Excel dosyanızı buraya bırakın"}
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
              : "veya bilgisayarınızdan .xlsx dosyası seçin"}
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

        <ImportKurallari />

        {analizEdiliyorMu && <AnalizLoading />}

        {!analizEdiliyorMu && analizSonucu && (
          <UrunAnalizSonucu sonuc={analizSonucu} />
        )}
      </div>
    </Modal>
  );
}

function ImportKurallari() {
  return (
    <div
      className="
        rounded-ui-lg
        border
        border-brand-blue/15
        bg-brand-blue/[0.035]
        px-4
        py-4
      "
    >
      <div
        className="
          flex
          gap-3
        "
      >
        <span
          className="
            mt-0.5
            flex
            h-7
            w-7
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-brand-blue/10
            text-brand-blue
          "
        >
          <InfoIcon />
        </span>

        <div>
          <p
            className="
              text-xs
              font-extrabold
              text-text-primary
            "
          >
            Ürün aktarım kuralları
          </p>

          <p
            className="
              mt-1
              text-xs
              leading-5
              text-text-secondary
            "
          >
            Sistemde aynı ürün kodu zaten varsa ürün güncellenmez ve
            <strong> Mevcut</strong> olarak atlanır. Kategori yolu sistemde
            bulunmayan yeni ürünler eklenmez. Hatalı bir yeni ürün satırı varsa
            gerçek aktarım başlatılamaz.
          </p>
        </div>
      </div>
    </div>
  );
}

function UrunAnalizSonucu({ sonuc }) {
  const satirlar = Array.isArray(sonuc?.satirlar) ? sonuc.satirlar : [];

  const hataliSatirSayisi = Number(sonuc?.hataliSatirSayisi) || 0;

  const olusturulacakUrunSayisi = Number(sonuc?.olusturulacakUrunSayisi) || 0;

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
          Excel içerisindeki ürün kayıtları mevcut ürünler, kategoriler ve
          teknik özellik tanımlarıyla karşılaştırıldı.
        </p>
      </div>

      <div
        className="
          grid
          gap-3

          sm:grid-cols-2

          xl:grid-cols-5
        "
      >
        <OzetKarti baslik="Toplam" deger={sonuc?.toplamSatirSayisi ?? 0} />

        <OzetKarti baslik="Geçerli" deger={sonuc?.gecerliSatirSayisi ?? 0} />

        <OzetKarti
          baslik="Yeni"
          deger={sonuc?.olusturulacakUrunSayisi ?? 0}
          vurgu="yeni"
        />

        <OzetKarti
          baslik="Mevcut"
          deger={sonuc?.mevcutUrunSayisi ?? 0}
          vurgu="mevcut"
        />

        <OzetKarti
          baslik="Hatalı"
          deger={sonuc?.hataliSatirSayisi ?? 0}
          vurgu={hataliSatirSayisi > 0 ? "hata" : undefined}
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
            max-h-[430px]
            overflow-auto
          "
        >
          <table
            className="
              w-full
              min-w-[1120px]
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

                <TabloBasligi>Ürün</TabloBasligi>

                <TabloBasligi>Kategori</TabloBasligi>

                <TabloBasligi>Durum</TabloBasligi>

                <TabloBasligi>Teknik Detay</TabloBasligi>

                <TabloBasligi>Sıra No</TabloBasligi>

                <TabloBasligi>SEO URL</TabloBasligi>
              </tr>
            </thead>

            <tbody>
              {satirlar.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="
                      px-4
                      py-10
                      text-center
                      text-sm
                      text-text-muted
                    "
                  >
                    Analiz edilecek ürün satırı bulunamadı.
                  </td>
                </tr>
              ) : (
                satirlar.map((satir) => (
                  <UrunAnalizSatiri key={satir.satirNo} satir={satir} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnalizDurumu
        aktarimaHazirMi={Boolean(sonuc?.aktarimaHazirMi)}
        hataliSatirSayisi={hataliSatirSayisi}
        olusturulacakUrunSayisi={olusturulacakUrunSayisi}
        mevcutUrunSayisi={Number(sonuc?.mevcutUrunSayisi) || 0}
      />
    </div>
  );
}

function UrunAnalizSatiri({ satir }) {
  const hatalar = Array.isArray(satir?.hatalar) ? satir.hatalar : [];

  return (
    <tr
      className="
        border-t
        border-border
        transition-colors

        hover:bg-slate-50/60
      "
    >
      <TabloHucre>{satir?.satirNo ?? "-"}</TabloHucre>

      <TabloHucre>
        <div
          className="
            min-w-[190px]
          "
        >
          <p
            className="
              font-bold
              text-text-primary
            "
          >
            {satir?.urunAdi || "-"}
          </p>

          <p
            className="
              mt-1
              font-mono
              text-[11px]
              font-semibold
              text-text-muted
            "
          >
            {satir?.urunKodu || "Ürün kodu yok"}
          </p>

          {hatalar.length > 0 && (
            <div
              className="
                mt-2
                space-y-1
              "
            >
              {hatalar.map((hata, index) => (
                <p
                  key={`${satir?.satirNo}-${index}`}
                  className="
                      text-[11px]
                      font-semibold
                      leading-4
                      text-danger
                    "
                >
                  {hata}
                </p>
              ))}
            </div>
          )}
        </div>
      </TabloHucre>

      <TabloHucre>
        <div
          className="
            max-w-[280px]
            whitespace-normal
            leading-5
          "
        >
          {satir?.kategoriYolu || "-"}
        </div>
      </TabloHucre>

      <TabloHucre>
        <DurumRozeti durum={satir?.durum} />
      </TabloHucre>

      <TabloHucre>{satir?.teknikDetaySayisi ?? 0}</TabloHucre>

      <TabloHucre>{satir?.hesaplananSiraNo ?? "-"}</TabloHucre>

      <TabloHucre>
        <div
          className="
            max-w-[220px]
            break-all
            text-[11px]
          "
        >
          {satir?.hesaplananSeoUrl || "-"}
        </div>
      </TabloHucre>
    </tr>
  );
}

function AnalizDurumu({
  aktarimaHazirMi,
  hataliSatirSayisi,
  olusturulacakUrunSayisi,
  mevcutUrunSayisi,
}) {
  let mesaj = "Excel dosyasında içe aktarılacak yeni ürün bulunmuyor.";

  let durum = "normal";

  if (hataliSatirSayisi > 0) {
    mesaj =
      `${hataliSatirSayisi} hatalı satır bulunuyor. ` +
      "Hatalı satırlar düzeltilmeden ürün aktarımı yapılamaz.";

    durum = "hata";
  } else if (aktarimaHazirMi) {
    mesaj =
      `${olusturulacakUrunSayisi} yeni ürün içe aktarılmaya hazır.` +
      (mevcutUrunSayisi > 0
        ? ` ${mevcutUrunSayisi} mevcut ürün değişiklik yapılmadan atlanacak.`
        : "");

    durum = "basarili";
  } else if (mevcutUrunSayisi > 0) {
    mesaj =
      `Dosyadaki ${mevcutUrunSayisi} ürün sistemde zaten mevcut. ` +
      "Mevcut ürünlerde değişiklik yapılmayacak.";
  }

  const className =
    durum === "hata"
      ? `
        border-danger/20
        bg-danger/[0.06]
        text-danger
      `
      : durum === "basarili"
        ? `
          border-success/20
          bg-success/[0.06]
          text-success
        `
        : `
          border-border
          bg-surface-soft
          text-text-secondary
        `;

  return (
    <div
      className={`
        rounded-ui-lg
        border
        px-4
        py-3
        ${className}
      `}
    >
      <p
        className="
          text-sm
          font-bold
          leading-5
        "
      >
        {mesaj}
      </p>
    </div>
  );
}

function OzetKarti({ baslik, deger, vurgu }) {
  let className = `
      border-border
      bg-surface-soft/60
    `;

  let degerClassName = "text-text-primary";

  if (vurgu === "hata") {
    className = `
        border-danger/20
        bg-danger/[0.04]
      `;

    degerClassName = "text-danger";
  }

  if (vurgu === "yeni") {
    className = `
        border-brand-blue/20
        bg-brand-blue/[0.04]
      `;

    degerClassName = "text-brand-blue";
  }

  if (vurgu === "mevcut") {
    className = `
        border-success/20
        bg-success/[0.04]
      `;

    degerClassName = "text-success";
  }

  return (
    <div
      className={`
        rounded-ui-lg
        border
        p-4
        ${className}
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
          ${degerClassName}
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
            h-8
            w-8
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
          Ürün Excel dosyası analiz ediliyor...
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

  const urunSayisi = Number(analizSonucu?.olusturulacakUrunSayisi) || 0;

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
          disabled={!dosya || analizEdiliyorMu || aktariliyorMu}
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
                h-4
                w-4
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
          disabled={!aktarimAktifMi || aktariliyorMu || analizEdiliyorMu}
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
          {aktariliyorMu && (
            <span
              className="
                h-4
                w-4
                animate-spin
                rounded-full
                border-2
                border-white/30
                border-t-white
              "
            />
          )}

          {aktariliyorMu
            ? "Ürünler İçe Aktarılıyor..."
            : `${urunSayisi} Ürünü İçe Aktar`}
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

function InfoIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />

      <path strokeLinecap="round" d="M12 11v5" />

      <path strokeLinecap="round" d="M12 8h.01" />
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

export default UrunExcelImportModal;
