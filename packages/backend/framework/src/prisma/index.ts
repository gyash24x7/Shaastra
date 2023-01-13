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

export type BasePrisma = {
	$use: ( cb: PrismaMiddleware ) => void;
}