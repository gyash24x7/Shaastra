import type { ApolloServer } from "@apollo/server";
import type * as http from "node:http";
import type { CommandBus, EventBus, ICommands, IEvents, IQueries, QueryBus } from "../cqrs/index.js";
import type { RestApi } from "../rest/index.js";
import type { AppInfo } from "../config/index.js";
import type { Consul } from "../consul/index.js";
import type { ServiceContext, ServiceContextFn } from "../context/index.js";
import type { HealthChecker } from "../health/index.js";

export interface IApplicationOptions {
	name: string;
	restApis?: RestApi<ServiceContext>[];
	cqrs: {
		commands: ICommands;
		queries: IQueries;
		events: IEvents;
	};
	graphql: {
		resolvers: any;
	};
}

export interface IApplication<A = any> {
	readonly _app: A;
	readonly appInfo: AppInfo;
	readonly apolloServer: ApolloServer<ServiceContext>;
	readonly start: () => Promise<void>;
	readonly consul: Consul;
	readonly httpServer: http.Server;
	readonly applyMiddlewares: () => void;
	readonly registerRestApis: () => void;
	readonly restApis: RestApi<ServiceContext>[];
	readonly healthChecker: HealthChecker<ServiceContext>;
	readonly commandBus: CommandBus;
	readonly queryBus: QueryBus;
	readonly eventBus: EventBus;
	readonly createContext: ServiceContextFn;
}

export const defaultApplicationOptions: IApplicationOptions = {
	cqrs: {
		commands: {},
		events: {},
		queries: {}
	},
	graphql: { resolvers: undefined },
	name: ""
};

export * from "./adapters/express.js";