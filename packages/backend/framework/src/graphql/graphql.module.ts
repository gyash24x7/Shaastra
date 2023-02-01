import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { ConfigService, ConfigModule } from "@nestjs/config";
import { DiscoveryModule } from "@nestjs/core";
import { LoggerFactory } from "../logger/index.js";
import { GraphQLServer } from "./graphql.server.js";
import { ResolverExplorerService } from "./resolver.explorer.service.js";
import { SchemaBuilderService } from "./schema.builder.service.js";

@Module( {
	imports: [ DiscoveryModule, ConfigModule ],
	providers: [ GraphQLServer, SchemaBuilderService, ResolverExplorerService ]
} )
export class GraphQLModule implements NestModule {
	private readonly logger = LoggerFactory.getLogger( GraphQLModule );

	constructor(
		private readonly graphqlServer: GraphQLServer,
		private readonly configService: ConfigService
	) {}

	async configure( consumer: MiddlewareConsumer ) {
		const appId = this.configService.getOrThrow<string>( "app.id" );
		const isGateway = appId === "gateway";

		await this.graphqlServer.start( isGateway );
		consumer.apply( this.graphqlServer.middleware() )
			.forRoutes( { path: "/api/graphql", method: RequestMethod.POST } );

		this.logger.info( "GraphQL Middlewares Applied!" );
	}
}