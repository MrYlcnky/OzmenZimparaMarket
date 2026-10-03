import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

function metniNormalizeEt(deger) {
  return String(deger ?? "")
    .trim()
    .toLocaleLowerCase("tr-TR");
}

function MultiSelect({
  id,
  label,

  value = [],
  onValueChange,

  options = [],

  placeholder = "Seçiniz",

  multiple = true,
  searchable = true,

  searchPlaceholder = "Değer ara...",
  noResultsText = "Sonuç bulunamadı",

  disabled = false,

  maxVisibleValues = 2,
}) {
  const [acikMi, setAcikMi] = useState(false);
  const [aramaMetni, setAramaMetni] = useState("");
  const [konum, setKonum] = useState(null);

  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const searchInputRef = useRef(null);

  const seciliDegerler = useMemo(() => {
    return Array.isArray(value) ? value.map((deger) => String(deger)) : [];
  }, [value]);

  const filtrelenmisSecenekler = useMemo(() => {
    const arama = metniNormalizeEt(aramaMetni);

    if (!searchable || !arama) {
      return options;
    }

    return options.filter((option) => {
      const aranabilirMetin = [option.label, option.value, option.searchText]
        .map(metniNormalizeEt)
        .join(" ");

      return aranabilirMetin.includes(arama);
    });
  }, [options, searchable, aramaMetni]);

  useEffect(() => {
    if (!acikMi) {
      return undefined;
    }

    function konumuGuncelle() {
      const trigger = triggerRef.current;

      if (!trigger) {
        return;
      }

      const rect = trigger.getBoundingClientRect();

      const ekranAltBosluk = window.innerHeight - rect.bottom;

      const asagiAcilsinMi = ekranAltBosluk >= 280 || rect.top < ekranAltBosluk;

      setKonum({
        left: rect.left,
        width: rect.width,

        top: asagiAcilsinMi ? rect.bottom + 6 : undefined,

        bottom: asagiAcilsinMi ? undefined : window.innerHeight - rect.top + 6,
      });
    }

    function disariyaTiklandi(event) {
      const container = containerRef.current;

      const dropdown = document.getElementById(`${id}-multiselect-dropdown`);

      if (
        container?.contains(event.target) ||
        dropdown?.contains(event.target)
      ) {
        return;
      }

      setAcikMi(false);
    }

    function klavyeKontrol(event) {
      if (event.key === "Escape") {
        setAcikMi(false);
      }
    }

    konumuGuncelle();

    window.addEventListener("resize", konumuGuncelle);

    window.addEventListener("scroll", konumuGuncelle, true);

    document.addEventListener("mousedown", disariyaTiklandi);

    document.addEventListener("keydown", klavyeKontrol);

    if (searchable) {
      requestAnimationFrame(() => {
        searchInputRef.current?.focus();
      });
    }

    return () => {
      window.removeEventListener("resize", konumuGuncelle);

      window.removeEventListener("scroll", konumuGuncelle, true);

      document.removeEventListener("mousedown", disariyaTiklandi);

      document.removeEventListener("keydown", klavyeKontrol);
    };
  }, [acikMi, id, searchable]);

  function dropdownAcKapat() {
    if (disabled) {
      return;
    }

    setAcikMi((onceki) => {
      const yeniDeger = !onceki;

      if (!yeniDeger) {
        setAramaMetni("");
      }

      return yeniDeger;
    });
  }

  function secenekSec(optionValue) {
    const deger = String(optionValue);

    const seciliMi = seciliDegerler.includes(deger);

    if (!multiple) {
      if (seciliMi) {
        onValueChange([]);
      } else {
        onValueChange([deger]);
      }

      setAcikMi(false);
      setAramaMetni("");

      return;
    }

    if (seciliMi) {
      onValueChange(
        seciliDegerler.filter((mevcutDeger) => mevcutDeger !== deger),
      );

      return;
    }

    onValueChange([...seciliDegerler, deger]);
  }

  function seciliDegerSil(event, silinecekDeger) {
    event.stopPropagation();

    onValueChange(seciliDegerler.filter((deger) => deger !== silinecekDeger));
  }

  const gorunenDegerler = seciliDegerler.slice(0, maxVisibleValues);

  const kalanSecimSayisi = Math.max(
    0,
    seciliDegerler.length - gorunenDegerler.length,
  );

  return (
    <div ref={containerRef}>
      {label && (
        <label
          htmlFor={id}
          className="
            mb-2.5
            block
            text-[13px]
            font-bold
            text-zinc-800
          "
        >
          {label}
        </label>
      )}

      <button
        ref={triggerRef}
        id={id}
        type="button"
        disabled={disabled}
        onClick={dropdownAcKapat}
        className={`
          flex
          min-h-[46px]
          w-full
          items-center
          gap-2
          rounded-xl
          border
          px-3.5
          text-left
          outline-none
          transition-all

          ${
            acikMi
              ? "border-purple-300 bg-white shadow-[0_0_0_3px_rgba(124,58,237,0.06)]"
              : "border-zinc-200 bg-[#fafafa] hover:border-zinc-300 hover:bg-white"
          }

          disabled:cursor-not-allowed
          disabled:bg-zinc-100
          disabled:text-zinc-400
        `}
        aria-expanded={acikMi}
        aria-haspopup="listbox"
      >
        <div
          className="
            flex
            min-w-0
            flex-1
            flex-wrap
            items-center
            gap-1.5
          "
        >
          {gorunenDegerler.length === 0 ? (
            <span
              className="
                truncate
                text-[13px]
                font-medium
                text-zinc-400
              "
            >
              {placeholder}
            </span>
          ) : (
            gorunenDegerler.map((deger) => (
              <span
                key={deger}
                className="
                    inline-flex
                    max-w-[150px]
                    items-center
                    gap-1.5
                    rounded-lg
                    border
                    border-purple-100
                    bg-purple-50
                    px-2
                    py-1
                    text-[11px]
                    font-bold
                    text-purple-700
                  "
              >
                <span className="truncate">{deger}</span>

                <span
                  role="button"
                  tabIndex={0}
                  onClick={(event) => seciliDegerSil(event, deger)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      seciliDegerSil(event, deger);
                    }
                  }}
                  className="
                      flex
                      h-4
                      w-4
                      shrink-0
                      items-center
                      justify-center
                      rounded
                      text-purple-400
                      transition-colors

                      hover:bg-purple-100
                      hover:text-purple-700
                    "
                  aria-label={`${deger} seçimini kaldır`}
                >
                  <CloseIcon />
                </span>
              </span>
            ))
          )}

          {kalanSecimSayisi > 0 && (
            <span
              className="
                rounded-lg
                bg-zinc-100
                px-2
                py-1
                text-[11px]
                font-extrabold
                text-zinc-500
              "
            >
              +{kalanSecimSayisi}
            </span>
          )}
        </div>

        <span
          className={`
            shrink-0
            text-zinc-400
            transition-transform
            duration-200

            ${acikMi ? "rotate-180" : ""}
          `}
        >
          <ChevronDownIcon />
        </span>
      </button>

      {acikMi &&
        konum &&
        createPortal(
          <div
            id={`${id}-multiselect-dropdown`}
            className="
              fixed
              z-[1200]
              overflow-hidden
              rounded-xl
              border
              border-zinc-200
              bg-white
              shadow-[0_18px_50px_rgba(15,23,42,0.16)]
            "
            style={{
              left: konum.left,
              width: konum.width,
              top: konum.top,
              bottom: konum.bottom,
            }}
          >
            {searchable && (
              <div
                className="
                  border-b
                  border-zinc-100
                  p-2
                "
              >
                <div className="relative">
                  <span
                    className="
                      pointer-events-none
                      absolute
                      inset-y-0
                      left-0
                      flex
                      items-center
                      pl-3
                      text-zinc-400
                    "
                  >
                    <SearchIcon />
                  </span>

                  <input
                    ref={searchInputRef}
                    type="text"
                    value={aramaMetni}
                    onChange={(event) => setAramaMetni(event.target.value)}
                    placeholder={searchPlaceholder}
                    className="
                      h-10
                      w-full
                      rounded-lg
                      border
                      border-zinc-200
                      bg-zinc-50
                      pl-9
                      pr-9
                      text-[13px]
                      font-medium
                      text-zinc-800
                      outline-none
                      transition-all

                      placeholder:text-zinc-400

                      focus:border-purple-300
                      focus:bg-white
                      focus:ring-4
                      focus:ring-purple-100
                    "
                  />

                  {aramaMetni && (
                    <button
                      type="button"
                      onClick={() => {
                        setAramaMetni("");

                        searchInputRef.current?.focus();
                      }}
                      className="
                        absolute
                        inset-y-0
                        right-0
                        flex
                        w-9
                        items-center
                        justify-center
                        text-zinc-400

                        hover:text-zinc-700
                      "
                    >
                      <CloseIcon />
                    </button>
                  )}
                </div>
              </div>
            )}

            <div
              className="
                max-h-[260px]
                overflow-y-auto
                py-1
              "
              role="listbox"
              aria-multiselectable={multiple}
            >
              {filtrelenmisSecenekler.length > 0 ? (
                filtrelenmisSecenekler.map((option) => {
                  const deger = String(option.value);

                  const seciliMi = seciliDegerler.includes(deger);

                  return (
                    <button
                      key={deger}
                      type="button"
                      onClick={() => secenekSec(deger)}
                      className={`
                          flex
                          min-h-[42px]
                          w-full
                          items-center
                          gap-3
                          px-3.5
                          py-2.5
                          text-left
                          transition-colors

                          ${
                            seciliMi
                              ? "bg-purple-50 text-purple-700"
                              : "text-zinc-700 hover:bg-zinc-50"
                          }
                        `}
                    >
                      <span
                        className={`
                            flex
                            h-[18px]
                            w-[18px]
                            shrink-0
                            items-center
                            justify-center
                            border

                            ${multiple ? "rounded-[5px]" : "rounded-full"}

                            ${
                              seciliMi
                                ? "border-purple-600 bg-purple-600 text-white"
                                : "border-zinc-300 bg-white"
                            }
                          `}
                      >
                        {seciliMi && <CheckIcon />}
                      </span>

                      <span
                        className="
                            min-w-0
                            flex-1
                            truncate
                            text-[13px]
                            font-semibold
                          "
                      >
                        {option.label}
                      </span>

                      {option.count !== undefined && (
                        <span
                          className="
                              shrink-0
                              rounded-md
                              bg-zinc-100
                              px-2
                              py-1
                              text-[10px]
                              font-bold
                              text-zinc-400
                            "
                        >
                          {option.count}
                        </span>
                      )}
                    </button>
                  );
                })
              ) : (
                <div
                  className="
                    flex
                    min-h-[100px]
                    items-center
                    justify-center
                    px-4
                    text-center
                  "
                >
                  <p
                    className="
                      text-[12px]
                      font-semibold
                      text-zinc-400
                    "
                  >
                    {noResultsText}
                  </p>
                </div>
              )}
            </div>

            {multiple && seciliDegerler.length > 0 && (
              <div
                className="
                    flex
                    items-center
                    justify-between
                    border-t
                    border-zinc-100
                    px-3
                    py-2
                  "
              >
                <span
                  className="
                      text-[11px]
                      font-semibold
                      text-zinc-400
                    "
                >
                  {seciliDegerler.length} seçim
                </span>

                <button
                  type="button"
                  onClick={() => onValueChange([])}
                  className="
                      text-[11px]
                      font-extrabold
                      text-purple-600

                      hover:text-purple-800
                    "
                >
                  Temizle
                </button>
              </div>
            )}
          </div>,
          document.body,
        )}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />

      <path d="m20 20-4-4" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-3.5 w-3.5"
      aria-hidden="true"
    >
      <path d="M7 7l10 10M17 7 7 17" strokeLinecap="round" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="m7 10 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      className="h-3 w-3"
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default MultiSelect;
