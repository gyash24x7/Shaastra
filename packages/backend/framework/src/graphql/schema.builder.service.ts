import { buildSubgraphSchema } from "@apollo/subgraph";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { GraphQLSchema } from "graphql";
import { applyMiddleware } from "graphql-middleware";
import { shield } from "graphql-shield";
import { gql } from "graphql-tag";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import process from "node:process";
import { LoggerFactory } from "../logger/index.js";
import { ResolverExplorerService } from "./resolver.explorer.service.js";

@Injectable()
export class SchemaBuilderService {

	private readonly logger = LoggerFactory.getLogger( SchemaBuilderService );

	constructor(
		private readonly configService: ConfigService,
		private readonly resolverExplorer: ResolverExplorerService
	) {}

	async buildSchema(): Promise<GraphQLSchema> {
		const schemaPath = this.configService.getOrThrow( "app.graphql.schemaPath" );
		const typeDefsString = await readFile( join( process.cwd(), schemaPath ), "utf-8" );
		const typeDefs = gql( typeDefsString );

		const { resolvers, permissions } = await this.resolverExplorer.buildResolversAndPermissions();

		this.logger.debug( "Resolvers: %o", resolvers );
		const schema = buildSubgraphSchema( { typeDefs, resolvers } as any );
		return applyMiddleware( schema, shield( permissions ) );
	}
}