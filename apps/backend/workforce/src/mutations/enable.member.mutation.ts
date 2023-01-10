import { eventBus, logger } from "..";
import { memberRef } from "../entities";
import { AppEvents } from "../events";
import { prisma } from "../prisma";
import { builder } from "../schema/builder";

const enableMemberInputRef = builder.inputType( "EnableMemberInput", {
	fields: t => (
		{
			id: t.string( { required: true } )
		}
	)
} );

builder.mutationField( "enableMember", t => t.prismaField( {
	type: memberRef,
	args: {
		data: t.arg( { type: enableMemberInputRef, required: true } )
	},
	async resolve( _query, _parent, { data }, context, _info ) {
		logger.trace( `>> Resolvers::Mutation::enableMember()` );
		logger.debug( "Data: %o", data );

		const member = await prisma.member.update( {
			where: { id: data.id },
			data: { enabled: true }
		} );

		logger.debug( `Member Enabled Successfully! ${ member.id }` );

		eventBus.execute( AppEvents.MEMBER_ENABLED_EVENT, member, context );
		return member;
	}
} ) );