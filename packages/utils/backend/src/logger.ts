import winston from "winston";

const logger = winston.createLogger( {
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.colorize(),
		winston.format.printf( ( { level, message, label, timestamp } ) => {
			return `${ timestamp } [${ label }] ${ level }: ${ message }`;
		} )
	),
	transports: [ new winston.transports.Console() ]
} );

export function createLogger( label: string ) {
	return logger.child( { label } );
}
