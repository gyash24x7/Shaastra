import { GraphQLResolverParams, Mutation, Resolver } from "@app/framework/graphql";
import { LoggerFactory } from "@app/framework/logger";
import { CommandBus } from "@nestjs/cqrs";
import type { Channel, Message } from "../../prisma/generated";
import { CreateChannelCommand, CreateChannelInput, CreateMessageCommand, CreateMessageInput } from "../commands";

@Resolver( "Mutation" )
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