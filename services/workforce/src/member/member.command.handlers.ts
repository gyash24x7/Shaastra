import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { MemberCreatedEvent, MemberEnabledEvent } from "./member.events";
import { CreateMemberCommand, EnableMemberCommand } from "./member.commands";
import { WorkforcePrismaService } from "@shaastra/prisma";

@CommandHandler( CreateMemberCommand )
export class CreateMemberCommandHandler implements ICommandHandler<CreateMemberCommand> {
	constructor(
		private readonly prismaService: WorkforcePrismaService,
		private readonly eventBus: EventBus
	) {}

	async execute( { data }: CreateMemberCommand ) {
		const member = await this.prismaService.member.create( {
			data: { ...data, departments: { set: data.departments } }
		} );

		this.eventBus.publish( new MemberCreatedEvent( member ) );
	}
}

@CommandHandler( EnableMemberCommand )
export class EnableMemberCommandHandler implements ICommandHandler<EnableMemberCommand> {
	constructor(
		private readonly prismaService: WorkforcePrismaService,
		private readonly eventBus: EventBus
	) {}

	async execute( { data }: EnableMemberCommand ) {
		const member = await this.prismaService.member.update( {
			where: { id: data.memberId },
			data: { enabled: true }
		} );

		this.eventBus.publish( new MemberEnabledEvent( member ) );
	}
}

export const commandHandlers = [ EnableMemberCommandHandler, CreateMemberCommandHandler ];