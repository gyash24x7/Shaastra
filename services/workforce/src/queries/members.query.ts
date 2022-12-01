import type { IQuery, IQueryHandler } from "@nestjs/cqrs";
import { QueryHandler } from "@nestjs/cqrs";
import type { Member } from "../prisma/index.js";
import { PrismaService } from "../prisma/index.js";

export class MembersQuery implements IQuery {
	constructor( public readonly teamId: string ) {}
}

@QueryHandler( MembersQuery )
export class MembersQueryHandler implements IQueryHandler<MembersQuery, Member[]> {
	constructor( private readonly prismaService: PrismaService ) {}

	async execute( { teamId }: MembersQuery ): Promise<Member[]> {
		return this.prismaService.team.findUniqueOrThrow( { where: { id: teamId } } ).members();
	}

}