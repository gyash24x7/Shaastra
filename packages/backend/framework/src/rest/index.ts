import type { ServiceContext } from "../context";

export interface RestApiOptions {
	path: string;
	method: "GET" | "POST" | "PUT" | "DELETE" | "ALL";
	handler: ( ctx: ServiceContext ) => void | Promise<void>;
}

export class RestApi {
	public readonly method: "GET" | "POST" | "PUT" | "DELETE" | "ALL";
	public readonly path: string;
	public readonly handler: ( ctx: ServiceContext ) => void | Promise<void>;

	constructor( options: RestApiOptions ) {
		this.path = options.path;
		this.method = options.method;
		this.handler = options.handler;
	}
}