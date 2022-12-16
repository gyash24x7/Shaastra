import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import tailwindConfig from "./tailwind.config.js";

export default defineConfig( {
	plugins: [ solid() ],
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
