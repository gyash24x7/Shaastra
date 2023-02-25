import type { UserAuthInfo } from "@app/framework/auth";
import { LoggerFactory } from "@app/framework/logger";
import { Prisma, PrismaService } from "@app/framework/prisma";
import type { ICommand, ICommandHandler } from "@nestjs/cqrs";
import { CommandHandler, EventBus } from "@nestjs/cqrs";
import type { Message, PrismaClient } from "@prisma/client/connect";
import { MessageCreatedEvent } from "../events";

export type CreateMessageInput = {
	content: string;
	channelId: string;
}

export class CreateMessageCommand implements ICommand {
	constructor(
		public readonly data: CreateMessageInput,
		public readonly authInfo: UserAuthInfo
	) {}
}

@CommandHandler( CreateMessageCommand )
export class CreateMessageCommandHandler implements ICommandHandler<CreateMessageCommand, Message> {
	private readonly logger = LoggerFactory.getLogger( CreateMessageCommandHandler );

	constructor(
		@Prisma() private readonly prismaService: PrismaService<PrismaClient>,
		private readonly eventBus: EventBus
	) {}

	async execute( { data, authInfo }: CreateMessageCommand ): Promise<Message> {
		this.logger.debug( `>> createMessage()` );
		this.logger.debug( "Data: %o", data );

		const message = await this.prismaService.client.message.create( {
			data: { ...data, createdById: authInfo.id }
		} );

		this.logger.debug( "Message Created Successfully! Id: %s", message.id );
		this.eventBus.publish( new MessageCreatedEvent( message ) );
		return message;
	}
}