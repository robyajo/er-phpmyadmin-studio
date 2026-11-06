import path from "node:path";
import { type Plugin, defineConfig } from "vite";

const ignoreNativeNodeAddons = (): Plugin => ({
  name: "ignore-native-node-addons",
  resolveId(source) {
    if (source.endsWith(".node")) {
      return { id: source, external: false };
    }
    return null;
  },
  load(id) {
    if (id.endsWith(".node")) {
      return "export default {}; export const getCPUInfo = () => ({});";
    }
    return null;
  },
});

export default defineConfig({
  plugins: [ignoreNativeNodeAddons()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
