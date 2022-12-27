import { logger } from "@shaastra/framework";
import crypto from "crypto";
import dayjs from "dayjs";
import type { AppContext } from "../index.js";
import { AppCommands } from "./index.js";

export type CreateTokenInput = { userId: string, token?: string };

export default async function createTokenCommandHandler( _data: unknown, context: AppContext ) {
	let data = _data as CreateTokenInput;

	logger.debug( `Handling ${ AppCommands.CREATE_TOKEN_COMMAND }...` );
	logger.debug( "Data: ", data );

	const token = data.token || crypto.randomBytes( 32 ).toString( "hex" );
	const expiry = dayjs().add( 2, "days" ).toDate();
	return context.prisma.token.create( { data: { userId: data.userId, token, expiry } } );
}