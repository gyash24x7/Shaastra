import { logger } from "../index.js";
import { prisma } from "../prisma/index.js";
import { builder } from "../schema/builder.js";
import { memberRef } from "../entities/index.js";

builder.queryField( "me", t => t.prismaField( {
	type: memberRef,
	nullable: true,
	async resolve( _query, _parent, _args, context, _info ) {
		logger.trace( `>> Resolvers::Query::me()` );
		return prisma.member.findUnique( { where: { id: context.authInfo?.id } } );
	}
} ) );