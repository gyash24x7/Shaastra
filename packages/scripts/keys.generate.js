const { join } = require( "node:path" );
const { writeFileSync } = require( "node:fs" );
const jose = require( "jose" );

jose.generateKeyPair( "RS256" ).then(
	async ( { privateKey, publicKey } ) => {
		writeFileSync(
			join( process.cwd(), "src", "assets", "keys", ".private.key" ),
			await jose.exportPKCS8( privateKey )
		);
		writeFileSync(
			join( process.cwd(), "src", "assets", "keys", ".public.key.pem" ),
			await jose.exportSPKI( publicKey )
		);
	}
);