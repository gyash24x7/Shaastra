import { EventEmitter } from "node:events";

export interface IQuery<I, Ctx> {
	data: I;
	context: Ctx;
}

export interface IQueryBuilder<Q extends IQuery<unknown, unknown>, R> {
	handler: IQueryHandler<Q, R>;

	new( data: Q["data"], context: Q["context"] ): Q;
}

export type IQueryHandler<Q extends IQuery<unknown, unknown>, R> = ( query: Q ) => Promise<R>

export class QueryBus extends EventEmitter {
	registerQuery<Q extends IQuery<unknown, unknown>, R>( cb: IQueryBuilder<Q, R> ) {
		super.on( cb.name, async ( query: Q ) => {
			const result = await cb.handler( query );
			super.emit( `${ cb.name }Completed`, result );
		} );
	}

	execute<Q extends IQuery<unknown, unknown>, R>( query: Q ): Promise<R> {
		const hasListeners = super.emit( query.constructor.name, query );

		return new Promise( ( resolve, reject ) => {
			super.on( `${ query.constructor.name }Completed`, resolve );

			if ( !hasListeners ) {
				reject( new Error( `Unknown Query!` ) );
			}
		} );
	}
}