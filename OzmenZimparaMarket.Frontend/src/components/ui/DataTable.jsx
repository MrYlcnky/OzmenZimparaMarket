import { useEffect, useMemo, useRef, useState } from "react";

import Select from "./Select";

function DataTable({
  data = [],
  columns = [],

  getRowId = (row) => row.id,

  selectable = false,
  selectedRowIds = [],
  onSelectionChange,
  isRowSelectable = () => true,
  bulkActions,

  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Ara...",

  toolbarRight,

  defaultPageSize = 10,
  pageSizeOptions = [10, 20, 50],

  pageResetKey = "",

  hasActiveFilters = false,
  onClearFilters,

  emptyTitle = "Kayıt bulunamadı",
  emptyDescription = "Gösterilecek herhangi bir kayıt bulunmuyor.",

  noResultTitle = "Sonuç bulunamadı",
  noResultDescription = "Arama veya filtre kriterlerinize uygun kayıt bulunamadı.",

  rowClassName,
  tableMinWidth = "760px",

  paginationMode = "client",

  currentPage: controlledCurrentPage = 1,
  pageSize: controlledPageSize,
  totalItems: controlledTotalItems,
  totalPages: controlledTotalPages,

  onPageChange,
  onPageSizeChange,

  loading = false,
}) {
  const serverSide = paginationMode === "server";

  const [internalPageSize, setInternalPageSize] = useState(defaultPageSize);

  const paginationContextKey = [searchValue, pageResetKey, data.length].join(
    "::",
  );

  const [paginationState, setPaginationState] = useState({
    contextKey: paginationContextKey,
    page: 1,
  });

  const clientCurrentPage =
    paginationState.contextKey === paginationContextKey
      ? paginationState.page
      : 1;

  const pageSize = serverSide
    ? Number(controlledPageSize ?? defaultPageSize)
    : internalPageSize;

  const totalItems = serverSide
    ? Number(controlledTotalItems ?? data.length)
    : data.length;

  const hesaplananTotalPages = Math.max(
    1,
    Math.ceil(totalItems / Math.max(pageSize, 1)),
  );

  const totalPages = serverSide
    ? Math.max(1, Number(controlledTotalPages ?? hesaplananTotalPages))
    : hesaplananTotalPages;

  const requestedCurrentPage = serverSide
    ? Number(controlledCurrentPage ?? 1)
    : clientCurrentPage;

  const safeCurrentPage = Math.min(
    Math.max(requestedCurrentPage, 1),
    totalPages,
  );

  const displayedData = useMemo(() => {
    if (serverSide) {
      return data;
    }

    const startIndex = (safeCurrentPage - 1) * pageSize;

    return data.slice(startIndex, startIndex + pageSize);
  }, [data, serverSide, safeCurrentPage, pageSize]);

  const normalizedSelectedRowIds = useMemo(
    () => (Array.isArray(selectedRowIds) ? selectedRowIds : []),
    [selectedRowIds],
  );

  const selectedRowIdSet = useMemo(
    () => new Set(normalizedSelectedRowIds),
    [normalizedSelectedRowIds],
  );

  const displayedSelectableRows = useMemo(
    () =>
      selectable ? displayedData.filter((row) => isRowSelectable(row)) : [],
    [selectable, displayedData, isRowSelectable],
  );

  const displayedSelectableRowIds = useMemo(
    () => displayedSelectableRows.map((row) => getRowId(row)),
    [displayedSelectableRows, getRowId],
  );

  const selectedDisplayedCount = displayedSelectableRowIds.filter((rowId) =>
    selectedRowIdSet.has(rowId),
  ).length;

  const allDisplayedSelected =
    displayedSelectableRowIds.length > 0 &&
    selectedDisplayedCount === displayedSelectableRowIds.length;

  const someDisplayedSelected =
    selectedDisplayedCount > 0 && !allDisplayedSelected;

  const selectedCount = normalizedSelectedRowIds.length;

  const startItem = totalItems === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1;

  const endItem =
    totalItems === 0
      ? 0
      : Math.min(
          serverSide
            ? startItem + Math.max(displayedData.length - 1, 0)
            : safeCurrentPage * pageSize,
          totalItems,
        );

  const pageNumbers = createPageNumbers(safeCurrentPage, totalPages);

  const hasSearch = Boolean(searchValue?.trim());

  const hasQuery = hasSearch || hasActiveFilters;

  const bulkActionsContent =
    typeof bulkActions === "function"
      ? bulkActions({
          selectedCount,
          selectedRowIds: normalizedSelectedRowIds,
          clearSelection: secimiTemizle,
        })
      : bulkActions;

  function sayfayiDegistir(page) {
    const yeniSayfa = Math.min(Math.max(page, 1), totalPages);

    if (serverSide) {
      onPageChange?.(yeniSayfa);

      return;
    }

    setPaginationState({
      contextKey: paginationContextKey,
      page: yeniSayfa,
    });
  }

  function aramaDegisti(value) {
    if (!serverSide) {
      sayfayiDegistir(1);
    }

    onSearchChange?.(value);
  }

  function aramayiTemizle() {
    if (!serverSide) {
      sayfayiDegistir(1);
    }

    onSearchChange?.("");
  }

  function tumFiltreleriTemizle() {
    if (!serverSide) {
      sayfayiDegistir(1);
    }

    if (hasSearch) {
      onSearchChange?.("");
    }

    onClearFilters?.();
  }

  function sayfaBoyutuDegisti(value) {
    const yeniBoyut = Number(value);

    if (Number.isNaN(yeniBoyut) || yeniBoyut <= 0) {
      return;
    }

    if (serverSide) {
      onPageSizeChange?.(yeniBoyut);

      return;
    }

    setInternalPageSize(yeniBoyut);

    sayfayiDegistir(1);
  }

  function satirSeciminiDegistir(row) {
    if (!selectable || loading || !isRowSelectable(row)) {
      return;
    }

    const rowId = getRowId(row);

    const yeniSecimler = new Set(normalizedSelectedRowIds);

    if (yeniSecimler.has(rowId)) {
      yeniSecimler.delete(rowId);
    } else {
      yeniSecimler.add(rowId);
    }

    onSelectionChange?.(Array.from(yeniSecimler));
  }

  function gorunenSatirlariSec() {
    if (!selectable || loading || displayedSelectableRowIds.length === 0) {
      return;
    }

    const yeniSecimler = new Set(normalizedSelectedRowIds);

    if (allDisplayedSelected) {
      displayedSelectableRowIds.forEach((rowId) => {
        yeniSecimler.delete(rowId);
      });
    } else {
      displayedSelectableRowIds.forEach((rowId) => {
        yeniSecimler.add(rowId);
      });
    }

    onSelectionChange?.(Array.from(yeniSecimler));
  }

  function secimiTemizle() {
    onSelectionChange?.([]);
  }

  return (
    <div
      aria-busy={loading}
      className="
        relative
        overflow-hidden
        rounded-[18px]
        border border-border
        bg-white
        shadow-[0_4px_22px_rgba(24,24,27,0.035)]
      "
    >
      {loading && (
        <div
          className="
            absolute
            left-0 right-0 top-0
            z-20
            h-[2px]
            overflow-hidden
            bg-brand-blue/10
          "
        >
          <div
            className="
              h-full w-1/3
              animate-pulse
              bg-gradient-to-r
              from-brand-blue
              to-brand-purple
            "
          />
        </div>
      )}

      {(onSearchChange || toolbarRight) && (
        <div
          className="
            flex flex-col
            gap-4
            border-b
            border-border
            px-5 py-5
            sm:px-6
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >
          {onSearchChange ? (
            <div
              className="
                relative w-full
                lg:max-w-[380px]
              "
            >
              <div
                className="
                  pointer-events-none
                  absolute inset-y-0
                  left-0
                  flex items-center
                  pl-3.5
                  text-text-muted
                "
              >
                <SearchIcon />
              </div>

              <input
                type="search"
                value={searchValue}
                onChange={(event) => aramaDegisti(event.target.value)}
                placeholder={searchPlaceholder}
                className="
                  h-11 w-full
                  rounded-ui
                  border
                  border-border
                  bg-[#fafafa]
                  pl-10 pr-10
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

              {searchValue && (
                <button
                  type="button"
                  onClick={aramayiTemizle}
                  className="
                    absolute inset-y-0
                    right-0
                    flex w-10
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
          ) : (
            <div />
          )}

          {toolbarRight && (
            <div
              className="
                flex flex-wrap
                items-center
                gap-3
              "
            >
              {toolbarRight}
            </div>
          )}
        </div>
      )}

      {selectable && selectedCount > 0 && (
        <BulkSelectionBar selectedCount={selectedCount} onClear={secimiTemizle}>
          {bulkActionsContent}
        </BulkSelectionBar>
      )}

      {loading && data.length === 0 ? (
        <LoadingState />
      ) : data.length === 0 ? (
        <EmptyState
          title={hasQuery ? noResultTitle : emptyTitle}
          description={hasQuery ? noResultDescription : emptyDescription}
          searchMode={hasQuery}
          onClear={hasQuery ? tumFiltreleriTemizle : undefined}
        />
      ) : (
        <>
          <div
            className={`
              w-full
              overflow-x-auto
              transition-opacity

              ${loading ? "opacity-60" : "opacity-100"}
            `}
          >
            <table
              style={{
                minWidth: tableMinWidth,
              }}
              className="
                w-full
                border-collapse
              "
            >
              <thead>
                <tr
                  className="
                    border-b
                    border-border
                    bg-surface-soft/70
                  "
                >
                  {selectable && (
                    <th
                      scope="col"
                      className="
                        w-[54px]
                        px-5
                        py-3.5
                        text-center
                      "
                    >
                      <SelectionCheckbox
                        checked={allDisplayedSelected}
                        indeterminate={someDisplayedSelected}
                        disabled={
                          loading || displayedSelectableRowIds.length === 0
                        }
                        onChange={gorunenSatirlariSec}
                        ariaLabel="Bu sayfadaki kayıtları seç"
                      />
                    </th>
                  )}

                  {columns.map((column) => (
                    <th
                      key={column.key}
                      scope="col"
                      style={{
                        width: column.width,
                      }}
                      className={`
                          px-5 py-3.5
                          text-left
                          text-[11px]
                          font-extrabold
                          uppercase
                          tracking-[0.08em]
                          text-text-muted
                          ${column.headerClassName ?? ""}
                        `}
                    >
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody
                className="
                  divide-y
                  divide-border
                "
              >
                {displayedData.map((row, rowIndex) => {
                  const rowId = getRowId(row);

                  const secilebilirMi = selectable && isRowSelectable(row);

                  const seciliMi = selectable && selectedRowIdSet.has(rowId);

                  const dynamicRowClass =
                    typeof rowClassName === "function"
                      ? rowClassName(row)
                      : (rowClassName ?? "");

                  return (
                    <tr
                      key={rowId}
                      className={`
                          transition-colors

                          ${
                            seciliMi
                              ? "bg-brand-blue/[0.035]"
                              : "hover:bg-surface-soft/60"
                          }

                          ${dynamicRowClass}
                        `}
                    >
                      {selectable && (
                        <td
                          className="
                              w-[54px]
                              px-5
                              py-4
                              text-center
                              align-middle
                            "
                        >
                          <SelectionCheckbox
                            checked={seciliMi}
                            disabled={loading || !secilebilirMi}
                            onChange={() => satirSeciminiDegistir(row)}
                            ariaLabel={`${rowIndex + 1}. kaydı seç`}
                          />
                        </td>
                      )}

                      {columns.map((column) => (
                        <td
                          key={column.key}
                          className={`
                                px-5 py-4
                                align-middle
                                text-sm
                                text-text-secondary
                                ${column.cellClassName ?? ""}
                              `}
                        >
                          {column.render
                            ? column.render(row, rowIndex)
                            : row[column.key]}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div
            className="
              flex flex-col
              gap-4
              border-t
              border-border
              bg-white
              px-5 py-4
              sm:px-6
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >
            <div
              className="
                flex flex-wrap
                items-center
                gap-4
              "
            >
              <p
                className="
                  text-xs
                  text-text-muted
                "
              >
                <strong
                  className="
                    font-bold
                    text-text-primary
                  "
                >
                  {startItem}–{endItem}
                </strong>{" "}
                / {totalItems} kayıt
              </p>

              <div
                className="
                  flex items-center
                  gap-2
                "
              >
                <span
                  className="
                    whitespace-nowrap
                    text-xs
                    text-text-muted
                  "
                >
                  Sayfa başına
                </span>

                <div className="w-[88px]">
                  <Select
                    value={String(pageSize)}
                    options={pageSizeOptions.map((option) => ({
                      value: String(option),
                      label: String(option),
                    }))}
                    onValueChange={sayfaBoyutuDegisti}
                  />
                </div>
              </div>
            </div>

            {totalPages > 1 && (
              <nav
                aria-label="Sayfalama"
                className="
                  flex flex-wrap
                  items-center
                  gap-1
                "
              >
                <PaginationButton
                  disabled={safeCurrentPage === 1 || loading}
                  onClick={() => sayfayiDegistir(safeCurrentPage - 1)}
                  ariaLabel="Önceki sayfa"
                >
                  <ChevronLeftIcon />
                </PaginationButton>

                {pageNumbers.map((page, index) =>
                  page === "..." ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="
                          flex h-9
                          min-w-9
                          items-center
                          justify-center
                          px-2
                          text-xs
                          text-text-muted
                        "
                      aria-hidden="true"
                    >
                      ...
                    </span>
                  ) : (
                    <PaginationButton
                      key={page}
                      active={page === safeCurrentPage}
                      disabled={loading}
                      onClick={() => sayfayiDegistir(page)}
                      ariaLabel={`${page}. sayfa`}
                      ariaCurrent={page === safeCurrentPage}
                    >
                      {page}
                    </PaginationButton>
                  ),
                )}

                <PaginationButton
                  disabled={safeCurrentPage === totalPages || loading}
                  onClick={() => sayfayiDegistir(safeCurrentPage + 1)}
                  ariaLabel="Sonraki sayfa"
                >
                  <ChevronRightIcon />
                </PaginationButton>
              </nav>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function BulkSelectionBar({ selectedCount, onClear, children }) {
  return (
    <div
      className="
        flex
        flex-col
        gap-3
        border-b
        border-brand-blue/10
        bg-gradient-to-r
        from-brand-blue/[0.055]
        via-brand-purple/[0.025]
        to-transparent
        px-5
        py-3.5
        sm:px-6
        lg:flex-row
        lg:items-center
        lg:justify-between
      "
    >
      <div
        className="
          flex
          flex-wrap
          items-center
          gap-3
        "
      >
        <div
          className="
            flex
            h-8
            min-w-8
            items-center
            justify-center
            rounded-full
            bg-brand-blue
            px-2.5
            text-xs
            font-extrabold
            text-white
            shadow-[0_4px_12px_rgba(37,99,235,0.18)]
          "
        >
          {selectedCount}
        </div>

        <div>
          <p
            className="
              text-sm
              font-extrabold
              text-text-primary
            "
          >
            {selectedCount} kayıt seçildi
          </p>

          <p
            className="
              mt-0.5
              text-[11px]
              text-text-muted
            "
          >
            Seçili kayıtlara toplu işlem uygulayabilirsiniz.
          </p>
        </div>
      </div>

      <div
        className="
          flex
          flex-wrap
          items-center
          gap-2
        "
      >
        <button
          type="button"
          onClick={onClear}
          className="
            inline-flex
            h-9
            items-center
            justify-center
            rounded-ui
            border
            border-border
            bg-white
            px-3.5
            text-xs
            font-bold
            text-text-secondary
            transition-all
            hover:border-brand-blue/20
            hover:text-brand-blue
          "
        >
          Seçimi Temizle
        </button>

        {children}
      </div>
    </div>
  );
}

function SelectionCheckbox({
  checked = false,
  indeterminate = false,
  disabled = false,
  onChange,
  ariaLabel,
}) {
  const checkboxRef = useRef(null);

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = Boolean(indeterminate);
    }
  }, [indeterminate]);

  return (
    <label
      className={`
        inline-flex
        items-center
        justify-center

        ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      <input
        ref={checkboxRef}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        aria-label={ariaLabel}
        className="
          peer
          sr-only
        "
      />

      <span
        aria-hidden="true"
        className={`
          flex
          h-[18px]
          w-[18px]
          items-center
          justify-center
          rounded-[5px]
          border
          transition-all

          ${
            checked || indeterminate
              ? `
                border-brand-blue
                bg-brand-blue
                text-white
                shadow-[0_2px_7px_rgba(37,99,235,0.18)]
              `
              : `
                border-[#cbd5e1]
                bg-white
                text-transparent
              `
          }

          ${
            disabled
              ? "opacity-40"
              : `
                peer-focus-visible:ring-4
                peer-focus-visible:ring-brand-blue/15
              `
          }
        `}
      >
        {indeterminate ? <MinusIcon /> : <CheckIcon />}
      </span>
    </label>
  );
}

function LoadingState() {
  return (
    <div
      className="
        px-6 py-16
        text-center
      "
    >
      <div
        className="
          mx-auto
          h-8 w-8
          animate-spin
          rounded-full
          border-[3px]
          border-brand-blue/15
          border-t-brand-blue
        "
      />

      <p
        className="
          mt-4
          text-sm
          font-bold
          text-text-secondary
        "
      >
        Kayıtlar yükleniyor...
      </p>
    </div>
  );
}

function EmptyState({ title, description, searchMode, onClear }) {
  return (
    <div
      className="
        px-6 py-16
        text-center
      "
    >
      <div
        className="
          mx-auto flex
          h-12 w-12
          items-center
          justify-center
          rounded-full
          bg-surface-soft
          text-text-muted
        "
      >
        {searchMode ? <SearchIcon /> : <DatabaseIcon />}
      </div>

      <h3
        className="
          mt-4
          text-base
          font-extrabold
          text-text-primary
        "
      >
        {title}
      </h3>

      <p
        className="
          mx-auto mt-2
          max-w-md
          text-sm
          leading-6
          text-text-muted
        "
      >
        {description}
      </p>

      {onClear && (
        <button
          type="button"
          onClick={onClear}
          className="
            mt-4
            text-sm
            font-bold
            text-brand-blue
            hover:underline
          "
        >
          Filtreleri temizle
        </button>
      )}
    </div>
  );
}

function PaginationButton({
  children,
  active = false,
  disabled = false,
  onClick,
  ariaLabel,
  ariaCurrent = false,
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-current={ariaCurrent ? "page" : undefined}
      className={`
        flex h-9
        min-w-9
        items-center
        justify-center
        rounded-ui
        border
        px-2.5
        text-xs
        font-bold
        transition-all

        disabled:cursor-not-allowed
        disabled:opacity-40

        ${
          active
            ? `
              border-brand-blue
              bg-brand-blue
              text-white
              shadow-[0_5px_15px_rgba(37,99,235,0.18)]
            `
            : `
              border-border
              bg-white
              text-text-secondary
              hover:border-brand-blue/30
              hover:bg-brand-blue/[0.04]
              hover:text-brand-blue
            `
        }
      `}
    >
      {children}
    </button>
  );
}

function createPageNumbers(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from(
      {
        length: totalPages,
      },
      (_, index) => index + 1,
    );
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "...", totalPages];
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      "...",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
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

function ChevronLeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
    </svg>
  );
}

function DatabaseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <ellipse cx="12" cy="5" rx="8" ry="3" />

      <path
        d="
          M4 5v6
          c0 1.7 3.6 3 8 3
          s8-1.3 8-3V5
        "
      />

      <path
        d="
          M4 11v6
          c0 1.7 3.6 3 8 3
          s8-1.3 8-3v-6
        "
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      className="h-3 w-3"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m5 12 4 4 10-10" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      className="h-3 w-3"
      aria-hidden="true"
    >
      <path strokeLinecap="round" d="M6 12h12" />
    </svg>
  );
}

export default DataTable;
