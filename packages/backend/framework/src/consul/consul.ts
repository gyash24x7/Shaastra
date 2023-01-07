import type { Consul as ConsulType } from "consul";
import BaseConsul from "consul";
import { logger } from "../logger/index.js";
import type { AppInfo } from "../application/index.js";

export type ConsulService = {
	ID: string;
	Tags: string[];
	Service: string;
	Port: number;
	Meta: Record<string, string>;
	Address: string;
};

export class Consul {
	private readonly consul: ConsulType;

	constructor() {
		this.consul = new BaseConsul( {
			host: process.env[ "CONSUL_HOST" ] || "localhost",
			port: process.env[ "CONSUL_PORT" ] || "8500"
		} );
	}

	async getRegisteredServices() {
		logger.trace( `>> Consul::getRegisteredServices()` );
		const services = await this.consul.agent.service.list<Record<string, ConsulService>>();
		return Object.values( services );
	}

	async registerService( appInfo: AppInfo ) {
		logger.trace( `>> Consul::registerService() AppInfo: ${ JSON.stringify( appInfo ) }` );

		const { id, name, port, address, pkg, url } = appInfo;

		const check = {
			id: `${ id }-health-check`,
			name: `${ name } API Health Check`,
			http: `${ url }/api/health`,
			method: "GET",
			header: { "Content-Type": [ "application/json" ] },
			interval: "30s",
			timeout: "1s"
		};

		await this.consul.agent.service.register( { id, name, port, address, meta: { pkg, url }, check } );
		logger.debug( `${ name } Service registered in Consul!` );
	}

	async deregisterService( appId: string ) {
		logger.debug( `Unregistering ${ appId } from consul...` );
		await this.consul.agent.service.deregister( appId );
	}
}