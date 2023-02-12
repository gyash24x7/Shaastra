import { AuthController } from "./auth.controller.js";
import { GraphQLController } from "./graphql.controller.js";
import { InboundController } from "./inbound.controller.js";

export * from "./auth.controller.js";
export * from "./graphql.controller.js";
export * from "./inbound.controller.js";

const controllers = [ AuthController, GraphQLController, InboundController ];
export default controllers;