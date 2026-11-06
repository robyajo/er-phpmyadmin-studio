import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  AlertTriangle,
  ArrowDownToLine,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Download,
  ExternalLink,
  Flame,
  Globe,
  Home,
  Laptop,
  Play,
  RefreshCw,
  Search,
  Sparkles,
  Tag,
  Wrench,
  Zap,
} from "lucide-react";
import { AppIcon, APP_VERSION } from "@/components/app-logo";
import { RELEASES_DATA, type ReleaseNote } from "@/data/releases";
import {
  type GitHubRelease,
  type MatchedAsset,
  checkForAppUpdates,
  detectPlatform,
  getMatchingReleaseAsset,
} from "@/services/auto-update";
import { useConnection } from "@/context/connection-context";
import { cn } from "@/utils/tailwind";

type DownloadStatus = "idle" | "downloading" | "complete" | "error";

export function UpdatesView() {
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const { setActiveTabId } = useConnection();

  const [selectedVersion, setSelectedVersion] = useState<string>(APP_VERSION);
  const [lang, setLang] = useState<"id" | "en">(
    i18n.language?.startsWith("en") ? "en" : "id"
  );

  useEffect(() => {
    setLang(i18n.language?.startsWith("en") ? "en" : "id");
  }, [i18n.language]);

  const toggleChangelogLang = () => {
    const nextLang = lang === "id" ? "en" : "id";
    setLang(nextLang);
    if (typeof i18n?.changeLanguage === "function") {
      i18n.changeLanguage(nextLang);
    }
    try {
      localStorage.setItem("lang", nextLang);
    } catch {}
  };
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "new" | "improvement" | "fix">("all");
  const [searchFilter, setSearchFilter] = useState("");

  // Update & Downloader State
  const [remoteRelease, setRemoteRelease] = useState<GitHubRelease | null>(null);
  const [matchingAsset, setMatchingAsset] = useState<MatchedAsset | null>(null);
  const [hasNewerVersion, setHasNewerVersion] = useState(false);
  const [latestVersion, setLatestVersion] = useState<string>(APP_VERSION);
  const [status, setStatus] = useState<DownloadStatus>("idle");
  const [percent, setPercent] = useState<number>(0);
  const [downloadedBytes, setDownloadedBytes] = useState<number>(0);
  const [totalBytes, setTotalBytes] = useState<number>(85 * 1024 * 1024);
  const [downloadedFilePath, setDownloadedFilePath] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const platform = matchingAsset?.platform || detectPlatform();
  const fileName =
    matchingAsset?.name ||
    `xphpmyadmin-${latestVersion}-${platform}.${
      platform === "linux" ? "AppImage" : platform === "win32" ? "exe" : "dmg"
    }`;
  const downloadUrl =
    matchingAsset?.url ||
    remoteRelease?.html_url ||
    "https://github.com/ajoroby/xphpmyadmin/releases";

  // Check for updates on mount
  useEffect(() => {
    let isMounted = true;
    checkForAppUpdates({ silent: true })
      .then((res) => {
        if (!isMounted) return;
        if (res.hasUpdate && res.release) {
          setHasNewerVersion(true);
          setRemoteRelease(res.release);
          setLatestVersion(res.latestVersion || APP_VERSION);
          const asset = res.matchingAsset || getMatchingReleaseAsset(res.release);
          setMatchingAsset(asset);
          if (asset?.size) setTotalBytes(asset.size);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  // Listen for electron updater progress
  useEffect(() => {
    if (typeof window === "undefined" || !window.electronUpdater) {
      return;
    }

    const unsubProgress = window.electronUpdater.onProgress((data) => {
      setStatus("downloading");
      setDownloadedBytes(data.bytes);
      if (data.total > 0) setTotalBytes(data.total);
      setPercent(data.percent);
    });

    const unsubComplete = window.electronUpdater.onComplete((data) => {
      setStatus("complete");
      setPercent(100);
      setDownloadedFilePath(data.filePath);
    });

    const unsubError = window.electronUpdater.onError((data) => {
      setStatus("error");
      setErrorMessage(data.error || "Gagal mengunduh berkas");
    });

    return () => {
      unsubProgress();
      unsubComplete();
      unsubError();
    };
  }, []);

  const handleManualCheck = async () => {
    setIsCheckingUpdate(true);
    try {
      const res = await checkForAppUpdates({ silent: false });
      if (res.hasUpdate && res.release) {
        setHasNewerVersion(true);
        setRemoteRelease(res.release);
        setLatestVersion(res.latestVersion || APP_VERSION);
        const asset = res.matchingAsset || getMatchingReleaseAsset(res.release);
        setMatchingAsset(asset);
        if (asset?.size) setTotalBytes(asset.size);
      }
    } finally {
      setIsCheckingUpdate(false);
    }
  };

  const handleStartDownload = async () => {
    setStatus("downloading");
    setPercent(0);
    setDownloadedBytes(0);
    setErrorMessage("");

    if (typeof window !== "undefined" && window.electronUpdater) {
      try {
        const res = await window.electronUpdater.startDownload({
          url: downloadUrl,
          fileName,
        });

        if (!res.success) {
          setStatus("error");
          setErrorMessage(res.error || "Gagal mengunduh pembaruan dari server.");
        }
      } catch (err) {
        setStatus("error");
        setErrorMessage(err instanceof Error ? err.message : String(err));
      }
    } else {
      // Browser fallback simulation
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 10;
        setPercent(currentProgress);
        setDownloadedBytes(Math.round((currentProgress / 100) * totalBytes));

        if (currentProgress >= 100) {
          clearInterval(interval);
          setStatus("complete");
          if (typeof window !== "undefined") {
            window.open(downloadUrl, "_blank");
          }
        }
      }, 200);
    }
  };

  const handleInstallNow = async () => {
    if (typeof window !== "undefined" && window.electronUpdater && downloadedFilePath) {
      await window.electronUpdater.openInstaller(downloadedFilePath);
    } else if (typeof window !== "undefined") {
      window.open(downloadUrl, "_blank");
    }
  };

  const activeRelease: ReleaseNote =
    RELEASES_DATA.find((r) => r.version === selectedVersion) ||
    RELEASES_DATA[0];

  const formatMb = (bytes: number) => {
    return (bytes / (1024 * 1024)).toFixed(1);
  };

  const filteredItems = (activeRelease.items || []).filter((item) => {
    if (filterType !== "all" && item.type !== filterType) return false;
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      const matchText = (lang === "id" ? item.id : item.en).toLowerCase();
      return matchText.includes(q);
    }
    return true;
  });

  const handleBackToHome = () => {
    setActiveTabId("tab-home");
    navigate({ to: "/" });
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-background font-sans text-foreground select-none">
      {/* Top Navigation & Action Bar */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card/70 px-4 sm:px-6 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleBackToHome}
            className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            title={t("updates.backToHome", "Kembali ke Ruang Kerja Utama (Home)")}
          >
            <ArrowLeft size={16} />
          </button>
          <div className="flex items-center gap-2.5">
            <AppIcon size={30} withBackground />
            <div>
              <h1 className="font-bold text-sm tracking-tight text-foreground flex items-center gap-2">
                <span>{t("updates.title", "Pusat Pembaruan & Catatan Rilis")}</span>
                <span className="rounded bg-teal-500/15 border border-teal-500/30 px-2 py-0.5 font-mono text-[10px] font-semibold text-teal-400">
                  {`v${APP_VERSION} (${t("updates.installed", "Terpasang")})`}
                </span>
                {hasNewerVersion && (
                  <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 flex items-center gap-1 animate-pulse">
                    <Sparkles size={11} />
                    {`v${latestVersion} ${t("updates.available", "Tersedia")}`}
                  </span>
                )}
              </h1>
              <p className="text-[11px] text-muted-foreground">
                {t("updates.subtitle", "Pantau pembaruan sistem, unduh binary resmi GitHub, dan eksplorasi log perubahan")}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <button
            type="button"
            onClick={toggleChangelogLang}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            title={t("updates.switchLanguage", "Ganti Bahasa Tampilan Catatan Rilis (ID / EN)")}
          >
            <Globe size={13} className="text-teal-400" />
            <span className="font-mono font-bold uppercase">{lang}</span>
          </button>

          {/* Manual Update Check */}
          <button
            type="button"
            disabled={isCheckingUpdate}
            onClick={handleManualCheck}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw
              size={13}
              className={cn(isCheckingUpdate && "animate-spin text-teal-400")}
            />
            <span className="hidden sm:inline">
              {isCheckingUpdate ? t("updates.checkingOnline", "Memeriksa GitHub...") : t("updates.checkOnline", "Periksa Pembaruan Online")}
            </span>
          </button>

          {/* GitHub Releases */}
          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined") {
                window.open("https://github.com/ajoroby/xphpmyadmin/releases", "_blank");
              }
            }}
            className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer hidden md:flex"
          >
            <span>GitHub Release</span>
            <ExternalLink size={12} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left Sidebar: Releases List */}
        <aside className="w-64 sm:w-72 shrink-0 border-r border-border bg-muted/20 flex flex-col min-h-0">
          <div className="p-3 border-b border-border/60">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
              {t("updates.historyTitle", "Riwayat Rilis")}
            </span>
            <div className="text-xs text-muted-foreground">
              {t("updates.historySubtitle", { count: RELEASES_DATA.length, defaultValue: `Total ${RELEASES_DATA.length} rilis terdokumentasi` })}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1 no-scrollbar">
            {RELEASES_DATA.map((rel) => {
              const isSelected = rel.version === activeRelease.version;
              const isCurrent = rel.version === APP_VERSION;
              const isLatest = rel.version === RELEASES_DATA[0].version;

              return (
                <button
                  key={rel.version}
                  type="button"
                  onClick={() => setSelectedVersion(rel.version)}
                  className={cn(
                    "w-full text-left rounded-xl p-3 transition-all cursor-pointer border flex flex-col gap-1",
                    isSelected
                      ? "bg-accent/80 border-border text-foreground shadow-xs font-medium"
                      : "border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold flex items-center gap-1.5">
                      v{rel.version}
                      {isCurrent && (
                        <span className="size-2 rounded-full bg-teal-400 inline-block shadow-[0_0_8px_#2dd4bf]" />
                      )}
                    </span>
                    <div className="flex items-center gap-1">
                      {isLatest && (
                        <span className="rounded bg-teal-500/15 border border-teal-500/30 px-1.5 py-0.2 font-mono text-[9px] font-semibold text-teal-400 uppercase">
                          Terbaru
                        </span>
                      )}
                      {isCurrent && (
                        <span className="rounded bg-muted px-1.5 py-0.2 font-mono text-[9px] text-muted-foreground">
                          Terpasang
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-[11px] font-medium text-foreground/80 line-clamp-1 leading-snug">
                    {lang === "id" ? rel.title?.id : rel.title?.en}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar size={10} />
                      {rel.date}
                    </span>
                    <span className="font-mono">
                      {rel.items?.length || 0} item
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Right Content View */}
        <main className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-7 space-y-6">
          {/* Top Active Download Card (If newer version exists or user wants to download) */}
          <div className="rounded-2xl border border-teal-500/25 bg-linear-to-br from-teal-500/10 via-background to-muted/30 p-5 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/50 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-teal-500/20 px-2 py-0.5 font-mono text-xs font-bold text-teal-400">
                    v{hasNewerVersion ? latestVersion : APP_VERSION}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground flex items-center gap-1">
                    <Laptop size={12} />
                    {platform === "linux"
                      ? "Linux (AppImage / DEB)"
                      : platform === "win32"
                      ? "Windows Installer"
                      : platform === "darwin"
                      ? "macOS DMG"
                      : "Desktop Application"}
                  </span>
                  {hasNewerVersion && (
                    <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.2 text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                      <Sparkles size={11} />
                      Pembaruan Siap Diinstal
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-foreground mt-1 tracking-tight">
                  {hasNewerVersion
                    ? `Pembaruan Aplikasi xphpMyAdmin Desktop v${latestVersion} Siap Diunduh`
                    : `xphpMyAdmin Desktop v${APP_VERSION} — Versi Resmi Terpasang`}
                </h3>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {status === "idle" && (
                  <button
                    type="button"
                    onClick={handleStartDownload}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-teal-500 hover:bg-teal-600 px-4 py-2 text-xs font-bold text-black transition-all cursor-pointer shadow-sm hover:shadow-[0_0_14px_#2dd4bf]/40"
                  >
                    <ArrowDownToLine size={14} />
                    <span>{hasNewerVersion ? t("updates.startDownload", "Mulai Unduh Pembaruan") : t("updates.redownload", "Unduh Ulang Paket")}</span>
                  </button>
                )}

                {status === "downloading" && (
                  <button
                    type="button"
                    disabled
                    className="inline-flex items-center gap-1.5 rounded-xl bg-teal-500/60 px-4 py-2 text-xs font-bold text-black transition-all cursor-not-allowed opacity-90"
                  >
                    <RefreshCw size={14} className="animate-spin" />
                    <span>{t("updates.downloading", { percent, defaultValue: `Mengunduh... (${percent}%)` })}</span>
                  </button>
                )}

                {status === "complete" && (
                  <button
                    type="button"
                    onClick={handleInstallNow}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 px-4 py-2 text-xs font-bold text-black transition-all cursor-pointer shadow-sm hover:shadow-[0_0_14px_#10b981]/40"
                  >
                    <Play size={13} fill="currentColor" />
                    <span>{t("updates.installNow", "Pasang Sekarang (Buka Installer)")}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      window.open(downloadUrl, "_blank");
                    }
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                >
                  <ExternalLink size={13} />
                  <span>{t("updates.downloadBrowser", "Unduh via Browser")}</span>
                </button>
              </div>
            </div>

            {/* Live Progress Bar Section */}
            {(status === "downloading" || status === "complete" || status === "error") && (
              <div className="rounded-xl border border-border bg-card/80 p-4 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground flex items-center gap-2">
                    {status === "downloading" && (
                      <>
                        <RefreshCw size={14} className="animate-spin text-teal-400" />
                        Mengunduh berkas installer dari GitHub CDN...
                      </>
                    )}
                    {status === "complete" && (
                      <>
                        <CheckCircle2 size={15} className="text-emerald-400" />
                        Berkas installer berhasil diunduh! Klik Pasang Sekarang untuk memperbarui aplikasi.
                      </>
                    )}
                    {status === "error" && (
                      <>
                        <AlertTriangle size={14} className="text-destructive" />
                        Gagal mengunduh: {errorMessage}
                      </>
                    )}
                  </span>
                  <span className="font-mono font-bold text-teal-400">{percent}%</span>
                </div>

                <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted border border-border/50">
                  <div
                    className={cn(
                      "h-full transition-all duration-200",
                      status === "complete"
                        ? "bg-emerald-500 shadow-[0_0_8px_#10b981]"
                        : status === "error"
                        ? "bg-destructive"
                        : "bg-linear-to-r from-teal-500 to-emerald-400 shadow-[0_0_8px_#2dd4bf]"
                    )}
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                  <span>
                    {status === "downloading" &&
                      `${formatMb(downloadedBytes)} MB / ${formatMb(totalBytes)} MB`}
                    {status === "complete" &&
                      (downloadedFilePath || "Tersimpan di direktori Unduhan")}
                    {status === "error" && "Silakan coba lagi atau gunakan opsi Unduh via Browser."}
                  </span>
                  <span className="text-foreground">{fileName}</span>
                </div>
              </div>
            )}
          </div>

          {/* Release Details Hero */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-teal-500/15 border border-teal-500/30 px-2.5 py-0.5 font-mono text-xs font-bold text-teal-400">
                  v{activeRelease.version}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar size={13} />
                  {activeRelease.date}
                </span>
                {activeRelease.version === APP_VERSION && (
                  <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 size={11} />
                    Versi Terpasang Saat Ini
                  </span>
                )}
              </div>

              <span className="text-xs font-mono text-muted-foreground">
                xphpMyAdmin Desktop Studio
              </span>
            </div>

            <h2 className="text-lg font-bold tracking-tight text-foreground">
              {lang === "id" ? activeRelease.title?.id : activeRelease.title?.en}
            </h2>

            <p className="text-xs leading-relaxed text-muted-foreground bg-muted/30 p-3.5 rounded-xl border border-border/50">
              {lang === "id" ? activeRelease.body?.id : activeRelease.body?.en}
            </p>
          </div>

          {/* Filter Bar & Changelog Items */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <button
                  type="button"
                  onClick={() => setFilterType("all")}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer",
                    filterType === "all"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  {t("updates.filterAll", "Semua")} ({activeRelease.items?.length || 0})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType("new")}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1",
                    filterType === "new"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Sparkles size={12} />
                  {t("updates.filterNew", "Fitur Baru")} (
                  {activeRelease.items?.filter((i) => i.type === "new").length || 0}
                  )
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType("improvement")}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1",
                    filterType === "improvement"
                      ? "bg-sky-600 text-white shadow-xs"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Zap size={12} />
                  {t("updates.filterImprovement", "Peningkatan")} (
                  {activeRelease.items?.filter((i) => i.type === "improvement").length || 0}
                  )
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType("fix")}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1",
                    filterType === "fix"
                      ? "bg-amber-600 text-white shadow-xs"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Wrench size={12} />
                  {t("updates.filterFix", "Perbaikan")} (
                  {activeRelease.items?.filter((i) => i.type === "fix").length || 0}
                  )
                </button>
              </div>

              {/* Quick Search in Changelog */}
              <div className="relative">
                <Search
                  size={13}
                  className="-translate-y-1/2 absolute left-2.5 top-1/2 text-muted-foreground"
                />
                <input
                  type="text"
                  placeholder={t("updates.searchPlaceholder", { version: activeRelease.version, defaultValue: "Cari dalam catatan rilis..." })}
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="h-8 w-full sm:w-56 rounded-lg border border-border bg-background pr-2.5 pl-8 text-xs placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-ring"
                />
              </div>
            </div>

            {/* List of Items */}
            <div className="space-y-3">
              {filteredItems.map((item, idx) => {
                const text = lang === "id" ? item.id : item.en;
                const isNew = item.type === "new";
                const isFix = item.type === "fix";
                const isImprovement = item.type === "improvement";

                return (
                  <div
                    key={idx}
                    className="rounded-xl border border-border bg-card p-4 text-xs space-y-1.5 hover:border-teal-500/40 transition-colors shadow-xs"
                  >
                    <div className="flex items-center gap-2">
                      {isNew && (
                        <span className="inline-flex items-center gap-1 rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-400 uppercase">
                          <Sparkles size={11} />
                          {t("updates.typeNew", "Fitur Baru")}
                        </span>
                      )}
                      {isImprovement && (
                        <span className="inline-flex items-center gap-1 rounded bg-sky-500/15 border border-sky-500/30 px-2 py-0.5 font-mono text-[10px] font-semibold text-sky-400 uppercase">
                          <Zap size={11} />
                          {t("updates.typeImprovement", "Peningkatan")}
                        </span>
                      )}
                      {isFix && (
                        <span className="inline-flex items-center gap-1 rounded bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 font-mono text-[10px] font-semibold text-amber-400 uppercase">
                          <Wrench size={11} />
                          {t("updates.typeFix", "Perbaikan")}
                        </span>
                      )}
                    </div>
                    <p className="text-foreground/90 leading-relaxed pt-0.5 text-xs">
                      {text}
                    </p>
                  </div>
                );
              })}

              {filteredItems.length === 0 && (
                <div className="rounded-xl border border-dashed border-border p-8 text-center text-xs text-muted-foreground">
                  {t("updates.noChangesFound", "Tidak ada catatan perubahan yang cocok")}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/updates")({
  component: UpdatesView,
});
