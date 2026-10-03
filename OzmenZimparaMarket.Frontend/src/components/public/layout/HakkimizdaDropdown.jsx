import { Link } from "react-router";

const kurumsalLinkler = [
  {
    baslik: "Hakkımızda",
    aciklama: "Firmamızı ve çalışma anlayışımızı tanıyın.",
    yol: "/hakkimizda",
  },
  {
    baslik: "Vizyonumuz",
    aciklama: "Vizyonumuzu, misyonumuzu ve stratejimizi inceleyin.",
    yol: "/vizyon-misyon-strateji",
  },
  {
    baslik: "Kalite Politikamız",
    aciklama: "Kalite ve hizmet standartlarımızı görün.",
    yol: "/kalite-politikasi",
  },
  {
    baslik: "KVKK",
    aciklama:
      "Kişisel verilerin korunmasına ilişkin bilgilendirmeyi inceleyin.",
    yol: "/kvkk",
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
        w-[300px]
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
        <div className="space-y-1">
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
                py-3.5
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
