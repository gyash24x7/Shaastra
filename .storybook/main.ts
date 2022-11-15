import type { StorybookConfig } from "@storybook/core-common";

const rootStorybookConfig: StorybookConfig = {
	stories: [],
	addons: [
		"@storybook/addon-links",
		"@storybook/addon-actions",
		"@storybook/addon-interactions",
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

export default rootStorybookConfig;
