import { printSubgraphSchema } from "@apollo/subgraph";
import { schema } from "@workforce/schema";

await Bun.write( "./graphql/schema.graphql", printSubgraphSchema( schema ) );