import type { Config } from "jest";

const config: Config = {
	displayName: "ui",
	preset: "../../jest.preset.js",
	collectCoverage: true,
	testEnvironment: "jsdom",
	globals: {
		"ts-jest": { tsconfig: "<rootDir>/tsconfig.spec.json" }
	},
	transform: {
		"^.+\\.[tj]sx?$": "ts-jest"
	},
	moduleFileExtensions: [ "ts", "tsx", "js", "jsx" ],
	coverageDirectory: "../../coverage/libs/ui"
};

export default config;
