import type { GraphQLSchema } from "graphql";
import type * as http from "node:http";
import type { Logger } from "pino";
import type { JwtUtils } from "../auth/index.js";
import type { ServiceContextFn } from "../context/index.js";
import type { EventBus, IEvents } from "../events/index.js";
import type { GraphQLServer } from "../graphql/index.js";
import type { HealthChecker } from "../health/index.js";
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

export interface IApplicationOptions {
	name: string;
	restApis?: RestApi[];
	events?: IEvents;
	graphql: {
		gateway?: boolean,
		schema?: GraphQLSchema
	};
	middlewares?: ExpressMiddleware[];
	errorHandlers?: ExpressErrorHandler[];
}

export interface IApplication<A = any> {
	readonly _app: A;
	readonly logger: Logger;
	readonly appInfo: AppInfo;
	readonly graphQLServer: GraphQLServer;
	readonly start: () => Promise<void>;
	readonly httpServer: http.Server;
	readonly applyMiddlewares: () => void;
	readonly registerRestApis: () => void;
	readonly restApis: RestApi[];
	readonly eventBus: EventBus;
	readonly createContext: ServiceContextFn;
	readonly jwtUtils: JwtUtils;
	readonly healthCheck: HealthChecker;
}

export * from "./adapters/express.js";