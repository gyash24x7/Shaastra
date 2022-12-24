import dayjs from "dayjs";
import type { VerifyUserInput } from "../graphql/inputs.js";
import type { AppContext } from "../index.js";

export default async function verifyUserCommandHandler( data: unknown, context: AppContext ) {
	const input = data as VerifyUserInput;
	const user = await context.prisma.user.findUnique( { where: { id: input.userId } } );
	if ( !user ) {
		return "";
	}

	const token = await context.prisma.token.findUnique( { where: { id: input.tokenId } } );
	if ( !token || dayjs().isAfter( token.expiry ) ) {
		return "";
	}

	await context.prisma.user.update( {
		where: { id: input.userId },
		data: { verified: true }
	} );

	await context.prisma.token.delete( { where: { id: input.tokenId } } );

	return user.id;
}