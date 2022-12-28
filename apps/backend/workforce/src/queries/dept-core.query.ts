import type { Department } from "@prisma/client/workforce/index.js";
import { MemberPosition } from "@prisma/client/workforce/index.js";
import type { ServiceContext } from "@shaastra/framework";
import { logger } from "@shaastra/framework";
import { AppQueries } from "./index.js";
import { prisma } from "../index.js";

export default async function deptCoreQueryHandler( _data: unknown, _context: ServiceContext ) {
	const data = _data as { department: Department };

	logger.debug( `Handling ${ AppQueries.DEPT_CORE_QUERY }...` );
	logger.debug( "Data: ", data );

	return prisma.member.findFirstOrThrow( {
		where: { department: data.department, position: MemberPosition.CORE }
	} );
};

