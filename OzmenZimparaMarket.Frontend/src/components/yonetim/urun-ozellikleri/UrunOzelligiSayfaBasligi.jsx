import Container from "../../ui/Container";

function UrunOzelligiSayfaBasligi({ toplamKayit = 0, onYeniUrunOzelligi }) {
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
              flex flex-col
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
                  flex items-center
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

                <span
                  className="
                    text-border
                  "
                >
                  /
                </span>

                <span
                  className="
                    font-semibold
                    text-brand-blue
                  "
                >
                  Ürün Özellikleri Yönetimi
                </span>
              </div>

              <div
                className="
                  mt-3
                  flex flex-wrap
                  items-center
                  gap-3
                "
              >
                <h1
                  className="
                    text-3xl
                    font-extrabold
                    tracking-tight
                    text-text-primary
                    lg:text-[38px]
                  "
                >
                  Ürün Özellikleri Yönetimi
                </h1>

                <span
                  className="
                    inline-flex
                    h-7
                    min-w-7
                    items-center
                    justify-center
                    rounded-full
                    bg-purple-100
                    px-2.5
                    text-xs
                    font-extrabold
                    text-purple-700
                  "
                >
                  {toplamKayit}
                </span>
              </div>

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
                Ürünlerde kullanılacak teknik özellikleri, filtre davranışlarını
                ve teklif sepetindeki seçim seçeneklerini yönetin.
              </p>
            </div>

            <button
              type="button"
              onClick={onYeniUrunOzelligi}
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
              Yeni Ürün Özelliği
            </button>
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

export default UrunOzelligiSayfaBasligi;
