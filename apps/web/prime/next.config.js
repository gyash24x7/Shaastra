const { withNx } = require( "@nrwl/next/plugins/with-nx" );
const nextConfig = {
	nx: { svgr: false }
};

module.exports = withNx( nextConfig );

