import bcrypt from "bcryptjs";
import { UserMessages } from "../messages/user.messages.js";
import { logger } from "../index.js";
import { prisma } from "../prisma/index.js";
import { builder } from "../schema/builder.js";
import { userRef } from "../entities/index.js";

const loginInputRef = builder.inputType( "LoginInput", {
	fields: t => ( {
		username: t.string( { required: true } ),
		password: t.string( { required: true } )
	} )
} );

export type LoginInput = {
	username: string;
	password: string;
};

builder.mutationField( "login", t => t.prismaField( {
	type: userRef,
	args: { data: t.arg( { type: loginInputRef, required: true } ) },
	async resolve( _query, _parent, { data }, _context, _info ) {
		logger.trace( `>> Resolvers::Mutation::login()` );
		logger.debug( "Data: %o", data );

		const existingUser = await prisma.user.findUnique( {
			where: { username: data.username.toLowerCase() }
		} );

		logger.debug( `Existing User: ${ JSON.stringify( existingUser ) }` );

		if ( !existingUser ) {
			logger.debug( `${ UserMessages.NOT_FOUND } Username: ${ data.username }` );
			throw new Error( UserMessages.NOT_FOUND );
		}

		if ( !existingUser.verified ) {
			logger.debug( `${ UserMessages.NOT_VERIFIED } Username: ${ data.username }` );
			throw new Error( UserMessages.NOT_VERIFIED );
		}

		const doPasswordsMatch = bcrypt.compareSync( data.password, existingUser.password );
		if ( !doPasswordsMatch ) {
			logger.debug( `${ UserMessages.INVALID_CREDENTIALS } Username: ${ data.username }` );
			throw new Error( UserMessages.INVALID_CREDENTIALS );
		}

		const payload = {
			roles: existingUser.roles,
			verified: existingUser.verified,
			sub: existingUser.id,
			exp: Math.floor( Date.now() / 1000 + 24 * 60 * 60 ),
			iat: Math.floor( Date.now() / 1000 )
		};

		logger.debug( payload );

		return existingUser;
	}
} ) );