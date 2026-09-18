import UrunKarti from "./UrunKarti";

function UrunListesi({ urunler }) {
  if (urunler.length === 0) {
    return (
      <div className="rounded-ui-lg border border-border bg-surface-soft px-6 py-16 text-center">
        <h3 className="text-lg font-bold text-text-primary">
          Ürün bulunamadı.
        </h3>

        <p className="mt-2 text-sm text-text-secondary">
          Seçtiğiniz kategori veya filtrelere uygun ürün bulunmuyor.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {urunler.map((urun) => (
        <UrunKarti
          key={urun.id}
          urunAdi={urun.urunAdi}
          urunKodu={urun.urunKodu}
          kategoriAdi={urun.kategoriAdi}
          kisaAciklama={urun.kisaAciklama}
          seoUrl={urun.seoUrl}
          gorselYolu={urun.gorselYolu}
        />
      ))}
    </div>
  );
}

export default UrunListesi;
