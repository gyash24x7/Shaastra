import type { StorybookViteConfig } from "@storybook/builder-vite";
import solidPlugin from "vite-plugin-solid";

const config: StorybookViteConfig = {
	core: {
		builder: {
			name: "@storybook/builder-vite",
			options: {
				fsCache: false
			}
		}
	},
	framework: "@storybook/html",
	stories: [
		"../src/**/*.stories.mdx",
		"../src/**/*.stories.@(js|jsx|ts|tsx)"
	],
	addons: [
		"@storybook/addon-essentials",
		{
			name: "@storybook/addon-postcss",
			options: {
				postcssLoaderOptions: {
					implementation: require( "postcss" )
				}
			}
		}
	],
	viteFinal( config ) {
		config.plugins?.unshift( solidPlugin( { hot: false } ) );
		config.resolve!.dedupe = [ "@storybook/client-api" ];
		return config;
	}

};

export default config;
