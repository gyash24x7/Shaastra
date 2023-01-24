import type { IQuery, IQueryHandler } from "@nestjs/cqrs";
import { QueryHandler } from "@nestjs/cqrs";
import type { Member } from "@prisma/client/workforce/index.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { LoggerFactory } from "@shaastra/framework";

export class MembersQuery implements IQuery {
	constructor( public readonly teamId: string ) {}
}

@QueryHandler( MembersQuery )
export class MembersQueryHandler implements IQueryHandler<MembersQuery, Member[]> {
	private readonly logger = LoggerFactory.getLogger( MembersQueryHandler );

	constructor( private readonly prismaService: PrismaService ) {}

	async execute( { teamId }: MembersQuery ): Promise<Member[]> {
		this.logger.debug( `>> execute()` );
		this.logger.debug( "Data: %o", { teamId } );
		const members = await this.prismaService.team.findUniqueOrThrow( { where: { id: teamId } } ).members();
		this.logger.debug( "Members found: %o", members );
		return members;
	}

}