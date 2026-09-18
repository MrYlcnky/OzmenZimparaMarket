import KullaniciFormModal from "../../components/yonetim/kullanicilar/KullaniciFormModal";
import KullaniciListesi from "../../components/yonetim/kullanicilar/KullaniciListesi";
import KullaniciSayfaBasligi from "../../components/yonetim/kullanicilar/KullaniciSayfaBasligi";
import KullaniciSifreDegistirModal from "../../components/yonetim/kullanicilar/KullaniciSifreDegistirModal";
import KullaniciSifreSifirlaModal from "../../components/yonetim/kullanicilar/KullaniciSifreSifirlaModal";
import KullaniciSilModal from "../../components/yonetim/kullanicilar/KullaniciSilModal";

import useKullaniciYonetimi from "../../components/yonetim/kullanicilar/useKullaniciYonetimi";

function KullaniciYonetimiSayfasi() {
  const {
    mevcutKullaniciId,

    filtrelenmisKullanicilar,

    aramaMetni,
    durumFiltresi,

    aktifKullaniciSayisi,
    pasifKullaniciSayisi,
    aktifFiltreVarMi,

    yukleniyorMu,

    durumDegistirilenKullaniciId,

    formModalAcikMi,
    formModu,
    duzenlenecekKullanici,
    kullaniciFormu,
    kullaniciFormHatalari,
    kullaniciKaydediliyorMu,

    siliniyorMu,
    silinecekKullanici,

    sifresiSifirlanacakKullanici,
    sifreSifirlamaFormu,
    sifreSifirlamaHatalari,
    sifreSifirlaniyorMu,

    sifreDegistirmeModalAcikMi,
    sifreDegistirmeFormu,
    sifreDegistirmeHatalari,
    sifreDegistiriliyorMu,

    aramaMetniDegistir,
    durumFiltresiDegistir,
    filtreleriTemizle,

    yeniKullaniciModaliniAc,
    duzenlemeModaliniAc,
    formModaliniKapat,
    kullaniciFormAlaniniDegistir,
    kullaniciyiKaydet,

    kullaniciDurumunuDegistir,

    silmeModaliniAc,
    silmeModaliniKapat,
    kullaniciyiSil,

    sifreSifirlamaModaliniAc,
    sifreSifirlamaModaliniKapat,
    sifreSifirlamaAlaniniDegistir,
    kullaniciSifresiniSifirla,

    sifreDegistirmeModaliniAc,
    sifreDegistirmeModaliniKapat,
    sifreDegistirmeAlaniniDegistir,
    kendiSifresiniDegistir,
  } = useKullaniciYonetimi();

  const duzenlenenKullaniciMevcutKullaniciMi = Boolean(
    duzenlenecekKullanici?.id &&
    mevcutKullaniciId &&
    duzenlenecekKullanici.id === mevcutKullaniciId,
  );

  return (
    <div className="min-h-full bg-surface-soft">
      <KullaniciSayfaBasligi
        onYeniKullanici={yeniKullaniciModaliniAc}
        onSifreDegistir={sifreDegistirmeModaliniAc}
      />

      <div
        className="
          px-6
          py-6

          lg:px-8
        "
      >
        <KullaniciListesi
          kullanicilar={filtrelenmisKullanicilar}
          aramaMetni={aramaMetni}
          durumFiltresi={durumFiltresi}
          aktifKullaniciSayisi={aktifKullaniciSayisi}
          pasifKullaniciSayisi={pasifKullaniciSayisi}
          aktifFiltreVarMi={aktifFiltreVarMi}
          yukleniyorMu={yukleniyorMu}
          durumDegistirilenKullaniciId={durumDegistirilenKullaniciId}
          onAramaMetniDegistir={aramaMetniDegistir}
          onDurumFiltresiDegistir={durumFiltresiDegistir}
          onFiltreleriTemizle={filtreleriTemizle}
          onDurumDegistir={kullaniciDurumunuDegistir}
          onDuzenle={duzenlemeModaliniAc}
          onSifreSifirla={sifreSifirlamaModaliniAc}
          onSil={silmeModaliniAc}
        />
      </div>

      <KullaniciFormModal
        open={formModalAcikMi}
        mode={formModu}
        form={kullaniciFormu}
        alanHatalari={kullaniciFormHatalari}
        mevcutKullaniciMi={duzenlenenKullaniciMevcutKullaniciMi}
        saving={kullaniciKaydediliyorMu}
        onClose={formModaliniKapat}
        onFieldChange={kullaniciFormAlaniniDegistir}
        onSubmit={kullaniciyiKaydet}
      />

      <KullaniciSilModal
        open={Boolean(silinecekKullanici)}
        kullanici={silinecekKullanici}
        loading={siliniyorMu}
        onClose={silmeModaliniKapat}
        onConfirm={kullaniciyiSil}
      />

      <KullaniciSifreSifirlaModal
        open={Boolean(sifresiSifirlanacakKullanici)}
        kullanici={sifresiSifirlanacakKullanici}
        form={sifreSifirlamaFormu}
        alanHatalari={sifreSifirlamaHatalari}
        loading={sifreSifirlaniyorMu}
        onClose={sifreSifirlamaModaliniKapat}
        onFieldChange={sifreSifirlamaAlaniniDegistir}
        onSubmit={kullaniciSifresiniSifirla}
      />

      <KullaniciSifreDegistirModal
        open={sifreDegistirmeModalAcikMi}
        form={sifreDegistirmeFormu}
        alanHatalari={sifreDegistirmeHatalari}
        loading={sifreDegistiriliyorMu}
        onClose={sifreDegistirmeModaliniKapat}
        onFieldChange={sifreDegistirmeAlaniniDegistir}
        onSubmit={kendiSifresiniDegistir}
      />
    </div>
  );
}

export default KullaniciYonetimiSayfasi;
