import react from "@vitejs/plugin-react-swc";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";
import { defineConfig } from "vite";
import packageJson from "./package.json";
import tailwindConfig from "./tailwind.config.js";

const external = Object.keys( packageJson.peerDependencies );

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
	build: {
		lib: {
			entry: "src/index.ts",
			formats: [ "es" ]
		},
		rollupOptions: { external }
	}
} );
