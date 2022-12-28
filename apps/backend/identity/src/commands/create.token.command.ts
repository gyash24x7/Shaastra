import type { ServiceContext } from "@shaastra/framework";
import { logger } from "@shaastra/framework";
import crypto from "crypto";
import dayjs from "dayjs";
import { AppCommands } from "./index.js";
import { prisma } from "../index.js";

export type CreateTokenInput = { userId: string, token?: string };

export default async function createTokenCommandHandler( _data: unknown, _context: ServiceContext ) {
	let data = _data as CreateTokenInput;

	logger.debug( `Handling ${ AppCommands.CREATE_TOKEN_COMMAND }...` );
	logger.debug( "Data: ", data );

	const token = data.token || crypto.randomBytes( 32 ).toString( "hex" );
	const expiry = dayjs().add( 2, "days" ).toDate();
	return prisma.token.create( { data: { userId: data.userId, token, expiry } } );
}