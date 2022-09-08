import type { ModuleMetadata } from "@nestjs/common";
import type * as Consul from "consul";

export interface ConsulModuleOptions {
	isGlobal?: boolean;
	options: ConsulServiceOptions;
}

export interface ConsulModuleAsyncOptions extends Pick<ModuleMetadata, "imports"> {
	isGlobal?: boolean;
	useFactory?: ( ...args: any[] ) => Promise<ConsulServiceOptions> | ConsulServiceOptions;
	inject?: any[];
}

export interface ConsulServiceOptions {
	host: string,
	port: string,
	registerOptions: Consul.Agent.Service.RegisterOptions
}
