import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/KolehiyoCentral/",
  plugins: [react()],
  server: {
    port: 5173,
  },
});
