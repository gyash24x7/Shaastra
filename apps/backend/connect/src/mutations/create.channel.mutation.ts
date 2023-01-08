import { channelRef } from "../entities/index.js";
import { logger } from "../index.js";
import { prisma } from "../prisma/index.js";
import { builder } from "../schema/builder.js";
import { channelTypeRef } from "../schema/scalars.js";

const createChannelInputRef = builder.inputType( "CreateChannelInput", {
	fields: t => (
		{
			name: t.string( { required: true } ),
			description: t.string( { required: true } ),
			type: t.field( { type: channelTypeRef, required: true } )
		}
	)
} );

builder.mutationField( "createChannel", t => t.prismaField( {
	type: channelRef,
	args: { data: t.arg( { type: createChannelInputRef, required: true } ) },
	async resolve( _query, _parent, { data }, context, _info ) {
		const channel = await prisma.channel.create( {
			data: { ...data, createdById: context.authInfo!.id }
		} );
		logger.debug( "Channel Created!" );
		return channel;
	}
} ) );
