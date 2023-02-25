import { buildSubgraphSchema } from "@apollo/subgraph";
import { Injectable } from "@nestjs/common";
import type { GraphQLSchema } from "graphql";
import { applyMiddleware } from "graphql-middleware";
import { shield } from "graphql-shield";
import { gql } from "graphql-tag";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { AppConfig, Config } from "../config";
import { LoggerFactory } from "../logger";
import { ResolverExplorerService } from "./resolver.explorer.service";

@Injectable()
export class SchemaBuilderService {

	private readonly logger = LoggerFactory.getLogger( SchemaBuilderService );

	constructor(
		@Config() private readonly config: AppConfig,
		private readonly resolverExplorer: ResolverExplorerService
	) {}

	async buildSchema(): Promise<GraphQLSchema> {
		this.logger.trace( ">> buildSchema()" );
		const typeDefsString = await readFile( join( __dirname, this.config.graphql.schemaPath! ), "utf-8" );
		const typeDefs = gql( typeDefsString );

		const { resolvers, permissions } = await this.resolverExplorer.buildResolversAndPermissions();

		const schema = buildSubgraphSchema( { typeDefs, resolvers } as any );
		return applyMiddleware( schema, shield( permissions ) );
	}
}