import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import React from "react";
import { toast } from "sonner";
import { APP_VERSION } from "@/components/app-logo";
import { LOCAL_STORAGE_KEYS } from "@/constants";
import {
  compareSemver,
  checkFirstLaunchAfterUpdate,
  checkForAppUpdates,
  getMatchingReleaseAsset,
} from "@/services/auto-update";
import { ConnectionProvider } from "@/context/connection-context";
import { UpdatesView } from "@/routes/updates";
import { RELEASES_DATA } from "@/data/releases";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    info: vi.fn(),
    error: vi.fn(),
  },
}));

const mockNavigate = vi.fn();
vi.mock("@tanstack/react-router", async () => {
  const actual = await vi.importActual("@tanstack/react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Auto Update & Dedicated Updates View System", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe("compareSemver", () => {
    it("correctly compares semantic versions", () => {
      expect(compareSemver("1.5.0", "1.4.2")).toBe(1);
      expect(compareSemver("1.4.2", "1.5.0")).toBe(-1);
      expect(compareSemver("1.4.2", "1.4.2")).toBe(0);
      expect(compareSemver("v2.0.0", "1.9.9")).toBe(1);
      expect(compareSemver("1.4.1", "1.4.2")).toBe(-1);
      expect(compareSemver("1.4.2-beta", "1.4.2")).toBe(0);
    });
  });

  describe("getMatchingReleaseAsset", () => {
    it("matches appropriate asset per OS platform", () => {
      const release = {
        tag_name: "v1.5.0",
        name: "Release v1.5.0",
        html_url: "https://github.com/ajoroby/xphpmyadmin/releases/tag/v1.5.0",
        body: "Notes",
        published_at: "2026-11-06",
        assets: [
          {
            name: "xphpmyadmin-1.5.0.AppImage",
            browser_download_url: "https://github.com/ajoroby/xphpmyadmin/releases/download/v1.5.0/xphpmyadmin-1.5.0.AppImage",
            size: 89000000,
          },
          {
            name: "xphpmyadmin-1.5.0.exe",
            browser_download_url: "https://github.com/ajoroby/xphpmyadmin/releases/download/v1.5.0/xphpmyadmin-1.5.0.exe",
            size: 75000000,
          },
        ],
      };

      const linuxAsset = getMatchingReleaseAsset(release, "linux");
      expect(linuxAsset.name).toBe("xphpmyadmin-1.5.0.AppImage");
      expect(linuxAsset.platform).toBe("linux");

      const winAsset = getMatchingReleaseAsset(release, "win32");
      expect(winAsset.name).toBe("xphpmyadmin-1.5.0.exe");
      expect(winAsset.platform).toBe("win32");
    });
  });

  describe("checkFirstLaunchAfterUpdate", () => {
    it("triggers toast and marks version in localStorage when first running a new version", () => {
      const onOpenChangelog = vi.fn();
      localStorage.removeItem(LOCAL_STORAGE_KEYS.LAST_SEEN_VERSION);

      const isFirstLaunch = checkFirstLaunchAfterUpdate(onOpenChangelog);

      expect(isFirstLaunch).toBe(true);
      expect(localStorage.getItem(LOCAL_STORAGE_KEYS.LAST_SEEN_VERSION)).toBe(
        APP_VERSION
      );
      expect(toast.success).toHaveBeenCalledWith(
        expect.stringContaining(`Aplikasi Diperbarui ke v${APP_VERSION}!`),
        expect.objectContaining({
          action: expect.objectContaining({
            label: "Lihat Pembaruan",
          }),
        })
      );

      // Subsequent call with same version should NOT trigger
      const subsequentCall = checkFirstLaunchAfterUpdate(onOpenChangelog);
      expect(subsequentCall).toBe(false);
    });

    it("triggers toast when upgrading from older version (e.g. 1.4.1 to 1.4.2)", () => {
      const onOpenChangelog = vi.fn();
      localStorage.setItem(LOCAL_STORAGE_KEYS.LAST_SEEN_VERSION, "1.4.1");

      const isFirstLaunch = checkFirstLaunchAfterUpdate(onOpenChangelog);

      expect(isFirstLaunch).toBe(true);
      expect(localStorage.getItem(LOCAL_STORAGE_KEYS.LAST_SEEN_VERSION)).toBe(
        APP_VERSION
      );
      expect(toast.success).toHaveBeenCalled();
    });
  });

  describe("checkForAppUpdates", () => {
    it("handles up-to-date response from GitHub", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          tag_name: "v1.4.2",
          name: "v1.4.2 Release",
          html_url: "https://github.com/ajoroby/xphpmyadmin/releases/tag/v1.4.2",
        }),
      });
      global.fetch = mockFetch;

      const result = await checkForAppUpdates({ silent: false });

      expect(result.hasUpdate).toBe(false);
      expect(toast.success).toHaveBeenCalledWith(
        "Aplikasi Sudah Versi Terbaru",
        expect.anything()
      );
    });

    it("notifies when a newer version is available and triggers update event", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          tag_name: "v1.5.0",
          name: "Fitur Terbaru v1.5.0",
          html_url: "https://github.com/ajoroby/xphpmyadmin/releases/tag/v1.5.0",
          assets: [
            {
              name: "xphpmyadmin-1.5.0.AppImage",
              browser_download_url: "https://example.com/xphpmyadmin-1.5.0.AppImage",
              size: 85000000,
            },
          ],
        }),
      });
      global.fetch = mockFetch;

      const result = await checkForAppUpdates({ silent: false });

      expect(result.hasUpdate).toBe(true);
      expect(result.latestVersion).toBe("1.5.0");
      expect(toast.info).toHaveBeenCalledWith(
        "Versi Baru Tersedia: v1.5.0!",
        expect.objectContaining({
          action: expect.objectContaining({
            label: "Unduh & Pasang",
          }),
        })
      );
    });
  });

  describe("Dedicated UpdatesView Page Component", () => {
    it("renders dedicated updates view with releases, categories, and controls", () => {
      const { getByText, getAllByText, getByTitle } = render(
        <ConnectionProvider>
          <UpdatesView />
        </ConnectionProvider>
      );

      // Dedicated page header
      expect(getByText("Pusat Pembaruan & Catatan Rilis")).toBeInTheDocument();
      expect(getAllByText(new RegExp(`v${APP_VERSION}`)).length).toBeGreaterThan(0);

      // Latest release title
      const latest = RELEASES_DATA[0];
      expect(getAllByText(new RegExp(latest.title.id.slice(0, 30))).length).toBeGreaterThan(0);

      // Check category filters
      expect(getAllByText(/Fitur Baru/i).length).toBeGreaterThan(0);
      expect(getAllByText(/Peningkatan/i).length).toBeGreaterThan(0);
      expect(getAllByText(/Perbaikan/i).length).toBeGreaterThan(0);

      // Test language toggle
      const langBtn = getByTitle("Ganti Bahasa Tampilan Catatan Rilis (ID / EN)");
      fireEvent.click(langBtn);
      expect(getAllByText(new RegExp(latest.title.en.slice(0, 30))).length).toBeGreaterThan(0);
    });

    it("allows switching between historical releases and filtering in dedicated view", () => {
      const { getByText, getAllByText } = render(
        <ConnectionProvider>
          <UpdatesView />
        </ConnectionProvider>
      );

      // Click on v1.0.0
      const v1Btn = getByText("v1.0.0");
      fireEvent.click(v1Btn);

      const v1Release = RELEASES_DATA.find((r) => r.version === "1.0.0");
      expect(getAllByText(new RegExp(v1Release!.title.id.slice(0, 30))).length).toBeGreaterThan(0);

      // Filter by "Perbaikan"
      const fixFilterBtn = getByText(/Perbaikan \(/);
      fireEvent.click(fixFilterBtn);
    });
  });
});
