import { EventEmitter } from "node:events";
import type { ServiceContext } from "../context/index.js";
import { logger } from "../logger/index.js";

export type IQueryHandler<P> = ( data: unknown, context: ServiceContext<P> ) => Promise<any>

export type IQueries<P, AQ extends string | number | symbol = string> = Record<AQ, IQueryHandler<P>>;

export class QueryBus<P, AQ extends string | number | symbol = string> extends EventEmitter {

	constructor( queries: IQueries<P, AQ> ) {
		super();

		Object.keys( queries ).forEach( ( key ) => {
			const value = queries[ key as AQ ];
			super.on( key, async ( data, context: ServiceContext<P> ) => {
				logger.debug( `Executing Query: ${ key } ...` );
				const result = await value( data, context );
				super.emit( `${ key }Completed`, result );
			} );
		} );
	}

	execute<I, R>( name: string, data: I, context: ServiceContext<P> ): Promise<R> {
		const hasListeners = super.emit( name, data, context );
		logger.debug( `Published Query: ${ name } ...` );

		return new Promise( ( resolve, reject ) => {
			if ( !hasListeners ) {
				logger.error( `No Handlers found for Query: ${ name }` );
				reject( new Error( `Unknown Query!` ) );
			}

			super.on( `${ name }Completed`, ( data: R ) => {
				logger.debug( `Execution Complete for Query: ${ name }` );
				resolve( data );
			} );
		} );
	}
}