import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";
import DirectivesPlugin from "@pothos/plugin-directives";
import FederationPlugin from "@pothos/plugin-federation";
import { prisma as client } from "../prisma/index.js";
import type { ServiceContext } from "@shaastra/framework";
import type PrismaTypes from "./pothos.js";

export const builder = new SchemaBuilder<{
	Context: ServiceContext
	Scalars: { Date: { Input: Date, Output: Date } }
	PrismaTypes: PrismaTypes
}>( {
	plugins: [ PrismaPlugin, DirectivesPlugin, FederationPlugin ],
	prisma: { client }
} );

builder.queryType( {} );
builder.mutationType( {} );