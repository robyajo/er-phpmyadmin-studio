import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { app, type BrowserWindow, ipcMain, shell } from "electron";

export function registerUpdaterIpcHandlers(
  getMainWindow: () => BrowserWindow | null
) {
  ipcMain.handle(
    "download-app-update",
    async (_event, { url, fileName }: { url: string; fileName: string }) => {
      const mainWindow = getMainWindow();
      try {
        const downloadsDir = app.getPath("downloads");
        const targetPath = path.join(downloadsDir, fileName);

        const response = await fetch(url, { redirect: "follow" });
        if (!response.ok) {
          throw new Error(`Gagal mengunduh: status ${response.status} ${response.statusText}`);
        }

        const contentLength = Number(response.headers.get("content-length") || 0);
        let downloadedBytes = 0;

        const fileStream = fs.createWriteStream(targetPath);

        if (!response.body) {
          throw new Error("Tidak ada data respon dari server GitHub");
        }

        const nodeStream = Readable.fromWeb(response.body as any);

        nodeStream.on("data", (chunk: Buffer) => {
          downloadedBytes += chunk.length;
          const percent =
            contentLength > 0
              ? Math.min(100, Math.round((downloadedBytes / contentLength) * 100))
              : 0;

          if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send("update-download-progress", {
              bytes: downloadedBytes,
              total: contentLength,
              percent,
            });
          }
        });

        await new Promise<void>((resolve, reject) => {
          nodeStream.pipe(fileStream);
          fileStream.on("finish", () => resolve());
          fileStream.on("error", (err) => reject(err));
          nodeStream.on("error", (err) => reject(err));
        });

        // Set executable permissions on Linux AppImages
        if (process.platform === "linux" && fileName.endsWith(".AppImage")) {
          try {
            fs.chmodSync(targetPath, 0o755);
          } catch {
            // ignore chmod error
          }
        }

        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send("update-download-complete", {
            filePath: targetPath,
          });
        }

        return { success: true, filePath: targetPath };
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send("update-download-error", {
            error: errorMsg,
          });
        }
        return { success: false, error: errorMsg };
      }
    }
  );

  ipcMain.handle("install-app-update", async (_event, filePath: string) => {
    try {
      if (!fs.existsSync(filePath)) {
        throw new Error("Berkas installer tidak ditemukan di disk lokal");
      }

      const openResult = await shell.openPath(filePath);
      if (openResult) {
        // If system cannot execute directly, reveal it in folder for user
        shell.showItemInFolder(filePath);
      }
      return { success: true };
    } catch (err: unknown) {
      shell.showItemInFolder(filePath);
      return {
        success: false,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  });
}
