import { workforceService } from "@workforce/core";
import { builder, ObjectTypes, Queries } from "./builder.ts";

builder.queryField( Queries.MemberInfo, t =>
	t.prismaField( {
		type: ObjectTypes.Member,
		resolve: ( _query, _parent, _args, { authInfo } ) => workforceService.getMember( authInfo.id )
	} )
);
