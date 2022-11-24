const { join } = require( "path" );
const theme = require( "@shaastra/configs/tailwind/theme.json" );

module.exports = {
	content: [ join( __dirname, "src/**/*!(*.stories|*.spec).{ts,tsx,html}" ) ],
	theme,
	plugins: []
};
