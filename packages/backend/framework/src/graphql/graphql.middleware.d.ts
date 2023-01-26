declare module "graphql-middleware" {
	import { StitchingInfo } from "@graphql-tools/delegate";
	import { GraphQLResolveInfo, GraphQLSchema, GraphQLTypeResolver, GraphQLIsTypeOfFn } from "graphql";

	export declare type IMiddlewareFragment = string;
	export declare type IMiddlewareResolver<TSource = any, TContext = any, TArgs = any> = ( resolve: (
		source?: TSource,
		args?: TArgs,
		context?: TContext,
		info?: GraphQLResolveInfo & {
			stitchingInfo?: StitchingInfo;
		}
	) => any, parent: TSource, args: TArgs, context: TContext, info: GraphQLResolveInfo ) => Promise<any>;

	export interface IMiddlewareWithOptions<TSource = any, TContext = any, TArgs = any> {
		fragment?: IMiddlewareFragment;
		fragments?: IMiddlewareFragment[];
		resolve?: IMiddlewareResolver<TSource, TContext, TArgs>;
	}

	export declare type IMiddlewareFunction<TSource = any, TContext = any, TArgs = any> =
		IMiddlewareWithOptions<TSource, TContext, TArgs>
		| IMiddlewareResolver<TSource, TContext, TArgs>;

	export interface IMiddlewareTypeMap<TSource = any, TContext = any, TArgs = any> {
		[ key: string ]: IMiddlewareFunction<TSource, TContext, TArgs> | IMiddlewareFieldMap<TSource, TContext, TArgs>;
	}

	export interface IMiddlewareFieldMap<TSource = any, TContext = any, TArgs = any> {
		[ key: string ]: IMiddlewareFunction<TSource, TContext, TArgs>;
	}

	export declare class IMiddlewareGenerator<TSource, TContext, TArgs> {
		constructor( generator: IMiddlewareGeneratorConstructor<TSource, TContext, TArgs> );

		generate( schema: GraphQLSchema ): IMiddleware<TSource, TContext, TArgs>;
	}

	export declare type IMiddlewareGeneratorConstructor<TSource = any, TContext = any, TArgs = any> = ( schema: GraphQLSchema ) => IMiddleware<TSource, TContext, TArgs>;
	export declare type IMiddleware<TSource = any, TContext = any, TArgs = any> =
		IMiddlewareFunction<TSource, TContext, TArgs>
		| IMiddlewareTypeMap<TSource, TContext, TArgs>;
	export declare type IApplyOptions = {
		onlyDeclaredResolvers: boolean;
	};
	export declare type GraphQLSchemaWithFragmentReplacements = GraphQLSchema & {
		schema?: GraphQLSchema;
		fragmentReplacements?: FragmentReplacement[];
	};

	export interface FragmentReplacement {
		field: string;
		fragment: string;
	}

	export interface IResolvers<TSource = any, TContext = any> {
		[ key: string ]: IResolverObject<TSource, TContext>;
	}

	export interface IResolverObject<TSource = any, TContext = any> {
		[ key: string ]: IFieldResolver<TSource, TContext> | IResolverOptions<TSource, TContext>;
	}

	export interface IResolverOptions<TSource = any, TContext = any> {
		fragment?: string;
		fragments?: string[];
		resolve?: IFieldResolver<TSource, TContext>;
		subscribe?: IFieldResolver<TSource, TContext>;
		__resolveType?: GraphQLTypeResolver<TSource, TContext>;
		__isTypeOf?: GraphQLIsTypeOfFn<TSource, TContext>;
	}

	export declare type IFieldResolver<TSource, TContext> = ( source: TSource, args: {
		[ argument: string ]: any;
	}, context: TContext, info: GraphQLResolveInfo & {
		stitchingInfo?: StitchingInfo;
	} ) => any;

	/**
	 *
	 * @param schema
	 * @param options
	 * @param middleware
	 *
	 * Validates middleware and generates resolvers map for provided middleware.
	 * Applies middleware to the current schema and returns the modified one.
	 *
	 */
	export declare function addMiddlewareToSchema<TSource, TContext, TArgs>(
		schema: GraphQLSchema,
		options: IApplyOptions,
		middleware: IMiddleware<TSource, TContext, TArgs>
	): {
		schema: GraphQLSchema;
		fragmentReplacements: FragmentReplacement[];
	};

	/**
	 *
	 * @param schema
	 * @param middlewares
	 *
	 * Apply middleware to resolvers and return generated schema.
	 *
	 */
	export declare function applyMiddleware<TSource = any, TContext = any, TArgs = any>(
		schema: GraphQLSchema,
		...middlewares: ( IMiddleware<TSource, TContext, TArgs> | IMiddlewareGenerator<TSource, TContext, TArgs> )[]
	): GraphQLSchemaWithFragmentReplacements;

	/**
	 *
	 * @param schema
	 * @param middlewares
	 *
	 * Apply middleware to declared resolvers and return new schema.
	 *
	 */
	export declare function applyMiddlewareToDeclaredResolvers<TSource = any, TContext = any, TArgs = any>(
		schema: GraphQLSchema,
		...middlewares: ( IMiddleware<TSource, TContext, TArgs> | IMiddlewareGenerator<TSource, TContext, TArgs> )[]
	): GraphQLSchemaWithFragmentReplacements;

	export declare function middleware<TSource = any, TContext = any, TArgs = any>( generator: IMiddlewareGeneratorConstructor<TSource, TContext, TArgs> ): IMiddlewareGenerator<TSource, TContext, TArgs>;

}