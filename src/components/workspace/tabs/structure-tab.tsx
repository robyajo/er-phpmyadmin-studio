import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Check,
  CheckSquare,
  Columns,
  CornerDownRight,
  Database,
  FileText,
  FileUp,
  Filter,
  HelpCircle,
  MinusCircle,
  Play,
  Plus,
  RefreshCw,
  Search,
  Star,
  Table as TableIcon,
  Trash2,
  X,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { TableItem } from "@/types/workspace";
import { cn } from "@/utils/tailwind";

interface StructureTabProps {
  bulkAction: string;
  currentSelectedDatabase: string;
  filteredDisplayTables: TableItem[];
  isCreatingTable: boolean;
  newTableColumnsInput: number;
  newTableNameInput: string;
  onBrowseTable: (tableName: string) => void;
  onCreateTable: () => void;
  onDropTable: (tableName: string) => void;
  onEmptyTable: (tableName: string) => void;
  onExecuteBulkAction: () => void;
  onOpenInsertModal: (tableName: string) => void;
  onRefreshTables: () => void;
  onSearchTable?: (tableName: string) => void;
  onSwitchTab: (tabId: "import" | "export") => void;
  onViewTableStructure: (tableName: string) => void;
  selectedTableCheckboxes: string[];
  setBulkAction: (val: string) => void;
  setNewTableColumnsInput: (val: number) => void;
  setNewTableNameInput: (val: string) => void;
  setSelectedTableCheckboxes: React.Dispatch<React.SetStateAction<string[]>>;
  setTableSearch: (val: string) => void;
  tableSearch: string;
  totalDatabaseRows: number;
}

export function StructureTab({
  bulkAction,
  currentSelectedDatabase,
  filteredDisplayTables,
  isCreatingTable,
  newTableColumnsInput,
  newTableNameInput,
  onBrowseTable,
  onCreateTable,
  onDropTable,
  onEmptyTable,
  onExecuteBulkAction,
  onOpenInsertModal,
  onRefreshTables,
  onSearchTable,
  onSwitchTab,
  onViewTableStructure,
  selectedTableCheckboxes,
  setBulkAction,
  setNewTableColumnsInput,
  setNewTableNameInput,
  setSelectedTableCheckboxes,
  setTableSearch,
  tableSearch,
  totalDatabaseRows,
}: StructureTabProps) {
  // Collapsible Filters Panel (phpMyAdmin style)
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(true);

  // Sorting state for table list
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Favorite tables state (persisted in localStorage or component state)
  const [favoriteTables, setFavoriteTables] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`pma_fav_${currentSelectedDatabase}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleFavorite = (tableName: string) => {
    setFavoriteTables((prev) => {
      const next = prev.includes(tableName)
        ? prev.filter((t) => t !== tableName)
        : [...prev, tableName];
      try {
        localStorage.setItem(
          `pma_fav_${currentSelectedDatabase}`,
          JSON.stringify(next)
        );
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Sort tables
  const sortedTables = useMemo(() => {
    return [...filteredDisplayTables].sort((a, b) => {
      const isFavA = favoriteTables.includes(a.name);
      const isFavB = favoriteTables.includes(b.name);
      if (isFavA && !isFavB) return -1;
      if (!isFavA && isFavB) return 1;

      const comp = a.name.localeCompare(b.name);
      return sortDirection === "asc" ? comp : -comp;
    });
  }, [filteredDisplayTables, favoriteTables, sortDirection]);

  // Compute total size and overhead
  const { totalOverheadBytes, totalSizeBytes } = useMemo(() => {
    let sizeBytes = 0;
    let overheadBytes = 0;
    for (const tbl of filteredDisplayTables) {
      if (tbl.dataLength || tbl.indexLength) {
        sizeBytes += (tbl.dataLength || 0) + (tbl.indexLength || 0);
      }
      if (tbl.dataFree) {
        overheadBytes += tbl.dataFree;
      }
    }
    return {
      totalOverheadBytes: overheadBytes,
      totalSizeBytes: sizeBytes,
    };
  }, [filteredDisplayTables]);

  const formatBytes = (bytes: number) => {
    if (bytes <= 0) return "0 B";
    if (bytes > 1_048_576) return `${(bytes / 1_048_576).toFixed(1)} MiB`;
    return `${(bytes / 1024).toFixed(1)} KiB`;
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-background">
      {/* Filters Collapsible Bar (phpMyAdmin style) */}
      <div className="shrink-0 border-b border-border bg-card p-3">
        <div className="flex items-center gap-2 mb-2">
          <Button
            className="h-7 border-border bg-background px-2.5 text-xs text-foreground hover:bg-muted cursor-pointer"
            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            size="sm"
            variant="outline"
          >
            <Filter className="mr-1.5 size-3.5 text-primary" />
            Filters
          </Button>

          <Badge
            className="border-primary/30 bg-primary/10 font-mono text-[10px] text-primary"
            variant="outline"
          >
            {filteredDisplayTables.length} Tabel
          </Badge>

          <Badge
            className="hidden border-emerald-500/30 bg-emerald-500/10 font-mono text-[10px] text-emerald-500 sm:inline-flex"
            variant="outline"
          >
            {totalDatabaseRows.toLocaleString()} Baris Total
          </Badge>
        </div>

        {isFilterPanelOpen && (
          <div className="flex items-center gap-3 rounded border border-border bg-muted/30 p-2.5 text-xs">
            <span className="text-muted-foreground font-medium">
              Containing the word:
            </span>
            <div className="relative w-64 sm:w-80">
              <Input
                autoFocus
                className="h-7 border-border bg-background pr-2 pl-3 text-xs text-foreground placeholder:text-muted-foreground/60"
                onChange={(e) => setTableSearch(e.target.value)}
                placeholder="misal: users, logs, transactions..."
                value={tableSearch}
              />
            </div>
            {tableSearch && (
              <button
                className="cursor-pointer text-muted-foreground hover:text-foreground text-[11px]"
                onClick={() => setTableSearch("")}
                type="button"
              >
                Reset
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Table Content */}
      <div className="flex-1 space-y-4 overflow-y-auto p-3 sm:p-4">
        {filteredDisplayTables.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground">
              <TableIcon size={24} />
            </div>
            <h3 className="mt-4 font-semibold text-foreground text-sm">
              Belum Ada Tabel di Basis Data `{currentSelectedDatabase}`
            </h3>
            <p className="mt-1 max-w-sm text-muted-foreground text-xs leading-relaxed">
              Buat tabel pertama Anda menggunakan formulir di bawah atau pulihkan
              skema dari berkas cadangan melalui menu Impor.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <Button
                className="h-8 bg-primary font-semibold text-primary-foreground text-xs hover:bg-primary/90 cursor-pointer"
                onClick={() => {
                  const elem = document.getElementById("create-table-card");
                  if (elem) elem.scrollIntoView({ behavior: "smooth" });
                }}
                size="sm"
              >
                <Plus className="mr-1.5" size={13} />
                Buat Tabel Baru
              </Button>
              <Button
                className="h-8 border-border text-foreground hover:bg-muted cursor-pointer"
                onClick={() => onSwitchTab("import")}
                size="sm"
                variant="outline"
              >
                <FileUp className="mr-1.5" size={13} />
                Impor Skrip SQL
              </Button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border bg-card shadow-2xs">
            <table className="w-full min-w-[850px] border-collapse text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/60 text-muted-foreground font-sans">
                  {/* Checkbox All */}
                  <th className="w-8 px-3 py-2 text-center">
                    <input
                      checked={
                        sortedTables.length > 0 &&
                        selectedTableCheckboxes.length === sortedTables.length
                      }
                      className="cursor-pointer rounded border-border bg-background text-primary"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTableCheckboxes(
                            sortedTables.map((t) => t.name)
                          );
                        } else {
                          setSelectedTableCheckboxes([]);
                        }
                      }}
                      type="checkbox"
                    />
                  </th>

                  {/* Table Name (Sortable) */}
                  <th
                    className="cursor-pointer select-none px-3 py-2 font-semibold hover:text-foreground"
                    onClick={() =>
                      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
                    }
                  >
                    <div className="flex items-center gap-1">
                      <span>Table</span>
                      {sortDirection === "asc" ? (
                        <ArrowUp className="text-primary size-3" />
                      ) : (
                        <ArrowDown className="text-primary size-3" />
                      )}
                    </div>
                  </th>

                  {/* Action */}
                  <th className="px-3 py-2 text-center font-semibold">Action</th>

                  {/* Rows */}
                  <th className="px-3 py-2 text-right font-semibold">
                    <div className="flex items-center justify-end gap-1">
                      <span>Rows</span>
                      <span title="May be approximate for InnoDB">
                        <HelpCircle size={11} className="opacity-60" />
                      </span>
                    </div>
                  </th>

                  {/* Type (Engine) */}
                  <th className="px-3 py-2 font-semibold">Type</th>

                  {/* Collation */}
                  <th className="px-3 py-2 font-semibold">Collation</th>

                  {/* Size */}
                  <th className="px-3 py-2 text-right font-semibold">Size</th>

                  {/* Overhead */}
                  <th className="px-3 py-2 text-right font-semibold">Overhead</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border/50 text-foreground font-mono text-[11px]">
                {sortedTables.map((tbl) => {
                  const isChecked = selectedTableCheckboxes.includes(tbl.name);
                  const isFav = favoriteTables.includes(tbl.name);
                  const overheadFormatted =
                    tbl.dataFree && tbl.dataFree > 0
                      ? formatBytes(tbl.dataFree)
                      : "-";

                  return (
                    <tr
                      className={cn(
                        "transition-colors hover:bg-muted/50",
                        isChecked && "bg-primary/5"
                      )}
                      key={tbl.name}
                    >
                      {/* Checkbox */}
                      <td className="px-3 py-1.5 text-center">
                        <input
                          checked={isChecked}
                          className="cursor-pointer rounded border-border bg-background text-primary"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedTableCheckboxes((prev) => [
                                ...prev,
                                tbl.name,
                              ]);
                            } else {
                              setSelectedTableCheckboxes((prev) =>
                                prev.filter((n) => n !== tbl.name)
                              );
                            }
                          }}
                          type="checkbox"
                        />
                      </td>

                      {/* Table Name */}
                      <td className="px-3 py-1.5 font-medium text-foreground">
                        <button
                          className="flex cursor-pointer items-center gap-1.5 text-left font-semibold text-primary hover:underline"
                          onClick={() => onBrowseTable(tbl.name)}
                          title="Klik untuk membuka Browse tab"
                          type="button"
                        >
                          <TableIcon className="shrink-0 text-primary" size={13} />
                          <span>{tbl.name}</span>
                        </button>
                      </td>

                      {/* Action icons & buttons matching phpMyAdmin */}
                      <td className="px-3 py-1.5 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1 text-[11px] font-sans">
                          {/* Favorite Star */}
                          <button
                            className="cursor-pointer p-0.5 text-muted-foreground hover:text-amber-400 transition-colors"
                            onClick={() => toggleFavorite(tbl.name)}
                            title={isFav ? "Hapus dari favorit" : "Jadikan favorit"}
                            type="button"
                          >
                            <Star
                              className={cn(
                                "size-3.5",
                                isFav
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-muted-foreground/60"
                              )}
                            />
                          </button>

                          {/* Browse */}
                          <Button
                            className="h-6 px-1.5 text-[11px] text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400 cursor-pointer"
                            onClick={() => onBrowseTable(tbl.name)}
                            size="sm"
                            title="Browse (Jelajahi data tabel)"
                            variant="ghost"
                          >
                            <Play className="mr-1 fill-current" size={10} />
                            Browse
                          </Button>

                          {/* Structure */}
                          <Button
                            className="h-6 px-1.5 text-[11px] text-primary hover:bg-primary/10 cursor-pointer"
                            onClick={() => onViewTableStructure(tbl.name)}
                            size="sm"
                            title="Structure (Kolom & Indeks)"
                            variant="ghost"
                          >
                            <Columns className="mr-1" size={11} />
                            Structure
                          </Button>

                          {/* Search */}
                          <Button
                            className="h-6 px-1.5 text-[11px] text-muted-foreground hover:text-foreground cursor-pointer"
                            onClick={() => onSearchTable?.(tbl.name)}
                            size="sm"
                            title="Search (Cari data di tabel ini)"
                            variant="ghost"
                          >
                            <Search className="mr-1" size={11} />
                            Search
                          </Button>

                          {/* Insert */}
                          <Button
                            className="h-6 px-1.5 text-[11px] text-amber-500 hover:bg-amber-500/10 cursor-pointer"
                            onClick={() => onOpenInsertModal(tbl.name)}
                            size="sm"
                            title="Insert (Sisipkan baris baru)"
                            variant="ghost"
                          >
                            <Plus className="mr-1" size={11} />
                            Insert
                          </Button>

                          {/* Empty */}
                          <Button
                            className="h-6 px-1.5 text-[11px] text-destructive hover:bg-destructive/10 cursor-pointer"
                            onClick={() => onEmptyTable(tbl.name)}
                            size="sm"
                            title="Empty (TRUNCATE tabel)"
                            variant="ghost"
                          >
                            <Trash2 className="mr-1" size={11} />
                            Empty
                          </Button>

                          {/* Drop */}
                          <Button
                            className="h-6 px-1 text-[11px] text-destructive hover:bg-destructive/10 cursor-pointer"
                            onClick={() => onDropTable(tbl.name)}
                            size="sm"
                            title="Drop (Hapus tabel permanen)"
                            variant="ghost"
                          >
                            <MinusCircle className="mr-1" size={11} />
                            Drop
                          </Button>
                        </div>
                      </td>

                      {/* Rows */}
                      <td className="px-3 py-1.5 text-right font-medium">
                        {tbl.rows.toLocaleString()}
                      </td>

                      {/* Type (Engine) */}
                      <td className="px-3 py-1.5">
                        <span className="text-muted-foreground font-mono text-[11px]">
                          {tbl.engine || "InnoDB"}
                        </span>
                      </td>

                      {/* Collation */}
                      <td className="px-3 py-1.5 text-[11px] text-muted-foreground">
                        {tbl.collation || "utf8mb4_unicode_ci"}
                      </td>

                      {/* Size */}
                      <td className="px-3 py-1.5 text-right font-medium text-foreground">
                        {tbl.size}
                      </td>

                      {/* Overhead */}
                      <td className="px-3 py-1.5 text-right font-medium text-muted-foreground">
                        {overheadFormatted}
                      </td>
                    </tr>
                  );
                })}
              </tbody>

              {/* Summary Footer Row (phpMyAdmin style) */}
              <tfoot>
                <tr className="border-t-2 border-border bg-muted/60 font-semibold text-[11px] text-foreground font-sans">
                  <td className="px-3 py-2 text-center">
                    <CheckSquare className="mx-auto text-primary size-3.5" />
                  </td>
                  <td className="px-3 py-2 font-mono">
                    {sortedTables.length} tables
                  </td>
                  <td className="px-3 py-2 text-center text-muted-foreground">
                    Sum
                  </td>
                  <td className="px-3 py-2 text-right text-emerald-600 dark:text-emerald-400 font-mono">
                    {totalDatabaseRows.toLocaleString()}
                  </td>
                  <td className="px-3 py-2 text-muted-foreground font-mono">
                    InnoDB
                  </td>
                  <td className="px-3 py-2 text-muted-foreground font-mono">
                    utf8mb4_general_ci
                  </td>
                  <td className="px-3 py-2 text-right text-primary font-mono">
                    {formatBytes(totalSizeBytes)}
                  </td>
                  <td className="px-3 py-2 text-right text-muted-foreground font-mono">
                    {formatBytes(totalOverheadBytes)}
                  </td>
                </tr>
              </tfoot>
            </table>

            {/* With Selected Action Bar (phpMyAdmin style) */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-muted/30 p-2.5 text-xs font-sans">
              <div className="flex items-center gap-2">
                <CornerDownRight className="text-muted-foreground size-3.5" />
                <label className="flex cursor-pointer items-center gap-1 text-muted-foreground hover:text-foreground">
                  <input
                    checked={
                      sortedTables.length > 0 &&
                      selectedTableCheckboxes.length === sortedTables.length
                    }
                    className="cursor-pointer rounded border-border bg-background text-primary"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTableCheckboxes(
                          sortedTables.map((t) => t.name)
                        );
                      } else {
                        setSelectedTableCheckboxes([]);
                      }
                    }}
                    type="checkbox"
                  />
                  <span>Check all</span>
                </label>

                <span className="text-[11px] text-muted-foreground ml-3">
                  With selected:
                </span>
                <select
                  className="h-7 rounded border border-border bg-card px-2 font-mono text-foreground text-xs focus:border-primary focus:outline-none"
                  onChange={(e) => setBulkAction(e.target.value)}
                  value={bulkAction}
                >
                  <option value="empty">Empty (TRUNCATE)</option>
                  <option value="drop">Drop (DROP)</option>
                  <option value="print">Print</option>
                  <option value="check">Check table (CHECK)</option>
                  <option value="optimize">Optimize table (OPTIMIZE)</option>
                  <option value="repair">Repair table (REPAIR)</option>
                  <option value="analyze">Analyze table (ANALYZE)</option>
                  <option value="checksum">Checksum table (CHECKSUM)</option>
                  <option value="export">Export (EXPORT)</option>
                </select>
                <Button
                  className="h-7 bg-primary font-semibold text-primary-foreground text-xs hover:bg-primary/90 cursor-pointer"
                  disabled={selectedTableCheckboxes.length === 0}
                  onClick={onExecuteBulkAction}
                  size="sm"
                >
                  Jalankan
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="text-[11px] text-primary hover:underline cursor-pointer"
                  onClick={() =>
                    setSelectedTableCheckboxes(sortedTables.map((t) => t.name))
                  }
                  type="button"
                >
                  Pilih Semua
                </button>
                <span className="text-muted-foreground/70">•</span>
                <button
                  className="text-[11px] text-muted-foreground hover:underline cursor-pointer"
                  onClick={() => setSelectedTableCheckboxes([])}
                  type="button"
                >
                  Kosongkan Pilihan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Form Buat Tabel Baru di Basis Data Ini */}
        <div
          className="space-y-3 rounded-lg border border-border bg-card p-4"
          id="create-table-card"
        >
          <div className="flex items-center gap-2">
            <Plus className="text-emerald-500" size={14} />
            <h3 className="font-semibold text-foreground text-xs">
              Buat Tabel Baru pada Basis Data `{currentSelectedDatabase}`
            </h3>
          </div>

          <div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-4">
            <div className="space-y-1 sm:col-span-2">
              <Label className="text-[11px] text-muted-foreground">
                Nama Tabel Baru:
              </Label>
              <Input
                className="h-8 border-border bg-background font-mono text-foreground text-xs focus-visible:border-white/30 focus-visible:ring-0"
                onChange={(e) => setNewTableNameInput(e.target.value)}
                placeholder="misal: users, orders, logs..."
                value={newTableNameInput}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] text-muted-foreground">
                Jumlah Kolom Standar:
              </Label>
              <Input
                className="h-8 border-border bg-background font-mono text-foreground text-xs focus-visible:border-white/30 focus-visible:ring-0"
                max={50}
                min={1}
                onChange={(e) =>
                  setNewTableColumnsInput(Number(e.target.value) || 1)
                }
                type="number"
                value={newTableColumnsInput}
              />
            </div>
            <div>
              <Button
                className="h-8 w-full bg-primary font-semibold text-primary-foreground text-xs hover:bg-primary/90 cursor-pointer"
                disabled={!newTableNameInput.trim() || isCreatingTable}
                onClick={onCreateTable}
                size="sm"
              >
                <Plus className="mr-1.5" size={13} />
                {isCreatingTable ? "Membuat..." : "Buat Tabel"}
              </Button>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground/70">
            Secara default, tabel baru akan diinisialisasi dengan primary key `id`
            AUTO_INCREMENT dan timestamp `created_at`.
          </p>
        </div>
      </div>
    </div>
  );
}
