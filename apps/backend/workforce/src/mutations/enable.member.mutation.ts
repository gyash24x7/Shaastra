import { AppEvents } from "../events/index.js";
import type { MutationResolvers } from "../graphql/generated/index.js";

export const enableMemberMutationResolver: MutationResolvers["enableMember"] =
	async function ( _parent, { data }, context, _info ) {
		context.logger.trace( `>> Resolvers::Mutation::enableMember()` );
		context.logger.debug( "Data: %o", data );

		const member = await context.prisma.member.update( {
			where: { id: data.id },
			data: { enabled: true }
		} );

		context.logger.debug( `Member Enabled Successfully! ${ member.id }` );

		context.eventBus.execute( AppEvents.MEMBER_ENABLED_EVENT, member, context );
		return member;
	};