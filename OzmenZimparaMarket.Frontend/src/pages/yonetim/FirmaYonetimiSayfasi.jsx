import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  firmaGenelBilgisiGetir,
  firmaGenelBilgisiGuncelle,
} from "../../api/servisler/firmaServisi";

import FirmaFormu from "../../components/yonetim/firma/FirmaFormu";
import Container from "../../components/ui/Container";

import { firmaSchema } from "../../schemas/firmaSchema";

const bosForm = {
  sirketAdi: "",
  hakkimizda: "",
  vizyonumuz: "",
  misyonumuz: "",
  stratejimiz: "",
  kalitePolitikamiz: "",
  kvkk: "",
  iletisimNo: "",
  whatsappNo: "",
  eposta: "",
  acikAdres: "",
  il: "",
  ilce: "",
  googleHaritaBaglantisi: "",
  googleHaritaGommeBaglantisi: "",
};

function firmaVerisiniFormaDonustur(veri) {
  return {
    sirketAdi: veri?.sirketAdi ?? "",
    hakkimizda: veri?.hakkimizda ?? "",
    vizyonumuz: veri?.vizyonumuz ?? "",
    misyonumuz: veri?.misyonumuz ?? "",
    stratejimiz: veri?.stratejimiz ?? "",
    kalitePolitikamiz: veri?.kalitePolitikamiz ?? "",
    kvkk: veri?.kvkk ?? "",
    iletisimNo: veri?.iletisimNo ?? "",
    whatsappNo: veri?.whatsappNo ?? "",
    eposta: veri?.eposta ?? "",
    acikAdres: veri?.acikAdres ?? "",
    il: veri?.il ?? "",
    ilce: veri?.ilce ?? "",
    googleHaritaBaglantisi: veri?.googleHaritaBaglantisi ?? "",
    googleHaritaGommeBaglantisi: veri?.googleHaritaGommeBaglantisi ?? "",
  };
}

function FirmaYonetimiSayfasi() {
  const [form, setForm] = useState(bosForm);
  const [firmaBilgisi, setFirmaBilgisi] = useState(null);

  const [yukleniyor, setYukleniyor] = useState(true);

  const [kaydediliyor, setKaydediliyor] = useState(false);

  const [hataMesaji, setHataMesaji] = useState("");

  const [basariMesaji, setBasariMesaji] = useState("");

  const [alanHatalari, setAlanHatalari] = useState(null);

  useEffect(() => {
    let iptalEdildiMi = false;

    async function firmaBilgisiniYukle() {
      try {
        setYukleniyor(true);

        setHataMesaji("");
        setBasariMesaji("");
        setAlanHatalari(null);

        const veri = await firmaGenelBilgisiGetir();

        if (iptalEdildiMi) {
          return;
        }

        setFirmaBilgisi(veri);

        setForm(firmaVerisiniFormaDonustur(veri));
      } catch (error) {
        if (iptalEdildiMi) {
          return;
        }

        const cevap = error?.response?.data;

        const mesaj =
          cevap?.mesaj ||
          cevap?.title ||
          "Firma bilgileri yüklenirken bir hata oluştu.";

        setHataMesaji(mesaj);

        toast.error(mesaj, {
          toastId: "firma-yukleme-hatasi",
        });
      } finally {
        if (!iptalEdildiMi) {
          setYukleniyor(false);
        }
      }
    }

    Promise.resolve().then(() => {
      if (!iptalEdildiMi) {
        return firmaBilgisiniYukle();
      }

      return undefined;
    });

    return () => {
      iptalEdildiMi = true;
    };
  }, []);

  function formDegisti(event) {
    const { name, value } = event.target;

    setForm((mevcutForm) => ({
      ...mevcutForm,
      [name]: value,
    }));

    setBasariMesaji("");

    if (!alanHatalari) {
      return;
    }

    setAlanHatalari((mevcutHatalar) => {
      if (!mevcutHatalar) {
        return null;
      }

      const yeniHatalar = {
        ...mevcutHatalar,
      };

      const eslesenAnahtar = Object.keys(yeniHatalar).find(
        (anahtar) => anahtar.toLowerCase() === name.toLowerCase(),
      );

      if (eslesenAnahtar) {
        delete yeniHatalar[eslesenAnahtar];
      }

      return yeniHatalar;
    });
  }

  async function formuGonder(event) {
    event.preventDefault();

    setHataMesaji("");
    setBasariMesaji("");
    setAlanHatalari(null);

    const sonuc = firmaSchema.safeParse(form);

    if (!sonuc.success) {
      const zodHatalari = {};

      sonuc.error.issues.forEach((issue) => {
        const alanAdi = issue.path[0];

        if (!alanAdi) {
          return;
        }

        if (!zodHatalari[alanAdi]) {
          zodHatalari[alanAdi] = [];
        }

        zodHatalari[alanAdi].push(issue.message);
      });

      const mesaj = "Lütfen formdaki eksik veya hatalı alanları kontrol edin.";

      setAlanHatalari(zodHatalari);

      setHataMesaji(mesaj);

      toast.warning(mesaj, {
        toastId: "firma-validasyon-hatasi",
      });

      return;
    }

    try {
      setKaydediliyor(true);

      const guncellenenFirma = await firmaGenelBilgisiGuncelle(sonuc.data);

      setFirmaBilgisi(guncellenenFirma);

      setForm(firmaVerisiniFormaDonustur(guncellenenFirma));

      const mesaj =
        guncellenenFirma?.mesaj || "Firma bilgileri başarıyla güncellendi.";

      setBasariMesaji(mesaj);

      toast.success(mesaj);
    } catch (error) {
      const cevap = error?.response?.data;

      const backendAlanHatalari = cevap?.hatalar ?? cevap?.errors ?? null;

      const mesaj =
        cevap?.mesaj ||
        cevap?.title ||
        "Firma bilgileri güncellenirken bir hata oluştu.";

      setAlanHatalari(backendAlanHatalari);

      setHataMesaji(mesaj);

      toast.error(mesaj);
    } finally {
      setKaydediliyor(false);
    }
  }

  if (yukleniyor) {
    return (
      <div className="min-h-[calc(100vh-76px)] bg-[#f7f8fb]">
        <Container>
          <div className="flex min-h-[460px] items-center justify-center">
            <div className="text-center">
              <div
                className="
                  mx-auto h-10 w-10
                  animate-spin
                  rounded-full
                  border-[3px]
                  border-brand-blue/15
                  border-t-brand-blue
                "
              />

              <p className="mt-5 text-sm font-semibold text-text-secondary">
                Firma bilgileri yükleniyor...
              </p>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-76px)] bg-[#f7f8fb]">
      {/* Sayfa başlığı */}
      <div className="border-b border-border bg-white">
        <Container>
          <div className="py-8 lg:py-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold text-text-muted">Yönetim</span>

                  <span className="text-border">/</span>

                  <span className="font-semibold text-brand-blue">
                    Firma Yönetimi
                  </span>
                </div>

                <h1
                  className="
                    mt-3
                    text-3xl font-extrabold
                    tracking-tight
                    text-text-primary
                    lg:text-[38px]
                  "
                >
                  Firma Yönetimi
                </h1>

                <p
                  className="
                    mt-3 max-w-2xl
                    text-sm leading-6
                    text-text-secondary
                    sm:text-base
                  "
                >
                  Web sitesinde kullanılan kurumsal içerikleri, iletişim
                  bilgilerini ve firma konum bilgilerini tek ekrandan yönetin.
                </p>
              </div>

              {firmaBilgisi?.guncellemeTarihi && (
                <div
                  className="
                    flex items-center gap-3
                    rounded-ui-lg
                    border border-border
                    bg-surface-soft
                    px-4 py-3
                  "
                >
                  <div
                    className="
                      flex h-9 w-9
                      items-center justify-center
                      rounded-full
                      bg-success/10
                      text-success
                    "
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-4 w-4"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                  </div>

                  <div>
                    <p
                      className="
                        text-[11px]
                        font-bold uppercase
                        tracking-[0.12em]
                        text-text-muted
                      "
                    >
                      Son Güncelleme
                    </p>

                    <p className="mt-0.5 text-sm font-bold text-text-primary">
                      {new Date(firmaBilgisi.guncellemeTarihi).toLocaleString(
                        "tr-TR",
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Container>
      </div>

      {/* Marka vurgu çizgisi */}
      <div
        className="
          h-[3px]
          bg-gradient-to-r
          from-brand-blue
          via-brand-purple
          to-transparent
        "
      />

      <Container>
        <div className="py-8 lg:py-10">
          <FirmaFormu
            form={form}
            onChange={formDegisti}
            onSubmit={formuGonder}
            kaydediliyor={kaydediliyor}
            hataMesaji={hataMesaji}
            basariMesaji={basariMesaji}
            alanHatalari={alanHatalari}
          />
        </div>
      </Container>
    </div>
  );
}

export default FirmaYonetimiSayfasi;
