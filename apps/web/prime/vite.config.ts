import solid from "vite-plugin-solid";
import ssr from "vite-plugin-ssr/plugin";
import tailwindcss from "tailwindcss";
import type { UserConfig } from "vite";
import tailwindConfig from "./tailwind.config";
import tsconfigPaths from "vite-tsconfig-paths";
import autoprefixer = require("autoprefixer");

const config: UserConfig = {
	plugins: [ solid( { ssr: true } ), ssr(), tsconfigPaths() ],
	css: {
		postcss: {
			plugins: [
				tailwindcss( tailwindConfig ),
				autoprefixer()
			]
		}
	},
	build: {
		// @ts-ignore
		polyfillDynamicImport: false
	}
};

export default config;