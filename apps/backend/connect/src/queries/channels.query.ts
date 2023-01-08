import { channelRef } from "../entities/index.js";
import { builder } from "../schema/builder.js";

builder.queryField( "channels", t => t.prismaField( {
	type: [ channelRef ],
	async resolve( _query, _parent, _args, _context, _info ) {
		return [];
	}
} ) );