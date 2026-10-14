import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
    plugins: [react()],
    server: { port: 5173 },
    // Temis (src/asistente) usa un worker que carga la normativa por trozos.
    worker: { format: "es" },
});
