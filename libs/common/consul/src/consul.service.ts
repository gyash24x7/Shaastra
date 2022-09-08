import { BeforeApplicationShutdown, Injectable, OnModuleInit } from "@nestjs/common";
import type { Consul as ConsulType } from "consul";
import Consul from "consul";
import { ConfigService } from "@nestjs/config";

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

	constructor( private readonly configService: ConfigService ) {
		this.consul = new Consul( {
			host: this.configService.get( "app.consul.host" ),
			port: this.configService.get( "app.consul.port" )
		} );
	}

	async getRegisteredServices( appId: string ) {
		const serviceMap = await this.consul.agent.service.list<Record<string, ConsulRegisteredService>>();
		return Object.values( serviceMap ).filter( service => service.ID !== appId );
	}

	async onModuleInit() {
		const id = this.configService.get<string>( "app.id" )!;
		const name = this.configService.get<string>( "app.name" )!;
		const port = this.configService.get<number>( "app.port" )!;
		const address = this.configService.get<string>( "app.address" )!;
		const meta = { pkg: this.configService.get<string>( "app.pkg" )! };

		const check = {
			id: `${ id }-health-check`,
			name: `${ name } API Health Check`,
			http: `http://${ address }:${ port }/api/health/check`,
			method: "GET",
			header: { "Content-Type": [ "application/json" ] },
			interval: "10s",
			timeout: "1s"
		};

		await this.consul.agent.service.register( { id, name, port, address, meta, check } );
	}

	async beforeApplicationShutdown() {
		await this.consul.agent.service.deregister( this.configService.get( "app.id" )! );
	}
}





