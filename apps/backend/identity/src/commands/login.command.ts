import bcrypt from "bcryptjs";
import type { LoginInput } from "../graphql/inputs.js";
import { UserMessages } from "../messages/user.messages.js";
import type { ServiceContext } from "@shaastra/framework";
import { logger } from "@shaastra/framework";
import { AppCommands } from "./index.js";
import { prisma } from "../index.js";

export default async function loginCommandHandler( _data: unknown, _context: ServiceContext ) {
	const data = _data as LoginInput;

	logger.debug( `Handling ${ AppCommands.LOGIN_COMMAND }...` );
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

	// const ks = await readFile( join( process.cwd(), "src/assets/keys.json" ) );
	// const keyStore = await jose.JWK.asKeyStore( ks.toString() );
	// const [ jwk ] = keyStore.all( { use: "sig" } );
	//
	// const opt = { compact: true, jwk, fields: { typ: "jwt" } };
	// const token = await jose.JWS.createSign( opt, jwk )
	// 	.update( JSON.stringify( payload ) )
	// 	.final();
	//
	// logger.debug( `Token: ${ token.signResult }` );
	//
	// context.res.setHeader( "x-access-token", token.signResult.toString() );

	return !!payload;
}