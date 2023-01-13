import type { PrismaClient } from "@prisma/client/identity/index.js";
import { RestApi } from "@shaastra/framework";

export const logoutApi = new RestApi<PrismaClient>( {
	path: "/api/auth/logout",
	method: "POST",
	async handler( context ) {
		context.res.clearCookie( "identity" );
		context.res.status( 200 ).send();
	}
} );