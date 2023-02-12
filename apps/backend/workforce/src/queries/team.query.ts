import type { IQuery, IQueryHandler } from "@nestjs/cqrs";
import { QueryHandler } from "@nestjs/cqrs";
import type { Team, PrismaClient } from "@prisma/client/workforce/index.js";
import { LoggerFactory, PrismaService, Prisma } from "@shaastra/framework";

export class TeamQuery implements IQuery {
	constructor( public readonly teamId: string ) {}
}

@QueryHandler( TeamQuery )
export class TeamQueryHandler implements IQueryHandler<TeamQuery, Team | null> {
	private readonly logger = LoggerFactory.getLogger( TeamQueryHandler );

	constructor( @Prisma() private readonly prismaService: PrismaService<PrismaClient> ) {}

	async execute( { teamId }: TeamQuery ): Promise<Team | null> {
		this.logger.debug( `>> execute()` );
		this.logger.debug( "Data: %o", { teamId } );
		const team = await this.prismaService.client.team.findUnique( { where: { id: teamId } } );
		this.logger.debug( "Team found: %o", team );
		return team;
	}

}