import { MemberCreatedEventHandler } from "./member.created.event";
import { MemberEnabledEventHandler } from "./member.enabled.event";
import { TeamCreatedEventHandler } from "./team.created.event";

export * from "./member.created.event";
export * from "./member.enabled.event";
export * from "./team.created.event";

const eventHandlers = [ MemberCreatedEventHandler, MemberEnabledEventHandler, TeamCreatedEventHandler ];
export default eventHandlers;