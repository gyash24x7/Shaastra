import { channelRef } from "../entities";
import { builder } from "../schema/builder";

builder.queryField( "channels", t => t.prismaField( {
	type: [ channelRef ],
	async resolve( _query, _parent, _args, _context, _info ) {
		return [];
	}
} ) );