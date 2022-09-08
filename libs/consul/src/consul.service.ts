import { BeforeApplicationShutdown, Inject, Injectable, OnModuleInit } from "@nestjs/common";
import type { Consul as ConsulType } from "consul";
import Consul from "consul";
import type { ConsulServiceOptions } from "./consul.options";

type ConsulRegisteredService = {
	ID: string;
	Tags: string[];
	Service: string;
	Port: number;
	Meta: Record<string, string>;
	Address: string;
};

@Injectable()
export class ConsulService implements OnModuleInit, BeforeApplicationShutdown {
	private readonly consul: ConsulType;
	private readonly options: ConsulServiceOptions;

	constructor( @Inject( "CONSUL_SERVICE_OPTIONS" ) options: ConsulServiceOptions ) {
		this.options = options;
		this.consul = new Consul( { host: options.host, port: options.port } );
	}

	async getRegisteredServices( appId: string ) {
		const serviceMap = await this.consul.agent.service.list<Record<string, ConsulRegisteredService>>();
		return Object.values( serviceMap ).filter( service => service.ID !== appId );
	}

	async onModuleInit() {
		const { id, name, port, address, meta } = this.options.registerOptions;
		const url = `http://${ address }:${ port }`;

		const check = {
			id: `${ id }-health-check`,
			name: `${ name } API Health Check`,
			http: `${ url }/api/health/check`,
			method: "GET",
			header: { "Content-Type": [ "application/json" ] },
			interval: "10s",
			timeout: "1s"
		};

		await this.consul.agent.service.register( { id, name, port, address, meta, check } );
	}

	async beforeApplicationShutdown() {
		await this.consul.agent.service.deregister( this.options.registerOptions.id! );
	}
}





