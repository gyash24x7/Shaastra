import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DiscoveryModule } from "../discovery/index.js";
import { LoggerFactory } from "../logger/index.js";
import { GraphQLServer } from "./graphql.server.js";
import { SchemaBuilderService } from "./schema.builder.service.js";

@Module( {
	imports: [ DiscoveryModule ],
	providers: [ GraphQLServer, SchemaBuilderService ]
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
		consumer.apply( this.graphqlServer.middleware() ).forRoutes( "/api/graphql" );
		this.logger.info( "GraphQL Middlewares Applied!" );
	}
}