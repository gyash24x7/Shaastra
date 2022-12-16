import { gql } from "graphql-tag";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import process from "node:process";

const typeDefsString = await readFile( join( process.cwd(), "src/graphql/schema.graphql" ), "utf-8" );
export const typeDefs = gql( typeDefsString );