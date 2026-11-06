import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  Cloud,
  Copy,
  Database,
  FileText,
  HelpCircle,
  Keyboard,
  Layers,
  Maximize2,
  PanelLeftClose,
  Power,
  RefreshCw,
  Scissors,
  Search,
  Settings,
  Shield,
  SunMoon,
  Terminal,
  X,
  ClipboardPaste,
  CheckSquare,
} from "lucide-react";
import { toast } from "sonner";
import { AppIcon, APP_VERSION } from "@/components/app-logo";
import { useConnection } from "@/context/connection-context";
import { useCloudSync } from "@/context/cloud-sync-context";
import { useSettings } from "@/context/settings-context";
import { useResponsiveWindow } from "@/hooks/use-responsive";
import { toggleTheme } from "@/actions/theme";
import { closeWindow } from "@/actions/window";
import { checkForAppUpdates } from "@/services/auto-update";
import { cn } from "@/utils/tailwind";

function useSafeConnection() {
  try {
    return useConnection();
  } catch {
    return null;
  }
}

function useSafeCloudSync() {
  try {
    return useCloudSync();
  } catch {
    return null;
  }
}

function useSafeSettings() {
  try {
    return useSettings();
  } catch {
    return null;
  }
}

interface AppMenubarProps {
  className?: string;
}

export function AppMenubar({ className }: AppMenubarProps) {
  const { t } = useTranslation();
  const connection = useSafeConnection();
  const cloudSync = useSafeCloudSync();
  const settings = useSafeSettings();
  const { isMaximized, toggleMaximize } = useResponsiveWindow();

  const [aboutOpen, setAboutOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  const handleNewConnection = () => {
    window.dispatchEvent(new CustomEvent("xphpmyadmin:add_connection"));
  };

  const handleNewSshTunnel = () => {
    window.dispatchEvent(new CustomEvent("xphpmyadmin:add_ssh_tunnel"));
  };

  const handleManualSync = () => {
    if (!cloudSync) return;
    toast.info(t("common.syncing", "Menjalankan sinkronisasi cloud..."));
    cloudSync
      .syncNow(connection?.profiles || [])
      .then((res) => {
        if (res.success) {
          toast.success(t("cloudSync.saveSettings", "Sinkronisasi Cloud Berhasil!"), {
            description: res.message || `${res.syncedItems} item disinkronkan.`,
          });
        } else {
          toast.error(t("common.error", "Gagal sinkronisasi"), {
            description: res.error || "Terjadi kesalahan saat sinkronisasi.",
          });
        }
      })
      .catch((err) => {
        toast.error(t("common.error", "Gagal sinkronisasi"), {
          description: err instanceof Error ? err.message : String(err),
        });
      });
  };

  const handleCloseActiveTab = () => {
    if (connection && connection.activeTabId && connection.activeTabId !== "tab-home") {
      connection.closeTab(connection.activeTabId);
      toast.info(t("header.closeTab", "Tab koneksi ditutup"));
    } else {
      toast.info("Tab utama (Home) tidak dapat ditutup");
    }
  };

  const handleCopy = () => {
    document.execCommand("copy");
    toast.success(t("common.copied", "Teks disalin ke clipboard"));
  };

  const handleCut = () => {
    document.execCommand("cut");
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const activeEl = document.activeElement as HTMLInputElement | HTMLTextAreaElement | null;
      if (activeEl && typeof activeEl.value === "string") {
        const start = activeEl.selectionStart ?? activeEl.value.length;
        const end = activeEl.selectionEnd ?? activeEl.value.length;
        activeEl.value = activeEl.value.slice(0, start) + text + activeEl.value.slice(end);
        activeEl.dispatchEvent(new Event("input", { bubbles: true }));
      } else {
        document.execCommand("paste");
      }
    } catch {
      document.execCommand("paste");
    }
  };

  const handleSelectAll = () => {
    document.execCommand("selectAll");
  };

  const handleFocusSearch = () => {
    window.dispatchEvent(new CustomEvent("xphpmyadmin:focus_search"));
  };

  const handleFilterMethod = (method: "all" | "direct" | "ssh") => {
    window.dispatchEvent(
      new CustomEvent("xphpmyadmin:filter_method", { detail: method })
    );
  };

  const handleToggleFavoriteFilter = () => {
    window.dispatchEvent(new CustomEvent("xphpmyadmin:toggle_favorite_filter"));
  };

  const handleOpenProfile = (profileId: string) => {
    window.dispatchEvent(
      new CustomEvent("xphpmyadmin:select_profile", { detail: profileId })
    );
  };

  return (
    <>
      <Menubar
        className={cn(
          "h-7 border-0 bg-transparent px-1 py-0 shadow-none select-none gap-0.5",
          className
        )}
      >
        {/* MENU: FILE / BERKAS */}
        <MenubarMenu>
          <MenubarTrigger className="h-6 px-2 py-0.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/70 data-[state=open]:bg-muted data-[state=open]:text-foreground font-medium rounded cursor-pointer transition-colors">
            {t("menubar.file", "Berkas")}
          </MenubarTrigger>
          <MenubarContent className="min-w-56 text-xs" align="start">
            <MenubarItem
              className="cursor-pointer gap-2"
              onClick={handleNewConnection}
            >
              <Database size={13} className="text-primary" />
              <span>{t("menubar.newConnection", "Koneksi Database Baru...")}</span>
              <MenubarShortcut>Ctrl+N</MenubarShortcut>
            </MenubarItem>

            <MenubarItem
              className="cursor-pointer gap-2"
              onClick={handleNewSshTunnel}
            >
              <Terminal size={13} className="text-purple-400" />
              <span>{t("menubar.newSshTunnel", "SSH Tunnel Baru...")}</span>
              <MenubarShortcut>Ctrl+Shift+N</MenubarShortcut>
            </MenubarItem>

            <MenubarSeparator />

            <MenubarItem
              className="cursor-pointer gap-2"
              onClick={handleManualSync}
            >
              <Cloud size={13} className="text-sky-400" />
              <span>{t("menubar.syncCloudNow", "Sinkronisasi Cloud Sekarang")}</span>
              <MenubarShortcut>Ctrl+S</MenubarShortcut>
            </MenubarItem>

            <MenubarItem
              className="cursor-pointer gap-2"
              onClick={() => settings?.openSettings()}
            >
              <Settings size={13} className="text-muted-foreground" />
              <span>{t("menubar.appSettings", "Pengaturan Aplikasi...")}</span>
              <MenubarShortcut>Ctrl+,</MenubarShortcut>
            </MenubarItem>

            <MenubarSeparator />

            <MenubarItem
              className="cursor-pointer gap-2"
              onClick={handleCloseActiveTab}
            >
              <X size={13} className="text-muted-foreground" />
              <span>{t("menubar.closeTab", "Tutup Tab Aktif")}</span>
              <MenubarShortcut>Ctrl+W</MenubarShortcut>
            </MenubarItem>

            <MenubarSeparator />

            <MenubarItem
              className="cursor-pointer gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
              onClick={() => closeWindow()}
              variant="destructive"
            >
              <Power size={13} />
              <span>{t("menubar.exitApp", "Keluar Aplikasi")}</span>
              <MenubarShortcut>Alt+F4</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        {/* MENU: EDIT / SUNTING */}
        <MenubarMenu>
          <MenubarTrigger className="h-6 px-2 py-0.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/70 data-[state=open]:bg-muted data-[state=open]:text-foreground font-medium rounded cursor-pointer transition-colors">
            {t("menubar.edit", "Sunting")}
          </MenubarTrigger>
          <MenubarContent className="min-w-52 text-xs" align="start">
            <MenubarItem className="cursor-pointer gap-2" onClick={handleCut}>
              <Scissors size={13} className="text-muted-foreground" />
              <span>{t("menubar.cut", "Potong")}</span>
              <MenubarShortcut>Ctrl+X</MenubarShortcut>
            </MenubarItem>

            <MenubarItem className="cursor-pointer gap-2" onClick={handleCopy}>
              <Copy size={13} className="text-muted-foreground" />
              <span>{t("menubar.copy", "Salin")}</span>
              <MenubarShortcut>Ctrl+C</MenubarShortcut>
            </MenubarItem>

            <MenubarItem className="cursor-pointer gap-2" onClick={handlePaste}>
              <ClipboardPaste size={13} className="text-muted-foreground" />
              <span>{t("menubar.paste", "Tempel")}</span>
              <MenubarShortcut>Ctrl+V</MenubarShortcut>
            </MenubarItem>

            <MenubarSeparator />

            <MenubarItem
              className="cursor-pointer gap-2"
              onClick={handleSelectAll}
            >
              <CheckSquare size={13} className="text-muted-foreground" />
              <span>{t("menubar.selectAll", "Pilih Semua Teks")}</span>
              <MenubarShortcut>Ctrl+A</MenubarShortcut>
            </MenubarItem>

            <MenubarSeparator />

            <MenubarItem
              className="cursor-pointer gap-2"
              onClick={handleFocusSearch}
            >
              <Search size={13} className="text-teal-400" />
              <span>{t("menubar.searchConnections", "Cari Koneksi...")}</span>
              <MenubarShortcut>Ctrl+F</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        {/* MENU: KONEKSI */}
        <MenubarMenu>
          <MenubarTrigger className="h-6 px-2 py-0.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/70 data-[state=open]:bg-muted data-[state=open]:text-foreground font-medium rounded cursor-pointer transition-colors">
            {t("menubar.connection", "Koneksi")}
          </MenubarTrigger>
          <MenubarContent className="min-w-56 text-xs" align="start">
            <MenubarItem
              className="cursor-pointer gap-2"
              onClick={handleNewConnection}
            >
              <Database size={13} className="text-primary" />
              <span>{t("menubar.newConnection", "Tambah Server Database Baru")}</span>
            </MenubarItem>

            <MenubarItem
              className="cursor-pointer gap-2"
              onClick={handleNewSshTunnel}
            >
              <Terminal size={13} className="text-purple-400" />
              <span>{t("menubar.newSshTunnel", "Tambah Profil SSH Tunnel")}</span>
            </MenubarItem>

            <MenubarSeparator />

            {/* Submenu Filter */}
            <MenubarSub>
              <MenubarSubTrigger className="cursor-pointer gap-2">
                <Layers size={13} className="text-muted-foreground" />
                <span>{t("grid.filterAll", "Filter Tipe Koneksi")}</span>
              </MenubarSubTrigger>
              <MenubarSubContent className="min-w-44 text-xs">
                <MenubarItem
                  className="cursor-pointer"
                  onClick={() => handleFilterMethod("all")}
                >
                  {t("menubar.filterAll", "Semua Tipe Koneksi")}
                </MenubarItem>
                <MenubarItem
                  className="cursor-pointer"
                  onClick={() => handleFilterMethod("direct")}
                >
                  {t("menubar.filterDirect", "Koneksi Langsung (Direct)")}
                </MenubarItem>
                <MenubarItem
                  className="cursor-pointer"
                  onClick={() => handleFilterMethod("ssh")}
                >
                  {t("menubar.filterSsh", "Terowongan SSH (Tunnel)")}
                </MenubarItem>
              </MenubarSubContent>
            </MenubarSub>

            <MenubarItem
              className="cursor-pointer gap-2"
              onClick={handleToggleFavoriteFilter}
            >
              <Shield size={13} className="text-amber-400" />
              <span>{t("grid.favoritesOnly", "Filter Host Favorit")}</span>
            </MenubarItem>

            <MenubarSeparator />

            {/* Quick Connection List */}
            {connection?.profiles && connection.profiles.length > 0 ? (
              <MenubarSub>
                <MenubarSubTrigger className="cursor-pointer gap-2">
                  <Database size={13} className="text-muted-foreground" />
                  <span>Daftar Server ({connection.profiles.length})</span>
                </MenubarSubTrigger>
                <MenubarSubContent className="min-w-52 max-h-60 overflow-y-auto text-xs">
                  {connection.profiles.slice(0, 15).map((p) => (
                    <MenubarItem
                      key={p.id}
                      className="cursor-pointer gap-1.5"
                      onClick={() => handleOpenProfile(p.id)}
                    >
                      <span
                        className={cn(
                          "size-1.5 rounded-full",
                          p.method === "ssh"
                            ? "bg-purple-400"
                            : "bg-teal-400"
                        )}
                      />
                      <span className="truncate">{p.name || p.host}</span>
                      <span className="ml-auto text-[10px] font-mono text-muted-foreground">
                        :{p.port}
                      </span>
                    </MenubarItem>
                  ))}
                </MenubarSubContent>
              </MenubarSub>
            ) : null}
          </MenubarContent>
        </MenubarMenu>

        {/* MENU: TAMPILAN / VIEW */}
        <MenubarMenu>
          <MenubarTrigger className="h-6 px-2 py-0.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/70 data-[state=open]:bg-muted data-[state=open]:text-foreground font-medium rounded cursor-pointer transition-colors">
            {t("menubar.view", "Tampilan")}
          </MenubarTrigger>
          <MenubarContent className="min-w-52 text-xs" align="start">
            <MenubarItem
              className="cursor-pointer gap-2"
              onClick={() => toggleTheme()}
            >
              <SunMoon size={13} className="text-muted-foreground" />
              <span>{t("menubar.toggleTheme", "Ganti Tema (Gelap / Terang)")}</span>
            </MenubarItem>

            <MenubarItem
              className="cursor-pointer gap-2"
              onClick={toggleMaximize}
            >
              <Maximize2 size={13} className="text-muted-foreground" />
              <span>{isMaximized ? "Mode Normal" : t("menubar.toggleMaximize", "Maksimalkan Jendela")}</span>
              <MenubarShortcut>F11</MenubarShortcut>
            </MenubarItem>

            <MenubarSeparator />

            <MenubarItem
              className="cursor-pointer gap-2"
              onClick={() => window.location.reload()}
            >
              <RefreshCw size={13} className="text-muted-foreground" />
              <span>Muat Ulang Aplikasi (Reload)</span>
              <MenubarShortcut>Ctrl+R</MenubarShortcut>
            </MenubarItem>

            <MenubarSeparator />

            <MenubarItem
              className="cursor-pointer gap-2"
              onClick={() =>
                connection?.setIsSidebarCollapsed((prev) => !prev)
              }
            >
              <PanelLeftClose size={13} className="text-muted-foreground" />
              <span>{t("header.collapseSidebar", "Perluas / Ciutkan Sidebar")}</span>
              <MenubarShortcut>Ctrl+B</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        {/* MENU: BANTUAN / HELP */}
        <MenubarMenu>
          <MenubarTrigger className="h-6 px-2 py-0.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/70 data-[state=open]:bg-muted data-[state=open]:text-foreground font-medium rounded cursor-pointer transition-colors">
            {t("menubar.help", "Bantuan")}
          </MenubarTrigger>
          <MenubarContent className="min-w-60 text-xs" align="start">
            <MenubarItem
              className="cursor-pointer gap-2"
              onClick={() => setShortcutsOpen(true)}
            >
              <Keyboard size={13} className="text-muted-foreground" />
              <span>{t("menubar.keyboardShortcuts", "Daftar Shortcut Keyboard")}</span>
            </MenubarItem>

            <MenubarItem
              className="cursor-pointer gap-2"
              onClick={() =>
                window.dispatchEvent(
                  new CustomEvent("xphpmyadmin:open_changelog")
                )
              }
            >
              <FileText size={13} className="text-teal-400" />
              <span>Catatan Rilis & Log Pembaruan</span>
            </MenubarItem>

            <MenubarItem
              className="cursor-pointer gap-2"
              onClick={() => {
                checkForAppUpdates({
                  silent: false,
                  onOpenChangelog: () =>
                    window.dispatchEvent(
                      new CustomEvent("xphpmyadmin:open_changelog")
                    ),
                });
              }}
            >
              <RefreshCw size={13} className="text-muted-foreground" />
              <span>{t("menubar.checkUpdates", "Periksa Pembaruan Online...")}</span>
            </MenubarItem>

            <MenubarSeparator />

            <MenubarItem
              className="cursor-pointer gap-2"
              onClick={() => setAboutOpen(true)}
            >
              <HelpCircle size={13} className="text-primary" />
              <span>{t("menubar.aboutApp", "Tentang xphpMyAdmin Desktop")}</span>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>

      {/* MODAL / DIALOG: TENTANG APLIKASI */}
      {aboutOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 select-none animate-in fade-in duration-150"
          onClick={() => setAboutOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-xl border border-border bg-card p-5 shadow-2xl text-foreground space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <AppIcon size={36} className="shrink-0" />
              <div>
                <h3 className="font-bold text-sm tracking-tight">
                  xphpMyAdmin Desktop
                </h3>
                <p className="text-xs text-muted-foreground font-mono">
                  v{APP_VERSION} (Production Build)
                </p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Klien manajemen database modern pengganti phpMyAdmin berbasis Electron, React, TanStack, dan Tailwind CSS dengan dukungan SSH Tunneling dan Cloud Sync.
            </p>

            <div className="rounded-lg border border-border/60 bg-muted/30 p-2.5 text-[11px] font-mono space-y-1 text-muted-foreground">
              <div className="flex justify-between">
                <span>Arsitektur:</span>
                <span className="text-foreground">Electron + Vite</span>
              </div>
              <div className="flex justify-between">
                <span>Protokol Deep Link:</span>
                <span className="text-foreground">xphpmyadmin://</span>
              </div>
              <div className="flex justify-between">
                <span>Pustaka UI:</span>
                <span className="text-foreground">Radix UI + Lucide</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
                onClick={() => {
                  setAboutOpen(false);
                  window.dispatchEvent(
                    new CustomEvent("xphpmyadmin:open_changelog")
                  );
                }}
                type="button"
              >
                Lihat Catatan Rilis
              </button>
              <button
                className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
                onClick={() => setAboutOpen(false)}
                type="button"
              >
                {t("common.close", "Tutup")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL / DIALOG: DAFTAR SHORTCUT KEYBOARD */}
      {shortcutsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 select-none animate-in fade-in duration-150"
          onClick={() => setShortcutsOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-2xl text-foreground space-y-4 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Keyboard size={18} className="text-primary" />
                <h3 className="font-bold text-sm">{t("menubar.keyboardShortcuts", "Shortcut Keyboard Aplikasi")}</h3>
              </div>
              <button
                className="rounded p-1 text-muted-foreground hover:text-foreground cursor-pointer"
                onClick={() => setShortcutsOpen(false)}
                type="button"
              >
                <X size={15} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1.5">
                <h4 className="font-semibold text-muted-foreground text-[11px] uppercase tracking-wider">
                  Manajemen Koneksi & Tab
                </h4>
                <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                  <span>{t("menubar.newConnection", "Koneksi Baru")}</span>
                  <span className="font-mono text-foreground text-right">Ctrl + N</span>
                  <span>{t("menubar.newSshTunnel", "SSH Tunnel Baru")}</span>
                  <span className="font-mono text-foreground text-right">Ctrl + Shift + N</span>
                  <span>{t("menubar.syncCloudNow", "Sinkronisasi Cloud")}</span>
                  <span className="font-mono text-foreground text-right">Ctrl + S</span>
                  <span>{t("menubar.closeTab", "Tutup Tab Aktif")}</span>
                  <span className="font-mono text-foreground text-right">Ctrl + W</span>
                </div>
              </div>

              <div className="border-t border-border pt-2 space-y-1.5">
                <h4 className="font-semibold text-muted-foreground text-[11px] uppercase tracking-wider">
                  Tampilan & Jendela
                </h4>
                <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                  <span>Muat Ulang (Reload)</span>
                  <span className="font-mono text-foreground text-right">Ctrl + R</span>
                  <span>{t("menubar.toggleMaximize", "Layar Penuh (Maximize)")}</span>
                  <span className="font-mono text-foreground text-right">F11</span>
                  <span>{t("header.collapseSidebar", "Toggle Sidebar")}</span>
                  <span className="font-mono text-foreground text-right">Ctrl + B</span>
                  <span>{t("sidebar.settings", "Pengaturan")}</span>
                  <span className="font-mono text-foreground text-right">Ctrl + ,</span>
                  <span>{t("menubar.searchConnections", "Cari Koneksi")}</span>
                  <span className="font-mono text-foreground text-right">Ctrl + F</span>
                </div>
              </div>

              <div className="border-t border-border pt-2 space-y-1.5">
                <h4 className="font-semibold text-muted-foreground text-[11px] uppercase tracking-wider">
                  Klik Kanan (Context Menu)
                </h4>
                <div className="space-y-1 text-muted-foreground text-[11px]">
                  <p>• Klik kanan pada kartu koneksi untuk opsi cepat: <b>Hubungkan</b>, <b>Edit</b>, <b>Duplikat</b>, <b>Salin Host/URI/SSH</b>, dan <b>Hapus</b>.</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-border">
              <button
                className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
                onClick={() => setShortcutsOpen(false)}
                type="button"
              >
                {t("common.confirm", "Mengerti")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
