import { CommandBus } from "@nestjs/cqrs";
import type { Member, Team } from "@prisma/client/workforce/index.js";
import { type GraphQLResolverParams, LoggerFactory, Mutation, Resolver } from "@shaastra/framework";
import { CreateMemberCommand, CreateMemberInput } from "../commands/create.member.command.js";
import { CreateTeamCommand, CreateTeamInput } from "../commands/create.team.command.js";
import { EnableMemberCommand, EnableMemberInput } from "../commands/enable.member.command.js";

@Resolver()
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