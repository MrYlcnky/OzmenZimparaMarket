import { useMemo, useRef, useState } from "react";

import * as RadixSelect from "@radix-ui/react-select";
import * as ScrollArea from "@radix-ui/react-scroll-area";

const BOS_DEGER = "__bos_deger__";

function metniNormalizeEt(deger) {
  return String(deger ?? "")
    .trim()
    .toLocaleLowerCase("tr-TR");
}

function Select({
  id,
  label,
  value,
  onValueChange,

  options = [],

  placeholder = "Seçiniz",
  emptyLabel,

  hata,
  aciklama,

  required = false,
  disabled = false,

  searchable = false,
  searchPlaceholder = "Ara...",
  noResultsText = "Sonuç bulunamadı",
}) {
  const [aramaMetni, setAramaMetni] = useState("");

  const searchInputRef = useRef(null);

  const radixValue =
    value === "" || value === null || value === undefined
      ? BOS_DEGER
      : String(value);

  const tumSecenekler = useMemo(() => {
    const sonuc = [];

    if (emptyLabel) {
      sonuc.push({
        value: BOS_DEGER,
        label: emptyLabel,
        disabled: false,
        emphasized: false,
        bold: false,
      });
    }

    options.forEach((option) => {
      sonuc.push({
        ...option,
        value: String(option.value),
        bold: option.bold === true,
      });
    });

    return sonuc;
  }, [options, emptyLabel]);

  const filtrelenmisSecenekler = useMemo(() => {
    if (!searchable) {
      return tumSecenekler;
    }

    const arama = metniNormalizeEt(aramaMetni);

    if (!arama) {
      return tumSecenekler;
    }

    return tumSecenekler.filter((option) => {
      const aranabilirMetin = [option.label, option.searchText]
        .map(metniNormalizeEt)
        .join(" ");

      return aranabilirMetin.includes(arama);
    });
  }, [tumSecenekler, searchable, aramaMetni]);

  /*
   * Az seçenek varsa liste gereksiz yere 220px olmaz.
   * Çok seçenek olduğunda 220px'de sınırlandırılır
   * ve ScrollArea devreye girer.
   */
  const listeYuksekligi = Math.min(
    Math.max(filtrelenmisSecenekler.length * 41, 100),
    220,
  );

  function degerDegisti(yeniDeger) {
    if (yeniDeger === BOS_DEGER) {
      onValueChange("");
      return;
    }

    onValueChange(yeniDeger);
  }

  function aciklikDegisti(open) {
    if (!open) {
      setAramaMetni("");
      return;
    }

    setAramaMetni("");

    if (searchable) {
      requestAnimationFrame(() => {
        searchInputRef.current?.focus();
      });
    }
  }

  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          className="
            flex
            items-center
            gap-1
            text-[13px]
            font-bold
            text-text-primary
          "
        >
          {label}

          {required && <span className="text-danger">*</span>}
        </label>
      )}

      <RadixSelect.Root
        value={radixValue}
        onValueChange={degerDegisti}
        onOpenChange={aciklikDegisti}
        disabled={disabled}
      >
        <RadixSelect.Trigger
          id={id}
          aria-invalid={hata ? "true" : undefined}
          className={`
            ${label ? "mt-2.5" : ""}

            flex
            h-11
            w-full
            items-center
            justify-between
            gap-3

            rounded-ui

            border
            px-3.5

            text-left
            text-sm

            outline-none
            transition-all
            duration-200

            disabled:cursor-not-allowed
            disabled:opacity-60

            ${
              hata
                ? `
                  border-danger/60
                  bg-danger/[0.025]
                  text-text-primary

                  focus:border-danger
                  focus:ring-4
                  focus:ring-danger/10
                `
                : `
                  border-border
                  bg-[#fafafa]
                  text-text-primary

                  hover:border-[#d4d4d8]
                  hover:bg-white

                  focus:border-brand-blue
                  focus:bg-white
                  focus:ring-4
                  focus:ring-brand-blue/10
                `
            }

            data-[placeholder]:text-text-muted
          `}
        >
          <RadixSelect.Value placeholder={placeholder} />

          <RadixSelect.Icon
            className="
              shrink-0
              text-text-muted
            "
          >
            <ChevronDownIcon />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>

        <RadixSelect.Portal>
          <RadixSelect.Content
            position="popper"
            sideOffset={6}
            collisionPadding={12}
            className="
              z-[1000]

              w-[var(--radix-select-trigger-width)]

              overflow-hidden

              rounded-ui

              border
              border-border

              bg-white

              shadow-[0_18px_50px_rgba(15,23,42,0.16)]
            "
          >
            {searchable && (
              <div
                className="
                  border-b
                  border-border
                  bg-white
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
                      text-text-muted
                    "
                  >
                    <SearchIcon />
                  </span>

                  <input
                    ref={searchInputRef}
                    type="text"
                    value={aramaMetni}
                    onChange={(event) => setAramaMetni(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key !== "Escape") {
                        event.stopPropagation();
                      }
                    }}
                    placeholder={searchPlaceholder}
                    className="
                      h-10
                      w-full

                      rounded-ui

                      border
                      border-border

                      bg-[#fafafa]

                      pl-9
                      pr-9

                      text-sm
                      text-text-primary

                      outline-none
                      transition-all

                      placeholder:text-text-muted

                      hover:border-[#d4d4d8]

                      focus:border-brand-blue
                      focus:bg-white
                      focus:ring-4
                      focus:ring-brand-blue/10
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

                        text-text-muted

                        transition-colors

                        hover:text-text-primary
                      "
                      aria-label="Aramayı temizle"
                    >
                      <CloseIcon />
                    </button>
                  )}
                </div>
              </div>
            )}

            {filtrelenmisSecenekler.length > 0 ? (
              <ScrollArea.Root
                type="always"
                className="
    relative
    w-full
    overflow-hidden
    bg-white
  "
                style={{
                  height: `${listeYuksekligi}px`,
                }}
              >
                <ScrollArea.Viewport
                  className="
      h-full
      w-full
    "
                >
                  <RadixSelect.Viewport
                    className="
        w-full
      "
                  >
                    <div className="min-w-full">
                      {filtrelenmisSecenekler.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                          disabled={option.disabled}
                          emphasized={option.emphasized}
                          bold={option.bold}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </div>
                  </RadixSelect.Viewport>
                </ScrollArea.Viewport>

                <ScrollArea.Scrollbar
                  orientation="vertical"
                  className="
      z-10

      flex
      w-[10px]

      touch-none
      select-none

      border-l
      border-slate-200/70

      bg-slate-100

      p-[2px]

      transition-colors
    "
                >
                  <ScrollArea.Thumb
                    className="
        relative
        min-h-8
        flex-1

        rounded-full

        bg-slate-400

        transition-colors

        hover:bg-slate-500
      "
                  />
                </ScrollArea.Scrollbar>
              </ScrollArea.Root>
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
                <div>
                  <div
                    className="
                      mx-auto
                      flex
                      h-8 w-8
                      items-center
                      justify-center
                      rounded-full
                      bg-surface-soft
                      text-text-muted
                    "
                  >
                    <SearchIcon />
                  </div>

                  <p
                    className="
                      mt-2
                      text-xs
                      font-semibold
                      text-text-muted
                    "
                  >
                    {noResultsText}
                  </p>
                </div>
              </div>
            )}
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>

      {aciklama && !hata && (
        <p
          className="
            mt-2
            text-xs
            leading-5
            text-text-muted
          "
        >
          {aciklama}
        </p>
      )}

      {hata && (
        <p
          className="
            mt-2
            text-xs
            font-semibold
            text-danger
          "
        >
          {hata}
        </p>
      )}
    </div>
  );
}

function SelectItem({
  children,
  value,
  disabled = false,
  emphasized = false,
  bold = false,
}) {
  return (
    <RadixSelect.Item
      value={value}
      disabled={disabled}
      style={{
        borderRadius: 0,
      }}
      className={`
        relative

        flex
        min-h-[41px]
        w-full

        cursor-pointer
        select-none

        items-center

        !rounded-none

        border-b
        border-border/50

        px-4
        py-2.5
        pl-10

        text-sm
        leading-5

        outline-none
        transition-colors

        last:border-b-0

        data-[highlighted]:!rounded-none
        data-[highlighted]:bg-brand-blue/[0.08]
        data-[highlighted]:text-brand-blue

        data-[state=checked]:!rounded-none
        data-[state=checked]:bg-brand-blue/[0.10]
        data-[state=checked]:text-text-primary

        data-[disabled]:pointer-events-none
        data-[disabled]:opacity-40

        ${
          emphasized
            ? `
              bg-purple-100
              font-extrabold
              text-text-primary
            `
            : bold
              ? `
                bg-white
                font-extrabold
                text-text-primary
              `
              : `
                bg-white
                font-medium
                text-text-secondary
              `
        }
      `}
    >
      <span
        className="
          absolute
          left-4

          flex
          h-4 w-4

          items-center
          justify-center

          text-brand-blue
        "
      >
        <RadixSelect.ItemIndicator>
          <CheckIcon />
        </RadixSelect.ItemIndicator>
      </span>

      <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
    </RadixSelect.Item>
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

      <path strokeLinecap="round" d="m20 20-4-4" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path strokeLinecap="round" d="M7 7l10 10M17 7 7 17" />
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
      <path strokeLinecap="round" strokeLinejoin="round" d="m7 10 5 5 5-5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m5 12 4 4L19 6" />
    </svg>
  );
}

export default Select;
