import shell from "shelljs";
import { join } from "node:path";

const schemaPath = join( process.cwd(), "src/schema.graphql" );

const host = process.env[ "APP_HOST" ];
const graphRef = process.env[ "APOLLO_GRAPH_REF" ];
const subgraph = process.argv[ 2 ];
const port = process.env[ `${ subgraph.toUpperCase() }_PORT` ] || "8000";
const routingUrl = `http://${ host }:${ port }/api/graphql`;

shell.exec(
	`rover subgraph publish --name ${ subgraph } --routing-url ${ routingUrl } --schema ${ schemaPath } ${ graphRef }`
);