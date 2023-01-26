import { CommandBus } from "@nestjs/cqrs";
import type { Message, Channel } from "@prisma/client/connect/index.js";
import { type GraphQLResolverParams, LoggerFactory, Mutation, Resolver } from "@shaastra/framework";
import { CreateChannelCommand, CreateChannelInput } from "../commands/create.channel.command.js";
import { CreateMessageCommand, CreateMessageInput } from "../commands/create.message.command.js";

@Resolver()
export class MutationResolvers {
	private readonly logger = LoggerFactory.getLogger( MutationResolvers );

	constructor( private readonly commandBus: CommandBus ) {}

	@Mutation()
	createChannel( { args, context }: GraphQLResolverParams<CreateChannelInput> ): Promise<Channel> {
		this.logger.debug( ">> createChannel()" );
		this.logger.debug( "Args: %o", args );
		return this.commandBus.execute( new CreateChannelCommand( args.data, context.authInfo! ) );
	}

	@Mutation()
	createMessage( { args, context }: GraphQLResolverParams<CreateMessageInput> ): Promise<Message> {
		this.logger.debug( ">> createMessage()" );
		this.logger.debug( "Args: %o", args );
		return this.commandBus.execute( new CreateMessageCommand( args.data, context.authInfo! ) );
	}
}