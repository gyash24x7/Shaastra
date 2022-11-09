import type { ICommand, ICommandHandler } from "@nestjs/cqrs";
import { CommandHandler, EventBus } from "@nestjs/cqrs";
import type { UserAuthInfo } from "@shaastra/auth";
import { PrismaService } from "../../prisma/prisma.service";
import { Field, InputType } from "@nestjs/graphql";
import { MessageCreatedEvent } from "../events/message.created.event";

@InputType( CreateMessageInput.TYPENAME )
export class CreateMessageInput {
	public static readonly TYPENAME = CreateMessageInput.name;
	@Field() content: string;
	@Field() channelId: string;
}

export class CreateMessageCommand implements ICommand {
	constructor(
		public readonly data: CreateMessageInput,
		public readonly authInfo: UserAuthInfo
	) {}
}

@CommandHandler( CreateMessageCommand )
export class CreateMessageCommandHandler implements ICommandHandler<CreateMessageCommand, string> {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly eventBus: EventBus
	) {}

	async execute( { data, authInfo }: CreateMessageCommand ): Promise<string> {
		const message = await this.prismaService.message.create(
			{ data: { ...data, createdById: authInfo.id } }
		);

		this.eventBus.publish( new MessageCreatedEvent( message ) );
		return message.id;
	}
}