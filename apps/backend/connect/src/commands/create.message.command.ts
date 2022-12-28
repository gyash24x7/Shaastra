import type { ServiceContext } from "@shaastra/framework";
import { logger } from "@shaastra/framework";
import type { CreateMessageInput } from "../graphql/inputs.js";
import { AppCommands } from "./index.js";
import { prisma } from "../index.js";

export default async function createMessageCommandHandler( _data: unknown, context: ServiceContext ) {
	const data = _data as CreateMessageInput;

	logger.debug( `Handling ${ AppCommands.CREATE_MESSAGE_COMMAND }...` );
	logger.debug( "Data: ", data );

	const message = await prisma.message.create( {
		data: { ...data, createdById: context.authInfo!.id }
	} );
	return message.id;
};
