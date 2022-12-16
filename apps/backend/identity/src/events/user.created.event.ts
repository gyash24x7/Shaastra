import type { PrismaClient, Token, User } from "@prisma/client/identity/index.js";
import type { IEvent, IEventHandler } from "@shaastra/cqrs";
import type { ServiceContext } from "@shaastra/utils";
import { CreateTokenCommand } from "../commands/index.js";

export class UserCreatedEvent implements IEvent<User, ServiceContext<PrismaClient>> {
	constructor(
		public readonly data: User,
		public readonly context: ServiceContext<PrismaClient>
	) {}

	public static readonly handler: IEventHandler<UserCreatedEvent> = async ( { data, context } ) => {
		const token: Token = await context.commandBus.execute( new CreateTokenCommand( { userId: data.id }, context ) );
		const link = `http://localhost:3000/verify/${ data.id }/${ token.id }`;
		const subject = "Verify your Shaastra Account";
		const content = `Please click here to verify your Shaastra Account ${ link }`;
		await context.mailer.sendMail( { subject, content, email: data.email, name: data.name } );
	};
}