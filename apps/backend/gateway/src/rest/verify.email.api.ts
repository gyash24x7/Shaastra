import type { PrismaClient } from "@prisma/client/identity";
import { RestApi } from "@shaastra/framework";
import crypto from "crypto";
import dayjs from "dayjs";
import { UserMessages, TokenMessages } from "../constants/messages.js";

export type VerifyEmailInput = {
	userId: string;
	hash: string;
}

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

		const newTokenHash = crypto.randomBytes( 32 ).toString( "hex" );
		const newTokenExpiry = dayjs().add( 2, "hours" ).toDate();
		await context.prisma.token.create( { data: { userId, hash: newTokenHash, expiry: newTokenExpiry } } );

		context.res.redirect( `http://localhost:3000/members/create?hash=${ newTokenHash }&userId=${ userId }` );
	}
} );