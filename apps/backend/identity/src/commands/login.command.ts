import bcrypt from "bcryptjs";
import type { LoginInput } from "../graphql/inputs.js";
import { UserMessages } from "../messages/user.messages.js";
import type { AppContext } from "../index.js";

export default async function loginCommandHandler( data: unknown, context: AppContext ) {
	const input = data as LoginInput;

	const existingUser = await context.prisma.user.findUnique( {
		where: { username: input.username }
	} );

	context.logger?.debug( `Existing User: ${ JSON.stringify( existingUser ) }` );

	if ( !existingUser ) {
		throw new Error( UserMessages.NOT_FOUND );
	}

	if ( !existingUser.verified ) {
		throw new Error( UserMessages.NOT_VERIFIED );
	}

	const doPasswordsMatch = bcrypt.compareSync( input.password, existingUser.password );
	if ( !doPasswordsMatch ) {
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
	// context.logger.debug( `Token: ${ token.signResult }` );
	//
	// context.res.setHeader( "x-access-token", token.signResult.toString() );

	return !!payload;
}