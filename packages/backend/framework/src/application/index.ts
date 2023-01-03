import type * as http from "node:http";
import type { RestApi } from "../rest/index.js";
import type { Consul } from "../consul/index.js";
import type { ServiceContextFn } from "../context/index.js";
import type { GraphQLServer } from "../graphql/index.js";
import type { ExpressErrorHandler, ExpressMiddleware } from "../auth/index.js";
import type { GraphQLSchema } from "graphql";
import type { Logger } from "pino";
import type { EventBus, IEvents } from "../events/index.js";

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
}

export * from "./adapters/express.js";