import { builder } from "./builder.ts";
import "./inputs.ts";
import "./types.ts";
import "./queries.ts";
import "./mutations.ts";

builder.queryType( {} );
builder.mutationType( {} );

export const schema = builder.toSubGraphSchema( {
	linkUrl: "https://specs.apollo.dev/federation/v2.7"
} );