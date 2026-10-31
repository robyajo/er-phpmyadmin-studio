import {
  ArrowLeft,
  Check,
  Copy,
  Info,
  Key,
  Plus,
  RefreshCw,
  RotateCcw,
  Table as TableIcon,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface InsertTabProps {
  currentSelectedDatabase: string;
  initialValues?: Record<string, any>;
  isSaving: boolean;
  mode: "insert" | "edit" | "copy";
  onCancel: () => void;
  onSave: (
    values: Record<string, any>,
    functions: Record<string, string>,
    nullFields: Record<string, boolean>,
    afterSaveAction: "browse" | "insert_another"
  ) => Promise<void> | void;
  originalRow?: Record<string, any> | null;
  selectedTable: string;
  tableStructureColumns: any[];
}

const COMMON_SQL_FUNCTIONS = [
  "",
  "NOW",
  "UUID",
  "MD5",
  "SHA1",
  "PASSWORD",
  "AES_ENCRYPT",
  "AES_DECRYPT",
  "LOWER",
  "UPPER",
  "HEX",
  "UNHEX",
  "RAND",
  "CURRENT_TIMESTAMP",
];

export function InsertTab({
  currentSelectedDatabase,
  initialValues = {},
  isSaving,
  mode,
  onCancel,
  onSave,
  originalRow,
  selectedTable,
  tableStructureColumns,
}: InsertTabProps) {
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [functions, setFunctions] = useState<Record<string, string>>({});
  const [nullFields, setNullFields] = useState<Record<string, boolean>>({});
  const [afterSaveAction, setAfterSaveAction] = useState<"browse" | "insert_another">("browse");

  // Determine effective columns
  const effectiveColumns = React.useMemo(() => {
    if (tableStructureColumns && tableStructureColumns.length > 0) {
      return tableStructureColumns;
    }
    // Fallback: infer columns from initialValues or originalRow if structure isn't ready
    const sourceObj =
      initialValues && Object.keys(initialValues).length > 0
        ? initialValues
        : originalRow || {};
    const keys = Object.keys(sourceObj);
    if (keys.length > 0) {
      return keys.map((k) => ({
        Field: k,
        Type: "varchar(255)",
        Null: "YES",
        Key: k === "id" ? "PRI" : "",
        Default: null,
        Extra: "",
      }));
    }
    return [
      { Field: "id", Type: "int(11)", Null: "NO", Key: "PRI", Default: null, Extra: "auto_increment" },
      { Field: "name", Type: "varchar(255)", Null: "NO", Key: "", Default: null, Extra: "" },
    ];
  }, [tableStructureColumns, initialValues, originalRow]);

  // Synchronize form values whenever initialValues, originalRow, or mode changes
  useEffect(() => {
    const nextVals: Record<string, string> = {};
    const nextNulls: Record<string, boolean> = {};
    const nextFuncs: Record<string, string> = {};

    for (const col of effectiveColumns) {
      const field = col.Field;
      const rawVal = initialValues[field] !== undefined ? initialValues[field] : originalRow?.[field];

      if (mode === "copy" && col.Key === "PRI") {
        if (col.Extra && String(col.Extra).toLowerCase().includes("auto_increment")) {
          // Leave auto-increment primary key blank on copy
          nextVals[field] = "";
          nextNulls[field] = false;
        } else if (
          typeof rawVal === "string" &&
          (rawVal.length === 36 || /^[0-9a-f-]{36}$/i.test(rawVal))
        ) {
          // Generate a fresh UUID for copied UUID keys
          nextVals[field] =
            typeof crypto !== "undefined" && crypto.randomUUID
              ? crypto.randomUUID()
              : `copy-${Date.now()}`;
          nextNulls[field] = false;
        } else if (typeof rawVal === "number") {
          nextVals[field] = String(rawVal + 1);
          nextNulls[field] = false;
        } else if (rawVal !== undefined && rawVal !== null && rawVal !== "") {
          nextVals[field] = `${String(rawVal)}_copy`;
          nextNulls[field] = false;
        } else {
          nextVals[field] = "";
          nextNulls[field] = false;
        }
      } else if (mode === "copy" && col.Key === "UNI") {
        // Adjust unique fields (e.g. email) to avoid duplicate key error
        if (typeof rawVal === "string" && rawVal.includes("@")) {
          const [uName, uDomain] = rawVal.split("@");
          nextVals[field] = `${uName}_copy@${uDomain}`;
        } else if (rawVal !== undefined && rawVal !== null && rawVal !== "") {
          nextVals[field] = `${String(rawVal)}_copy`;
        } else {
          nextVals[field] = "";
        }
        nextNulls[field] = false;
      } else if (rawVal === null) {
        nextVals[field] = "";
        nextNulls[field] = true;
      } else if (rawVal !== undefined) {
        nextVals[field] = typeof rawVal === "object" ? JSON.stringify(rawVal) : String(rawVal);
        nextNulls[field] = false;
      } else {
        nextVals[field] = "";
        nextNulls[field] = col.Null === "YES";
      }
      nextFuncs[field] = "";
    }

    setFormValues(nextVals);
    setNullFields(nextNulls);
    setFunctions(nextFuncs);
  }, [effectiveColumns, initialValues, originalRow, mode]);

  const handleValueChange = (field: string, val: string) => {
    setFormValues((prev) => ({ ...prev, [field]: val }));
    if (nullFields[field]) {
      setNullFields((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleNullToggle = (field: string, isNull: boolean) => {
    setNullFields((prev) => ({ ...prev, [field]: isNull }));
    if (isNull) {
      setFormValues((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleFunctionChange = (field: string, fn: string) => {
    setFunctions((prev) => ({ ...prev, [field]: fn }));
  };

  const handleReset = () => {
    const nextVals: Record<string, string> = {};
    const nextNulls: Record<string, boolean> = {};
    for (const col of effectiveColumns) {
      const field = col.Field;
      const rawVal = initialValues[field] !== undefined ? initialValues[field] : originalRow?.[field];
      if (rawVal === null) {
        nextVals[field] = "";
        nextNulls[field] = true;
      } else if (rawVal !== undefined) {
        nextVals[field] = typeof rawVal === "object" ? JSON.stringify(rawVal) : String(rawVal);
        nextNulls[field] = false;
      } else {
        nextVals[field] = "";
        nextNulls[field] = col.Null === "YES";
      }
    }
    setFormValues(nextVals);
    setNullFields(nextNulls);
    setFunctions({});
    toast.info("Nilai formulir telah direset ke nilai awal.");
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      const hasValues = Object.keys(formValues).some(
        (k) => formValues[k] !== "" || nullFields[k]
      );
      if (!hasValues && mode !== "copy") {
        toast.warning("Harap isi setidaknya satu nilai kolom.");
        return;
      }
      await onSave(formValues, functions, nullFields, afterSaveAction);
    } catch (err: any) {
      toast.error("Terjadi kesalahan saat menyimpan formulir", {
        description: err?.message || String(err),
      });
    }
  };

  const getModeTitle = () => {
    switch (mode) {
      case "edit":
        return `Ubah baris di tabel \`${selectedTable}\``;
      case "copy":
        return `Salin & Sisipkan baris ke tabel \`${selectedTable}\``;
      default:
        return `Sisipkan baris baru ke tabel \`${selectedTable}\``;
    }
  };

  const getModeBadge = () => {
    switch (mode) {
      case "edit":
        return (
          <Badge className="border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono text-[11px]" variant="outline">
            Mode Edit (UPDATE)
          </Badge>
        );
      case "copy":
        return (
          <Badge className="border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono text-[11px]" variant="outline">
            Mode Duplikasi (INSERT COPY)
          </Badge>
        );
      default:
        return (
          <Badge className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[11px]" variant="outline">
            Mode Baru (INSERT)
          </Badge>
        );
    }
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto">
      {/* Top Header Banner */}
      <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-md border border-border bg-muted/60 text-primary">
            {mode === "insert" ? (
              <Plus size={16} />
            ) : mode === "copy" ? (
              <Copy size={16} className="text-amber-500" />
            ) : (
              <TableIcon size={16} />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-foreground">{getModeTitle()}</h2>
              {getModeBadge()}
            </div>
            <p className="text-xs text-muted-foreground">
              Basis Data: <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400">{currentSelectedDatabase}</span>
              {" » "}
              Tabel: <span className="font-mono font-medium text-foreground">{selectedTable}</span>
            </p>
          </div>
        </div>

        <Button
          className="h-8 text-xs cursor-pointer gap-1.5"
          onClick={onCancel}
          size="sm"
          variant="outline"
        >
          <ArrowLeft size={13} />
          Kembali ke Jelajahi (Browse)
        </Button>
      </div>

      {/* Copy mode tip banner */}
      {mode === "copy" && (
        <div className="mx-4 mt-3 flex items-center gap-2 rounded-md border border-amber-500/20 bg-amber-50/70 p-2.5 text-xs text-amber-900 dark:border-amber-800/40 dark:bg-amber-950/20 dark:text-amber-300">
          <Info className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>
            <strong>Mode Salin (Duplikasi Baris):</strong> Nilai dari baris sebelumnya telah diisikan. Kunci utama (Primary Key) dan nilai unik telah disesuaikan secara otomatis untuk mencegah konflik duplikasi data. Anda dapat mengubah nilai apa pun sebelum menekan <strong>Kirim (Go)</strong>.
          </span>
        </div>
      )}

      {/* Main Form Content */}
      <form className="flex-1 p-4 max-w-5xl space-y-4" onSubmit={handleSubmit}>
        <div className="overflow-hidden rounded-md border border-border bg-card shadow-sm">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/50 font-semibold text-muted-foreground">
                <th className="p-2.5 w-[20%] font-medium">Kolom (Column)</th>
                <th className="p-2.5 w-[15%] font-medium">Jenis (Type)</th>
                <th className="p-2.5 w-[20%] font-medium">Fungsi (Function)</th>
                <th className="p-2.5 w-[8%] text-center font-medium">Null</th>
                <th className="p-2.5 w-[37%] font-medium">Nilai (Value)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {effectiveColumns.map((col, idx) => {
                const fieldName = col.Field;
                const fieldType = col.Type || "varchar(255)";
                const isPk = col.Key === "PRI";
                const isUni = col.Key === "UNI";
                const isAutoInc = col.Extra && String(col.Extra).toLowerCase().includes("auto_increment");
                const isNull = !!nullFields[fieldName];
                const val = formValues[fieldName] ?? "";
                const fn = functions[fieldName] ?? "";
                const isLongText = fieldType.toLowerCase().includes("text") || fieldType.toLowerCase().includes("json");

                return (
                  <tr
                    className={`transition-colors hover:bg-muted/30 ${
                      idx % 2 === 1 ? "bg-muted/10" : "bg-card"
                    }`}
                    key={fieldName}
                  >
                    {/* Column Name */}
                    <td className="p-2.5 align-middle">
                      <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-foreground">
                        {isPk && <Key className="size-3 text-amber-500 shrink-0" title="Primary Key" />}
                        <span>{fieldName}</span>
                        {isPk && (
                          <Badge className="h-4 px-1 text-[9px] bg-amber-500/10 text-amber-600 border-amber-500/20" variant="outline">
                            PRI
                          </Badge>
                        )}
                        {isUni && (
                          <Badge className="h-4 px-1 text-[9px] bg-blue-500/10 text-blue-600 border-blue-500/20" variant="outline">
                            UNI
                          </Badge>
                        )}
                      </div>
                      {isAutoInc && (
                        <span className="text-[10px] text-muted-foreground/80 italic font-mono">
                          auto_increment
                        </span>
                      )}
                    </td>

                    {/* Column Type */}
                    <td className="p-2.5 align-middle font-mono text-xs text-muted-foreground">
                      {fieldType}
                    </td>

                    {/* SQL Function */}
                    <td className="p-2.5 align-middle">
                      <select
                        className="h-7 w-full rounded border border-border bg-background px-2 text-xs font-mono text-foreground focus:border-primary focus:outline-none cursor-pointer"
                        disabled={isNull}
                        onChange={(e) => handleFunctionChange(fieldName, e.target.value)}
                        value={fn}
                      >
                        {COMMON_SQL_FUNCTIONS.map((f) => (
                          <option key={f} value={f}>
                            {f || "(tanpa fungsi)"}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Null Checkbox */}
                    <td className="p-2.5 align-middle text-center">
                      <input
                        checked={isNull}
                        className="size-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
                        onChange={(e) => handleNullToggle(fieldName, e.target.checked)}
                        title="Centang untuk mengatur kolom ini menjadi NULL"
                        type="checkbox"
                      />
                    </td>

                    {/* Value Input */}
                    <td className="p-2.5 align-middle">
                      {isNull ? (
                        <div className="flex h-7 items-center rounded border border-dashed border-border bg-muted/40 px-2.5 text-xs font-mono text-muted-foreground italic select-none">
                          NULL
                        </div>
                      ) : isLongText ? (
                        <textarea
                          className="w-full rounded border border-border bg-background p-2 text-xs font-mono text-foreground focus:border-primary focus:outline-none"
                          onChange={(e) => handleValueChange(fieldName, e.target.value)}
                          placeholder={`Nilai ${fieldName}...`}
                          rows={3}
                          value={val}
                        />
                      ) : (
                        <input
                          className="h-7 w-full rounded border border-border bg-background px-2 text-xs font-mono text-foreground focus:border-primary focus:outline-none"
                          onChange={(e) => handleValueChange(fieldName, e.target.value)}
                          placeholder={isAutoInc && mode !== "edit" ? "(otomatis)" : `Nilai ${fieldName}...`}
                          type="text"
                          value={val}
                        />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* phpMyAdmin Action Toolbar at Bottom */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-card p-3 shadow-sm">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground font-medium">Setelah disimpan:</span>
            <select
              className="h-8 rounded border border-border bg-background px-2.5 text-xs text-foreground focus:border-primary focus:outline-none cursor-pointer"
              onChange={(e) => setAfterSaveAction(e.target.value as any)}
              value={afterSaveAction}
            >
              <option value="browse">Kembali ke halaman sebelumnya (Jelajahi)</option>
              <option value="insert_another">Sisipkan baris baru lagi</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              className="h-8 text-xs cursor-pointer gap-1.5"
              onClick={handleReset}
              size="sm"
              type="button"
              variant="outline"
            >
              <RotateCcw size={13} />
              Reset
            </Button>

            <Button
              className="h-8 text-xs cursor-pointer gap-1.5"
              onClick={onCancel}
              size="sm"
              type="button"
              variant="ghost"
            >
              Batal
            </Button>

            <Button
              className="h-8 text-xs cursor-pointer gap-1.5 font-semibold"
              disabled={isSaving}
              onClick={() => handleSubmit()}
              size="sm"
              type="submit"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="size-3 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Check size={14} />
                  Kirim (Go)
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
