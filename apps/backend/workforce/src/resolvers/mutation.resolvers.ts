import { GraphQLResolverParams, Mutation, Resolver } from "@app/framework/graphql";
import { LoggerFactory } from "@app/framework/logger";
import { CommandBus } from "@nestjs/cqrs";
import type { Member, Team } from "@prisma/client/workforce";
import {
	CreateMemberCommand,
	CreateMemberInput,
	CreateTeamCommand,
	CreateTeamInput,
	EnableMemberCommand,
	EnableMemberInput
} from "../commands";

@Resolver( "Mutation" )
export class MutationResolvers {
	private readonly logger = LoggerFactory.getLogger( MutationResolvers );

	constructor( private readonly commandBus: CommandBus ) {}

	@Mutation()
	createTeam( { args, context }: GraphQLResolverParams<CreateTeamInput> ): Promise<Team> {
		this.logger.debug( ">> createTeam()" );
		this.logger.debug( "Args: %o", args );
		return this.commandBus.execute( new CreateTeamCommand( args.data, context.authInfo ) );
	}

	@Mutation()
	createMember( { args }: GraphQLResolverParams<CreateMemberInput> ): Promise<Member> {
		this.logger.debug( ">> createMember()" );
		this.logger.debug( "Args: %o", args );
		return this.commandBus.execute( new CreateMemberCommand( args.data ) );
	}

	@Mutation()
	enableMember( { args }: GraphQLResolverParams<EnableMemberInput> ): Promise<Member> {
		this.logger.debug( ">> enableMember()" );
		this.logger.debug( "Args: %o", args );
		return this.commandBus.execute( new EnableMemberCommand( args.data ) );
	}
}