import type { ModuleMetadata } from "@nestjs/common";

export interface AuthModuleOptions {
	isGlobal?: boolean;
	options: AuthStrategyOptions;
}

export interface AuthStrategyOptions {
	audience: string;
	domain: string;
}

export interface AuthModuleAsyncOptions extends Pick<ModuleMetadata, "imports"> {
	isGlobal?: boolean,
	inject: any[],
	useFactory: ( ...args: any[] ) => Promise<AuthStrategyOptions> | AuthStrategyOptions
}