import { applyDecorators, SetMetadata, Injectable } from "@nestjs/common";
import type { IRule } from "graphql-shield";

export const GRAPHQL_RESOLVER_META_KEY = "GRAPHQL_RESOLVER";
export const GRAPHQL_SHIELD_META = "GRAPHQL_SHIELD_META";
export const GRAPHQL_RESOLVER_TYPE = "GRAPHQL_RESOLVER_TYPE";

export const Resolver = () => applyDecorators(
	SetMetadata( GRAPHQL_RESOLVER_META_KEY, true ),
	Injectable()
);

export const Query = () => applyDecorators(
	SetMetadata( GRAPHQL_RESOLVER_TYPE, "Query" )
);

export const Mutation = () => applyDecorators(
	SetMetadata( GRAPHQL_RESOLVER_TYPE, "Mutation" )
);

export const ResolveReference = ( parentType: string ) => applyDecorators(
	SetMetadata( GRAPHQL_RESOLVER_TYPE, parentType )
);

export const FieldResolver = ( parentType: string ) => applyDecorators(
	SetMetadata( GRAPHQL_RESOLVER_TYPE, parentType )
);

export const GraphQLShield = ( rule: IRule ) => applyDecorators(
	SetMetadata( GRAPHQL_SHIELD_META, rule )
);