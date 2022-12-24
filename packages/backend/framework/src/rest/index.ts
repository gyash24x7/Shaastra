import type { ServiceBaseContext } from "../context/index.js";

export interface RestApiOptions<Ctx> {
	path: string;
	method: "GET" | "POST" | "PUT" | "DELETE" | "ALL";
	handler: ( ctx: Ctx ) => void | Promise<void>;
}

export class RestApi<Ctx extends ServiceBaseContext> {
	public readonly method: "GET" | "POST" | "PUT" | "DELETE" | "ALL";
	public readonly path: string;
	public readonly handler: ( ctx: Ctx ) => void | Promise<void>;

	constructor( options: RestApiOptions<Ctx> ) {
		this.path = options.path;
		this.method = options.method;
		this.handler = options.handler;
	}
}