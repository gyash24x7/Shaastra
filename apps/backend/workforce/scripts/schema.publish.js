const { lexicographicSortSchema, printSchema } = require( "graphql" );
const { writeFileSync } = require( "node:fs" );
const { logger, schema } = require( "../dist" );
const { join } = require( "node:path" );
const shell = require( "shelljs" );

const schemaPath = join( process.cwd(), "src/schema.graphql" );
const schemaString = printSchema( lexicographicSortSchema( schema ) );

writeFileSync( schemaPath, schemaString );
logger.debug( "Written Schema!" );

const graphRef = process.env[ "APOLLO_GRAPH_REF" ];
const subgraph = "workforce";
const routingUrl = `http://localhost:${ process.env[ "WORKFORCE_PORT" ] }/api/graphql`;

shell.exec(
	`rover subgraph publish --name ${ subgraph } --schema ${ schemaPath } --routing-url ${ routingUrl } ${ graphRef }`
);