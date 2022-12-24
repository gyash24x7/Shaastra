import type { Consul as ConsulType } from "consul";
import BaseConsul from "consul";
import type { Signale } from "signale";
import type { AppInfo, ConsulConfig } from "../config/index.js";

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
	private readonly logger: Signale | undefined;

	constructor( consulConfig: ConsulConfig, logger?: Signale ) {
		this.consul = new BaseConsul( consulConfig );
		this.logger = logger;
	}

	async getAllServices() {
		return this.consul.agent.service.list<Record<string, ConsulService>>();
	}

	async getRegisteredServices( appId: string ) {
		const serviceMap = await this.consul.agent.service.list<Record<string, ConsulService>>();
		return Object.values( serviceMap ).filter( service => service.ID !== appId );
	}

	async registerService( appInfo: AppInfo ) {
		const { id, name, port, address, pkg } = appInfo;
		const url = `http://${ address }:${ port }`;

		const check = {
			id: `${ id }-health-check`,
			name: `${ name } API Health Check`,
			http: `${ url }/api/health`,
			method: "GET",
			header: { "Content-Type": [ "application/json" ] },
			interval: "10s",
			timeout: "1s"
		};

		await this.consul.agent.service.register( { id, name, port, address, meta: { pkg }, check } );
		this.applyShutdownHook( id );
	}

	private applyShutdownHook( appId: string ) {
		process.on( "beforeExit", async () => {
			this.logger?.scope( Consul.name ).pending( `Unregistering ${ appId } from consul...` );
			await this.consul.agent.service.deregister( appId );
		} );
	}
}