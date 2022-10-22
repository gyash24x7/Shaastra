import { BeforeApplicationShutdown, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import type { Consul as ConsulType } from "consul";
import Consul from "consul";
import { ConfigService } from "@nestjs/config";

interface ConsulServiceOptions {
	host: string,
	port: string,
	registerOptions: Consul.Agent.Service.RegisterOptions
}

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
	private readonly logger = new Logger( ConsulService.name );

	constructor( private readonly configService: ConfigService ) {
		this.options = {
			host: this.configService.get( "app.consul.host" )!,
			port: this.configService.get( "app.consul.port" )!,
			registerOptions: {
				id: this.configService.get<string>( "app.id" )!,
				name: this.configService.get<string>( "app.name" )!,
				port: this.configService.get<number>( "app.port" )!,
				address: this.configService.get<string>( "app.address" )!,
				meta: { pkg: this.configService.get<string>( "app.pkg" )! }
			}
		};
		this.consul = new Consul( { host: this.options.host, port: this.options.port } );
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
		this.logger.debug( "Unregistering app from consul..." );
		await this.consul.agent.service.deregister( this.options.registerOptions.id! );
	}
}