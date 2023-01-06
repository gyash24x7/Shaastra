import { EventEmitter } from "node:events";
import type { ServiceContext } from "../context";
import { logger } from "../logger";

export type IEventHandler = ( data: any, context: ServiceContext ) => Promise<void>

export type IEvents = Record<string, IEventHandler>;

export class EventBus extends EventEmitter {

	constructor( events: IEvents ) {
		super();

		Object.keys( events ).forEach( ( key ) => {
			const value = events[ key ];
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
