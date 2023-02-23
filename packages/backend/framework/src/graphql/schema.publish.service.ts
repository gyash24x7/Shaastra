import { Injectable } from "@nestjs/common";
import { join } from "node:path";
import shelljs from "shelljs";
import { type AppConfig, Config } from "../config/index.js";
import { LoggerFactory } from "../logger/index.js";

@Injectable()
export class SchemaPublishService {

	private readonly logger = LoggerFactory.getLogger( SchemaPublishService );

	constructor( @Config() private readonly config: AppConfig ) {}

	publishSchema() {
		this.logger.trace( ">> publishSchema()" );
		const routingUrl = this.config.appInfo.url + "/api/graphql";
		const schemaPath = join( __dirname, this.config.graphql.schemaPath! );

		const { stdout } = shelljs.exec(
			`rover subgraph publish \
			--name ${ this.config.appInfo.id } \
			--routing-url ${ routingUrl } \
			--schema ${ schemaPath } \
			${ this.config.graphql.graphRef }`
		);

		this.logger.log( stdout );
		this.logger.info( "Schema Published to Apollo Studio!" );
	}
}