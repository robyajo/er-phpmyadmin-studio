import { Check, Edit, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditRowModalProps {
  currentSelectedDatabase: string;
  isSaving: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSaveRow: (updatedValues: Record<string, any>) => void;
  rowToEdit: Record<string, any> | null;
  selectedTable: string;
  tableStructureColumns: any[];
}

export function EditRowModal({
  currentSelectedDatabase,
  isSaving,
  isOpen,
  onClose,
  onSaveRow,
  rowToEdit,
  selectedTable,
  tableStructureColumns,
}: EditRowModalProps) {
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [nullFields, setNullFields] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (rowToEdit) {
      const initialVals: Record<string, any> = {};
      const initialNulls: Record<string, boolean> = {};
      for (const [k, v] of Object.entries(rowToEdit)) {
        if (v === null || v === undefined) {
          initialVals[k] = "";
          initialNulls[k] = true;
        } else if (typeof v === "object") {
          initialVals[k] = JSON.stringify(v);
          initialNulls[k] = false;
        } else {
          initialVals[k] = String(v);
          initialNulls[k] = false;
        }
      }
      setFormValues(initialVals);
      setNullFields(initialNulls);
    }
  }, [rowToEdit]);

  if (!isOpen || !rowToEdit) {
    return null;
  }

  const columnsList =
    tableStructureColumns.length > 0
      ? tableStructureColumns
      : Object.keys(rowToEdit).map((key) => ({
          Extra: "",
          Field: key,
          Null: "YES",
          Type: typeof rowToEdit[key] === "number" ? "int" : "varchar",
        }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalValues: Record<string, any> = {};
    for (const col of columnsList) {
      const key = col.Field;
      if (nullFields[key]) {
        finalValues[key] = null;
      } else {
        finalValues[key] = formValues[key] ?? "";
      }
    }
    onSaveRow(finalValues);
  };

  return (
    <div className="fade-in fixed inset-0 z-50 flex animate-in items-center justify-center bg-black/80 p-4 backdrop-blur-sm duration-150">
      <div className="flex max-h-[85vh] w-full max-w-xl flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
        {/* Header Modal */}
        <div className="flex shrink-0 items-center justify-between border-border border-b bg-muted/40 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-md border border-primary/30 bg-primary/10 text-primary">
              <Edit size={14} />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm">
                Edit Baris Data:{" "}
                <span className="font-mono text-primary">`{selectedTable}`</span>
              </h3>
              <p className="text-[11px] text-muted-foreground/70">
                Basis Data: {currentSelectedDatabase}
              </p>
            </div>
          </div>
          <button
            className="rounded p-1 text-muted-foreground/70 transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
            onClick={onClose}
            type="button"
          >
            <X size={15} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-3 overflow-y-auto p-4 text-xs">
            {columnsList.map((col) => {
              const fieldName = col.Field;
              const isNull = nullFields[fieldName];
              return (
                <div
                  className="space-y-1 rounded-md border border-border/60 bg-muted/20 p-2.5"
                  key={fieldName}
                >
                  <div className="flex items-center justify-between">
                    <Label className="font-mono font-semibold text-[11px] text-foreground">
                      {fieldName}
                    </Label>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[10px] text-muted-foreground/70">
                        {col.Type}
                      </span>
                      {col.Null === "YES" && (
                        <label className="flex cursor-pointer items-center gap-1 font-mono text-[10px] text-muted-foreground hover:text-foreground">
                          <input
                            type="checkbox"
                            checked={isNull}
                            onChange={(e) =>
                              setNullFields((prev) => ({
                                ...prev,
                                [fieldName]: e.target.checked,
                              }))
                            }
                            className="rounded border-border text-primary"
                          />
                          NULL
                        </label>
                      )}
                    </div>
                  </div>
                  <Input
                    className="h-8 border-border bg-background font-mono text-foreground text-xs focus-visible:border-white/30 focus-visible:ring-0 disabled:opacity-40"
                    disabled={isNull}
                    onChange={(e) =>
                      setFormValues((prev) => ({
                        ...prev,
                        [fieldName]: e.target.value,
                      }))
                    }
                    placeholder={
                      isNull ? "NULL" : `Nilai untuk kolom ${fieldName}`
                    }
                    value={isNull ? "" : formValues[fieldName] ?? ""}
                  />
                </div>
              );
            })}
          </div>

          {/* Footer Modal */}
          <div className="flex items-center justify-between border-border border-t bg-muted/40 px-4 py-3">
            <Button
              className="h-7 border-border text-muted-foreground text-xs hover:bg-muted cursor-pointer"
              onClick={onClose}
              size="sm"
              type="button"
              variant="outline"
            >
              Batal
            </Button>
            <Button
              className="h-7 bg-primary font-semibold text-primary-foreground text-xs hover:bg-primary/90 cursor-pointer"
              disabled={isSaving}
              size="sm"
              type="submit"
            >
              <Check className="mr-1.5" size={12} />
              {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
