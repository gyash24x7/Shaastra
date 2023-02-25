import { LoggerFactory } from "@app/framework/logger";
import { Prisma, PrismaService } from "@app/framework/prisma";
import type { IQuery, IQueryHandler } from "@nestjs/cqrs";
import { QueryHandler } from "@nestjs/cqrs";
import type { PrismaClient, Team } from "@prisma/client/workforce";

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

		const member = await this.prismaService.client.member.findUniqueOrThrow( {
			where: { id: memberId },
			include: { teams: true }
		} );

		this.logger.debug( "Teams found: %o", member.teams );
		return member.teams;
	}

}