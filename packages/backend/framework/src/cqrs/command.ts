import { EventEmitter } from "node:events";
import type { ServiceContext } from "../context/index.js";

export type ICommandHandler<P> = ( data: unknown, context: ServiceContext<P> ) => Promise<any>

export type ICommands<P, AC extends string | number | symbol = string> = Record<AC, ICommandHandler<P>>;

export class CommandBus<P, AC extends string | number | symbol = string> extends EventEmitter {

	constructor( commands: ICommands<P, AC> ) {
		super();

		Object.keys( commands ).forEach( ( key ) => {
			const value = commands[ key as AC ];
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
				reject( new Error( `Unknown Command!` ) );
			}
		} );
	}
}