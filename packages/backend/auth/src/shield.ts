import type { ServiceBaseContext } from "@shaastra/utils";
import type { GraphQLSchema } from "graphql";
//@ts-ignore
import { applyMiddleware, IMiddlewareGenerator } from "graphql-middleware";

export function applyShield( schema: GraphQLSchema, shield: IMiddlewareGenerator<any, ServiceBaseContext> ) {
	return applyMiddleware( schema, shield );

}