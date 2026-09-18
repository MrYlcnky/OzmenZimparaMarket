import { Link } from "react-router";

const kurumsalLinkler = [
  {
    baslik: "Hakkımızda",
    aciklama: "Firmamızı ve çalışma anlayışımızı tanıyın.",
    yol: "/hakkimizda",
  },
  {
    baslik: "Vizyonumuz",
    aciklama: "Geleceğe yönelik hedeflerimizi inceleyin.",
    yol: "/hakkimizda#vizyonumuz",
  },
  {
    baslik: "Misyonumuz",
    aciklama: "Müşterilerimize sunduğumuz değerleri keşfedin.",
    yol: "/hakkimizda#misyonumuz",
  },
  {
    baslik: "Stratejimiz",
    aciklama: "Sürdürülebilir büyüme yaklaşımımızı inceleyin.",
    yol: "/hakkimizda#stratejimiz",
  },
  {
    baslik: "Kalite Politikamız",
    aciklama: "Kalite ve hizmet standartlarımızı görün.",
    yol: "/hakkimizda#kalite-politikamiz",
  },
];

function HakkimizdaDropdown({ open, onClose }) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="
        absolute
        left-1/2
        top-[calc(100%+18px)]
        z-50
        w-[390px]
        -translate-x-1/2
      "
    >
      <div
        className="
          overflow-hidden
          rounded-2xl
          border
          border-white/10
          bg-[#0b0d18]/95
          p-2
          shadow-[0_24px_70px_rgba(0,0,0,0.45)]
          backdrop-blur-xl
        "
      >
        <div
          className="
            border-b
            border-white/[0.07]
            px-4
            pb-3
            pt-2
          "
        >
          <p
            className="
              text-[10px]
              font-extrabold
              uppercase
              tracking-[0.18em]
              text-purple-300
            "
          >
            Kurumsal
          </p>

          <p
            className="
              mt-1
              text-xs
              leading-5
              text-white/45
            "
          >
            Özmen Zımpara Market'in kurumsal yaklaşımını keşfedin.
          </p>
        </div>

        <div className="mt-1 space-y-1">
          {kurumsalLinkler.map((link) => (
            <Link
              key={link.yol}
              to={link.yol}
              onClick={onClose}
              className="
                group
                block
                rounded-xl
                px-4
                py-3
                transition-all

                hover:bg-white/[0.06]
              "
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p
                    className="
                      text-sm
                      font-bold
                      text-white/90
                      transition-colors

                      group-hover:text-purple-300
                    "
                  >
                    {link.baslik}
                  </p>

                  <p
                    className="
                      mt-1
                      text-[11px]
                      leading-5
                      text-white/40
                    "
                  >
                    {link.aciklama}
                  </p>
                </div>

                <ArrowIcon />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="
        h-4
        w-4
        shrink-0
        text-white/20
        transition-all

        group-hover:translate-x-0.5
        group-hover:text-purple-300
      "
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default HakkimizdaDropdown;
