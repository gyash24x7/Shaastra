import { CreateMemberCommand, CreateTeamCommand, EnableMemberCommand } from "../commands/index.js";
import { MemberQuery, MembersQuery, TeamQuery, TeamsQuery } from "../queries/index.js";
import type { Resolvers } from "./generated/index.js";

export const resolvers: Resolvers = {
	Query: {
		me( _parent, _args, context ) {
			return context.queryBus.execute( new MemberQuery( { id: context.authInfo!.id }, context ) );
		}
	},
	Mutation: {
		async createMember( _parent, { data }, context ) {
			return context.commandBus.execute( new CreateMemberCommand( data, context ) );
		},

		async enableMember( _parent, { data }, context ) {
			return context.commandBus.execute( new EnableMemberCommand( data, context ) );
		},

		async createTeam( _parent, { data }, context ) {
			return context.commandBus.execute( new CreateTeamCommand( data, context ) );
		}
	},
	Member: {
		__resolveReference( parent, context ) {
			return context.queryBus.execute( new MemberQuery( { id: parent.id }, context ) );
		},

		async teams( parent, _args, context ) {
			return context.queryBus.execute( new TeamsQuery( { memberId: parent.id }, context ) );
		}
	},
	Team: {
		__resolveReference( parent, context ) {
			return context.queryBus.execute( new TeamQuery( { id: parent.id }, context ) );
		},

		async members( parent, _args, context ) {
			return context.queryBus.execute( new MembersQuery( { teamId: parent.id }, context ) );
		}
	}
};