import type { CreateChannelInput } from "../graphql/inputs.js";
import type { AppContext } from "../index.js";

export default async function createChannelCommandHandler( _data: unknown, context: AppContext ) {
	const data = _data as CreateChannelInput;
	const channel = await context.prisma.channel.create( {
		data: { ...data, createdById: context.authInfo!.id }
	} );
	return channel.id;
};
