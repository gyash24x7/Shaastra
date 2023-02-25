import { LoggerFactory } from "@app/framework/logger";
import { Prisma, PrismaService } from "@app/framework/prisma";
import type { IQuery, IQueryHandler } from "@nestjs/cqrs";
import { QueryHandler } from "@nestjs/cqrs";
import type { Member, PrismaClient } from "../../prisma/generated";

export class MemberQuery implements IQuery {
	constructor( public readonly memberId: string ) {}
}

@QueryHandler( MemberQuery )
export class MemberQueryHandler implements IQueryHandler<MemberQuery, Member | null> {
	private readonly logger = LoggerFactory.getLogger( MemberQueryHandler );

	constructor( @Prisma() private readonly prismaService: PrismaService<PrismaClient> ) {}

	async execute( { memberId }: MemberQuery ): Promise<Member | null> {
		this.logger.debug( ">> execute()" );
		this.logger.debug( "Data: %o", { memberId } );

		const member = await this.prismaService.client.member.findUnique( { where: { id: memberId } } );
		this.logger.debug( "Member found: %o", member );

		return member;
	}

}