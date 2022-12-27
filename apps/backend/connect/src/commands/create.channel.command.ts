import { logger } from "@shaastra/framework";
import type { CreateChannelInput } from "../graphql/inputs.js";
import type { AppContext } from "../index.js";
import { AppCommands } from "./index.js";

export default async function createChannelCommandHandler( _data: unknown, context: AppContext ) {
	const data = _data as CreateChannelInput;

	logger.debug( `Handling ${ AppCommands.CREATE_CHANNEL_COMMAND }...` );
	logger.debug( "Data: ", data );

	const channel = await context.prisma.channel.create( {
		data: { ...data, createdById: context.authInfo!.id }
	} );
	
	return channel.id;
};
