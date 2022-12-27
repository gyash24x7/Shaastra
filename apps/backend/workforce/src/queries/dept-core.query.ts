import type { Department } from "@prisma/client/workforce/index.js";
import { MemberPosition } from "@prisma/client/workforce/index.js";
import type { AppContext } from "../index.js";
import { logger } from "@shaastra/framework";
import { AppQueries } from "./index.js";

export default async function deptCoreQueryHandler( _data: unknown, context: AppContext ) {
	const data = _data as { department: Department };

	logger.debug( `Handling ${ AppQueries.DEPT_CORE_QUERY }...` );
	logger.debug( "Data: ", data );

	return context.prisma.member.findFirstOrThrow( {
		where: { department: data.department, position: MemberPosition.CORE }
	} );
};

