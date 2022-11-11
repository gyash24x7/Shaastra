const config = {
	stories: [],
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
	]
};

export default config;
