import { applyDecorators, SetMetadata, Injectable } from "@nestjs/common";
import type { ShieldRule } from "graphql-shield/typings/types";

export const GRAPHQL_RESOLVER_TYPE = "GRAPHQL_RESOLVER_TYPE";
export const GRAPHQL_SHIELD_META = "GRAPHQL_SHIELD_META";
export const GRAPHQL_OPERATION_TYPE = "GRAPHQL_OPERATION_TYPE";

export const Resolver = ( resolverType: string ) => applyDecorators(
	SetMetadata( GRAPHQL_RESOLVER_TYPE, resolverType ),
	Injectable()
);

export const Query = () => applyDecorators(
	SetMetadata( GRAPHQL_OPERATION_TYPE, "Query" )
);

export const Mutation = () => applyDecorators(
	SetMetadata( GRAPHQL_OPERATION_TYPE, "Mutation" )
);

export const ResolveReference = () => applyDecorators(
	SetMetadata( GRAPHQL_OPERATION_TYPE, "ResolveReference" )
);

export const FieldResolver = () => applyDecorators(
	SetMetadata( GRAPHQL_OPERATION_TYPE, "FieldResolver" )
);

export const GraphQLShield = ( rule: ShieldRule ) => applyDecorators(
	SetMetadata( GRAPHQL_SHIELD_META, rule )
);