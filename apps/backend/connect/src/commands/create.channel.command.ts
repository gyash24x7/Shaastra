import { ConflictException } from "@nestjs/common";
import type { ICommand, ICommandHandler } from "@nestjs/cqrs";
import { CommandHandler, EventBus } from "@nestjs/cqrs";
import type { Channel, ChannelType, PrismaClient } from "@prisma/client/connect/index.js";
import { LoggerFactory, UserAuthInfo, Prisma, PrismaService } from "@shaastra/framework";
import { ChannelMessages } from "../constants/messages.js";
import { ChannelCreatedEvent } from "../events/channel.created.event.js";

export type CreateChannelInput = {
	name: string;
	description: string;
	type: ChannelType;
}

export class CreateChannelCommand implements ICommand {
	constructor(
		public readonly data: CreateChannelInput,
		public readonly authInfo: UserAuthInfo
	) {}
}

@CommandHandler( CreateChannelCommand )
export class CreateChannelCommandHandler implements ICommandHandler<CreateChannelCommand, Channel> {
	private readonly logger = LoggerFactory.getLogger( CreateChannelCommandHandler );

	constructor(
		@Prisma() private readonly prismaService: PrismaService<PrismaClient>,
		private readonly eventBus: EventBus
	) {}

	async execute( { data, authInfo }: CreateChannelCommand ): Promise<Channel> {
		this.logger.debug( `>> createChannel()` );
		this.logger.debug( "Data: %o", data );

		const existingChannel = await this.prismaService.client.channel.findFirst( {
			where: { name: data.name }
		} );

		if ( existingChannel ) {
			this.logger.error( "Channel with Name (%s) already exists!", data.name );
			throw new ConflictException( ChannelMessages.ALREADY_EXISTS );
		}

		const channel = await this.prismaService.client.channel.create( {
			data: { ...data, createdById: authInfo.id }
		} );

		this.logger.debug( "Channel Created Successfully! Id: %s", channel.id );

		this.eventBus.publish( new ChannelCreatedEvent( channel ) );
		return channel;
	}

}