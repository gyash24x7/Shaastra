import type { ApolloServerPlugin } from "@apollo/server";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export function LandingPagePlugin(): ApolloServerPlugin {
	return {
		async serverWillStart() {
			return {
				async renderLandingPage() {
					const html = await readFile( join( process.cwd(), "src/assets/graphiql.html" ), "utf-8" );
					return { html };
				}
			};
		}
	};
}