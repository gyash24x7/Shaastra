import type { PrismaClient, Token } from "@prisma/client/identity/index.js";
import type { ICommand, ICommandHandler } from "@shaastra/cqrs";
import type { ServiceContext } from "@shaastra/utils";
import crypto from "crypto";
import dayjs from "dayjs";


export type CreateTokenInput = { userId: string, token?: string };

export class CreateTokenCommand implements ICommand<CreateTokenInput, ServiceContext<PrismaClient>> {
	constructor(
		public readonly data: CreateTokenInput,
		public readonly context: ServiceContext<PrismaClient>
	) {}

	public static readonly handler: ICommandHandler<CreateTokenCommand, Token> = ( { data, context } ) => {
		const token = data.token || crypto.randomBytes( 32 ).toString( "hex" );
		const expiry = dayjs().add( 2, "days" ).toDate();
		return context.prisma.token.create( { data: { userId: data.userId, token, expiry } } );
	};
}
