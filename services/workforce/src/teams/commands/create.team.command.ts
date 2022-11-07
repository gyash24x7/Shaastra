import { CommandHandler, EventBus, ICommand, ICommandHandler } from "@nestjs/cqrs";
import { ConflictException } from "@nestjs/common";
import { TeamMessages } from "../team.messages";
import { TeamCreatedEvent } from "../events/team.created.event";
import { PrismaService } from "../../prisma/prisma.service";
import type { Department } from "@prisma/client/workforce";

export type CreateTeamInput = {
	name: string
	department: Department;
	createdBy: string
}

export class CreateTeamCommand implements ICommand {
	constructor( public readonly data: CreateTeamInput ) {}
}

@CommandHandler( CreateTeamCommand )
export class CreateTeamCommandHandler implements ICommandHandler<CreateTeamCommand, string> {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly eventBus: EventBus
	) {}

	async execute( { data }: CreateTeamCommand ): Promise<string> {
		const existingTeam = await this.prismaService.team.findUnique( { where: { name: data.name } } );

		if ( existingTeam ) {
			throw new ConflictException( TeamMessages.ALREADY_EXISTS );
		}

		const team = await this.prismaService.team.create( {
			data: {
				...data,
				members: { connect: { id: data.createdBy } },
				createdBy: { connect: { id: data.createdBy } }
			},
			include: {
				members: true
			}
		} );
		this.eventBus.publish( new TeamCreatedEvent( team ) );
		return team.id;
	}
}