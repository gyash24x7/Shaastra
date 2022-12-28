import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { ServiceContext } from "@shaastra/framework";
import { RestApi } from "@shaastra/framework";
import { pem2jwk } from "pem-jwk";

export const jwksRestApi = new RestApi<ServiceContext>( {
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