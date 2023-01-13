import { MemberPosition } from "@prisma/client/workforce/index.js";
import { MemberMessages } from "../constants/messages.js";
import { AppEvents } from "../events/index.js";
import type { MutationResolvers } from "../graphql/generated/index.js";

export const createMemberMutationResolver: MutationResolvers["createMember"] =
	async function ( _parent, { data: { password, userId, ...data } }, context, _info ) {
		context.logger.trace( `>> Resolvers::Mutation::createMember()` );
		context.logger.debug( "Data: %o", data );

		const existingMember = await context.prisma.member.findUnique( {
			where: { id: userId }
		} );

		if ( existingMember ) {
			context.logger.error( `Member with Id ${ userId } already exists!` );
			throw new Error( MemberMessages.ALREADY_EXISTS );
		}

		const member = await context.prisma.member.create( {
			data: {
				...data,
				id: userId,
				position: MemberPosition.COORD
			}
		} );
		
		context.logger.debug( `Member Created Successfully! ${ userId }` );

		context.eventBus.execute( AppEvents.MEMBER_CREATED_EVENT, member, context );
		return member;
	};
