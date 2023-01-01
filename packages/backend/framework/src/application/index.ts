import type * as http from "node:http";
import type { CommandBus, EventBus, ICommands, IEvents, IQueries, QueryBus } from "../cqrs/index.js";
import type { RestApi } from "../rest/index.js";
import type { Consul } from "../consul/index.js";
import type { ServiceContextFn } from "../context/index.js";
import type { HealthChecker } from "../health/index.js";
import type { GraphQLServer } from "../graphql/index.js";
import type { ExpressErrorHandler, ExpressMiddleware } from "../auth/index.js";

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
	cqrs?: {
		commands: ICommands;
		queries: IQueries;
		events: IEvents;
	};
	graphql: {
		gateway?: boolean,
		resolvers?: any
	};
	middlewares?: ExpressMiddleware[];
	errorHandlers?: ExpressErrorHandler[];
}

export interface IApplication<A = any> {
	readonly _app: A;
	readonly appInfo: AppInfo;
	readonly graphQLServer: GraphQLServer;
	readonly start: () => Promise<void>;
	readonly consul: Consul;
	readonly httpServer: http.Server;
	readonly applyMiddlewares: () => void;
	readonly registerRestApis: () => void;
	readonly restApis: RestApi[];
	readonly healthChecker: HealthChecker;
	readonly commandBus: CommandBus;
	readonly queryBus: QueryBus;
	readonly eventBus: EventBus;
	readonly createContext: ServiceContextFn;
}

export const defaultOptions: IApplicationOptions = {
	cqrs: {
		commands: {},
		events: {},
		queries: {}
	},
	graphql: { resolvers: undefined },
	name: ""
};

export * from "./adapters/express.js";