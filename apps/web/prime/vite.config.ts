import solid from "vite-plugin-solid";
import tailwindcss from "tailwindcss";
import type { UserConfig } from "vite";
import tailwindConfig from "./tailwind.config";
import tsconfigPaths from "vite-tsconfig-paths";
import autoprefixer from "autoprefixer";

const config: UserConfig = {
	root: "apps/web/prime",
	plugins: [ solid(), tsconfigPaths() ],
	css: {
		postcss: {
			plugins: [
				tailwindcss( tailwindConfig ),
				autoprefixer()
			]
		}
	},
	build: {
		target: "esnext"
	}
};

export default config;