import { EventEmitter } from "node:events";
import type { ServiceContext } from "../context/index.js";

export type IQueryHandler<P> = ( data: unknown, context: ServiceContext<P> ) => Promise<any>

export type IQueries<P, AQ extends string | number | symbol = string> = Record<AQ, IQueryHandler<P>>;

export class QueryBus<P> extends EventEmitter {

	constructor( queries: IQueries<P> ) {
		super();

		Object.keys( queries ).forEach( ( key ) => {
			const value = queries[ key ];
			super.on( key, async ( data, context: ServiceContext<P> ) => {
				const result = await value( data, context );
				super.emit( `${ key }Completed`, result );
			} );
		} );
	}

	execute<I, R>( name: string, data: I, context: ServiceContext<P> ): Promise<R> {
		const hasListeners = super.emit( name, data, context );

		return new Promise( ( resolve, reject ) => {
			super.on( `${ name }Completed`, resolve );

			if ( !hasListeners ) {
				reject( new Error( `Unknown Query!` ) );
			}
		} );
	}
}