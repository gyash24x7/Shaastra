import { LoggerFactory } from "@app/framework/logger";
import { Prisma, PrismaService } from "@app/framework/prisma";
import type { IQuery, IQueryHandler } from "@nestjs/cqrs";
import { QueryHandler } from "@nestjs/cqrs";
import type { Member, PrismaClient } from "../../prisma/generated";

export class MembersQuery implements IQuery {
	constructor( public readonly teamId: string ) {}
}

@QueryHandler( MembersQuery )
export class MembersQueryHandler implements IQueryHandler<MembersQuery, Member[]> {
	private readonly logger = LoggerFactory.getLogger( MembersQueryHandler );

	constructor( @Prisma() private readonly prismaService: PrismaService<PrismaClient> ) {}

	async execute( { teamId }: MembersQuery ): Promise<Member[]> {
		this.logger.debug( `>> execute()` );
		this.logger.debug( "Data: %o", { teamId } );

		const team = await this.prismaService.client.team.findUniqueOrThrow( {
			where: { id: teamId },
			include: { members: true }
		} );

		this.logger.debug( "Members found: %o", team.members );
		return team.members;
	}

}