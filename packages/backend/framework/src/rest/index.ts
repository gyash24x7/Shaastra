import type { ServiceContext } from "../context/index.js";

export interface RestApiOptions<P> {
	path: string;
	method: "GET" | "POST" | "PUT" | "DELETE" | "ALL";
	handler: ( ctx: ServiceContext<P> ) => void | Promise<void>;
}

export class RestApi<P> {
	public readonly method: "GET" | "POST" | "PUT" | "DELETE" | "ALL";
	public readonly path: string;
	public readonly handler: ( ctx: ServiceContext<P> ) => void | Promise<void>;

	constructor( options: RestApiOptions<P> ) {
		this.path = options.path;
		this.method = options.method;
		this.handler = options.handler;
	}
}