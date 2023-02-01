import { join } from "node:path";
import shell from "shelljs";

const schemaPath = join( process.cwd(), "src/assets/schema.graphql" );
const graphRef = process.env[ "APOLLO_GRAPH_REF" ];

shell.exec( `rover graph fetch ${ graphRef }` ).to( schemaPath );