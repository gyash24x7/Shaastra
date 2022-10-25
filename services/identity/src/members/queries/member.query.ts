import type { IQuery, IQueryHandler } from "@nestjs/cqrs";
import { QueryHandler } from "@nestjs/cqrs";
import type { Member, User } from "@prisma/client/identity";
import { PrismaService } from "../../prisma/prisma.service";

export type MemberWithUser = Member & { user: User };

export class MemberQuery implements IQuery {
	constructor( public readonly id: string ) {}
}

@QueryHandler( MemberQuery )
export class MemberQueryHandler implements IQueryHandler<MemberQuery, MemberWithUser | null> {
	constructor( private readonly prismaService: PrismaService ) {}

	execute( { id }: MemberQuery ): Promise<MemberWithUser | null> {
		return this.prismaService.member.findUnique( { where: { id }, include: { user: true } } );
	}
}