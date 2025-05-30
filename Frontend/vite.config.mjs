import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import process from "process";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	define: {
		"process.env": process.env,
	},
});
