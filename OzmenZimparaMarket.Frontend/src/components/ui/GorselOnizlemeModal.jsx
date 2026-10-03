import { useEffect } from "react";

function GorselOnizlemeModal({
  open,
  src,
  alt = "Görsel",
  baslik = "",
  onClose,
}) {
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    function klavyeKontrol(event) {
      if (event.key === "Escape") {
        onClose?.();
      }
    }

    const oncekiOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", klavyeKontrol);

    return () => {
      document.body.style.overflow = oncekiOverflow;

      window.removeEventListener("keydown", klavyeKontrol);
    };
  }, [open, onClose]);

  if (!open || !src) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-[9999]
        flex
        items-center
        justify-center
        bg-black/85
        p-4
        backdrop-blur-sm

        sm:p-6
      "
      role="dialog"
      aria-modal="true"
      aria-label={`${alt} büyük görsel`}
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="
          absolute
          right-4
          top-4
          z-20
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-full
          border
          border-white/15
          bg-black/50
          text-white
          backdrop-blur-md
          transition-all

          hover:scale-105
          hover:bg-white
          hover:text-zinc-950

          sm:right-6
          sm:top-6
        "
        aria-label="Görsel önizlemeyi kapat"
      >
        <CloseIcon />
      </button>

      <img
        src={src}
        alt={alt}
        onClick={(event) => event.stopPropagation()}
        className="
          max-h-[88vh]
          max-w-[92vw]
          object-contain
          object-center
          drop-shadow-[0_30px_70px_rgba(0,0,0,0.45)]
        "
      />

      {baslik && (
        <div
          className="
            pointer-events-none
            absolute
            bottom-5
            left-1/2
            max-w-[85%]
            -translate-x-1/2
            rounded-full
            bg-black/55
            px-4
            py-2
            text-center
            text-[12px]
            font-semibold
            text-white/85
            backdrop-blur-md
          "
        >
          {baslik}
        </div>
      )}
    </div>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M7 7l10 10M17 7 7 17" strokeLinecap="round" />
    </svg>
  );
}

export default GorselOnizlemeModal;
