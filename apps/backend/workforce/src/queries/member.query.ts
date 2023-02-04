import type { IQuery, IQueryHandler } from "@nestjs/cqrs";
import { QueryHandler } from "@nestjs/cqrs";
import type { Member, PrismaClient } from "@prisma/client/workforce/index.js";
import { LoggerFactory, PrismaService, Prisma } from "@shaastra/framework";

export class MemberQuery implements IQuery {
	constructor( public readonly memberId: string ) {}
}

@QueryHandler( MemberQuery )
export class MemberQueryHandler implements IQueryHandler<MemberQuery, Member> {
	private readonly logger = LoggerFactory.getLogger( MemberQueryHandler );

	constructor( @Prisma() private readonly prismaService: PrismaService<PrismaClient> ) {}

	async execute( { memberId }: MemberQuery ): Promise<Member> {
		this.logger.debug( ">> execute()" );
		this.logger.debug( "Data: %o", { memberId } );

		const member = await this.prismaService.client.member.findUniqueOrThrow( { where: { id: memberId } } );
		this.logger.debug( "Member found: %o", member );

		return member;
	}

}