import Container from "../../components/ui/Container";

import UrunOzelligiFormModal from "../../components/yonetim/urun-ozellikleri/UrunOzelligiFormModal";
import UrunOzelligiListesi from "../../components/yonetim/urun-ozellikleri/UrunOzelligiListesi";
import UrunOzelligiSayfaBasligi from "../../components/yonetim/urun-ozellikleri/UrunOzelligiSayfaBasligi";
import UrunOzelligiSilModal from "../../components/yonetim/urun-ozellikleri/UrunOzelligiSilModal";
import useUrunOzelligiYonetimi from "../../components/yonetim/urun-ozellikleri/useUrunOzelligiYonetimi";

function UrunOzellikleriYonetimiSayfasi() {
  const {
    urunOzellikleri,
    yukleniyor,

    formModalAcik,
    duzenlenenUrunOzelligi,
    form,
    formHatalari,
    kaydediliyor,
    detayYukleniyor,

    durumDegistirilenId,

    silModalAcik,
    silinecekUrunOzelligi,
    siliniyor,

    yeniUrunOzelligiAc,
    urunOzelligiDuzenle,
    formModaliniKapat,

    formAlaniDegisti,
    urunOzelligiKaydet,

    urunOzelligiDurumDegistir,

    urunOzelligiSilmeOnayiAc,
    silModaliniKapat,
    urunOzelligiSil,
  } = useUrunOzelligiYonetimi();

  return (
    <>
      <UrunOzelligiSayfaBasligi
        toplamKayit={urunOzellikleri.length}
        onYeniUrunOzelligi={yeniUrunOzelligiAc}
      />

      <main
        className="
          min-h-[calc(100vh-240px)]
          bg-surface-soft
          py-10
        "
      >
        <Container>
          <UrunOzelligiListesi
            urunOzellikleri={urunOzellikleri}
            yukleniyor={yukleniyor}
            detayYukleniyor={detayYukleniyor}
            durumDegistirilenId={durumDegistirilenId}
            onDuzenle={urunOzelligiDuzenle}
            onDurumDegistir={urunOzelligiDurumDegistir}
            onSil={urunOzelligiSilmeOnayiAc}
          />
        </Container>
      </main>

      <UrunOzelligiFormModal
        open={formModalAcik}
        onClose={formModaliniKapat}
        duzenlenenUrunOzelligi={duzenlenenUrunOzelligi}
        form={form}
        formHatalari={formHatalari}
        kaydediliyor={kaydediliyor}
        onAlanDegisti={formAlaniDegisti}
        onKaydet={urunOzelligiKaydet}
      />

      <UrunOzelligiSilModal
        open={silModalAcik}
        onClose={silModaliniKapat}
        urunOzelligi={silinecekUrunOzelligi}
        siliniyor={siliniyor}
        onSil={urunOzelligiSil}
      />
    </>
  );
}

export default UrunOzellikleriYonetimiSayfasi;
