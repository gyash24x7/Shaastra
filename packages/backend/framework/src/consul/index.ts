import type { Consul as ConsulType } from "consul";
import BaseConsul from "consul";
import type { AppInfo, ConsulConfig } from "../config/index.js";
import { logger } from "../logger/index.js";

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

	constructor( consulConfig: ConsulConfig ) {
		this.consul = new BaseConsul( consulConfig );
	}

	async getAllServices() {
		return this.consul.agent.service.list<Record<string, ConsulService>>();
	}

	async getRegisteredServices( appId: string ) {
		logger.trace( `>> Consul::getRegisteredServices() AppId: ${ appId }` );

		const serviceMap = await this.consul.agent.service.list<Record<string, ConsulService>>();
		return Object.values( serviceMap ).filter( service => service.ID !== appId );
	}

	async registerService( appInfo: AppInfo ) {
		logger.trace( `>> Consul::registerService() AppInfo: ${ JSON.stringify( appInfo ) }` );

		const { id, name, port, address, pkg } = appInfo;
		const url = `http://${ address }:${ port }`;

		const check = {
			id: `${ id }-health-check`,
			name: `${ name } API Health Check`,
			http: `${ url }/api/health`,
			method: "GET",
			header: { "Content-Type": [ "application/json" ] },
			interval: "30s",
			timeout: "1s"
		};

		await this.consul.agent.service.register( { id, name, port, address, meta: { pkg }, check } );
		logger.debug( `${ name } Service registered in Consul!` );
		this.applyShutdownHook( id );
	}

	private applyShutdownHook( appId: string ) {
		process.on( "beforeExit", async () => {
			logger.debug( `Unregistering ${ appId } from consul...` );
			await this.consul.agent.service.deregister( appId );
		} );
	}
}