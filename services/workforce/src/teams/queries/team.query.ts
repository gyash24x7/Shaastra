import { IQuery, IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import type { Team } from "@prisma/client/workforce";
import { PrismaService } from "../../prisma/prisma.service";

export class TeamQuery implements IQuery {
	constructor( public readonly id: string ) {}
}

@QueryHandler( TeamQuery )
export class TeamQueryHandler implements IQueryHandler<TeamQuery, Team | null> {
	constructor( private readonly prismaService: PrismaService ) {}

	execute( { id }: TeamQuery ): Promise<Team | null> {
		return this.prismaService.team.findUnique( { where: { id } } );
	}
}