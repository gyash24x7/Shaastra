import { AuthController } from "./auth.controller";
import { GraphQLController } from "./graphql.controller";
import { InboundController } from "./inbound.controller";

export * from "./auth.controller";
export * from "./graphql.controller";
export * from "./inbound.controller";

const controllers = [ AuthController, GraphQLController, InboundController ];
export default controllers;