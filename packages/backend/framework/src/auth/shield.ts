import type { GraphQLSchema } from "graphql";
// @ts-ignore
import { applyMiddleware, IMiddlewareGenerator } from "graphql-middleware";
import type { ServiceContext } from "../context/index.js";

export function applyShield<P>( schema: GraphQLSchema, shield: IMiddlewareGenerator<any, ServiceContext<P>, any> ) {
	return applyMiddleware( schema, shield );

}