import { RestApi } from "@shaastra/framework";
import * as jose from "jose";
import { jwtUtils } from "..";

export const jwksRestApi = new RestApi( {
	method: "GET",
	path: "/api/keys",
	async handler( context ) {
		const publicKey = await jwtUtils.getPublicKey();
		const jwk = await jose.exportJWK( publicKey );
		context.res.send( { keys: [ jwk ] } );
	}
} );