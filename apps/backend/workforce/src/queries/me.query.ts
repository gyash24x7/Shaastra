import { memberRef } from "../entities/index.js";
import { logger } from "../index.js";
import { prisma } from "../prisma/index.js";
import { builder } from "../schema/builder.js";

builder.queryField( "me", t => t.prismaField( {
	type: memberRef,
	nullable: true,
	authScopes: {
		member: true
	},
	async resolve( _query, _parent, _args, context, _info ) {
		logger.trace( `>> Resolvers::Query::me()` );
		return prisma.member.findUnique( { where: { id: context.authInfo?.id } } );
	}
} ) );