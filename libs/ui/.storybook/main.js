const solidPlugin = require( "vite-plugin-solid" );
const tsconfigPaths = require( "vite-plugin-solid" )

module.exports = {
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
		"storybook-addon-swc",
		"@storybook/addon-essentials",
		"@storybook/addon-postcss"
	],
	features: {
		storyStoreV7: true
	},
	viteFinal( config ) {
		config.plugins?.unshift( tsconfigPaths() );
		config.plugins?.unshift( solidPlugin( { hot: false } ) );
		config.resolve.dedupe = [ "@storybook/client-api" ];
		return config;
	}
};