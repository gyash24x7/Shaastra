import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DiscoveredClassWithMeta, DiscoveryModule, DiscoveryService } from "../discovery/index.js";
import { LoggerFactory } from "../logger/index.js";
import {
	GRAPHQL_FIELD_RESOLVER,
	GRAPHQL_MUTATION_RESOLVER,
	GRAPHQL_QUERY_RESOLVER,
	GRAPHQL_REFERENCE_RESOLVER,
	GRAPHQL_RESOLVER_META_KEY,
	GraphQLOperationType
} from "./graphql.decorators.js";
import { GraphQLServer } from "./graphql.server.js";

@Module( {
	imports: [ DiscoveryModule ],
	providers: [ GraphQLServer ]
} )
export class GraphQLModule implements NestModule {
	private readonly logger = LoggerFactory.getLogger( GraphQLModule );

	constructor(
		private readonly discoveryService: DiscoveryService,
		private readonly graphqlServer: GraphQLServer,
		private readonly configService: ConfigService
	) {}

	registerOperationsFromClass( resolverClass: DiscoveredClassWithMeta<string>, operationType: GraphQLOperationType ) {
		const methods = this.discoveryService.classMethodsWithMetaAtKey(
			resolverClass.discoveredClass,
			operationType
		);

		methods.forEach( resolverMethod => {
			this.graphqlServer.registerResolver(
				resolverClass.meta,
				resolverMethod.discoveredMethod.methodName,
				resolverMethod.discoveredMethod.handler.bind( resolverClass.discoveredClass.instance )
			);
		} );

	}

	async configure( consumer: MiddlewareConsumer ) {
		const resolverClasses = await this.discoveryService.providersWithMetaAtKey<string>( GRAPHQL_RESOLVER_META_KEY );

		resolverClasses.forEach( resolverClass => {
			this.registerOperationsFromClass( resolverClass, GRAPHQL_QUERY_RESOLVER );
			this.registerOperationsFromClass( resolverClass, GRAPHQL_MUTATION_RESOLVER );
			this.registerOperationsFromClass( resolverClass, GRAPHQL_FIELD_RESOLVER );
			this.registerOperationsFromClass( resolverClass, GRAPHQL_REFERENCE_RESOLVER );
		} );

		const appId = this.configService.getOrThrow<string>( "app.id" );
		const isGateway = appId === "gateway";

		await this.graphqlServer.start( isGateway );
		consumer.apply( this.graphqlServer.middleware() ).forRoutes( "/api/graphql" );
		this.logger.info( "GraphQL Middlewares Applied!" );
	}
}