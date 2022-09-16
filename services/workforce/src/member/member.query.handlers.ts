import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetMemberQuery, GetMembersQuery } from "./member.queries";
import type { MemberModel } from "./member.model";
import { WorkforcePrismaService } from "@shaastra/prisma";
import { NotFoundException } from "@nestjs/common";
import { MemberMessages } from "./member.messages";

@QueryHandler( GetMembersQuery )
export class GetMembersQueryHandler implements IQueryHandler<GetMembersQuery, MemberModel[]> {
	constructor( private readonly prismaService: WorkforcePrismaService ) {}

	execute( { data }: GetMembersQuery ) {
		return this.prismaService.member.findMany( {
			where: {
				teams: !!data.team ? { some: { name: data.team } } : undefined,
				departments: !!data.department ? { has: data.department } : undefined
			}
		} );
	}
}

@QueryHandler( GetMemberQuery )
export class GetMemberQueryHandler implements IQueryHandler<GetMemberQuery, MemberModel> {
	constructor( private readonly prismaService: WorkforcePrismaService ) {}

	async execute( { id }: GetMemberQuery ) {
		const member = await this.prismaService.member.findUnique( { where: { id } } );
		if ( !member ) {
			throw new NotFoundException( MemberMessages.NOT_FOUND );
		}
		return member;
	}
}

export const queryHandlers = [ GetMembersQueryHandler ];