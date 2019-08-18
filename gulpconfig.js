/* eslint-disable */

const path = require('path');

const distDir = './dist';
const builDir = './build';
const srcDir = './src';

export const config = {
	build: {},
	assets: {
		js: [
			'./node_modules/jquery/dist/jquery.min.js',
			'./node_modules/bootstrap/dist/js/bootstrap.min.js',
		],
		css: [
			'./node_modules/bootstrap/dist/css/bootstrap.min.css',
		],
		data: [
			'./src/data/**/*'
		],
		assets: [
			'./src/assets/**/*'
		]
	},
	dirs: {
		'src': path.resolve(srcDir),
		'dist': path.resolve(distDir),
		'build': path.resolve('./build'),

		'scripts': path.resolve(distDir, 'scripts'),
		'styles': path.resolve(distDir, 'styles'),
		'data': path.resolve(distDir, 'data'),
		'assets': path.resolve(distDir, 'assets')
	},
	watch: {
		template: `${srcDir}/{layouts,pages,partials}/**/*.ejs`,
		assets: `${srcDir}/{scripts,styles,data}/**/*`,
	}
};
