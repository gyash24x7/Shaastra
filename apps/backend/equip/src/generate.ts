import { printSubgraphSchema } from "@apollo/subgraph";
import { schema } from "@equip/schema";

await Bun.write( "./graphql/schema.graphql", printSubgraphSchema( schema ) );