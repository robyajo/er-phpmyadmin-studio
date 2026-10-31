import React from "react";
import { AlertCircle, Trash2, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export interface ConfirmDialogProps {
  cancelText?: string;
  confirmText?: string;
  description: React.ReactNode;
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  variant?: "destructive" | "default";
}

export function ConfirmDialog({
  cancelText = "Batal",
  confirmText = "Hapus",
  description,
  isOpen,
  onCancel,
  onConfirm,
  title,
  variant = "destructive",
}: ConfirmDialogProps) {
  const isDestructive = variant === "destructive";

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent className="w-full max-w-lg border border-border bg-card p-0 shadow-2xl overflow-hidden rounded-2xl">
        {/* Top Header Card */}
        <div className="flex items-center justify-between border-b border-border bg-muted/40 px-5 py-3.5">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`flex size-8 shrink-0 items-center justify-center rounded-lg border ${
                isDestructive
                  ? "border-destructive/30 bg-destructive/10 text-destructive"
                  : "border-primary/30 bg-primary/10 text-primary"
              }`}
            >
              {isDestructive ? <Trash2 size={16} /> : <AlertCircle size={16} />}
            </div>
            <AlertDialogTitle className="truncate font-semibold text-sm text-foreground tracking-tight">
              {title}
            </AlertDialogTitle>
          </div>
          <button
            className="rounded p-1 text-muted-foreground/70 transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
            onClick={onCancel}
            type="button"
          >
            <X size={15} />
          </button>
        </div>

        {/* Content Body */}
        <div className="px-5 py-4 text-xs text-foreground space-y-2.5">
          <AlertDialogDescription className="text-xs text-muted-foreground leading-relaxed">
            {description}
          </AlertDialogDescription>
        </div>

        {/* Footer Actions */}
        <AlertDialogFooter className="border-t border-border bg-muted/30 px-5 py-3 m-0 flex flex-row items-center justify-end gap-2.5 rounded-none">
          <AlertDialogCancel
            onClick={onCancel}
            className="h-8 border-border text-xs text-foreground hover:bg-muted cursor-pointer"
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={async (e) => {
              e.preventDefault();
              await onConfirm();
            }}
            variant={variant}
            className={`h-8 text-xs font-semibold cursor-pointer ${
              isDestructive
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
