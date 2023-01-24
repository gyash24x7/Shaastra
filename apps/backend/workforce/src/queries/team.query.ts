import type { IQuery, IQueryHandler } from "@nestjs/cqrs";
import { QueryHandler } from "@nestjs/cqrs";
import type { Team } from "@prisma/client/workforce/index.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { LoggerFactory } from "@shaastra/framework";

export class TeamQuery implements IQuery {
	constructor( public readonly teamId: string ) {}
}

@QueryHandler( TeamQuery )
export class TeamQueryHandler implements IQueryHandler<TeamQuery, Team> {
	private readonly logger = LoggerFactory.getLogger( TeamQueryHandler );

	constructor( private readonly prismaService: PrismaService ) {}

	async execute( { teamId }: TeamQuery ): Promise<Team> {
		this.logger.debug( `>> execute()` );
		this.logger.debug( "Data: %o", { teamId } );
		const team = await this.prismaService.team.findUniqueOrThrow( { where: { id: teamId } } );
		this.logger.debug( "Team found: %o", team );
		return team;
	}

}