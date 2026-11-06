import { toast } from "sonner";
import { APP_VERSION } from "@/components/app-logo";
import { LOCAL_STORAGE_KEYS } from "@/constants";

export interface ReleaseAsset {
  name: string;
  browser_download_url: string;
  size: number;
}

export interface GitHubRelease {
  tag_name: string;
  name: string;
  html_url: string;
  body: string;
  published_at: string;
  assets?: ReleaseAsset[];
}

export interface MatchedAsset {
  name: string;
  url: string;
  size: number;
  platform: "linux" | "win32" | "darwin" | "other";
}

export interface UpdateCheckResult {
  hasUpdate: boolean;
  currentVersion: string;
  latestVersion?: string;
  releaseUrl?: string;
  releaseName?: string;
  release?: GitHubRelease;
  matchingAsset?: MatchedAsset;
  error?: string;
}

/**
 * Detects current OS platform.
 */
export function detectPlatform(): "linux" | "win32" | "darwin" | "other" {
  if (typeof navigator !== "undefined" && typeof navigator.userAgent === "string") {
    const ua = navigator.userAgent;
    if (ua.includes("Win")) return "win32";
    if (ua.includes("Mac")) return "darwin";
    if (ua.includes("Linux") || ua.includes("X11")) return "linux";
  }
  return "other";
}

/**
 * Finds the most suitable release binary asset from GitHub release assets for current OS.
 */
export function getMatchingReleaseAsset(
  release: GitHubRelease,
  targetPlatform?: "linux" | "win32" | "darwin" | "other"
): MatchedAsset {
  const platform = targetPlatform || detectPlatform();
  const assets = release.assets || [];
  const version = (release.tag_name || APP_VERSION).replace(/^[^\d]*/, "");

  let matched: ReleaseAsset | undefined;

  if (platform === "linux") {
    // Priority: .AppImage -> .deb -> .rpm -> .tar.gz
    matched =
      assets.find((a) => a.name.endsWith(".AppImage")) ||
      assets.find((a) => a.name.endsWith(".deb")) ||
      assets.find((a) => a.name.endsWith(".rpm")) ||
      assets.find((a) => a.name.endsWith(".tar.gz"));
  } else if (platform === "win32") {
    // Priority: .exe -> .msi -> .zip
    matched =
      assets.find((a) => a.name.endsWith(".exe")) ||
      assets.find((a) => a.name.endsWith(".msi")) ||
      assets.find((a) => a.name.endsWith(".zip"));
  } else if (platform === "darwin") {
    // Priority: .dmg -> .pkg -> .zip
    matched =
      assets.find((a) => a.name.endsWith(".dmg")) ||
      assets.find((a) => a.name.endsWith(".pkg")) ||
      assets.find((a) => a.name.endsWith(".zip"));
  }

  // If no platform-specific match, check first asset or fallback
  if (!matched && assets.length > 0) {
    matched = assets[0];
  }

  if (matched) {
    return {
      name: matched.name,
      url: matched.browser_download_url,
      size: matched.size,
      platform,
    };
  }

  // Fallback if release assets haven't finished uploading yet
  const ext =
    platform === "linux" ? "AppImage" : platform === "win32" ? "exe" : "dmg";
  return {
    name: `xphpmyadmin-${version}-${platform}.${ext}`,
    url: release.html_url || `https://github.com/ajoroby/xphpmyadmin/releases/tag/v${version}`,
    size: 85 * 1024 * 1024, // approx 85 MB
    platform,
  };
}

/**
 * Normalizes and compares two semver strings (e.g. "1.4.2" vs "1.5.0").
 * Returns:
 *   1 if v1 > v2
 *  -1 if v1 < v2
 *   0 if v1 === v2
 */
export function compareSemver(v1: string, v2: string): number {
  const clean1 = (v1 || "").replace(/^[^\d]*/, "").split(/[-+]/)[0];
  const clean2 = (v2 || "").replace(/^[^\d]*/, "").split(/[-+]/)[0];

  const parts1 = clean1.split(".").map((n) => Number.parseInt(n, 10) || 0);
  const parts2 = clean2.split(".").map((n) => Number.parseInt(n, 10) || 0);

  const maxLen = Math.max(parts1.length, parts2.length, 3);
  for (let i = 0; i < maxLen; i++) {
    const num1 = parts1[i] ?? 0;
    const num2 = parts2[i] ?? 0;
    if (num1 > num2) return 1;
    if (num1 < num2) return -1;
  }
  return 0;
}

/**
 * Checks for updates against GitHub Releases API or custom endpoint.
 */
export async function checkForAppUpdates({
  silent = false,
  onOpenChangelog,
  onOpenDownloader,
}: {
  silent?: boolean;
  onOpenChangelog?: () => void;
  onOpenDownloader?: (result: UpdateCheckResult) => void;
} = {}): Promise<UpdateCheckResult> {
  const currentVersion = APP_VERSION;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    const res = await fetch(
      "https://api.github.com/repos/ajoroby/xphpmyadmin/releases/latest",
      {
        signal: controller.signal,
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      }
    );
    clearTimeout(timeoutId);

    if (!res.ok) {
      if (res.status === 404) {
        if (!silent) {
          toast.info("Aplikasi Versi Terbaru", {
            description: `Anda menggunakan versi v${currentVersion}. Belum ada rilis publik baru di repository.`,
          });
        }
        return { hasUpdate: false, currentVersion };
      }
      throw new Error(`GitHub API merespon dengan status ${res.status}`);
    }

    const data: GitHubRelease = await res.json();
    const remoteTag = data.tag_name || "";
    const remoteVersion = remoteTag.replace(/^[^\d]*/, "");

    const isNewer = compareSemver(remoteVersion, currentVersion) > 0;
    const matchingAsset = getMatchingReleaseAsset(data);

    const result: UpdateCheckResult = {
      hasUpdate: isNewer,
      currentVersion,
      latestVersion: remoteVersion,
      releaseUrl: data.html_url || "https://github.com/ajoroby/xphpmyadmin/releases",
      releaseName: data.name,
      release: data,
      matchingAsset,
    };

    if (isNewer) {
      // Broadcast update event so UI can display top banner or download modal
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("xphpmyadmin:update_available", {
            detail: result,
          })
        );
      }

      toast.info(`Versi Baru Tersedia: v${remoteVersion}!`, {
        description: data.name || "Pembaruan xphpMyAdmin Desktop siap diunduh.",
        duration: 25000,
        action: {
          label: "Unduh & Pasang",
          onClick: () => {
            if (onOpenDownloader) {
              onOpenDownloader(result);
            } else if (typeof window !== "undefined") {
              window.dispatchEvent(
                new CustomEvent("xphpmyadmin:open_downloader", {
                  detail: result,
                })
              );
            }
          },
        },
      });

      return result;
    }

    if (!silent) {
      toast.success("Aplikasi Sudah Versi Terbaru", {
        description: `Anda sedang menggunakan versi terbaru xphpMyAdmin Desktop (v${currentVersion}).`,
        action: onOpenChangelog
          ? {
              label: "Lihat Catatan Rilis",
              onClick: onOpenChangelog,
            }
          : undefined,
      });
    }

    return result;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (!silent) {
      toast.error("Gagal Memeriksa Pembaruan", {
        description: `Tidak dapat menghubungi server GitHub: ${message}`,
      });
    }
    return {
      hasUpdate: false,
      currentVersion,
      error: message,
    };
  }
}

/**
 * Checks if the app is launching for the first time after an update/install.
 * If yes, displays an update toast with an action to inspect the changelog modal.
 */
export function checkFirstLaunchAfterUpdate(onOpenChangelog: () => void): boolean {
  if (typeof window === "undefined" || !window.localStorage) {
    return false;
  }

  const lastSeen = localStorage.getItem(LOCAL_STORAGE_KEYS.LAST_SEEN_VERSION);
  const currentVersion = APP_VERSION;

  if (lastSeen !== currentVersion) {
    // Record current version as seen
    localStorage.setItem(LOCAL_STORAGE_KEYS.LAST_SEEN_VERSION, currentVersion);

    // Show toast with action directing to changelog
    toast.success(`Aplikasi Diperbarui ke v${currentVersion}! 🎉`, {
      description:
        "Klik di sini untuk melihat fitur baru, perbaikan bug, dan ringkasan pembaruan versi ini.",
      duration: 15000,
      action: {
        label: "Lihat Pembaruan",
        onClick: () => {
          onOpenChangelog();
        },
      },
    });

    return true;
  }

  return false;
}
