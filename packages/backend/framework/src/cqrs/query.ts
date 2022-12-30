import { EventEmitter } from "node:events";
import type { ServiceContext } from "../context/index.js";
import { logger } from "../logger/index.js";

export type IQueryHandler = ( data: unknown, context: ServiceContext ) => Promise<any>

export type IQueries<AQ extends string | number | symbol = string> = Record<AQ, IQueryHandler>;

export class QueryBus<AQ extends string | number | symbol = string> extends EventEmitter {

	constructor( queries: IQueries<AQ> ) {
		super();

		Object.keys( queries ).forEach( ( key ) => {
			const value = queries[ key as AQ ];
			super.on( key, async ( data, context: ServiceContext ) => {
				logger.debug( `Executing Query: ${ key } ...` );
				const result = await value( data, context );
				super.emit( `${ key }Completed`, result );
			} );
		} );
	}

	execute<I, R>( name: string, data: I, context: ServiceContext ): Promise<R> {
		logger.debug( `Published Query: ${ name } ...` );
		const hasListeners = super.emit( name, data, context );

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