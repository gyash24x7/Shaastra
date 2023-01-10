import { logger } from "..";
import { messageRef } from "../entities";
import { prisma } from "../prisma";
import { builder } from "../schema/builder";

const createMessageInputRef = builder.inputType( "CreateMessageInput", {
	fields: t => (
		{
			content: t.string( { required: true } ),
			channelId: t.string( { required: true } )
		}
	)
} );

builder.mutationField( "createMessage", t => t.prismaField( {
	type: messageRef,
	args: { data: t.arg( { type: createMessageInputRef, required: true } ) },
	async resolve( _query, _parent, { data }, context, _info ) {
		const message = await prisma.message.create( {
			data: { ...data, createdById: context.authInfo!.id }
		} );
		logger.debug( "Message Created!" );
		return message;
	}
} ) );
