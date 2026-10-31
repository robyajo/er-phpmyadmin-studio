import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  BarChart3,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardCopy,
  Code2,
  Copy,
  CornerDownRight,
  Edit,
  Eye,
  FileCode2,
  FileDown,
  HelpCircle,
  MinusCircle,
  Play,
  Printer,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Table as TableIcon,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { QueryResultData } from "@/types/workspace";
import { cn } from "@/utils/tailwind";

interface BrowseTabProps {
  currentSelectedDatabase: string;
  isExecutingQuery: boolean;
  onCopyRow: (row: any) => void;
  onCreatePhpCode: () => void;
  onCreateView: () => void;
  onDeleteRow: (row: any) => void;
  onDeleteSelectedRows: (selectedRows: any[]) => void;
  onDisplayChart: () => void;
  onEditRow: (row: any) => void;
  onExecuteQuery: (overrideQuery?: string) => void;
  onExplainSql: () => void;
  onExportCurrentResults: () => void;
  onOpenInsertModal: (tableName: string) => void;
  onPrintResults: () => void;
  onSwitchToSqlTab: () => void;
  onUpdateCellInline?: (row: any, column: string, newValue: any) => Promise<void>;
  queryResults: QueryResultData | null;
  selectedTable: string;
  setSqlQuery: (query: string) => void;
  sqlQuery: string;
}

export function BrowseTab({
  currentSelectedDatabase,
  isExecutingQuery,
  onCopyRow,
  onCreatePhpCode,
  onCreateView,
  onDeleteRow,
  onDeleteSelectedRows,
  onDisplayChart,
  onEditRow,
  onExecuteQuery,
  onExplainSql,
  onExportCurrentResults,
  onOpenInsertModal,
  onPrintResults,
  onSwitchToSqlTab,
  onUpdateCellInline,
  queryResults,
  selectedTable,
  setSqlQuery,
  sqlQuery,
}: BrowseTabProps) {
  // Query options & inline editing
  const [isInlineEditOpen, setIsInlineEditOpen] = useState(false);
  const [inlineSqlDraft, setInlineSqlDraft] = useState(sqlQuery);
  const [showProfiling, setShowProfiling] = useState(false);

  // Pagination & filtering
  const [filterText, setFilterText] = useState("");
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [showAllRows, setShowAllRows] = useState(false);
  const [pageSize, setPageSize] = useState<number>(25);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showExtraOptions, setShowExtraOptions] = useState(false);

  // Row selection
  const [selectedRowIndices, setSelectedRowIndices] = useState<number[]>([]);

  // Inline cell editing state: { rowIndex, column, originalValue, draftValue }
  const [editingCell, setEditingCell] = useState<{
    col: string;
    originalVal: any;
    rIdx: number;
    val: string;
  } | null>(null);

  // Synchronize draft query when sqlQuery changes
  React.useEffect(() => {
    setInlineSqlDraft(sqlQuery);
  }, [sqlQuery]);

  // Client-side filtering & sorting
  const processedRows = useMemo(() => {
    if (!queryResults?.rows) return [];
    let list = [...queryResults.rows];

    if (filterText.trim()) {
      const q = filterText.toLowerCase();
      list = list.filter((r) =>
        Object.values(r).some((v) =>
          String(v ?? "")
            .toLowerCase()
            .includes(q)
        )
      );
    }

    if (sortCol) {
      list.sort((a, b) => {
        const valA = a[sortCol];
        const valB = b[sortCol];
        if (valA === valB) return 0;
        if (valA === null || valA === undefined) return 1;
        if (valB === null || valB === undefined) return -1;
        const res = valA > valB ? 1 : -1;
        return sortDir === "asc" ? res : -res;
      });
    }

    return list;
  }, [queryResults?.rows, filterText, sortCol, sortDir]);

  // Paginated rows
  const paginatedRows = useMemo(() => {
    if (showAllRows) return processedRows;
    const start = (currentPage - 1) * pageSize;
    return processedRows.slice(start, start + pageSize);
  }, [processedRows, showAllRows, currentPage, pageSize]);

  const totalPages = Math.ceil(processedRows.length / pageSize) || 1;
  const startRowIndex = showAllRows
    ? 0
    : (currentPage - 1) * pageSize;
  const endRowIndex = showAllRows
    ? processedRows.length
    : Math.min(startRowIndex + pageSize, processedRows.length);

  const handleSort = (col: string) => {
    if (sortCol === col) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortCol(col);
      setSortDir("asc");
    }
  };

  const handleSelectAllRows = (checked: boolean) => {
    if (checked) {
      setSelectedRowIndices(paginatedRows.map((_, i) => i));
    } else {
      setSelectedRowIndices([]);
    }
  };

  const handleToggleRowSelection = (index: number) => {
    setSelectedRowIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleCopyClipboardTsv = async () => {
    try {
      if (!queryResults?.columns || processedRows.length === 0) {
        toast.error("Tidak ada data untuk disalin.");
        return;
      }
      const cols = queryResults.columns;
      const header = cols.join("\t");
      const lines = processedRows.map((r) =>
        cols.map((c) => (r[c] === null || r[c] === undefined ? "NULL" : String(r[c]))).join("\t")
      );
      const tsvData = [header, ...lines].join("\n");
      await navigator.clipboard.writeText(tsvData);
      toast.success(`${processedRows.length} baris disalin ke papan klip sebagai TSV!`);
    } catch (err: any) {
      toast.error("Gagal menyalin data ke papan klip", {
        description: err?.message || String(err),
      });
    }
  };

  const handleSaveInlineCell = async () => {
    if (!editingCell || !onUpdateCellInline) {
      setEditingCell(null);
      return;
    }
    try {
      const row = paginatedRows[editingCell.rIdx];
      await onUpdateCellInline(row, editingCell.col, editingCell.val);
    } catch (err: any) {
      toast.error("Gagal memperbarui sel inline", {
        description: err?.message || String(err),
      });
    } finally {
      setEditingCell(null);
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-background">
      {/* 1. Green Query Feedback Banner (phpMyAdmin style) */}
      <div className="shrink-0 border-b border-emerald-500/20 bg-emerald-50/80 px-4 py-2.5 text-xs text-emerald-900 dark:border-emerald-800/40 dark:bg-emerald-950/30 dark:text-emerald-300">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span className="font-sans font-medium">
            Showing rows {startRowIndex} - {Math.max(0, endRowIndex - 1)} (
            {processedRows.length} total, Query took{" "}
            {(queryResults?.executionTimeMs ?? 1) / 1000} seconds.)
          </span>
        </div>
      </div>

      {/* 2. SQL Query Display Box with inline actions */}
      <div className="shrink-0 border-b border-border bg-card p-3">
        <div className="relative rounded border border-border bg-background p-2.5 font-mono text-xs text-foreground shadow-2xs">
          <div className="flex items-start justify-between gap-2">
            <div className="select-text whitespace-pre-wrap font-mono text-xs">
              <span className="font-bold text-purple-600 dark:text-purple-400">SELECT</span> *{" "}
              <span className="font-bold text-purple-600 dark:text-purple-400">FROM</span>{" "}
              <span className="text-emerald-600 dark:text-emerald-400">`{selectedTable}`</span>
              {sortCol && (
                <>
                  {" "}
                  <span className="font-bold text-purple-600 dark:text-purple-400">ORDER BY</span>{" "}
                  `{sortCol}` {sortDir.toUpperCase()}
                </>
              )}
              {!showAllRows && (
                <>
                  {" "}
                  <span className="font-bold text-purple-600 dark:text-purple-400">LIMIT</span>{" "}
                  {startRowIndex}, {pageSize}
                </>
              )}
              ;
            </div>
          </div>
        </div>

        {/* Options row below query */}
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
          <label className="flex cursor-pointer items-center gap-1 hover:text-foreground">
            <input
              checked={showProfiling}
              className="rounded border-border text-primary"
              onChange={(e) => setShowProfiling(e.target.checked)}
              type="checkbox"
            />
            <span>Profiling</span>
          </label>

          <span className="text-muted-foreground/40">[</span>
          <button
            className="cursor-pointer text-primary hover:underline"
            onClick={() => setIsInlineEditOpen(!isInlineEditOpen)}
            type="button"
          >
            Edit inline
          </button>
          <span className="text-muted-foreground/40">]</span>

          <span className="text-muted-foreground/40">[</span>
          <button
            className="cursor-pointer text-primary hover:underline"
            onClick={onSwitchToSqlTab}
            type="button"
          >
            Edit
          </button>
          <span className="text-muted-foreground/40">]</span>

          <span className="text-muted-foreground/40">[</span>
          <button
            className="cursor-pointer text-primary hover:underline"
            onClick={onExplainSql}
            type="button"
          >
            Explain SQL
          </button>
          <span className="text-muted-foreground/40">]</span>

          <span className="text-muted-foreground/40">[</span>
          <button
            className="cursor-pointer text-primary hover:underline"
            onClick={onCreatePhpCode}
            type="button"
          >
            Create PHP code
          </button>
          <span className="text-muted-foreground/40">]</span>

          <span className="text-muted-foreground/40">[</span>
          <button
            className="cursor-pointer text-primary hover:underline"
            onClick={() => onExecuteQuery()}
            type="button"
          >
            Refresh
          </button>
          <span className="text-muted-foreground/40">]</span>
        </div>

        {/* Inline SQL Editor Collapse */}
        {isInlineEditOpen && (
          <div className="mt-2.5 space-y-2 rounded border border-border bg-muted/30 p-2.5">
            <textarea
              className="h-20 w-full resize-none rounded border border-border bg-background p-2 font-mono text-xs text-foreground focus:outline-none"
              onChange={(e) => setInlineSqlDraft(e.target.value)}
              value={inlineSqlDraft}
            />
            <div className="flex items-center justify-end gap-2">
              <Button
                className="h-6.5 text-[11px] cursor-pointer"
                onClick={() => setIsInlineEditOpen(false)}
                size="sm"
                variant="outline"
              >
                Batal
              </Button>
              <Button
                className="h-6.5 bg-primary text-[11px] font-semibold text-primary-foreground hover:bg-primary/90 cursor-pointer"
                disabled={isExecutingQuery}
                onClick={() => {
                  setSqlQuery(inlineSqlDraft);
                  onExecuteQuery(inlineSqlDraft);
                  setIsInlineEditOpen(false);
                }}
                size="sm"
              >
                <Play className="mr-1" size={10} />
                Jalankan (Go)
              </Button>
            </div>
          </div>
        )}

        {/* Profiling Info Collapse */}
        {showProfiling && (
          <div className="mt-2.5 rounded border border-border bg-muted/30 p-2.5 text-[11px] font-mono">
            <div className="font-semibold text-foreground mb-1">
              Statistik Profiling Eksekusi:
            </div>
            <div className="grid grid-cols-2 gap-2 text-muted-foreground sm:grid-cols-4">
              <div>Waktu Eksekusi: {queryResults?.executionTimeMs ?? 0} ms</div>
              <div>Jumlah Baris: {queryResults?.rowCount ?? 0}</div>
              <div>Koneksi: TCP Socket 3306</div>
              <div>Status Server: OK (Query Executed)</div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Filter & Sort Toolbar (phpMyAdmin style) */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-border bg-card px-3 py-1.5 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex cursor-pointer items-center gap-1.5 font-medium text-foreground">
            <input
              checked={showAllRows}
              className="rounded border-border text-primary"
              onChange={(e) => {
                setShowAllRows(e.target.checked);
                setCurrentPage(1);
              }}
              type="checkbox"
            />
            <span>Show all</span>
          </label>

          <div className="flex items-center gap-1 text-muted-foreground">
            <span>Number of rows:</span>
            <select
              className="h-6.5 rounded border border-border bg-background px-1.5 font-mono text-[11px] text-foreground focus:outline-none"
              disabled={showAllRows}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              value={pageSize}
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={250}>250</option>
              <option value={500}>500</option>
            </select>
          </div>

          <div className="flex items-center gap-1 text-muted-foreground">
            <span>Filter rows:</span>
            <div className="relative">
              <Search
                className="absolute top-1.5 left-1.5 text-muted-foreground/60"
                size={11}
              />
              <Input
                className="h-6.5 w-44 rounded border-border bg-background pr-2 pl-6 text-[11px] text-foreground placeholder:text-muted-foreground/60 sm:w-56"
                onChange={(e) => {
                  setFilterText(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search this table"
                value={filterText}
              />
            </div>
          </div>

          <div className="flex items-center gap-1 text-muted-foreground">
            <span>Sort by key:</span>
            <select
              className="h-6.5 rounded border border-border bg-background px-1.5 font-mono text-[11px] text-foreground focus:outline-none"
              onChange={(e) => {
                const val = e.target.value;
                if (val === "None") {
                  setSortCol(null);
                } else {
                  setSortCol(val);
                  setSortDir("asc");
                }
              }}
              value={sortCol || "None"}
            >
              <option value="None">None</option>
              {queryResults?.columns.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Button
          className="h-6.5 border-border bg-muted/40 text-[11px] text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
          onClick={() => setShowExtraOptions(!showExtraOptions)}
          size="sm"
          variant="outline"
        >
          Extra options
        </Button>
      </div>

      {/* Extra options box */}
      {showExtraOptions && (
        <div className="shrink-0 border-b border-border bg-muted/20 p-2 text-xs">
          <div className="flex items-center gap-4 text-muted-foreground">
            <span className="font-semibold text-foreground">Tampilan:</span>
            <label className="flex cursor-pointer items-center gap-1">
              <input defaultChecked type="checkbox" className="rounded border-border text-primary" />
              <span>Wrap text panjang</span>
            </label>
            <label className="flex cursor-pointer items-center gap-1">
              <input defaultChecked type="checkbox" className="rounded border-border text-primary" />
              <span>Sorot baris aktif</span>
            </label>
            <label className="flex cursor-pointer items-center gap-1">
              <input defaultChecked type="checkbox" className="rounded border-border text-primary" />
              <span>Tampilkan tipe NULL jelas</span>
            </label>
          </div>
        </div>
      )}

      {/* 4. Real Data Table Grid */}
      <div className="flex-1 overflow-auto bg-background">
        {queryResults && queryResults.columns.length > 0 ? (
          <table className="w-full min-w-[700px] border-collapse text-left font-mono text-xs">
            <thead>
              <tr className="sticky top-0 z-10 border-b border-border bg-muted/60 text-muted-foreground shadow-2xs">
                {/* Navigation controls <- T -> */}
                <th className="w-16 px-2 py-2 text-center select-none font-sans font-bold">
                  <div className="flex items-center justify-center gap-1 text-[11px]">
                    <button
                      className="cursor-pointer text-muted-foreground hover:text-foreground disabled:opacity-30"
                      disabled={currentPage <= 1 || showAllRows}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      title="Previous Page"
                      type="button"
                    >
                      ←
                    </button>
                    <button
                      className="cursor-pointer font-bold text-primary hover:underline"
                      onClick={() => {
                        const elem = document.querySelector(".overflow-auto");
                        if (elem) elem.scrollTop = 0;
                      }}
                      title="Top of Table"
                      type="button"
                    >
                      T
                    </button>
                    <button
                      className="cursor-pointer text-muted-foreground hover:text-foreground disabled:opacity-30"
                      disabled={currentPage >= totalPages || showAllRows}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      title="Next Page"
                      type="button"
                    >
                      →
                    </button>
                  </div>
                </th>

                {/* Checkbox select all on page */}
                <th className="w-8 px-2 py-2 text-center">
                  <input
                    checked={
                      paginatedRows.length > 0 &&
                      selectedRowIndices.length === paginatedRows.length
                    }
                    className="cursor-pointer rounded border-border text-primary"
                    onChange={(e) => handleSelectAllRows(e.target.checked)}
                    type="checkbox"
                  />
                </th>

                {/* Row Action Header */}
                <th className="px-2 py-2 text-center font-semibold text-muted-foreground font-sans">
                  Action
                </th>

                {/* Columns */}
                {queryResults.columns.map((col) => (
                  <th
                    className="cursor-pointer select-none whitespace-nowrap px-3 py-2 font-medium hover:text-foreground"
                    key={col}
                    onClick={() => handleSort(col)}
                  >
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-foreground/90">{col}</span>
                      {sortCol === col ? (
                        sortDir === "asc" ? (
                          <ArrowUp className="text-emerald-500" size={11} />
                        ) : (
                          <ArrowDown className="text-emerald-500" size={11} />
                        )
                      ) : (
                        <ArrowUpDown
                          className="opacity-40 hover:opacity-100"
                          size={11}
                        />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-border/50 text-foreground">
              {paginatedRows.map((row, rIdx) => {
                const isSelected = selectedRowIndices.includes(rIdx);
                return (
                  <tr
                    className={cn(
                      "transition-colors hover:bg-muted/50",
                      isSelected && "bg-primary/5"
                    )}
                    key={rIdx}
                  >
                    {/* Index or Row Number */}
                    <td className="px-2 py-1.5 text-center text-[10px] text-muted-foreground/60 select-none">
                      {startRowIndex + rIdx + 1}
                    </td>

                    {/* Row Checkbox */}
                    <td className="px-2 py-1.5 text-center">
                      <input
                        checked={isSelected}
                        className="cursor-pointer rounded border-border text-primary"
                        onChange={() => handleToggleRowSelection(rIdx)}
                        type="checkbox"
                      />
                    </td>

                    {/* Action buttons: Edit, Copy, Delete */}
                    <td className="px-2 py-1.5 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-xs">
                        {/* Edit Button */}
                        <button
                          className="flex cursor-pointer items-center gap-1 text-[11px] text-primary hover:underline"
                          onClick={() => onEditRow(row)}
                          title="Edit baris data ini"
                          type="button"
                        >
                          <Edit className="text-amber-500" size={12} />
                          <span>Edit</span>
                        </button>

                        {/* Copy Button */}
                        <button
                          className="flex cursor-pointer items-center gap-1 text-[11px] text-primary hover:underline"
                          onClick={() => onCopyRow(row)}
                          title="Duplikasi baris ini (Copy)"
                          type="button"
                        >
                          <Copy className="text-indigo-500" size={12} />
                          <span>Copy</span>
                        </button>

                        {/* Delete Button */}
                        <button
                          className="flex cursor-pointer items-center gap-1 text-[11px] text-destructive hover:underline"
                          onClick={() => onDeleteRow(row)}
                          title="Hapus baris data ini"
                          type="button"
                        >
                          <MinusCircle className="text-destructive" size={12} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>

                    {/* Data Cells */}
                    {queryResults.columns.map((col) => {
                      const val = row[col];
                      const isEditingThisCell =
                        editingCell &&
                        editingCell.rIdx === rIdx &&
                        editingCell.col === col;

                      return (
                        <td
                          className="max-w-xs truncate px-3 py-1.5 font-mono text-[11px]"
                          key={col}
                          onDoubleClick={() => {
                            setEditingCell({
                              col,
                              originalVal: val,
                              rIdx,
                              val: val === null || val === undefined ? "" : String(val),
                            });
                          }}
                          title={
                            val !== null && val !== undefined
                              ? `${String(val)} (Klik ganda untuk mengedit)`
                              : "NULL (Klik ganda untuk mengedit)"
                          }
                        >
                          {isEditingThisCell ? (
                            <div className="flex items-center gap-1">
                              <input
                                autoFocus
                                className="h-6 w-full rounded border border-primary bg-background px-1.5 font-mono text-xs text-foreground focus:outline-none"
                                onBlur={handleSaveInlineCell}
                                onChange={(e) =>
                                  setEditingCell((prev) =>
                                    prev ? { ...prev, val: e.target.value } : null
                                  )
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleSaveInlineCell();
                                  if (e.key === "Escape") setEditingCell(null);
                                }}
                                value={editingCell.val}
                              />
                            </div>
                          ) : val === null || val === undefined ? (
                            <span className="italic text-muted-foreground/60">
                              NULL
                            </span>
                          ) : typeof val === "string" &&
                            (val.startsWith("http://") || val.startsWith("https://")) &&
                            (val.includes(".png") ||
                              val.includes(".jpg") ||
                              val.includes(".jpeg") ||
                              val.includes(".svg") ||
                              val.includes("dicebear")) ? (
                            <div className="flex items-center gap-1.5 truncate">
                              <img
                                alt="avatar"
                                className="size-4 shrink-0 rounded-full border border-border bg-muted object-cover"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = "none";
                                }}
                                src={val}
                              />
                              <span className="truncate">{val}</span>
                            </div>
                          ) : typeof val === "object" ? (
                            <span className="text-muted-foreground">
                              {JSON.stringify(val)}
                            </span>
                          ) : (
                            <span>{String(val)}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="flex h-full flex-col items-center justify-center p-8 text-center text-muted-foreground">
            <TableIcon className="mb-2 opacity-40" size={32} />
            <p className="text-xs">
              {isExecutingQuery
                ? "Menjalankan query ke MariaDB..."
                : `Tabel \`${selectedTable}\` kosong atau belum ada data.`}
            </p>
          </div>
        )}
      </div>

      {/* 5. Bottom Toolbar & With Selected Action Row */}
      <div className="shrink-0 border-t border-border bg-card p-2 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CornerDownRight className="text-muted-foreground size-3.5" />
            <label className="flex cursor-pointer items-center gap-1 text-muted-foreground hover:text-foreground">
              <input
                checked={
                  paginatedRows.length > 0 &&
                  selectedRowIndices.length === paginatedRows.length
                }
                className="cursor-pointer rounded border-border text-primary"
                onChange={(e) => handleSelectAllRows(e.target.checked)}
                type="checkbox"
              />
              <span>Check all</span>
            </label>

            <span className="text-muted-foreground ml-2">With selected:</span>
            <div className="flex items-center gap-1.5">
              <Button
                className="h-6 text-[10px] text-amber-500 hover:bg-amber-500/10 cursor-pointer"
                disabled={selectedRowIndices.length === 0}
                onClick={() => {
                  if (selectedRowIndices.length > 0) {
                    onEditRow(paginatedRows[selectedRowIndices[0]]);
                  }
                }}
                size="sm"
                variant="outline"
              >
                <Edit className="mr-1" size={10} />
                Edit
              </Button>

              <Button
                className="h-6 text-[10px] text-indigo-500 hover:bg-indigo-500/10 cursor-pointer"
                disabled={selectedRowIndices.length === 0}
                onClick={() => {
                  if (selectedRowIndices.length > 0) {
                    onCopyRow(paginatedRows[selectedRowIndices[0]]);
                  }
                }}
                size="sm"
                variant="outline"
              >
                <Copy className="mr-1" size={10} />
                Copy
              </Button>

              <Button
                className="h-6 text-[10px] text-destructive hover:bg-destructive/10 cursor-pointer"
                disabled={selectedRowIndices.length === 0}
                onClick={() => {
                  const toDelete = selectedRowIndices.map((i) => paginatedRows[i]);
                  onDeleteSelectedRows(toDelete);
                }}
                size="sm"
                variant="outline"
              >
                <MinusCircle className="mr-1" size={10} />
                Delete
              </Button>

              <Button
                className="h-6 text-[10px] text-emerald-500 hover:bg-emerald-500/10 cursor-pointer"
                disabled={selectedRowIndices.length === 0}
                onClick={onExportCurrentResults}
                size="sm"
                variant="outline"
              >
                <FileDown className="mr-1" size={10} />
                Export
              </Button>
            </div>
          </div>

          {/* Repeat pagination / filter controls */}
          <div className="flex items-center gap-3 text-muted-foreground text-[11px]">
            <span>
              Halaman {currentPage} dari {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <Button
                className="size-6 p-0 cursor-pointer"
                disabled={currentPage <= 1 || showAllRows}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                size="sm"
                variant="outline"
              >
                <ChevronLeft size={12} />
              </Button>
              <Button
                className="size-6 p-0 cursor-pointer"
                disabled={currentPage >= totalPages || showAllRows}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                size="sm"
                variant="outline"
              >
                <ChevronRight size={12} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Query results operations Panel (phpMyAdmin style) */}
      <div className="shrink-0 border-t border-border bg-card p-3">
        <div className="rounded-lg border border-border bg-muted/20 p-3">
          <div className="mb-2 font-semibold text-foreground text-xs">
            Query results operations
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              className="h-7 text-xs cursor-pointer border-border hover:bg-muted"
              onClick={onPrintResults}
              size="sm"
              variant="outline"
            >
              <Printer className="mr-1.5 text-muted-foreground" size={13} />
              Print
            </Button>

            <Button
              className="h-7 text-xs cursor-pointer border-border hover:bg-muted"
              onClick={handleCopyClipboardTsv}
              size="sm"
              variant="outline"
            >
              <ClipboardCopy className="mr-1.5 text-muted-foreground" size={13} />
              Copy to clipboard
            </Button>

            <Button
              className="h-7 text-xs cursor-pointer border-border hover:bg-muted"
              onClick={onExportCurrentResults}
              size="sm"
              variant="outline"
            >
              <FileDown className="mr-1.5 text-emerald-500" size={13} />
              Export
            </Button>

            <Button
              className="h-7 text-xs cursor-pointer border-border hover:bg-muted"
              onClick={onDisplayChart}
              size="sm"
              variant="outline"
            >
              <BarChart3 className="mr-1.5 text-primary" size={13} />
              Display chart
            </Button>

            <Button
              className="h-7 text-xs cursor-pointer border-border hover:bg-muted"
              onClick={onCreateView}
              size="sm"
              variant="outline"
            >
              <Eye className="mr-1.5 text-indigo-500" size={13} />
              Create view
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
