import { EventEmitter } from "node:events";
import type { ServiceContext } from "../context/index.js";
import { logger } from "../logger/index.js";

export type IEventHandler<P> = ( data: unknown, context: ServiceContext<P> ) => Promise<void>

export type IEvents<P, AE extends string | number | symbol = string> = Record<AE, IEventHandler<P>>;

export class EventBus<P, AE extends string | number | symbol = string> extends EventEmitter {

	constructor( events: IEvents<P, AE> ) {
		super();

		Object.keys( events ).forEach( ( key ) => {
			const value = events[ key as AE ];
			super.on( key, async ( data, context: ServiceContext<P> ) => {
				logger.debug( `Executing Event: ${ key } ...` );
				await value( data, context );
			} );
		} );
	}

	execute<I>( name: string, data: I, context: ServiceContext<P> ) {
		const hasListeners = super.emit( name, data, context );
		logger.debug( `Published Event: ${ name } ...` );

		if ( !hasListeners ) {
			logger.error( `No Handlers found for Event: ${ name }` );
		}
	}
}
