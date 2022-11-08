import { IQuery, IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import type { Team } from "@prisma/client/workforce";
import { PrismaService } from "../../prisma/prisma.service";

export class TeamQuery implements IQuery {
	constructor( public readonly id: string, public readonly isMemberId: boolean = false ) {}
}

@QueryHandler( TeamQuery )
export class TeamQueryHandler implements IQueryHandler<TeamQuery, Team | null> {
	constructor( private readonly prismaService: PrismaService ) {}

	execute( { id, isMemberId }: TeamQuery ): Promise<Team | null> {
		if ( isMemberId ) {
			return this.prismaService.team.findFirst( { where: { members: { some: { id } } } } );
		}
		return this.prismaService.team.findUnique( { where: { id } } );
	}
}