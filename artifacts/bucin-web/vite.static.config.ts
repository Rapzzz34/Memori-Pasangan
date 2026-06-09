import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  base: "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@/hooks/use-settings": path.resolve(
        import.meta.dirname,
        "src/hooks/static/use-settings.ts",
      ),
      "@/hooks/use-memories": path.resolve(
        import.meta.dirname,
        "src/hooks/static/use-memories.ts",
      ),
      "@/hooks/use-bucket-list": path.resolve(
        import.meta.dirname,
        "src/hooks/static/use-bucket-list.ts",
      ),
      "@/hooks/use-songs": path.resolve(
        import.meta.dirname,
        "src/hooks/static/use-songs.ts",
      ),
      "@/hooks/use-diary": path.resolve(
        import.meta.dirname,
        "src/hooks/static/use-diary.ts",
      ),
      "@/hooks/use-auth": path.resolve(
        import.meta.dirname,
        "src/hooks/static/use-auth.ts",
      ),
      "@": path.resolve(import.meta.dirname, "src"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
