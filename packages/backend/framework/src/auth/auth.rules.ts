import { rule } from "graphql-shield";
import type { IRuleFunction } from "graphql-shield/typings/types.js";
import type { ServiceContext } from "../graphql/index.js";
import type { UserAuthInfo } from "./auth.types.js";

export const isAuthenticatedRuleFunction: IRuleFunction = async ( _parent, _args, ctx: ServiceContext ) => {
	const authInfo: UserAuthInfo | undefined = ctx.res.locals[ "authInfo" ];
	return !!authInfo;
};

export const isMemberRuleFunction: IRuleFunction = async ( _parent, _args, ctx: ServiceContext ) => {
	const authInfo: UserAuthInfo | undefined = ctx.res.locals[ "authInfo" ];
	return !!authInfo?.department;
};

export const isCoreRuleFunction: IRuleFunction = async ( _parent, _args, ctx: ServiceContext ) => {
	const authInfo: UserAuthInfo | undefined = ctx.res.locals[ "authInfo" ];
	return !!authInfo?.department && authInfo?.position === "CORE";
};

export const isCoordRuleFunction: IRuleFunction = async ( _parent, _args, ctx: ServiceContext ) => {
	const authInfo: UserAuthInfo | undefined = ctx.res.locals[ "authInfo" ];
	return !!authInfo?.department && authInfo?.position === "COORD";
};

export const isHeadRuleFunction: IRuleFunction = async ( _parent, _args, ctx: ServiceContext ) => {
	const authInfo: UserAuthInfo | undefined = ctx.res.locals[ "authInfo" ];
	return !!authInfo?.department && authInfo?.position === "HEAD";
};

export const isAuthenticated = rule( { cache: "contextual" } )( isAuthenticatedRuleFunction );
export const isMember = rule( { cache: "contextual" } )( isMemberRuleFunction );
export const isCore = rule( { cache: "contextual" } )( isCoreRuleFunction );
export const isCoord = rule( { cache: "contextual" } )( isCoordRuleFunction );
export const isHead = rule( { cache: "contextual" } )( isHeadRuleFunction );