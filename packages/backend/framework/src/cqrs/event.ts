import { EventEmitter } from "node:events";
import type { ServiceContext } from "../context/index.js";

export type IEventHandler<P> = ( data: unknown, context: ServiceContext<P> ) => Promise<void>

export type IEvents<P, AE extends string | number | symbol = string> = Record<AE, IEventHandler<P>>;

export class EventBus<P> extends EventEmitter {

	constructor( events: IEvents<P> ) {
		super();

		Object.keys( events ).forEach( ( key ) => {
			const value = events[ key ];
			super.on( key, async ( data, context: ServiceContext<P> ) => {
				await value( data, context );
			} );
		} );
	}

	execute<I>( name: string, data: I, context: ServiceContext<P> ): Promise<void> {
		const hasListeners = super.emit( name, data, context );

		return new Promise( ( resolve, reject ) => {
			if ( !hasListeners ) {
				reject( new Error( `Unknown Event!` ) );
			}
			resolve();
		} );
	}
}