import type { IQuery, IQueryHandler } from "@nestjs/cqrs";
import { QueryHandler } from "@nestjs/cqrs";
import type { Member } from "../prisma/index.js";
import { PrismaService } from "../prisma/index.js";

export class MemberQuery implements IQuery {
	constructor( public readonly id: string ) {}
}

@QueryHandler( MemberQuery )
export class MemberQueryHandler implements IQueryHandler<MemberQuery, Member | null> {
	constructor( private readonly prismaService: PrismaService ) {}

	execute( { id }: MemberQuery ): Promise<Member | null> {
		return this.prismaService.member.findUnique( { where: { id } } );
	}
}