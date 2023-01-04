import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";
import DirectivesPlugin from "@pothos/plugin-directives";
import FederationPlugin from "@pothos/plugin-federation";
import { prisma as client } from "../prisma/index.js";
import type { ServiceContext } from "@shaastra/framework";
import type PrismaTypes from "./pothos.js";
import ScopeAuthPlugin from "@pothos/plugin-scope-auth";

export const builder = new SchemaBuilder<{
	Context: ServiceContext
	Scalars: { Date: { Input: Date, Output: Date } }
	PrismaTypes: PrismaTypes
	AuthScopes: {
		public: true;
		member: boolean;
		core: boolean;
		head: boolean;
		cocas: boolean;
	}
}>( {
	plugins: [ ScopeAuthPlugin, PrismaPlugin, DirectivesPlugin, FederationPlugin ],
	prisma: { client },
	async authScopes( context ) {
		return {
			public: true,
			member: !!context.authInfo?.department,
			core: context.authInfo?.position === "CORE",
			head: context.authInfo?.position === "HEAD",
			cocas: context.authInfo?.position === "COCAS"
		};
	}
} );

builder.queryType( {} );
builder.mutationType( {} );