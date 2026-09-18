function HizliIslemler({
  onFirma,
  onKategoriler,
  onUrunler,
  onTeknikOzellikler,
  onKullanicilar,
}) {
  const islemler = [
    {
      baslik: "Firma Bilgileri",
      aciklama: "Kurumsal metinleri, iletişim ve firma bilgilerini yönetin.",
      icon: <CompanyIcon />,
      onClick: onFirma,
    },

    {
      baslik: "Kategori Yönetimi",
      aciklama: "Ana ve alt kategorileri, sıralamaları ve görselleri yönetin.",
      icon: <CategoryIcon />,
      onClick: onKategoriler,
    },

    {
      baslik: "Ürün Yönetimi",
      aciklama:
        "Ürün kataloğunu, teknik bilgileri ve Excel işlemlerini yönetin.",
      icon: <ProductIcon />,
      onClick: onUrunler,
    },

    {
      baslik: "Ürün Özellikleri",
      aciklama:
        "Filtrelerde ve ürün detaylarında kullanılan teknik tanımları yönetin.",
      icon: <SlidersIcon />,
      onClick: onTeknikOzellikler,
    },

    {
      baslik: "Kullanıcı Yönetimi",
      aciklama: "Yönetim paneli kullanıcılarını ve hesap durumlarını yönetin.",
      icon: <UsersIcon />,
      onClick: onKullanicilar,
    },
  ];

  return (
    <section>
      <div className="mb-4">
        <h2
          className="
            text-lg
            font-extrabold
            text-text-primary
          "
        >
          Hızlı İşlemler
        </h2>

        <p
          className="
            mt-1
            text-sm
            text-text-muted
          "
        >
          Sık kullanılan yönetim ekranlarına hızlıca ulaşın.
        </p>
      </div>

      <div
        className="
          grid
          gap-4

          sm:grid-cols-2
          xl:grid-cols-5
        "
      >
        {islemler.map((islem) => (
          <button
            key={islem.baslik}
            type="button"
            onClick={islem.onClick}
            className="
              group
              flex
              min-h-[160px]
              flex-col
              items-start
              rounded-ui-lg
              border
              border-border
              bg-white
              p-5
              text-left
              shadow-sm
              transition-all

              hover:-translate-y-0.5
              hover:border-brand-blue/20
              hover:shadow-[0_12px_30px_rgba(15,23,42,0.07)]
            "
          >
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-gradient-to-br
                from-brand-blue/10
                to-brand-purple/10
                text-brand-blue
                transition

                group-hover:text-brand-purple
              "
            >
              {islem.icon}
            </div>

            <p
              className="
                mt-4
                text-sm
                font-extrabold
                text-text-primary
              "
            >
              {islem.baslik}
            </p>

            <p
              className="
                mt-1.5
                text-xs
                leading-5
                text-text-muted
              "
            >
              {islem.aciklama}
            </p>

            <span
              className="
                mt-auto
                pt-4
                text-xs
                font-extrabold
                text-brand-blue
              "
            >
              Yönet →
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

function CompanyIcon() {
  return <SimpleIcon path="M5 21V5h10v16M15 9h4v12M8 9h4M8 13h4M8 17h4" />;
}

function CategoryIcon() {
  return (
    <SimpleIcon path="M4 5h6v6H4V5Zm10 0h6v6h-6V5ZM4 15h6v4H4v-4Zm10 0h6v4h-6v-4Z" />
  );
}

function ProductIcon() {
  return (
    <SimpleIcon path="M5 7.5 12 4l7 3.5v9L12 20l-7-3.5v-9Zm0 0 7 3.5 7-3.5M12 11v9" />
  );
}

function SlidersIcon() {
  return <SimpleIcon path="M4 7h10M18 7h2M4 17h2M10 17h10M14 4v6M10 14v6" />;
}

function UsersIcon() {
  return (
    <SimpleIcon path="M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.5 20a5.5 5.5 0 0 1 11 0M16 6a3 3 0 0 1 0 6m1 3a5 5 0 0 1 4 5" />
  );
}

function SimpleIcon({ path }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d={path} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default HizliIslemler;
