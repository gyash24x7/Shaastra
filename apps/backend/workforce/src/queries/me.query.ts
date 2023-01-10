import { logger } from "..";
import { memberRef } from "../entities";
import { prisma } from "../prisma";
import { builder } from "../schema/builder";

builder.queryField( "me", t => t.prismaField( {
	type: memberRef,
	nullable: true,
	authScopes: {
		member: false
	},
	async resolve( _query, _parent, _args, context, _info ) {
		logger.trace( `>> Resolvers::Query::me()` );
		return prisma.member.findUnique( { where: { id: context.authInfo?.id } } );
	}
} ) );