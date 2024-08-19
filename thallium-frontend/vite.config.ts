import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as child from "child_process";

let commitHash = "unknown";

try {
  commitHash = child.execSync("git rev-parse --short HEAD")
    .toString().replace(/\n$/, "");
} catch (e) {
  console.error("Failed to get commit hash");
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    VITE_APP_VERSION: JSON.stringify(process.env.npm_package_version),
    VITE_COMMIT_HASH: JSON.stringify(commitHash),
    THALLIUM_BASE_URL: JSON.stringify(process.env.THALLIUM_API_URL ?? "/api"),
  }
});
