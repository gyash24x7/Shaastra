import type { MutationResolvers } from "../graphql/generated/index.js";

export const createMessageMutationResolver: MutationResolvers["createMessage"] =
	async function ( _parent, { data }, context, _info ) {
		const message = await context.prisma.message.create( {
			data: { ...data, createdById: context.authInfo!.id }
		} );
		context.logger.debug( "Message Created!" );
		return message;
	};
