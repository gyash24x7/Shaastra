import { defineConfig } from "vitest/config";

export default defineConfig( {
	test: {
		globals: true,
		environment: "node",
		include: [ "e2e/**/*.test.ts" ],
		coverage: {
			reportsDirectory: "coverage/e2e",
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