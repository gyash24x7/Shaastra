import { messageRef } from "../entities";
import { prisma } from "../prisma";
import { builder } from "../schema/builder";

const messagesInputRef = builder.inputType( "MessagesInput", {
	fields: t => (
		{
			channelId: t.string( { required: true } )
		}
	)
} );

builder.queryField( "messages", t => t.prismaField( {
	type: [ messageRef ],
	args: { data: t.arg( { type: messagesInputRef, required: true } ) },
	async resolve( _query, _parent, { data }, _context, _info ) {
		return prisma.channel.findUniqueOrThrow( { where: { id: data.channelId } } ).messages();
	}
} ) );