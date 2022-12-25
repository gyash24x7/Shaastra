import type { Resolvers } from "./generated/index.js";
import { AppQueries } from "../queries/index.js";
import { AppCommands } from "../commands/index.js";
import type { Member, Team } from "@prisma/client/workforce/index.js";

export const resolvers: Resolvers = {
	Query: {
		me( _parent, _args, context ): Promise<Member> {
			return context.queryBus.execute( AppQueries.MEMBER_QUERY, { id: context.authInfo!.id }, context );
		}
	},
	Mutation: {
		async createMember( _parent, { data }, context ): Promise<string> {
			return context.commandBus.execute( AppCommands.CREATE_MEMBER_COMMAND, data, context );
		},

		async enableMember( _parent, { data }, context ): Promise<string> {
			return context.commandBus.execute( AppCommands.ENABLE_MEMBER_COMMAND, data, context );
		},

		async createTeam( _parent, { data }, context ): Promise<string> {
			return context.commandBus.execute( AppCommands.CREATE_TEAM_COMMAND, data, context );
		}
	},
	Member: {
		__resolveReference( parent, context ): Promise<Member> {
			return context.queryBus.execute( AppQueries.MEMBER_QUERY, { id: parent.id }, context );
		},

		async teams( parent, _args, context ): Promise<Team[]> {
			return context.queryBus.execute( AppQueries.TEAMS_QUERY, { memberId: parent.id }, context );
		}
	},
	Team: {
		__resolveReference( parent, context ): Promise<Team> {
			return context.queryBus.execute( AppQueries.TEAM_QUERY, { id: parent.id }, context );
		},

		async members( parent, _args, context ): Promise<Member[]> {
			return context.queryBus.execute( AppQueries.MEMBERS_QUERY, { teamId: parent.id }, context );
		}
	}
};