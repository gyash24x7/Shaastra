import { EventEmitter } from "node:events";
import type { ServiceContext } from "../context/index.js";
import { logger } from "../logger/index.js";

export type IEventHandler = ( data: unknown, context: ServiceContext ) => Promise<void>

export type IEvents<AE extends string | number | symbol = string> = Record<AE, IEventHandler>;

export class EventBus<AE extends string | number | symbol = string> extends EventEmitter {

	constructor( events: IEvents<AE> ) {
		super();

		Object.keys( events ).forEach( ( key ) => {
			const value = events[ key as AE ];
			super.on( key, async ( data, context: ServiceContext ) => {
				logger.debug( `Executing Event: ${ key } ...` );
				await value( data, context );
			} );
		} );
	}

	execute<I>( name: string, data: I, context: ServiceContext ) {
		logger.debug( `Published Event: ${ name } ...` );
		const hasListeners = super.emit( name, data, context );

		if ( !hasListeners ) {
			logger.error( `No Handlers found for Event: ${ name }` );
		}
	}
}
