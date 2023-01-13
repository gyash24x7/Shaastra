import type { PrismaClient } from "@prisma/client/workforce/index.js";
import type { IEvents } from "@shaastra/framework";
import memberCreatedEventHandler from "./member.created.event.js";
import memberEnabledEventHandler from "./member.enabled.event.js";
import teamCreatedEventHandler from "./team.created.event.js";

export * from "./member.created.event.js";
export * from "./member.enabled.event.js";
export * from "./team.created.event.js";

export enum AppEvents {
	MEMBER_CREATED_EVENT = "MEMBER_CREATED_EVENT",
	MEMBER_ENABLED_EVENT = "MEMBER_ENABLED_EVENT",
	TEAM_CREATED_EVENT = "TEAM_CREATED_EVENT"
}

const events: IEvents<PrismaClient> = {
	MEMBER_CREATED_EVENT: memberCreatedEventHandler,
	MEMBER_ENABLED_EVENT: memberEnabledEventHandler,
	TEAM_CREATED_EVENT: teamCreatedEventHandler
};

export default events;