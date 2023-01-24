import { applyDecorators, Controller, SetMetadata } from "@nestjs/common";

export const GRAPHQL_RESOLVER_META_KEY = "GRAPHQL_RESOLVER";
export const GRAPHQL_QUERY_RESOLVER = "GRAPHQL_QUERY_RESOLVER";
export const GRAPHQL_MUTATION_RESOLVER = "GRAPHQL_MUTATION_RESOLVER";
export const GRAPHQL_REFERENCE_RESOLVER = "GRAPHQL_REFERENCE_RESOLVER";
export const GRAPHQL_FIELD_RESOLVER = "GRAPHQL_FIELD_RESOLVER";

export type GraphQLOperationType =
	typeof GRAPHQL_QUERY_RESOLVER
	| typeof GRAPHQL_MUTATION_RESOLVER
	| typeof GRAPHQL_REFERENCE_RESOLVER
	| typeof GRAPHQL_FIELD_RESOLVER

export const Resolver = ( meta: string ) => applyDecorators(
	SetMetadata( GRAPHQL_RESOLVER_META_KEY, meta ),
	Controller()
);

export const Query = () => applyDecorators(
	SetMetadata( GRAPHQL_QUERY_RESOLVER, true )
);

export const Mutation = () => applyDecorators(
	SetMetadata( GRAPHQL_MUTATION_RESOLVER, true )
);

export const ResolveReference = () => applyDecorators(
	SetMetadata( GRAPHQL_REFERENCE_RESOLVER, true )
);

export const FieldResolver = () => applyDecorators(
	SetMetadata( GRAPHQL_FIELD_RESOLVER, true )
);