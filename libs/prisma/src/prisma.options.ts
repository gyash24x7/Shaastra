import type { ModuleMetadata } from "@nestjs/common";
import type { Prisma as WorkforcePrisma } from "@prisma/client/workforce";

export type MiddlewareParams = {
	model?: WorkforcePrisma.ModelName
	action: WorkforcePrisma.PrismaAction
	args: any
	dataPath: string[]
	runInTransaction: boolean
}

export type Middleware<T = any> = (
	params: MiddlewareParams,
	next: ( params: MiddlewareParams ) => Promise<T>
) => Promise<T>

export interface PrismaModuleOptions {
	isGlobal?: boolean;
	options?: PrismaServiceOptions;
}

export interface PrismaServiceOptions extends WorkforcePrisma.PrismaClientOptions {
	middlewares?: Array<Middleware>;
}

export interface PrismaModuleAsyncOptions extends Pick<ModuleMetadata, "imports"> {
	isGlobal?: boolean;
	useFactory?: ( ...args: any[] ) => Promise<PrismaServiceOptions> | PrismaServiceOptions;
	inject?: any[];
}