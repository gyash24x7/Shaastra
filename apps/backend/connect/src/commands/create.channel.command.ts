import type { ServiceContext } from "@shaastra/framework";
import { logger } from "@shaastra/framework";
import type { CreateChannelInput } from "../graphql/inputs.js";
import { AppCommands } from "./index.js";
import { prisma } from "../index.js";

export default async function createChannelCommandHandler( _data: unknown, context: ServiceContext ) {
	const data = _data as CreateChannelInput;

	logger.debug( `Handling ${ AppCommands.CREATE_CHANNEL_COMMAND }...` );
	logger.debug( "Data: ", data );

	const channel = await prisma.channel.create( {
		data: { ...data, createdById: context.authInfo!.id }
	} );

	return channel.id;
};
