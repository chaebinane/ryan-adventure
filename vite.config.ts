import { defineConfig } from "vite";

// base: "./" 로 두면 GitHub Pages 하위 경로, Netlify, 로컬 파일 어디서나 동작합니다.
export default defineConfig({
  base: "./",
  build: {
    target: "es2020",
    chunkSizeWarningLimit: 1500,
  },
});
