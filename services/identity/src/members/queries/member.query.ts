import type { IQuery, IQueryHandler } from "@nestjs/cqrs";
import { QueryHandler } from "@nestjs/cqrs";
import type { Member, User } from "@prisma/client/identity";
import { PrismaService } from "../../prisma/prisma.service";

export type MemberWithUser = Member & { user: User };

export class MemberQuery implements IQuery {
	constructor(
		public readonly id: string,
		public readonly isUserId: boolean = false
	) {}
}

@QueryHandler( MemberQuery )
export class MemberQueryHandler implements IQueryHandler<MemberQuery, MemberWithUser | null> {
	constructor( private readonly prismaService: PrismaService ) {}

	execute( { id, isUserId }: MemberQuery ): Promise<MemberWithUser | null> {
		if ( isUserId ) {
			return this.prismaService.member.findUnique( { where: { userId: id }, include: { user: true } } );
		}

		return this.prismaService.member.findUnique( { where: { id }, include: { user: true } } );
	}
}