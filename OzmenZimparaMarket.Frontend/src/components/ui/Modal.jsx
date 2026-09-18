import { useEffect } from "react";

import { createPortal } from "react-dom";

function Modal({
  open,
  onClose,
  title,
  eyebrow,
  children,
  footer,
  maxWidth = "820px",
  closeDisabled = false,
  contentClassName = "",
}) {
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    function keyDown(event) {
      if (event.key === "Escape" && !closeDisabled) {
        onClose();
      }
    }

    const oncekiOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", keyDown);

    return () => {
      document.body.style.overflow = oncekiOverflow;

      window.removeEventListener("keydown", keyDown);
    };
  }, [open, onClose, closeDisabled]);

  if (!open) {
    return null;
  }

  return createPortal(
    <div
      className="
        fixed
        inset-0
        z-[500]

        flex
        items-center
        justify-center

        bg-slate-950/55

        px-4
        py-6

        backdrop-blur-[5px]

        sm:px-6
      "
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !closeDisabled) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        style={{
          maxWidth,
        }}
        className="
          relative

          flex
          max-h-[calc(100vh-48px)]
          w-full
          flex-col

          overflow-hidden

          rounded-[24px]

          border
          border-white/70

          bg-white

          shadow-[0_30px_90px_rgba(15,23,42,0.30)]

          ring-1
          ring-black/[0.04]
        "
      >
        <div
          className="
            absolute
            left-0
            right-0
            top-0
            z-10

            h-[3px]

            bg-gradient-to-r
            from-brand-blue
            via-brand-purple
            to-purple-400
          "
        />

        <div
          className="
            flex
            shrink-0
            items-start
            justify-between
            gap-5

            border-b
            border-slate-200/80

            bg-white

            px-6
            pb-5
            pt-6

            sm:px-7
            sm:pt-7
          "
        >
          <div className="min-w-0">
            {eyebrow && (
              <p
                className="
                  text-[11px]
                  font-extrabold
                  uppercase
                  tracking-[0.14em]
                  text-brand-blue
                "
              >
                {eyebrow}
              </p>
            )}

            <h2
              id="modal-title"
              className="
                mt-1.5

                text-[22px]
                font-extrabold
                leading-tight
                tracking-[-0.025em]
                text-text-primary
              "
            >
              {title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={closeDisabled}
            className="
              inline-flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center

              rounded-xl

              border
              border-slate-200

              bg-white

              text-slate-500

              shadow-sm

              transition-all
              duration-200

              hover:border-slate-300
              hover:bg-slate-50
              hover:text-slate-900

              focus:outline-none
              focus:ring-4
              focus:ring-slate-200/70

              disabled:cursor-not-allowed
              disabled:opacity-50
            "
            aria-label="Pencereyi kapat"
          >
            <CloseIcon />
          </button>
        </div>

        <div
          className="
            min-h-0
            flex-1

            overflow-y-auto
            overscroll-contain

            bg-white

            scrollbar-thin
          "
        >
          <div
            className={`
              px-6
              py-6

              sm:px-7

              ${contentClassName}
            `}
          >
            {children}
          </div>
        </div>

        {footer && (
          <div
            className="
              shrink-0

              border-t
              border-slate-200/80

              bg-slate-50/80

              px-6
              py-4

              backdrop-blur-xl

              sm:px-7
            "
          >
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      className="h-[17px] w-[17px]"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 6l12 12M18 6 6 18"
      />
    </svg>
  );
}

export default Modal;
