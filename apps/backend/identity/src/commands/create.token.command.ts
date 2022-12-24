import crypto from "crypto";
import dayjs from "dayjs";
import type { AppContext } from "../index.js";

export type CreateTokenInput = { userId: string, token?: string };

export default async function createTokenCommandHandler( data: unknown, context: AppContext ) {
	let input = data as CreateTokenInput;
	const token = input.token || crypto.randomBytes( 32 ).toString( "hex" );
	const expiry = dayjs().add( 2, "days" ).toDate();
	return context.prisma.token.create( { data: { userId: input.userId, token, expiry } } );
}