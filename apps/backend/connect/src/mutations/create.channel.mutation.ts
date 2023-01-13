import type { MutationResolvers } from "../graphql/generated/index.js";

export const createChannelMutationResolver: MutationResolvers["createChannel"] =
	async function ( _parent, { data }, context, _info ) {
		const channel = await context.prisma.channel.create( {
			data: { ...data, createdById: context.authInfo!.id }
		} );
		context.logger.debug( "Channel Created!" );
		return channel;
	};
