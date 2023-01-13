import type { MemberResolvers, TeamResolvers } from "./generated/index.js";

export const memberResolvers: MemberResolvers = {
	__resolveReference( { id }, context ) {
		return context.prisma.member.findUniqueOrThrow( { where: { id } } );
	},
	teams( { id }, _args, context ) {
		return context.prisma.member.findUniqueOrThrow( { where: { id } } ).teams();
	}
};

export const teamResolvers: TeamResolvers = {
	__resolveReference( { id }, context ) {
		return context.prisma.team.findUniqueOrThrow( { where: { id } } );
	},
	members( { id }, _args, context ) {
		return context.prisma.team.findUniqueOrThrow( { where: { id } } ).members();
	}
};