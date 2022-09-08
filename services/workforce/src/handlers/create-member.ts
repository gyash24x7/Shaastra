import type { ICommandHandler } from "@nestjs/cqrs";
import { CommandHandler, EventBus } from "@nestjs/cqrs";
import { CreateMemberCommand } from "../commands/create-member";
import { MemberCreatedEvent } from "../events/member-created";
import { WorkforcePrismaService } from "@shaastra/prisma";

@CommandHandler( CreateMemberCommand )
export class CreateMemberHandler implements ICommandHandler<CreateMemberCommand> {
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