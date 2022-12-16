import type { PrismaClient } from "@prisma/client/identity/index.js";
import type { ICommand, ICommandHandler } from "@shaastra/cqrs";
import type { ServiceContext } from "@shaastra/utils";
import dayjs from "dayjs";
import type { VerifyUserInput } from "../graphql/inputs.js";


export class VerifyUserCommand implements ICommand<VerifyUserInput, ServiceContext<PrismaClient>> {
	public readonly name = "VERIFY_USER_COMMAND";

	constructor(
		public readonly data: VerifyUserInput,
		public readonly context: ServiceContext<PrismaClient>
	) {}

	public static readonly handler: ICommandHandler<VerifyUserCommand, string> = async ( { data, context } ) => {
		const user = await context.prisma.user.findUnique( { where: { id: data.userId } } );
		if ( !user ) {
			return "";
		}

		const token = await context.prisma.token.findUnique( { where: { id: data.tokenId } } );
		if ( !token || dayjs().isAfter( token.expiry ) ) {
			return "";
		}

		await context.prisma.user.update( {
			where: { id: data.userId },
			data: { verified: true }
		} );

		await context.prisma.token.delete( { where: { id: data.tokenId } } );

		return user.id;
	};
}