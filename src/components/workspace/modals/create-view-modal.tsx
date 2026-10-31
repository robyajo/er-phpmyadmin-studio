import { Eye, Plus, X } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CreateViewModalProps {
  currentSelectedDatabase: string;
  isCreating: boolean;
  isOpen: boolean;
  onClose: () => void;
  onCreateView: (viewName: string) => void;
  sqlQuery: string;
}

export function CreateViewModal({
  currentSelectedDatabase,
  isCreating,
  isOpen,
  onClose,
  onCreateView,
  sqlQuery,
}: CreateViewModalProps) {
  const [viewName, setViewName] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!viewName.trim()) return;
    onCreateView(viewName.trim());
  };

  return (
    <div className="fade-in fixed inset-0 z-50 flex animate-in items-center justify-center bg-black/80 p-4 backdrop-blur-sm duration-150">
      <div className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
        {/* Header Modal */}
        <div className="flex shrink-0 items-center justify-between border-border border-b bg-muted/40 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-md border border-primary/30 bg-primary/10 text-primary">
              <Eye size={14} />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm">
                Buat View Baru (Create View)
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

        {/* Body Modal */}
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-3 p-4 text-xs">
            <div className="space-y-1">
              <Label className="text-[11px] text-foreground font-semibold">
                Nama View:
              </Label>
              <Input
                autoFocus
                className="h-8 border-border bg-background font-mono text-foreground text-xs focus-visible:border-white/30 focus-visible:ring-0"
                onChange={(e) => setViewName(e.target.value)}
                placeholder="misal: v_active_users, v_summary..."
                value={viewName}
              />
            </div>

            <div className="space-y-1">
              <Label className="text-[11px] text-muted-foreground">
                Query Definisi View (AS SELECT...):
              </Label>
              <pre className="max-h-36 overflow-auto rounded border border-border bg-muted/40 p-2.5 font-mono text-[11px] text-foreground">
                {sqlQuery}
              </pre>
            </div>
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
              disabled={!viewName.trim() || isCreating}
              size="sm"
              type="submit"
            >
              <Plus className="mr-1.5" size={12} />
              {isCreating ? "Membuat View..." : "Buat View"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
