import { IQuery, IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import type { Team } from "@prisma/client/workforce";
import { PrismaService } from "../../prisma/prisma.service";

export class TeamsQuery implements IQuery {
	constructor( public readonly memberId: string ) {}
}

@QueryHandler( TeamsQuery )
export class TeamsQueryHandler implements IQueryHandler<TeamsQuery, Team[]> {
	constructor( private readonly prismaService: PrismaService ) {}

	execute( { memberId }: TeamsQuery ): Promise<Team[]> {
		return this.prismaService.member.findUniqueOrThrow( { where: { id: memberId } } ).teams();
	}
}