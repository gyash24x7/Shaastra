import type { AppConfig } from "@shaastra/utils";
import type { Express } from "express";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { pem2jwk } from "pem-jwk";

export class JwksController {
	register( app: Express, config: AppConfig ) {
		app.get( "/api/keys", async () => {
			const pem = await readFile( join( process.cwd(), "src/assets/.public.key.pem" ) );
			const jwk = pem2jwk( pem.toString() );
			jwk[ "use" ] = "sig";
			jwk[ "kid" ] = config.auth?.key?.id!;
			return { keys: [ jwk ] };
		} );
	}
}