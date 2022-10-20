import type { INestApplicationContext } from "@nestjs/common";

export interface PrismaShutdownHook {
	enableShutdownHooks( app: INestApplicationContext ): void
}