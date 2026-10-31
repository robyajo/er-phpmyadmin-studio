import { HelpCircle, RefreshCw, X } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";

interface ExplainSqlModalProps {
  explainData: {
    columns: string[];
    rows: any[];
  } | null;
  isLoading: boolean;
  isOpen: boolean;
  onClose: () => void;
  query: string;
}

export function ExplainSqlModal({
  explainData,
  isLoading,
  isOpen,
  onClose,
  query,
}: ExplainSqlModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fade-in fixed inset-0 z-50 flex animate-in items-center justify-center bg-black/80 p-4 backdrop-blur-sm duration-150">
      <div className="flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
        {/* Header Modal */}
        <div className="flex shrink-0 items-center justify-between border-border border-b bg-muted/40 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-md border border-primary/30 bg-primary/10 text-primary">
              <HelpCircle size={15} />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm">
                Rencana Eksekusi Query (EXPLAIN)
              </h3>
              <p className="truncate font-mono text-[11px] text-muted-foreground/70 max-w-md">
                {query}
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

        {/* Body Modal */}
        <div className="flex-1 space-y-4 overflow-y-auto p-4 font-mono text-xs">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 p-12 text-primary">
              <RefreshCw className="animate-spin" size={16} />
              <span>Menganalisis query dengan EXPLAIN...</span>
            </div>
          ) : explainData && explainData.rows.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full border-collapse text-left text-[11px]">
                <thead>
                  <tr className="border-border border-b bg-muted/60 text-muted-foreground">
                    {explainData.columns.map((col) => (
                      <th className="p-2 whitespace-nowrap font-semibold" key={col}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50 text-foreground">
                  {explainData.rows.map((row, idx) => (
                    <tr className="hover:bg-muted/40 transition-colors" key={idx}>
                      {explainData.columns.map((col) => (
                        <td className="p-2 whitespace-nowrap" key={col}>
                          {row[col] === null || row[col] === undefined ? (
                            <span className="italic text-muted-foreground/50">NULL</span>
                          ) : (
                            String(row[col])
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              Tidak ada data EXPLAIN yang tersedia.
            </div>
          )}
        </div>

        {/* Footer Modal */}
        <div className="flex items-center justify-end border-border border-t bg-muted/40 px-4 py-3">
          <Button
            className="h-7 border-border text-foreground text-xs hover:bg-muted cursor-pointer"
            onClick={onClose}
            size="sm"
            type="button"
            variant="outline"
          >
            Tutup
          </Button>
        </div>
      </div>
    </div>
  );
}
