import type { ServiceBaseContext } from "@shaastra/utils/dist/index.js";
import type { IRule } from "graphql-shield";
import { rule } from "graphql-shield";
import type { UserAuthInfo } from "./strategy.js";

export const isAuthenticated: IRule = rule( { cache: "contextual" } )(
	async ( _parent, _args, ctx: ServiceBaseContext ): Promise<boolean> => {
		return !!ctx.req.res;
	}
);

export const hasPosition: ( positions: string ) => IRule = ( position ) => rule( { cache: "contextual" } )(
	async ( _parent, _args, ctx: ServiceBaseContext ) => {
		const authInfo = ctx.req.user as UserAuthInfo;
		return authInfo.position === position;
	}
);

export const hasDepartment: ( department: string ) => IRule = ( department ) => rule( { cache: "contextual" } )(
	async ( _parent, _args, ctx: ServiceBaseContext ) => {
		const authInfo = ctx.req.user as UserAuthInfo;
		return authInfo.department === department;
	}
);