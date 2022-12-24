import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { RestApi } from "@shaastra/framework";
import { pem2jwk } from "pem-jwk";
import type { AppContext } from "../index.js";

export const jwksRestApi = new RestApi<AppContext>( {
	method: "GET",
	path: "/api/keys",
	async handler( context ) {
		const pem = await readFile( join( process.cwd(), "src/assets/.public.key.pem" ) );
		const jwk = pem2jwk( pem.toString() );
		jwk[ "use" ] = "sig";
		jwk[ "kid" ] = "";
		context.res.send( { keys: [ jwk ] } );
	}
} );