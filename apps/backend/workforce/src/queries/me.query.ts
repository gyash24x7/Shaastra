import { logger } from "..";
import { memberRef } from "../entities";
import { prisma } from "../prisma";
import { builder } from "../schema/builder";

builder.queryField( "me", t => t.prismaField( {
	type: memberRef,
	nullable: true,
	authScopes: {
		member: true
	},
	async resolve( _query, _parent, _args, context, _info ) {
		logger.trace( `>> Resolvers::Query::me()` );
		const member = await prisma.member.findUnique( { where: { id: context.authInfo?.id } } );
		logger.debug( "Member found: %o", member );
		return member;
	}
} ) );