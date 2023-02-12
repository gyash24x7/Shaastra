import { ConflictException } from "@nestjs/common";
import type { ICommand, ICommandHandler } from "@nestjs/cqrs";
import { CommandHandler, EventBus } from "@nestjs/cqrs";
import type { Department, Team, PrismaClient, Member } from "@prisma/client/workforce/index.js";
import type { UserAuthInfo } from "@shaastra/framework";
import { LoggerFactory, PrismaService, Prisma } from "@shaastra/framework";
import { TeamMessages } from "../constants/messages.js";
import { TeamCreatedEvent } from "../events/index.js";

export type CreateTeamInput = {
	name: string;
	department: Department;
}

export class CreateTeamCommand implements ICommand {
	constructor(
		public readonly data: CreateTeamInput,
		public readonly authInfo?: UserAuthInfo
	) {}
}

@CommandHandler( CreateTeamCommand )
export class CreateTeamCommandHandler implements ICommandHandler<CreateTeamCommand, Team> {
	private readonly logger = LoggerFactory.getLogger( CreateTeamCommandHandler );

	constructor(
		@Prisma() private readonly prismaService: PrismaService<PrismaClient>,
		private readonly eventBus: EventBus
	) {}

	async execute( { data, authInfo }: CreateTeamCommand ): Promise<Team & { members: Member[] }> {
		this.logger.debug( `>> createTeam()` );
		this.logger.debug( "Data: %o", data );

		const existingTeam = await this.prismaService.client.team.findUnique( { where: { name: data.name } } );

		if ( !!existingTeam ) {
			this.logger.error( "Team already exists with Name %s", data.name );
			throw new ConflictException( TeamMessages.ALREADY_EXISTS );
		}

		const team = await this.prismaService.client.team.create( {
			data: {
				...data,
				department: authInfo?.department! as Department,
				members: { connect: { id: authInfo!.id } },
				createdBy: { connect: { id: authInfo!.id } }
			},
			include: { members: true }
		} );

		this.logger.debug( "Team Created Successfully! Id: %s", team.id );
		this.eventBus.publish( new TeamCreatedEvent( team ) );
		return team;
	}

}