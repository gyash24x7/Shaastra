import type { PrismaClient } from "@prisma/client/connect/index.js";
import type { ICommand, ICommandHandler } from "@shaastra/cqrs";
import type { ServiceContext } from "@shaastra/utils";
import type { CreateChannelInput } from "../graphql/inputs.js";

export class CreateChannelCommand implements ICommand<CreateChannelInput, ServiceContext<PrismaClient>> {
	constructor(
		public readonly data: CreateChannelInput,
		public readonly context: ServiceContext<PrismaClient>
	) {}

	public static readonly handler: ICommandHandler<CreateChannelCommand, string> = async ( { data, context } ) => {
		const channel = await context.prisma.channel.create( {
			data: { ...data, createdById: context.authInfo!.id }
		} );
		return channel.id;
	};
}
