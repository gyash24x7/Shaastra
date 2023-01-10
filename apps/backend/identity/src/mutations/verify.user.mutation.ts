import dayjs from "dayjs";
import { logger } from "..";
import { userRef } from "../entities";
import { TokenMessages } from "../messages/token.messages";
import { UserMessages } from "../messages/user.messages";
import { prisma } from "../prisma";
import { builder } from "../schema/builder";

const verifyUserInputRef = builder.inputType( "VerifyUserInput", {
	fields: t => (
		{
			userId: t.string( { required: true } ),
			tokenId: t.string( { required: true } )
		}
	)
} );

export type VerifyUserInput = {
	userId: string;
	tokenId: string;
};

builder.mutationField( "verifyUser", t => t.prismaField( {
	type: userRef,
	args: { data: t.arg( { type: verifyUserInputRef, required: true } ) },
	async resolve( _query, _parent, { data }, _context, _info ) {
		logger.trace( `>> Resolvers::Mutation::verifyUser()` );
		logger.debug( "Data: %o", data );

		const user = await prisma.user.findUnique( { where: { id: data.userId } } );
		if ( !user ) {
			logger.debug( `${ UserMessages.NOT_FOUND } UserId: ${ data.userId }` );
			throw new Error( UserMessages.NOT_FOUND );
		}

		const token = await prisma.token.findUnique( { where: { id: data.tokenId } } );
		if ( !token || dayjs().isAfter( token.expiry ) ) {
			logger.debug( `${ TokenMessages.NOT_FOUND } TokenId: ${ data.tokenId }` );
			throw new Error( TokenMessages.NOT_FOUND );
		}

		await prisma.user.update( {
			where: { id: data.userId },
			data: { verified: true }
		} );

		await prisma.token.delete( { where: { id: data.tokenId } } );

		return user;
	}
} ) );