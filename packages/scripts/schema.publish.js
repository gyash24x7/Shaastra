const { lexicographicSortSchema, printSchema } = require( "graphql" );
const shell = require( "shelljs" );
const { join } = require( "path" );
const { schema, appInfo } = require( join( process.cwd(), "dist" ) );

const schemaString = printSchema( lexicographicSortSchema( schema ) );

const graphRef = process.env[ "APOLLO_GRAPH_REF" ];
const subgraph = appInfo.id;
const routingUrl = `${ appInfo.url }/api/graphql`;

shell.echo( schemaString ).exec(
	`rover subgraph publish --name ${ subgraph } --routing-url ${ routingUrl } --schema - ${ graphRef }`
);