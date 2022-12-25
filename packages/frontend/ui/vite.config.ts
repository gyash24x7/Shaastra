import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import packageJson from "./package.json";
import tailwindConfig from "./tailwind.config.js";

const external = Object.keys( packageJson.peerDependencies );

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
	build: {
		lib: {
			entry: "src/index.ts",
			formats: [ "es" ]
		},
		rollupOptions: { external }
	}
} );
