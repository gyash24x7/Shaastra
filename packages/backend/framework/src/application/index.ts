import type * as http from "node:http";
import type { Logger } from "pino";
import type { JwtUtils } from "../auth/index.js";
import type { ServiceContextFn } from "../context/index.js";
import type { EventBus, IEvents } from "../events/index.js";
import type { GraphQLServer } from "../graphql/index.js";
import type { HealthChecker } from "../health/index.js";
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

export interface IApplication<P extends BasePrisma, A = any> {
	readonly _app: A;
	readonly logger: Logger;
	readonly appInfo: AppInfo;
	readonly graphQLServer: GraphQLServer<P>;
	readonly start: () => Promise<void>;
	readonly httpServer: http.Server;
	readonly applyMiddlewares: () => void;
	readonly registerRestApis: () => void;
	readonly restApis: RestApi<P>[];
	readonly eventBus: EventBus<P>;
	readonly createContext: ServiceContextFn<P>;
	readonly jwtUtils: JwtUtils;
	readonly healthCheck: HealthChecker;
	readonly prisma: P;
}

export * from "./adapters/express.js";