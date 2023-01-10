import SchemaBuilder from "@pothos/core";
import DirectivesPlugin from "@pothos/plugin-directives";
import FederationPlugin from "@pothos/plugin-federation";
import PrismaPlugin from "@pothos/plugin-prisma";
import ScopeAuthPlugin from "@pothos/plugin-scope-auth";
import type { ServiceContext } from "@shaastra/framework";
import { logger } from "..";
import { prisma as client } from "../prisma";
import type PrismaTypes from "./pothos";

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
	async authScopes( { authInfo } ) {
		logger.debug( "AuthInfo: %o", authInfo );
		return {
			public: true,
			member: !!authInfo?.department,
			core: authInfo?.position === "CORE",
			head: authInfo?.position === "HEAD",
			cocas: authInfo?.position === "COCAS"
		};
	}
} );

builder.queryType( {} );
builder.mutationType( {} );