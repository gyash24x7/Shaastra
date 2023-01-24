import type { ICommand, ICommandHandler } from "@nestjs/cqrs";
import { CommandHandler, EventBus } from "@nestjs/cqrs";
import type { Member } from "@prisma/client/workforce/index.js";
import { LoggerFactory } from "@shaastra/framework";
import { MemberEnabledEvent } from "../events/member.enabled.event.js";
import { PrismaService } from "../prisma/prisma.service.js";

export type EnableMemberInput = {
	id: string
}

export class EnableMemberCommand implements ICommand {
	constructor( public readonly data: EnableMemberInput ) {}
}

@CommandHandler( EnableMemberCommand )
export class EnableMemberCommandHandler implements ICommandHandler<EnableMemberCommand, Member> {
	private readonly logger = LoggerFactory.getLogger( EnableMemberCommandHandler );

	constructor(
		private readonly prismaService: PrismaService,
		private readonly eventBus: EventBus
	) {}

	async execute( { data }: EnableMemberCommand ): Promise<Member> {
		this.logger.debug( `>> enableMember()` );
		this.logger.debug( "Data: %o", data );

		const member = await this.prismaService.member.update( {
			where: { id: data.id },
			data: { enabled: true }
		} );

		this.logger.debug( "Member Enabled Successfully! Id: %s", member.id );

		this.eventBus.publish( new MemberEnabledEvent( member ) );
		return member;
	}

}