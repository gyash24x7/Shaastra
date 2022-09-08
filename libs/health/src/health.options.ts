import type { ModuleMetadata } from "@nestjs/common";

export interface HealthModuleOptions {
	isGlobal?: boolean;
	options: { baseUrl: string };
}

export interface HealthModuleAsyncOptions extends Pick<ModuleMetadata, "imports"> {
	isGlobal?: boolean;
	useFactory?: ( ...args: any[] ) => Promise<{ baseUrl: string }> | { baseUrl: string };
	inject?: any[];
}