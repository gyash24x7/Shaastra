import type { PrismaClient } from "@prisma/client/connect/index.js";
import type { ICommand, ICommandHandler } from "@shaastra/cqrs";
import type { ServiceContext } from "@shaastra/utils";
import type { CreateMessageInput } from "../graphql/inputs.js";

export class CreateMessageCommand implements ICommand<CreateMessageInput, ServiceContext<PrismaClient>> {
	constructor(
		public readonly data: CreateMessageInput,
		public readonly context: ServiceContext<PrismaClient>
	) {}

	public static readonly handler: ICommandHandler<CreateMessageCommand, string> = async ( { data, context } ) => {
		const message = await context.prisma.message.create( {
			data: { ...data, createdById: context.authInfo!.id }
		} );
		return message.id;
	};
}
