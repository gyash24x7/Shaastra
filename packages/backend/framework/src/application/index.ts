import type * as http from "node:http";
import type { RestApi } from "../rest";
import type { Consul } from "../consul";
import type { ServiceContextFn } from "../context";
import type { GraphQLServer } from "../graphql";
import type { JwtUtils } from "../auth";
import type { GraphQLSchema } from "graphql";
import type { Logger } from "pino";
import type { EventBus, IEvents } from "../events";
import type { HealthChecker } from "../health";
import type { ExpressErrorHandler, ExpressMiddleware } from "./adapters/express";

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
	readonly consul: Consul;
	readonly httpServer: http.Server;
	readonly applyMiddlewares: () => void;
	readonly registerRestApis: () => void;
	readonly restApis: RestApi[];
	readonly eventBus: EventBus;
	readonly createContext: ServiceContextFn;
	readonly jwtUtils: JwtUtils;
	readonly healthCheck: HealthChecker;
}

export * from "./adapters/express";