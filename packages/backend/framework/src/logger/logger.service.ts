import type { LoggerService as NestLoggerService } from "@nestjs/common";
import type { Ogma } from "@ogma/logger";
import { format } from "node:util";

export class LoggerService implements NestLoggerService {

	constructor(
		private readonly ogma: Ogma,
		private readonly application: string,
		private readonly scope?: string
	) {}

	debug( message: string, ...params: any[] ) {
		this.ogma.debug(
			format( message, ...params ),
			{ context: this.scope, application: this.application }
		);
	}

	error( message: string, ...params: any[] ) {
		this.ogma.error(
			format( message, ...params ),
			{ context: this.scope, application: this.application }
		);
	}

	log( message: string, ...params: any[] ) {
		this.ogma.info(
			format( message, ...params ),
			{ context: this.scope, application: this.application }
		);
	}

	verbose( message: string, ...params: any[] ) {
		this.ogma.verbose(
			format( message, ...params ),
			{ context: this.scope, application: this.application }
		);
	}

	warn( message: string, ...params: any[] ) {
		this.ogma.warn(
			format( message, ...params ),
			{ context: this.scope, application: this.application }
		);
	}

	info( message: string, ...params: any[] ) {
		this.ogma.info(
			format( message, ...params ),
			{ context: this.scope, application: this.application }
		);
	}

	trace( message: string, ...params: any[] ) {
		this.ogma.verbose(
			format( message, ...params ),
			{ context: this.scope, application: this.application }
		);
	}
}