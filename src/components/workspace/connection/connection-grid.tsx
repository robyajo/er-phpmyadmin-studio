import {
  ClipboardCopy,
  Copy,
  Database,
  Play,
  Plus,
  ShieldAlert,
  SlidersHorizontal,
  Star,
  Terminal,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import type React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Profile } from "@/types/connection";
import { cn } from "@/utils/tailwind";

interface ConnectionGridProps {
  favoritesOnly: boolean;
  filteredProfiles: Profile[];
  isInspectorOpen: boolean;
  methodFilter?: "all" | "direct" | "ssh";
  onAddNewHost: () => void;
  onAddNewSshTunnel?: () => void;
  onConnectHost?: (p: Profile) => void;
  onDeleteHost: (p: Profile) => void;
  onDuplicateHost?: (p: Profile, e: React.MouseEvent) => void;
  onMethodFilterChange?: (val: "all" | "direct" | "ssh") => void;
  onSelectHost: (p: Profile) => void;
  onSortByChange: (val: "recent" | "name") => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onToggleFavoriteFilter: (val: boolean) => void;
  onToggleInspector: () => void;
  selectedId: string;
  sortBy: "recent" | "name";
}

export function ConnectionGrid({
  favoritesOnly,
  filteredProfiles,
  isInspectorOpen,
  methodFilter = "all",
  onAddNewHost,
  onAddNewSshTunnel,
  onConnectHost,
  onDeleteHost,
  onDuplicateHost,
  onMethodFilterChange,
  onSelectHost,
  onSortByChange,
  onToggleFavorite,
  onToggleFavoriteFilter,
  onToggleInspector,
  selectedId,
  sortBy,
}: ConnectionGridProps) {
  const { t } = useTranslation();

  const handleCopyInfo = (label: string, text: string) => {
    try {
      navigator.clipboard.writeText(text);
      toast.success(t("grid.copySuccess", "{{label}} disalin ke clipboard!", { label }), {
        description: text,
      });
    } catch {
      toast.error(t("grid.copyFailed", "Gagal menyalin {{label}}", { label }));
    }
  };

  return (
    <section className="flex min-w-0 flex-1 flex-col overflow-hidden bg-background">
      {/* Top Toolbar */}
      <div className="flex h-10 shrink-0 items-center justify-between border-border border-b bg-background px-2.5 sm:px-4 gap-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <Button
            className="flex h-7 cursor-pointer items-center gap-1.5 rounded-md bg-primary px-2 font-semibold text-primary-foreground text-xs hover:bg-primary/90 sm:px-2.5"
            onClick={onAddNewHost}
            size="sm"
          >
            <Plus size={13} />
            <span className="hidden sm:inline">{t("grid.addHost", "Tambah Koneksi")}</span>
            <span className="sm:hidden">{t("grid.addHostShort", "Tambah")}</span>
          </Button>

          {onAddNewSshTunnel && (
            <Button
              className="flex h-7 cursor-pointer items-center gap-1.5 rounded-md border border-purple-300 bg-purple-50 px-2 font-semibold text-purple-700 text-xs hover:bg-purple-100 dark:border-purple-500/40 dark:bg-purple-600/15 dark:text-purple-200 dark:hover:bg-purple-600/25 sm:px-2.5"
              onClick={onAddNewSshTunnel}
              size="sm"
              title={t("grid.addSshTunnelTitle", "Buat koneksi baru dengan metode SSH Tunnel (VPS)")}
              variant="outline"
            >
              <Terminal size={12} />
              <span className="hidden sm:inline">{t("grid.addSshTunnel", "+ SSH Tunnel")}</span>
              <span className="sm:hidden">{t("grid.addSshTunnelShort", "SSH")}</span>
            </Button>
          )}

          <div className="mx-0.5 sm:mx-1 h-3.5 w-[1px] bg-border" />

          {/* Method Filter Tabs */}
          {onMethodFilterChange && (
            <div className="hidden sm:flex items-center gap-0.5 rounded-md border border-border bg-muted/40 p-0.5">
              <button
                className={cn(
                  "cursor-pointer rounded px-2 py-0.5 text-[11px] font-medium transition-all",
                  methodFilter === "all"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => onMethodFilterChange("all")}
                type="button"
              >
                {t("grid.filterAll", "Semua")}
              </button>
              <button
                className={cn(
                  "cursor-pointer rounded px-2 py-0.5 text-[11px] font-medium transition-all",
                  methodFilter === "direct"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => onMethodFilterChange("direct")}
                type="button"
              >
                {t("grid.filterDirect", "Direct")}
              </button>
              <button
                className={cn(
                  "flex cursor-pointer items-center gap-1 rounded px-2 py-0.5 text-[11px] font-medium transition-all",
                  methodFilter === "ssh"
                    ? "bg-purple-600 text-white shadow-xs"
                    : "text-purple-700 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                )}
                onClick={() => onMethodFilterChange("ssh")}
                type="button"
              >
                <Terminal size={10} />
                <span>{t("grid.filterSsh", "SSH")}</span>
              </button>
            </div>
          )}

          <div className="flex items-center gap-1.5 text-muted-foreground text-xs pl-1">
            <input
              checked={favoritesOnly}
              className="rounded border-border bg-muted text-foreground focus:ring-0 cursor-pointer"
              id="fav-filter"
              onChange={(e) => onToggleFavoriteFilter(e.target.checked)}
              type="checkbox"
            />
            <label
              className="cursor-pointer select-none text-[11px] hidden xs:inline"
              htmlFor="fav-filter"
            >
              {t("grid.favoritesOnly", "Favorit")}
            </label>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <span className="hidden text-[11px] text-muted-foreground/70 md:inline">
            {t("grid.sortBy", "Urutkan:")}
          </span>
          <Select
            onValueChange={(val: "recent" | "name") => onSortByChange(val)}
            value={sortBy}
          >
            <SelectTrigger className="h-7 w-24 sm:w-28 border-border text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="text-xs">
              <SelectItem value="recent">{t("grid.sortRecent", "Terakhir")}</SelectItem>
              <SelectItem value="name">{t("grid.sortName", "Nama")}</SelectItem>
            </SelectContent>
          </Select>
          <Button
            className={cn(
              "flex h-7 items-center gap-1.5 border-border px-2 text-xs transition-colors",
              isInspectorOpen
                ? "border-border bg-accent text-foreground font-medium"
                : "bg-muted/40 text-muted-foreground hover:text-foreground"
            )}
            onClick={onToggleInspector}
            size="sm"
            title={
              isInspectorOpen
                ? t("grid.closeInspector", "Tutup Inspector Host Details")
                : t("grid.openInspector", "Buka Inspector Host Details")
            }
            variant="outline"
          >
            <SlidersHorizontal size={12} />
            <span className="hidden sm:inline">{t("grid.hostDetails", "Detail Host")}</span>
          </Button>
        </div>
      </div>

      {/* Grid of Profile Cards */}
      <div className="flex-1 space-y-3 overflow-y-auto p-3 sm:p-4">
        <div className="flex items-center justify-between text-muted-foreground text-xs">
          <span>{t("grid.connectionsFound", "{{count}} koneksi ditemukan", { count: filteredProfiles.length })}</span>
          <span className="hidden text-[11px] text-muted-foreground/70 sm:inline">
            {t("grid.readyToConnect", "Tervalidasi siap terhubung ke MySQL & MariaDB")}
          </span>
        </div>

        {filteredProfiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-border border-dashed p-10 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted/60 text-muted-foreground">
              {methodFilter === "ssh" ? <Terminal size={22} /> : <Database size={22} />}
            </div>
            <h4 className="mt-3 font-semibold text-foreground text-sm">
              {methodFilter === "ssh"
                ? t("grid.noSshTitle", "Belum ada koneksi SSH Tunnel")
                : t("grid.noHostTitle", "Tidak ada koneksi yang cocok")}
            </h4>
            <p className="mt-1 max-w-sm text-muted-foreground text-xs">
              {methodFilter === "ssh"
                ? t("grid.noSshDesc", "Buat profil koneksi baru dengan metode SSH Tunnel untuk menghubungkan database di VPS tanpa membuka port publik.")
                : t("grid.noHostDesc", "Coba ubah kata kunci pencarian atau buat koneksi database baru.")}
            </p>
            {methodFilter === "ssh" && onAddNewSshTunnel && (
              <Button
                className="mt-4 flex items-center gap-1.5 bg-purple-600 font-semibold text-white hover:bg-purple-700"
                onClick={onAddNewSshTunnel}
                size="sm"
              >
                <Terminal size={13} />
                {t("grid.createSshNow", "+ Buat SSH Tunnel Sekarang")}
              </Button>
            )}
          </div>
        ) : (
          <div
            className={cn(
              "grid gap-3 transition-all",
              isInspectorOpen
                ? "grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
            )}
          >
            {filteredProfiles.map((p) => {
              const isSelected = p.id === selectedId;
              const isProd = p.environment === "Production";
              const isSsh = p.method === "ssh";
              return (
                <ContextMenu key={p.id}>
                  <ContextMenuTrigger asChild>
                    <Card
                      className={cn(
                        "group relative cursor-pointer rounded-lg border border-border bg-card p-3.5 transition-all hover:border-white/20 hover:bg-muted/40",
                        isSelected &&
                          "border-primary shadow-[0_0_12px_rgba(20,184,166,0.2)] ring-1 ring-primary",
                        isSsh && !isSelected && "border-purple-200 hover:border-purple-400 dark:border-purple-500/20 dark:hover:border-purple-500/40"
                      )}
                      onClick={() => onSelectHost(p)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <div
                            className={cn(
                              "flex size-8 shrink-0 items-center justify-center rounded-md border",
                              isProd
                                ? "border-destructive/30 bg-destructive/10 text-destructive"
                                : isSsh
                                  ? "border-purple-200 bg-purple-100 text-purple-700 dark:border-purple-500/40 dark:bg-purple-500/10 dark:text-purple-400"
                                  : "border-border bg-muted text-primary"
                            )}
                          >
                            {isSsh ? <Terminal size={15} /> : <Database size={15} />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="flex items-center gap-1.5 font-semibold text-foreground text-xs tracking-tight transition-colors group-hover:text-primary truncate">
                              <span className="truncate">{p.name}</span>
                              {isProd && (
                                <ShieldAlert className="text-destructive shrink-0" size={11} />
                              )}
                            </h4>
                            <p className="font-mono text-[11px] text-muted-foreground truncate">
                              {p.host}:{p.port}
                            </p>
                            {isSsh && p.ssh?.host && (
                              <p className="font-mono text-[10px] text-purple-700 dark:text-purple-400/90 truncate">
                                via {p.ssh.username || "root"}@{p.ssh.host}:{p.ssh.port || 22}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {onDuplicateHost && (
                            <button
                              aria-label={`Duplikat koneksi ${p.name}`}
                              className="cursor-pointer rounded p-1 text-muted-foreground/60 transition-colors hover:bg-primary/10 hover:text-primary"
                              onClick={(e) => onDuplicateHost(p, e)}
                              title={t("grid.duplicateHost", "Duplikasi / Klon Koneksi Ini")}
                              type="button"
                            >
                              <Copy size={13} />
                            </button>
                          )}
                          <button
                            aria-label={`Hapus koneksi ${p.name}`}
                            className="cursor-pointer rounded p-1 text-muted-foreground/60 transition-colors hover:bg-destructive/10 hover:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteHost(p);
                            }}
                            title={t("grid.deleteHost", "Hapus Koneksi")}
                            type="button"
                          >
                            <Trash2 size={13} />
                          </button>
                          <button
                            aria-label={
                              p.favorite
                                ? t("grid.removeFromFavorites", "Hapus dari Favorit")
                                : t("grid.addToFavorites", "Tambah ke Favorit")
                            }
                            className="cursor-pointer p-1 text-muted-foreground/70 transition-colors hover:text-amber-500"
                            onClick={(e) => onToggleFavorite(p.id, e)}
                            type="button"
                          >
                            <Star
                              className={cn(
                                p.favorite && "fill-amber-500 text-amber-500"
                              )}
                              size={13}
                            />
                          </button>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between border-border border-t pt-2 text-[10px]">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <Badge
                            className={cn(
                              "px-1.5 py-0 font-medium text-[9px] uppercase tracking-wide shrink-0",
                              isProd &&
                                "border-destructive/30 bg-destructive/10 text-destructive",
                              p.environment === "Staging" &&
                                "border-amber-500/30 bg-amber-500/10 text-amber-500",
                              p.environment === "Local" &&
                                "border-emerald-500/30 bg-emerald-500/10 text-emerald-500",
                              p.environment === "Other" &&
                                "border-border text-muted-foreground"
                            )}
                            variant="outline"
                          >
                            {p.environment}
                          </Badge>
                          {isSsh ? (
                            <Badge
                              className="border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-500/40 dark:bg-purple-500/10 dark:text-purple-300 px-1.5 py-0 font-medium text-[9px] truncate"
                              variant="outline"
                            >
                              🔒 SSH
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground/70 text-[10px]">Direct</span>
                          )}
                        </div>
                        <span className="text-muted-foreground/70 truncate ml-2 text-[10px]">
                          {p.last_used_at ? t("grid.lastConnected", "Aktif baru-baru ini") : t("grid.neverConnected", "Belum dibuka")}
                        </span>
                      </div>
                    </Card>
                  </ContextMenuTrigger>

                  <ContextMenuContent className="w-56 text-xs select-none">
                    <ContextMenuItem
                      className="cursor-pointer gap-2 font-medium"
                      onClick={() => {
                        if (onConnectHost) {
                          onConnectHost(p);
                        } else {
                          onSelectHost(p);
                        }
                      }}
                    >
                      <Play className="text-primary fill-primary/20" size={13} />
                      <span>{t("grid.connectHost", "Hubungkan Database")}</span>
                      <ContextMenuShortcut>↵</ContextMenuShortcut>
                    </ContextMenuItem>

                    <ContextMenuItem
                      className="cursor-pointer gap-2"
                      onClick={() => onSelectHost(p)}
                    >
                      <SlidersHorizontal className="text-muted-foreground" size={13} />
                      <span>{t("inspector.saveProfile", "Buka Form / Edit Profil")}</span>
                    </ContextMenuItem>

                    {onDuplicateHost && (
                      <ContextMenuItem
                        className="cursor-pointer gap-2"
                        onClick={(e) => onDuplicateHost(p, e)}
                      >
                        <Copy className="text-muted-foreground" size={13} />
                        <span>{t("grid.duplicateHost", "Duplikat / Clone Koneksi")}</span>
                      </ContextMenuItem>
                    )}

                    <ContextMenuItem
                      className="cursor-pointer gap-2"
                      onClick={(e) => onToggleFavorite(p.id, e)}
                    >
                      <Star
                        className={cn(
                          "text-muted-foreground",
                          p.favorite && "fill-amber-500 text-amber-500"
                        )}
                        size={13}
                      />
                      <span>
                        {p.favorite
                          ? t("grid.removeFromFavorites", "Hapus dari Favorit")
                          : t("grid.addToFavorites", "Tambah ke Favorit")}
                      </span>
                    </ContextMenuItem>

                    <ContextMenuSeparator />

                    <ContextMenuSub>
                      <ContextMenuSubTrigger className="cursor-pointer gap-2">
                        <ClipboardCopy className="text-muted-foreground" size={13} />
                        <span>{t("grid.copyConnectionInfo", "Salin Informasi Koneksi")}</span>
                      </ContextMenuSubTrigger>
                      <ContextMenuSubContent className="w-52 text-xs">
                        <ContextMenuItem
                          className="cursor-pointer"
                          onClick={() => handleCopyInfo("Host", p.host)}
                        >
                          {t("grid.copyHost", "Salin Host")} ({p.host})
                        </ContextMenuItem>
                        <ContextMenuItem
                          className="cursor-pointer"
                          onClick={() => handleCopyInfo("Port", String(p.port))}
                        >
                          {t("grid.copyPort", "Salin Port")} ({p.port})
                        </ContextMenuItem>
                        <ContextMenuItem
                          className="cursor-pointer"
                          onClick={() => handleCopyInfo("Username", p.username)}
                        >
                          {t("grid.copyUsername", "Salin Username")} ({p.username})
                        </ContextMenuItem>
                        {p.database && (
                          <ContextMenuItem
                            className="cursor-pointer"
                            onClick={() =>
                              handleCopyInfo("Database", p.database || "")
                            }
                          >
                            {t("grid.copyDatabase", "Salin Database")} ({p.database})
                          </ContextMenuItem>
                        )}
                        <ContextMenuSeparator />
                        <ContextMenuItem
                          className="cursor-pointer"
                          onClick={() =>
                            handleCopyInfo(
                              "MySQL Connection URI",
                              `mysql://${p.username}@${p.host}:${p.port}/${p.database || ""}`
                            )
                          }
                        >
                          {t("grid.copyMysqlUri", "Salin MySQL URI")}
                        </ContextMenuItem>
                        {isSsh && p.ssh?.host && (
                          <ContextMenuItem
                            className="cursor-pointer text-purple-700 dark:text-purple-400"
                            onClick={() =>
                              handleCopyInfo(
                                "Perintah SSH Tunnel",
                                `ssh -L ${p.port}:${p.host}:${p.port} ${p.ssh?.username || "root"}@${p.ssh?.host || "localhost"} -p ${p.ssh?.port || 22} -N`
                              )
                            }
                          >
                            {t("grid.copySshCli", "Salin Perintah SSH CLI")}
                          </ContextMenuItem>
                        )}
                      </ContextMenuSubContent>
                    </ContextMenuSub>

                    <ContextMenuSeparator />

                    <ContextMenuItem
                      className="cursor-pointer gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
                      onClick={() => onDeleteHost(p)}
                      variant="destructive"
                    >
                      <Trash2 size={13} />
                      <span>{t("grid.deleteHost", "Hapus Koneksi")}</span>
                      <ContextMenuShortcut>Del</ContextMenuShortcut>
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
