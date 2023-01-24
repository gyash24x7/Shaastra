import react from "@vitejs/plugin-react-swc";
import tailwindConfig from "./tailwind.config.js";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";
import { mergeConfig } from "vite";

/**
 *
 * @type {import("@storybook/react-vite").StorybookConfig}
 */
const config = {
	stories: [
		"../src/**/*.mdx",
		"../src/**/*.stories.@(js|jsx|ts|tsx)"
	],
	addons: [
		"@storybook/addon-links",
		"@storybook/addon-essentials",
		"@storybook/addon-interactions",
		{
			name: "storybook-addon-swc",
			options: {
				enable: true
			}
		}
	],
	framework: {
		name: "@storybook/react-vite",
		options: {}
	},
	docs: {
		autodocs: "tag"
	},
	viteFinal( viteConfig ) {
		return mergeConfig( viteConfig, {
			plugins: [ react() ],
			css: {
				postcss: {
					plugins: [
						tailwindcss( tailwindConfig ),
						autoprefixer()
					]
				}
			}
		} );
	}
};

export default config;