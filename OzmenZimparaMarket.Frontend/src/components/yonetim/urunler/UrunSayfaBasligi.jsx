import Container from "../../ui/Container";

import ExcelIslemleriMenu from "../excel/ExcelIslemleriMenu";

function UrunSayfaBasligi({
  onYeniUrun,

  onExcelSablonIndir,
  onExcelDisariAktar,
  onExcelIceAktar,

  excelSablonIndiriliyorMu = false,
  excelDisariAktariliyorMu = false,
}) {
  return (
    <>
      <div
        className="
          border-b
          border-border
          bg-white
        "
      >
        <Container>
          <div
            className="
              flex
              flex-col
              gap-5
              py-8

              sm:flex-row
              sm:items-end
              sm:justify-between

              lg:py-10
            "
          >
            <div>
              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-sm
                "
              >
                <span
                  className="
                    font-semibold
                    text-text-muted
                  "
                >
                  Yönetim
                </span>

                <span className="text-border">/</span>

                <span
                  className="
                    font-semibold
                    text-brand-blue
                  "
                >
                  Ürün Yönetimi
                </span>
              </div>

              <h1
                className="
                  mt-3
                  text-3xl
                  font-extrabold
                  tracking-tight
                  text-text-primary

                  lg:text-[38px]
                "
              >
                Ürün Yönetimi
              </h1>

              <p
                className="
                  mt-3
                  max-w-2xl
                  text-sm
                  leading-6
                  text-text-secondary

                  sm:text-base
                "
              >
                Ürünleri oluşturun, düzenleyin, kategorilerini ve teknik
                özelliklerini yönetin, görsellerini ve yayın durumlarını kontrol
                edin.
              </p>
            </div>

            <div
              className="
                flex
                flex-col
                gap-2

                sm:flex-row
                sm:items-center
              "
            >
              <ExcelIslemleriMenu
                sablonIndiriliyorMu={excelSablonIndiriliyorMu}
                disariAktariliyorMu={excelDisariAktariliyorMu}
                onSablonIndir={onExcelSablonIndir}
                onDisariAktar={onExcelDisariAktar}
                onIceAktar={onExcelIceAktar}
                sablonMetni="Ürün Şablonunu İndir"
                disariAktarMetni="Ürünleri Excel'e Aktar"
                aktarMetni="Excel'den Ürün İçe Aktar"
              />

              <button
                type="button"
                onClick={onYeniUrun}
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
                  px-5
                  text-sm
                  font-bold
                  text-white
                  shadow-[0_10px_25px_rgba(37,99,235,0.18)]
                  transition-all

                  hover:-translate-y-0.5
                  hover:shadow-[0_14px_30px_rgba(37,99,235,0.24)]
                "
              >
                <span
                  className="
                    text-lg
                    leading-none
                  "
                >
                  +
                </span>
                Yeni Ürün
              </button>
            </div>
          </div>
        </Container>
      </div>

      <div
        className="
          h-[3px]
          bg-gradient-to-r
          from-brand-blue
          via-brand-purple
          to-transparent
        "
      />
    </>
  );
}

export default UrunSayfaBasligi;
