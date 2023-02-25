import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { DiscoveryModule } from "@nestjs/core";
import { LoggerFactory } from "../logger";
import { GraphQLServer } from "./graphql.server";
import { ResolverExplorerService } from "./resolver.explorer.service";
import { SchemaBuilderService } from "./schema.builder.service";
import { SchemaPublishService } from "./schema.publish.service";

@Module( {
	imports: [ DiscoveryModule ],
	providers: [ GraphQLServer, SchemaBuilderService, ResolverExplorerService, SchemaPublishService ]
} )
export class GraphQLModule implements NestModule {
	private readonly logger = LoggerFactory.getLogger( GraphQLModule );

	constructor( private readonly graphqlServer: GraphQLServer ) {}

	async configure( consumer: MiddlewareConsumer ) {
		await this.graphqlServer.start();
		consumer.apply( this.graphqlServer.middleware() )
			.forRoutes( { path: "/api/graphql", method: RequestMethod.POST } );

		this.logger.info( "GraphQL Middlewares Applied!" );
	}
}