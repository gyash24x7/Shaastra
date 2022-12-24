import type { DocumentNode } from "graphql/index.js";
import type { ApolloServer } from "@apollo/server";
import type { Signale } from "signale";
import type * as http from "node:http";
import type { CommandBus, EventBus, ICommands, IEvents, IQueries, QueryBus } from "../cqrs/index.js";
import type { RestApi } from "../rest/index.js";
import type { AppInfo } from "../config/index.js";
import type { Consul } from "../consul/index.js";
import type {
	ContextFn,
	GatewayContext,
	ServiceBaseContext,
	ServiceContext,
	ServiceContextFn
} from "../context/index.js";
import type { HealthChecker } from "../health/index.js";

export interface IBaseApplicationOptions<Ctx extends ServiceBaseContext> {
	name: string;
	restApis: RestApi<Ctx>[];
}

export interface IServiceApplicationOptions<P> extends IBaseApplicationOptions<ServiceContext<P>> {
	cqrs: {
		commands: ICommands<P>;
		queries: IQueries<P>;
		events: IEvents<P>;
	};
	prisma: P;
	graphql: {
		typeDefs: DocumentNode;
		resolvers: any;
	};
}

export interface IGatewayApplicationOptions extends IBaseApplicationOptions<GatewayContext> {
	graphql: {
		supergraphSdl: string
	};
}

export interface IBaseApplication<Ctx extends ServiceBaseContext, A = any> {
	readonly _app: A;
	readonly appInfo: AppInfo;
	apolloServer: ApolloServer<Ctx>;
	readonly logger: Signale;
	readonly start: () => Promise<void>;
	readonly consul: Consul;
	readonly httpServer: http.Server;
	readonly applyMiddlewares: () => void;
	readonly registerRestApis: () => void;
	readonly restApis: RestApi<Ctx>[];
	readonly createContext: ContextFn<Ctx>;
	readonly healthChecker: HealthChecker<Ctx>;
}

export interface IServiceApplication<P, A = any> extends IBaseApplication<ServiceContext<P>, A> {
	readonly prisma: P;
	readonly commandBus: CommandBus<P>;
	readonly queryBus: QueryBus<P>;
	readonly eventBus: EventBus<P>;
	readonly createContext: ServiceContextFn<P>;
}

export interface IGatewayApplication<A = any> extends IBaseApplication<GatewayContext, A> {}

export * from "./adapters/express.js";