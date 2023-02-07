import { defineConfig } from "vitest/config";

export default defineConfig( {
	test: {
		include: [ "test/**/*.test.ts" ],
		environment: "node",
		coverage: {
			reportsDirectory: "coverage/test",
			reporter: [ "text", "json", "html" ],
			provider: "istanbul",
			enabled: true,
			include: [ "src/**/*.ts" ],
			exclude: [ "src/main.ts" ],
			all: true,
			clean: true
		}
	}
} );