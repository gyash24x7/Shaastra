import { EventEmitter } from "node:events";
import type { Logger } from "pino";
import type { ServiceContext } from "../context/index.js";

export type IEventHandler<P> = ( data: any, context: ServiceContext<P> ) => Promise<void>

export type IEvents<P> = Record<string, IEventHandler<P>>;

export class EventBus<P> extends EventEmitter {
	private readonly logger: Logger;

	constructor( events: IEvents<P>, logger: Logger ) {
		super();
		this.logger = logger;

		Object.keys( events ).forEach( ( key ) => {
			const value = events[ key ];
			super.on( key, async ( data, context: ServiceContext<P> ) => {
				logger.debug( `Executing Event: ${ key } ...` );
				await value( data, context );
			} );
		} );
	}

	execute<I>( name: string, data: I, context: ServiceContext<P> ) {
		this.logger.debug( `Published Event: ${ name } ...` );
		const hasListeners = super.emit( name, data, context );

		if ( !hasListeners ) {
			this.logger.error( `No Handlers found for Event: ${ name }` );
		}
	}
}
