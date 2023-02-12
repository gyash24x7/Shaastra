import { MemberCreatedEventHandler } from "./member.created.event.js";
import { MemberEnabledEventHandler } from "./member.enabled.event.js";
import { TeamCreatedEventHandler } from "./team.created.event.js";

export * from "./member.created.event.js";
export * from "./member.enabled.event.js";
export * from "./team.created.event.js";

const eventHandlers = [ MemberCreatedEventHandler, MemberEnabledEventHandler, TeamCreatedEventHandler ];
export default eventHandlers;