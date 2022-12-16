import { EventEmitter } from "node:events";

export interface ICommand<I, Ctx> {
	data: I;
	context: Ctx;
}

export interface ICommandBuilder<C extends ICommand<unknown, unknown>, R> {
	handler: ICommandHandler<C, R>;

	new( data: C["data"], context: C["context"] ): C;
}

export type ICommandHandler<C extends ICommand<unknown, unknown>, R> = ( command: C ) => Promise<R>

export class CommandBus extends EventEmitter {
	registerCommand<C extends ICommand<unknown, unknown>, R>( cb: ICommandBuilder<C, R> ) {
		super.on( cb.name, async ( command: C ) => {
			const result = await cb.handler( command );
			super.emit( `${ cb.name }Completed`, result );
		} );
	}

	execute<C extends ICommand<unknown, unknown>, R>( command: C ): Promise<R> {
		const hasListeners = super.emit( command.constructor.name, command );

		return new Promise( ( resolve, reject ) => {
			super.on( `${ command.constructor.name }Completed`, resolve );

			if ( !hasListeners ) {
				reject( new Error( `Unknown Command!` ) );
			}
		} );
	}
}