import type { IEvents } from "@shaastra/framework";
import memberCreatedEventHandler from "./member.created.event";
import memberEnabledEventHandler from "./member.enabled.event";
import teamCreatedEventHandler from "./team.created.event";

export * from "./member.created.event";
export * from "./member.enabled.event";
export * from "./team.created.event";

export enum AppEvents {
	MEMBER_CREATED_EVENT = "MEMBER_CREATED_EVENT",
	MEMBER_ENABLED_EVENT = "MEMBER_ENABLED_EVENT",
	TEAM_CREATED_EVENT = "TEAM_CREATED_EVENT"
}

const events: IEvents = {
	MEMBER_CREATED_EVENT: memberCreatedEventHandler,
	MEMBER_ENABLED_EVENT: memberEnabledEventHandler,
	TEAM_CREATED_EVENT: teamCreatedEventHandler
};

export default events;