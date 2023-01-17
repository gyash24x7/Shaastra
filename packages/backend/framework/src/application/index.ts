import type { IEvents } from "../events/index.js";
import type { BasePrisma } from "../prisma/index.js";
import type { RestApi } from "../rest/index.js";
import type { ExpressErrorHandler, ExpressMiddleware } from "./adapters/express.js";

export type AppInfo = {
	id: string;
	name: string;
	url: string;
	pkg: string;
	port: number;
	address: string;
}

export interface IApplicationOptions<P extends BasePrisma> {
	name: string;
	restApis?: RestApi<P>[];
	events?: IEvents<P>;
	isGateway?: boolean;
	middlewares?: ExpressMiddleware[];
	errorHandlers?: ExpressErrorHandler[];
	prisma: P;
	resolvers?: any;
}

export * from "./adapters/express.js";