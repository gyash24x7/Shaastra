import { defineConfig } from "vitest/config";

export default defineConfig( {
	test: {
		environment: "node",
		coverage: {
			provider: "istanbul",
			enabled: true,
			include: [ "src/**/*.ts" ],
			all: true,
			clean: true
		}
	}
} );