import { logger } from "..";
import { channelRef } from "../entities";
import { prisma } from "../prisma";
import { builder } from "../schema/builder";
import { channelTypeRef } from "../schema/scalars";

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
