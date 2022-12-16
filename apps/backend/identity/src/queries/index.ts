import { QueryBus } from "@shaastra/cqrs";
import { UserQuery } from "./user.query.js";

const queryBus = new QueryBus();
queryBus.registerQuery( UserQuery );

export { queryBus };

export * from "./user.query.js";