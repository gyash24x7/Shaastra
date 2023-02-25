import { LoggerFactory } from "@app/framework/logger";
import { Prisma, PrismaService } from "@app/framework/prisma";
import type { ICommand, ICommandHandler } from "@nestjs/cqrs";
import { CommandHandler, EventBus } from "@nestjs/cqrs";
import type { Member, PrismaClient } from "@prisma/client/workforce";
import { MemberEnabledEvent } from "../events";

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
		@Prisma() private readonly prismaService: PrismaService<PrismaClient>,
		private readonly eventBus: EventBus
	) {}

	async execute( { data }: EnableMemberCommand ): Promise<Member> {
		this.logger.debug( `>> enableMember()` );
		this.logger.debug( "Data: %o", data );

		const member = await this.prismaService.client.member.update( {
			where: { id: data.id },
			data: { enabled: true }
		} );

		this.logger.debug( "Member Enabled Successfully! Id: %s", member.id );

		this.eventBus.publish( new MemberEnabledEvent( member ) );
		return member;
	}

}