import { rule } from "graphql-shield";
import type { UserAuthInfo, ServiceContext } from "../utils/index.js";

export const isAuthenticated = rule( { cache: "contextual" } )(
	async ( _parent, _args, ctx: ServiceContext ) => {
		const authInfo: UserAuthInfo = ctx.res.locals[ "authInfo" ];
		return !!authInfo;
	}
);

export const isMember = rule( { cache: "contextual" } )(
	async ( _parent, _args, ctx: ServiceContext ) => {
		const authInfo: UserAuthInfo = ctx.res.locals[ "authInfo" ];
		return !!authInfo.department;
	}
);

export const isCore = rule( { cache: "contextual" } )(
	async ( _parent, _args, ctx: ServiceContext ) => {
		const authInfo: UserAuthInfo = ctx.res.locals[ "authInfo" ];
		return authInfo.position === "CORE";
	}
);

export const isCoord = rule( { cache: "contextual" } )(
	async ( _parent, _args, ctx: ServiceContext ) => {
		const authInfo: UserAuthInfo = ctx.res.locals[ "authInfo" ];
		return authInfo.position === "COORD";
	}
);

export const isHead = rule( { cache: "contextual" } )(
	async ( _parent, _args, ctx: ServiceContext ) => {
		const authInfo: UserAuthInfo = ctx.res.locals[ "authInfo" ];
		return authInfo.position === "HEAD";
	}
);