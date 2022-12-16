import { QueryBus } from "@shaastra/cqrs";
import { DeptCoreQuery } from "./dept-core.query.js";
import { MemberQuery } from "./member.query.js";
import { MembersQuery } from "./members.query.js";
import { TeamQuery } from "./team.query.js";
import { TeamsQuery } from "./teams.query.js";

const queryBus = new QueryBus();
queryBus.registerQuery( DeptCoreQuery );
queryBus.registerQuery( MemberQuery );
queryBus.registerQuery( MembersQuery );
queryBus.registerQuery( TeamsQuery );
queryBus.registerQuery( TeamQuery );

export { queryBus };

export * from "./dept-core.query.js";
export * from "./member.query.js";
export * from "./members.query.js";
export * from "./team.query.js";
export * from "./teams.query.js";