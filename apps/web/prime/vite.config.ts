import react from "@vitejs/plugin-react-swc";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";
import { defineConfig } from "vite";
import tailwindConfig from "./tailwind.config.js";

export default defineConfig( {
	plugins: [ react() ],
	css: {
		postcss: {
			plugins: [
				tailwindcss( tailwindConfig ),
				autoprefixer()
			]
		}
	},
	server: {
		port: 3000
	}
} );