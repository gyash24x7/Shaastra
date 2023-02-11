import type { InjectionToken, DynamicModule, ForwardReference, Type } from "@nestjs/common";

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

export interface PrismaModuleOptions<P extends PrismaClientLike> {
	imports: Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference>;
	useFactory: ( ...args: any[] ) => Promise<P> | P;
	inject: InjectionToken[];
}
