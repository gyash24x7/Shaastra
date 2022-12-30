import type { ServiceContext } from "@shaastra/framework";
import { logger } from "@shaastra/framework";
import dayjs from "dayjs";
import type { VerifyUserInput } from "../graphql/inputs.js";
import { UserMessages } from "../messages/user.messages.js";
import { AppCommands } from "./index.js";
import { prisma } from "../index.js";
import { TokenMessages } from "../messages/token.messages.js";

export default async function verifyUserCommandHandler( _data: unknown, _context: ServiceContext ) {
	const data = _data as VerifyUserInput;

	logger.debug( `Handling ${ AppCommands.VERIFY_USER_COMMAND }...` );
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

	return user.id;
}