import type { IQuery, IQueryHandler } from "@nestjs/cqrs";
import { QueryHandler } from "@nestjs/cqrs";
import type { Team, PrismaClient } from "@prisma/client/workforce/index.js";
import { LoggerFactory, PrismaService, Prisma } from "@shaastra/framework";

export class TeamsQuery implements IQuery {
	constructor( public readonly memberId: string ) {}
}

@QueryHandler( TeamsQuery )
export class TeamsQueryHandler implements IQueryHandler<TeamsQuery, Team[]> {
	private readonly logger = LoggerFactory.getLogger( TeamsQueryHandler );

	constructor( @Prisma() private readonly prismaService: PrismaService<PrismaClient> ) {}

	async execute( { memberId }: TeamsQuery ): Promise<Team[]> {
		this.logger.debug( `>> execute()` );
		this.logger.debug( "Data: %o", { memberId } );
		const teams = await this.prismaService.client.member.findUniqueOrThrow( { where: { id: memberId } } ).teams();
		this.logger.debug( "Teams found: %o", teams );
		return teams;
	}

}