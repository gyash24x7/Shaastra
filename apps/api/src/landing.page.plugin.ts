import type { ApolloServerPlugin } from "@apollo/server";
import { Plugin } from "@nestjs/apollo";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

@Plugin()
export class LandingPagePlugin implements ApolloServerPlugin {
	async serverWillStart() {
		return {
			async renderLandingPage() {
				const html = await readFile( join( __dirname, "assets/graphiql.html" ), "utf-8" );
				return { html };
			}
		};
	}
}
