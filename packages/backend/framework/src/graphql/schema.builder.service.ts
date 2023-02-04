import { buildSubgraphSchema } from "@apollo/subgraph";
import { Injectable } from "@nestjs/common";
import type { GraphQLSchema } from "graphql";
import { applyMiddleware } from "graphql-middleware";
import { shield } from "graphql-shield";
import { gql } from "graphql-tag";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import process from "node:process";
import { Config } from "../config/index.js";
import { LoggerFactory } from "../logger/index.js";
import type { AppConfig } from "../utils/index.js";
import { ResolverExplorerService } from "./resolver.explorer.service.js";

@Injectable()
export class SchemaBuilderService {

	private readonly logger = LoggerFactory.getLogger( SchemaBuilderService );

	constructor(
		@Config() private readonly config: AppConfig,
		private readonly resolverExplorer: ResolverExplorerService
	) {}

	async buildSchema(): Promise<GraphQLSchema> {
		const typeDefsString = await readFile( join( process.cwd(), this.config.graphql.schemaPath! ), "utf-8" );
		const typeDefs = gql( typeDefsString );

		const { resolvers, permissions } = await this.resolverExplorer.buildResolversAndPermissions();

		this.logger.debug( "Resolvers: %o", resolvers );
		const schema = buildSubgraphSchema( { typeDefs, resolvers } as any );
		return applyMiddleware( schema, shield( permissions ) );
	}
}