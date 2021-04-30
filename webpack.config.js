const defaultConfig = require( './node_modules/@wordpress/scripts/config/webpack.config.js' );
const path = require( 'path' );

module.exports = {
	...defaultConfig,
	/*
	externals: {
		...defaultConfig.externals,
		$: 'jQuery',
		jquery: 'jQuery'
	},
	*/
	entry: {
		backend: path.resolve( process.cwd(), 'src', 'backend.js' ),
		frontend: path.resolve( process.cwd(), 'src', 'frontend.js' ),
	},
};