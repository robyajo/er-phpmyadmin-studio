import { AppMenubar } from "@/components/workspace/app-menubar";
import { type ReactNode, useEffect, useState } from "react";
import { getPlatform } from "@/actions/app";
import { closeWindow, minimizeWindow } from "@/actions/window";
import { AppIcon, APP_VERSION } from "@/components/app-logo";
import { useResponsiveWindow } from "@/hooks/use-responsive";

interface DragWindowRegionProps {
  title?: ReactNode;
}

export default function DragWindowRegion({ title }: DragWindowRegionProps) {
  const [platform, setPlatform] = useState<string | null>(() => {
    if (typeof navigator !== "undefined" && typeof navigator.userAgent === "string") {
      if (navigator.userAgent.includes("Macintosh") || navigator.userAgent.includes("Mac OS")) {
        return "darwin";
      }
      if (navigator.userAgent.includes("Windows")) {
        return "win32";
      }
      if (navigator.userAgent.includes("Linux")) {
        return "linux";
      }
    }
    return null;
  });
  const { isMaximized, isNarrow, toggleMaximize } = useResponsiveWindow();

  useEffect(() => {
    let active = true;

    getPlatform()
      .then((value) => {
        if (!active) {
          return;
        }

        setPlatform(value);
      })
      .catch((error) => {
        console.error(error);
      });

    return () => {
      active = false;
    };
  }, []);

  const isMacOS = platform === "darwin";

  const defaultTitle = isNarrow
    ? "xphpMyAdmin"
    : "xphpMyAdmin Desktop";

  return (
    <div className="flex h-9 w-full items-center justify-between border-b border-border/40 bg-background/95 select-none">
      <div
        className="draglayer flex h-full min-w-0 flex-1 items-center cursor-default"
        onDoubleClick={toggleMaximize}
      >
        {!isMacOS && (
          <div className="flex h-full items-center gap-2 px-3 text-muted-foreground/80 text-xs font-medium truncate shrink-0">
            <div className="flex items-center gap-1.5 pr-1">
              <AppIcon size={14} className="shrink-0" />
              <span className="font-semibold text-foreground tracking-tight truncate hidden md:inline">
                {title || defaultTitle}
              </span>
            </div>
            {/*<button
              type="button"
              onClick={() =>
                window.dispatchEvent(
                  new CustomEvent("xphpmyadmin:open_changelog")
                )
              }
              className="no-drag inline-flex items-center gap-1 font-mono text-[10px] font-semibold text-teal-400 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 px-1.5 py-0.2 rounded transition-colors cursor-pointer"
              title={`Catatan Rilis & Log Pembaruan (v${APP_VERSION})`}
            >
              v{APP_VERSION}
            </button>*/}
            <div
              className="no-drag flex items-center"
              onDoubleClick={(e) => e.stopPropagation()}
            >
              <AppMenubar />
            </div>
            <span className="hidden lg:inline-block text-[10px] font-mono text-muted-foreground/50 border border-border/40 rounded px-1.5 py-0.2">
              {isMaximized ? "Mode Penuh" : "Mode Window"}
            </span>
          </div>
        )}
        {isMacOS && (
          <div className="flex h-full flex-1 items-center justify-between px-20 text-xs font-medium text-muted-foreground/80">
            <div className="flex items-center gap-1.5 truncate">
              <AppIcon size={14} className="shrink-0" />
              <span className="truncate">{title || defaultTitle}</span>
              {/*<button
                type="button"
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent("xphpmyadmin:open_changelog")
                  )
                }
                className="no-drag ml-1.5 inline-flex items-center gap-1 font-mono text-[10px] font-semibold text-teal-400 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 px-1.5 py-0.2 rounded transition-colors cursor-pointer"
                title={`Catatan Rilis & Log Pembaruan (v${APP_VERSION})`}
              >
                v{APP_VERSION}
              </button>*/}
            </div>
            <div
              className="no-drag flex items-center"
              onDoubleClick={(e) => e.stopPropagation()}
            >
              <AppMenubar />
            </div>
          </div>
        )}
      </div>

      {!isMacOS && (
        <div className="flex h-full items-center">
          <button
            className="flex h-full w-10 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
            onClick={minimizeWindow}
            title="Minimalkan"
            type="button"
          >
            <span className="h-0.5 w-3 bg-current" />
          </button>
          <button
            className="flex h-full w-10 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
            onClick={toggleMaximize}
            title={isMaximized ? "Pulihkan Ukuran" : "Maksimalkan"}
            type="button"
          >
            {isMaximized ? (
              <span className="relative inline-block size-3">
                <span className="absolute top-0 right-0 size-2.5 rounded-[1px] border border-current" />
                <span className="absolute bottom-0 left-0 size-2.5 rounded-[1px] border border-current bg-background" />
              </span>
            ) : (
              <span className="size-3 rounded-[1px] border border-current" />
            )}
          </button>
          <button
            className="flex h-full w-10 items-center justify-center text-muted-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground cursor-pointer"
            onClick={closeWindow}
            title="Tutup Jendela"
            type="button"
          >
            <span className="font-mono text-sm leading-none">&times;</span>
          </button>
        </div>
      )}
    </div>
  );
}
