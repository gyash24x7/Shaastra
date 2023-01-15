import type { PrismaClient } from "@prisma/client/identity";
import { RestApi } from "@shaastra/framework";
import dayjs from "dayjs";
import { UserMessages, TokenMessages } from "../constants/messages.js";

export type VerifyMemberCreateInput = {
	userId: string;
	hash: string;
}

export const verifyMemberCreateApi = new RestApi<PrismaClient>( {
	path: "/api/auth/verify-member-create",
	method: "POST",
	async handler( context ) {
		const { userId, hash }: VerifyMemberCreateInput = context.req.body;

		context.logger.trace( `>> Resolvers::Mutation::verifyMemberCreate()` );

		let user = await context.prisma.user.findUnique( { where: { id: userId } } );

		if ( !user ) {
			context.logger.debug( `${ UserMessages.NOT_FOUND } UserId: ${ userId }` );
			throw new Error( UserMessages.NOT_FOUND );
		}

		const token = await context.prisma.token.findFirst( { where: { userId, hash } } );
		if ( !token ) {
			context.logger.debug( `${ TokenMessages.NOT_FOUND } TokenHash: ${ hash }` );
			throw new Error( TokenMessages.NOT_FOUND );
		}

		if ( dayjs().isAfter( token.expiry ) ) {
			context.logger.debug( `${ TokenMessages.EXPIRED } TokenHash: ${ hash }` );
			throw new Error( TokenMessages.EXPIRED );
		}

		await context.prisma.token.delete( { where: { id: token.id } } );

		context.res.status( 200 ).send( user );
	}
} );