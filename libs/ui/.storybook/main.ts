import rootMain from "../../../.storybook/main";

const config = {
	...rootMain,
	core: {
		builder: {
			name: "webpack5",
			options: {
				fsCache: true
			}
		}
	},
	stories: [
		...rootMain.stories,
		"../src/**/*.stories.mdx",
		"../src/**/*.stories.@(js|jsx|ts|tsx)"
	]
};

export default config;
