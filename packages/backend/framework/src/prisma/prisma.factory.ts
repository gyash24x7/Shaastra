import type { AppConfig } from "../config";
import type { ClientType, PrismaClientLike } from "./prisma.types";

export function prismaClientFactory<P extends PrismaClientLike>( Client: ClientType<P> ) {
	return ( config: AppConfig ) => new Client( {
		log: [ "query", "info", "warn", "error" ],
		datasources: { db: config.db }
	} );
}