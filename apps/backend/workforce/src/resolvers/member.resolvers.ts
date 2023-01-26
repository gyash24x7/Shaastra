import { QueryBus } from "@nestjs/cqrs";
import type { Member, Team } from "@prisma/client/workforce/index.js";
import {
	FieldResolver,
	type GraphQLResolverParams,
	LoggerFactory,
	Resolver,
	ResolveReference
} from "@shaastra/framework";
import { MemberQuery } from "../queries/member.query.js";
import { TeamsQuery } from "../queries/teams.query.js";

@Resolver()
export class MemberResolvers {
	private readonly logger = LoggerFactory.getLogger( MemberResolvers );

	constructor( private readonly queryBus: QueryBus ) {}

	@ResolveReference( "Member" )
	__resolveReference( { parent: { id } }: GraphQLResolverParams ): Promise<Member> {
		this.logger.debug( ">> resolveReference()" );
		this.logger.debug( "Member Id: %s", id );
		return this.queryBus.execute( new MemberQuery( id! ) );
	}

	@FieldResolver( "Member" )
	teams( { parent: { id } }: GraphQLResolverParams ): Promise<Array<Team>> {
		this.logger.debug( ">> teams()" );
		this.logger.debug( "Member Id: %s", id );
		return this.queryBus.execute( new TeamsQuery( id! ) );
	}
}