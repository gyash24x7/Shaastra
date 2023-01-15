import type { PrismaClient } from "@prisma/client/identity/index.js";
import { RestApi } from "@shaastra/framework";
import bcrypt from "bcryptjs";
import type { CookieOptions } from "express";
import { UserMessages } from "../constants/messages.js";

export type LoginInput = {
	username: string;
	password: string;
};

const accessTokenCookieOptions: CookieOptions = {
	maxAge: 9000000,
	httpOnly: true,
	domain: "localhost",
	path: "/",
	sameSite: "lax",
	secure: false
};

export const loginApi = new RestApi<PrismaClient>( {
	path: "/api/auth/login",
	method: "POST",
	async handler( context ) {
		const data: LoginInput = context.req.body;

		context.logger.trace( `>> Resolvers::Mutation::login()` );
		context.logger.debug( "Data: %o", data );

		const existingUser = await context.prisma.user.findUnique( {
			where: { username: data.username }
		} );

		context.logger.debug( `Existing User: ${ JSON.stringify( existingUser ) }` );

		if ( !existingUser ) {
			context.logger.debug( `${ UserMessages.NOT_FOUND } Username: ${ data.username }` );
			throw new Error( UserMessages.NOT_FOUND );
		}

		if ( !existingUser.verified ) {
			context.logger.debug( `${ UserMessages.NOT_VERIFIED } Username: ${ data.username }` );
			throw new Error( UserMessages.NOT_VERIFIED );
		}

		const doPasswordsMatch = bcrypt.compareSync( data.password, existingUser.password );
		if ( !doPasswordsMatch ) {
			context.logger.debug( `${ UserMessages.INVALID_CREDENTIALS } Username: ${ data.username }` );
			throw new Error( UserMessages.INVALID_CREDENTIALS );
		}

		const payload = {
			id: existingUser.id,
			roles: existingUser.roles,
			verified: existingUser.verified,
			sub: existingUser.id,
			exp: Math.floor( Date.now() / 1000 + 24 * 60 * 60 ),
			iat: Math.floor( Date.now() / 1000 )
		};

		const token = await context.jwtUtils.sign( payload );

		context.res.cookie( "identity", token, accessTokenCookieOptions );
		context.res.status( 200 ).send( existingUser );
	}
} );