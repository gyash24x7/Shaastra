import type { PrismaClient } from "@prisma/client/identity/index.js";
import { RestApi } from "@shaastra/framework";
import * as jose from "jose";

export const jwksRestApi = new RestApi<PrismaClient>( {
	method: "GET",
	path: "/api/auth/keys",
	async handler( context ) {
		const publicKey = await context.jwtUtils.getPublicKey();
		const jwk = await jose.exportJWK( publicKey );
		context.res.send( { keys: [ jwk ] } );
	}
} );