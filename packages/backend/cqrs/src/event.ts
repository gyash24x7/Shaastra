import { EventEmitter } from "node:events";

export interface IEvent<I, Ctx> {
	data: I;
	context: Ctx;
}

export interface IEventBuilder<E extends IEvent<unknown, unknown>> {
	handler: IEventHandler<E>;

	new( data: E["data"], context: E["context"] ): E;
}

export type IEventHandler<E extends IEvent<unknown, unknown>> = ( event: E ) => Promise<void>

export class EventBus extends EventEmitter {
	registerEvent<E extends IEvent<I, Ctx>, I, Ctx>( e: IEventBuilder<E> ) {
		super.on( e.name, e.handler );
	}

	publish<E extends IEvent<unknown, unknown>>( event: E ) {
		const hasListeners = super.emit( event.constructor.name, event );
		if ( !hasListeners ) {
			console.warn( `Unknown Event!` );
		}
	}
}