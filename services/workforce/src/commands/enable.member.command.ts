import { CommandHandler, EventBus, ICommand, ICommandHandler } from "@nestjs/cqrs";
import { MemberEnabledEvent } from "../events/member.enabled.event.js";
import { PrismaService } from "../prisma/index.js";
import { Field, InputType } from "@nestjs/graphql";

@InputType( EnableMemberInput.TYPENAME )
export class EnableMemberInput {
	public static readonly TYPENAME = EnableMemberInput.name;
	@Field() id: string;
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
			where: { id: data.id },
			data: { enabled: true }
		} );

		this.eventBus.publish( new MemberEnabledEvent( member ) );
		return true;
	}
}