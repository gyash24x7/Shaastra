import type { IQuery, IQueryHandler } from "@nestjs/cqrs";
import { QueryHandler } from "@nestjs/cqrs";
import type { Member } from "@prisma/client/workforce/index.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { LoggerFactory } from "@shaastra/framework";

export class MemberQuery implements IQuery {
	constructor( public readonly memberId: string ) {}
}

@QueryHandler( MemberQuery )
export class MemberQueryHandler implements IQueryHandler<MemberQuery, Member> {
	private readonly logger = LoggerFactory.getLogger( MemberQueryHandler );

	constructor( private readonly prismaService: PrismaService ) {}

	async execute( { memberId }: MemberQuery ): Promise<Member> {
		this.logger.debug( ">> execute()" );
		this.logger.debug( "Data: %o", { memberId } );

		const member = await this.prismaService.member.findUniqueOrThrow( { where: { id: memberId } } );
		this.logger.debug( "Member found: %o", member );

		return member;
	}

}