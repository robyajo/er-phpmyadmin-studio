import { createRootRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type React from "react";
import { Activity, useEffect, useMemo, useRef, useState } from "react";
import { Download, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { APP_VERSION } from "@/components/app-logo";
import { AuthGate } from "@/components/auth/auth-gate";
import { CloudSyncModal } from "@/components/workspace/modals/cloud-sync-modal";
import { WorkspaceHeader } from "@/components/workspace/workspace-header";
import { inDevelopment } from "@/constants";
import {
  CloudSyncProvider,
  useCloudSync,
} from "@/context/cloud-sync-context";
import {
  ConnectionProvider,
  useConnection,
} from "@/context/connection-context";
import {
  SettingsProvider,
  useSettings,
} from "@/context/settings-context";
import BaseLayout from "@/layouts/base-layout";
import {
  checkForAppUpdates,
  checkFirstLaunchAfterUpdate,
  type UpdateCheckResult,
} from "@/services/auto-update";

function AppShell() {
  const navigate = useNavigate();
  const {
    activeTabId,
    activeTabs,
    addTab,
    closeTab,
    isSidebarCollapsed,
    mergeProfiles,
    profiles,
    searchQuery,
    setActiveTabId,
    setIsSidebarCollapsed,
    setSearchQuery,
  } = useConnection();
  const {
    config,
    isAuthenticated,
    isSyncing,
    journal,
    logout,
    pullFromCloud,
    setCachedProfiles,
    syncNow,
  } = useCloudSync();
  const { closeSettings, isSettingsOpen } = useSettings();

  const [isCloudSyncOpen, setIsCloudSyncOpen] = useState(false);
  const [isLocalBypassed, setIsLocalBypassed] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState<UpdateCheckResult | null>(null);
  const [dismissedBannerVersion, setDismissedBannerVersion] = useState<string | null>(null);

  const openUpdatesView = () => {
    addTab({
      env: "Other",
      id: "tab-updates",
      name: "Pusat Pembaruan",
    });
    navigate({ to: "/updates" as any });
  };

  useEffect(() => {
    if (profiles?.length) {
      setCachedProfiles(profiles);
    }
  }, [profiles, setCachedProfiles]);

  // First run after update detection & auto-check updates
  useEffect(() => {
    checkFirstLaunchAfterUpdate(() => {
      openUpdatesView();
    });

    const timer = setTimeout(() => {
      checkForAppUpdates({ silent: true });
    }, 3000);

    const handleOpenChangelog = () => openUpdatesView();
    const handleUpdateAvailable = (e: Event) => {
      const detail = (e as CustomEvent<UpdateCheckResult>).detail;
      if (detail?.hasUpdate) {
        setPendingUpdate(detail);
      }
    };
    const handleOpenDownloader = () => {
      openUpdatesView();
    };

    window.addEventListener("xphpmyadmin:open_changelog", handleOpenChangelog);
    window.addEventListener("xphpmyadmin:update_available", handleUpdateAvailable);
    window.addEventListener("xphpmyadmin:open_downloader", handleOpenDownloader);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("xphpmyadmin:open_changelog", handleOpenChangelog);
      window.removeEventListener("xphpmyadmin:update_available", handleUpdateAvailable);
      window.removeEventListener("xphpmyadmin:open_downloader", handleOpenDownloader);
    };
  }, []);

  // Otomatis tarik (auto-pull) snapshot dan profil dari Cloud saat aplikasi dijalankan (mount)
  // bagi pengguna dengan paket Pro, Team, atau Business
  const lastPulledKeyRef = useRef<string | null>(null);

  useEffect(() => {
    const isNonFree = config.subscriptionTier !== "free";
    const autoSyncEnabled = config.autoSync ?? isNonFree;
    const currentKey = (config.apiToken || config.userEmail || "").trim();

    if (
      isNonFree &&
      autoSyncEnabled &&
      currentKey &&
      lastPulledKeyRef.current !== currentKey
    ) {
      lastPulledKeyRef.current = currentKey;
      pullFromCloud()
        .then((res) => {
          if (res.success && res.data?.profiles && res.data.profiles.length > 0) {
            mergeProfiles(res.data.profiles);
            toast.success("Profil Host Tersinkronisasi", {
              description: `${res.data.profiles.length} host database dimuat dari ${res.lastDevice || "Neon Cloud"}.`,
            });
          }
        })
        .catch((err) => {
          console.warn("Auto-pull on startup skipped or failed:", err);
        });
    }
  }, [
    config.subscriptionTier,
    config.autoSync,
    config.apiToken,
    config.userEmail,
    pullFromCloud,
    mergeProfiles,
  ]);

  const pendingCount = useMemo(() => {
    return journal.filter((item) => item.syncStatus === "pending").length;
  }, [journal]);

  const handleSelectTab = (tabId: string) => {
    setActiveTabId(tabId);
    if (tabId === "tab-home") {
      navigate({ to: "/" });
      return;
    }
    if (tabId === "tab-updates") {
      navigate({ to: "/updates" as any });
      return;
    }
    const tab = activeTabs.find((t) => t.id === tabId);
    if (tab?.profileId) {
      navigate({
        params: { profileId: tab.profileId },
        to: "/workspace/$profileId",
      });
    }
  };

  const handleCloseTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    closeTab(tabId);
    if (activeTabId === tabId) {
      setActiveTabId("tab-home");
      navigate({ to: "/" });
    }
  };

  const handleLogout = () => {
    logout();
    setIsLocalBypassed(false);
    navigate({ to: "/" });
  };

  // Intercept when not authenticated
  if (!isAuthenticated && !isLocalBypassed) {
    return <AuthGate onBypassLocal={() => setIsLocalBypassed(true)} />;
  }

  const showUpdateBanner =
    pendingUpdate?.hasUpdate &&
    pendingUpdate.latestVersion &&
    pendingUpdate.latestVersion !== dismissedBannerVersion;

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-background font-sans text-foreground">
      {/* Top Banner Notice for Older Versions */}
      {showUpdateBanner && (
        <div className="flex items-center justify-between bg-teal-500/10 border-b border-teal-500/25 px-3 py-1.5 text-xs text-foreground select-none animate-in slide-in-from-top duration-150">
          <div className="flex items-center gap-2 truncate">
            <span className="flex size-2 shrink-0 rounded-full bg-teal-400 animate-ping" />
            <span className="font-semibold text-teal-400 shrink-0">
              Pembaruan Tersedia:
            </span>
            <span className="truncate text-muted-foreground">
              Versi <b className="text-foreground">v{pendingUpdate.latestVersion}</b> telah dirilis di GitHub. Anda sedang menggunakan versi lama (v{APP_VERSION}).
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={openUpdatesView}
              className="inline-flex items-center gap-1 rounded bg-teal-500 hover:bg-teal-600 px-2.5 py-0.5 text-[11px] font-bold text-black transition-colors cursor-pointer shadow-xs"
            >
              <Download size={12} />
              <span>Buka Halaman Pembaruan & Unduh</span>
            </button>
            <button
              type="button"
              onClick={openUpdatesView}
              className="rounded border border-border bg-background px-2 py-0.5 text-[11px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer hidden sm:inline-block"
            >
              Lihat Catatan Rilis
            </button>
            <button
              type="button"
              onClick={() =>
                setDismissedBannerVersion(pendingUpdate.latestVersion || "dismissed")
              }
              className="rounded p-1 text-muted-foreground hover:text-foreground cursor-pointer"
              title="Sembunyikan pemberitahuan"
            >
              <X size={13} />
            </button>
          </div>
        </div>
      )}

      <WorkspaceHeader
        activeTabId={activeTabId}
        activeTabs={activeTabs}
        isSidebarCollapsed={isSidebarCollapsed}
        isSyncing={isSyncing}
        onCloseTab={handleCloseTab}
        onLogout={handleLogout}
        onManualSync={() => {
          syncNow(profiles).then((res) => {
            if (res.success) {
              toast.success("Sinkronisasi manual berhasil!", {
                description:
                  res.message ||
                  `${res.syncedItems} item disinkronkan ke cloud database.`,
              });
            } else if (res.error) {
              const errorMessage = res.error;
              toast.error("Gagal sinkronisasi manual", {
                description: errorMessage,
                duration: 20000,
                action: {
                  label: "Salin Error",
                  onClick: () => {
                    navigator.clipboard.writeText(errorMessage);
                    toast.info("Pesan error berhasil disalin ke papan klip!");
                  },
                },
              });
            }
          });
        }}
        onOpenChangelog={openUpdatesView}
        onOpenCloudSync={() => setIsCloudSyncOpen(true)}
        onSearchChange={setSearchQuery}
        onSelectTab={handleSelectTab}
        onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
        pendingSyncCount={pendingCount}
        searchQuery={searchQuery}
        userConfig={config}
      />
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <Outlet />
      </div>

      <CloudSyncModal
        isOpen={isCloudSyncOpen}
        onClose={() => setIsCloudSyncOpen(false)}
      />
    </div>
  );
}

function Root() {
  return (
    <ConnectionProvider>
      <CloudSyncProvider>
        <SettingsProvider>
          <BaseLayout>
            <AppShell />
            <Toaster closeButton position="top-right" richColors />
            {/*<Activity mode={inDevelopment ? "visible" : "hidden"}>
              <TanStackRouterDevtools />
            </Activity>*/}
          </BaseLayout>
        </SettingsProvider>
      </CloudSyncProvider>
    </ConnectionProvider>
  );
}

export const Route = createRootRoute({
  component: Root,
});
