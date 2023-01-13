import type { QueryResolvers } from "../graphql/generated/index.js";

export const meQueryResolver: QueryResolvers["me"] = async function ( _parent, _args, context, _info ) {
	context.logger.trace( `>> Resolvers::Query::me()` );
	const member = await context.prisma.member.findUniqueOrThrow( { where: { id: context.authInfo?.id } } );
	context.logger.debug( "Member found: %o", member );
	return member;
};