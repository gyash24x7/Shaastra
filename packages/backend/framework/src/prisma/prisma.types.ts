export type PrismaMiddlewareParams = {
	model?: any
	action: any
	args: any
	dataPath: string[]
	runInTransaction: boolean
}

export type PrismaMiddleware<T = any> = (
	params: PrismaMiddlewareParams,
	next: ( params: PrismaMiddlewareParams ) => Promise<T>
) => Promise<T>

export type PrismaClientLike = {
	$on( eventType: string, callback: () => Promise<void> ): void;
	$connect(): Promise<void>;
	$disconnect(): Promise<void>;
	$use( middleware: PrismaMiddleware ): void;
};

export type PrismaLogLevel = "info" | "query" | "warn" | "error"
export type PrismaDatasources = { db: { url: string } }

export type PrismaClientOptions = {
	log?: Array<PrismaLogLevel>;
	datasources: PrismaDatasources;
}

export interface ClientType<T extends PrismaClientLike> extends Function {
	new( options: PrismaClientOptions ): T;
}