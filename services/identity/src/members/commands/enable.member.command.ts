import { CommandHandler, EventBus, ICommand, ICommandHandler } from "@nestjs/cqrs";
import { MemberEnabledEvent } from "../events/member.enabled.event";
import { PrismaService } from "../../prisma/prisma.service";

export type EnableMemberInput = {
	userId: string;
}

export class EnableMemberCommand implements ICommand {
	constructor( public readonly data: EnableMemberInput ) {}
}

@CommandHandler( EnableMemberCommand )
export class EnableMemberCommandHandler implements ICommandHandler<EnableMemberCommand, boolean> {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly eventBus: EventBus
	) {}

	async execute( { data }: EnableMemberCommand ): Promise<boolean> {
		const member = await this.prismaService.member.update( {
			where: { userId: data.userId },
			data: { enabled: true },
			include: { user: true }
		} );

		this.eventBus.publish( new MemberEnabledEvent( member ) );
		return true;
	}
}