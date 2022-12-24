import type { CreateMessageInput } from "../graphql/inputs.js";
import type { AppContext } from "../index.js";

export default async function createMessageCommandHandler( _data: unknown, context: AppContext ) {
	const data = _data as CreateMessageInput;
	const message = await context.prisma.message.create( {
		data: { ...data, createdById: context.authInfo!.id }
	} );
	return message.id;
};
