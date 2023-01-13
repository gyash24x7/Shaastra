import type { PrismaClient } from "@prisma/client/identity";
import { RestApi } from "@shaastra/framework";
import dayjs from "dayjs";
import { UserMessages, TokenMessages } from "../constants/messages.js";

export const verifyEmailApi = new RestApi<PrismaClient>( {
	path: "/api/auth/verify-email/:userId/:hash",
	method: "GET",
	async handler( context ) {
		const userId = context.req.params[ "userId" ];
		const hash = context.req.params[ "hash" ];

		context.logger.trace( `>> Resolvers::Mutation::verifyUser()` );

		let user = await context.prisma.user.findUnique( { where: { id: userId } } );
		if ( !user ) {
			context.logger.debug( `${ UserMessages.NOT_FOUND } UserId: ${ userId }` );
			throw new Error( UserMessages.NOT_FOUND );
		}

		const token = await context.prisma.token.findFirst( { where: { userId, hash } } );
		if ( !token || dayjs().isAfter( token.expiry ) ) {
			context.logger.debug( `${ TokenMessages.NOT_FOUND } TokenHash: ${ hash }` );
			throw new Error( TokenMessages.NOT_FOUND );
		}

		user = await context.prisma.user.update( {
			where: { id: userId },
			data: { verified: true }
		} );

		await context.prisma.token.delete( { where: { id: token.id } } );

		context.res.status( 200 ).send( user );
	}
} );