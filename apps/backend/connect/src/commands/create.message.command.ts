import { logger } from "@shaastra/framework";
import type { CreateMessageInput } from "../graphql/inputs.js";
import type { AppContext } from "../index.js";
import { AppCommands } from "./index.js";

export default async function createMessageCommandHandler( _data: unknown, context: AppContext ) {
	const data = _data as CreateMessageInput;

	logger.debug( `Handling ${ AppCommands.CREATE_MESSAGE_COMMAND }...` );
	logger.debug( "Data: ", data );

	const message = await context.prisma.message.create( {
		data: { ...data, createdById: context.authInfo!.id }
	} );
	return message.id;
};
