/* eslint-disable */
import path from 'path';

export const distDir = './docs';
export const buildDir= './build';
export const srcDir = './src';

export const config = {
	build: {
		layouts: path.normalize(path.join(srcDir, 'layouts')),
		pages: path.normalize(path.join(srcDir, 'pages')) + '/*.ejs',
		partials: path.normalize(path.join(srcDir, 'partials')),
	},
	assets: {
		js: [
			'./node_modules/jquery/dist/jquery.min.js',
			'./node_modules/bootstrap/dist/js/bootstrap.min.js',
			`${path.normalize(srcDir)}/scripts/**/*.js`,
		],
		css: [
			'./node_modules/bootstrap/dist/css/bootstrap.min.css',
			'./node_modules/bootstrap/dist/css/bootstrap.min.css.map',
			`${path.normalize(srcDir)}/styles/**/*.css`
		],
		data: [
			`${path.normalize(srcDir)}/data/**/*`
		],
		images: [
			`${path.normalize(srcDir)}/images/**/*`
		],
		assets: [
			`${path.normalize(srcDir)}/assets/**/*`
		]
	},
	dirs: {
		src: path.normalize(srcDir),
		dist: path.normalize(distDir),
		scripts: path.normalize(path.join(distDir, 'scripts')),
		styles: path.normalize(path.join(distDir, 'styles')),
		data: path.normalize(path.join(distDir, 'data')),
		images: path.normalize(path.join(distDir, 'images')),
		assets: path.normalize(path.join(distDir, 'assets'))
	},
	watch: {
		template: `${path.normalize(srcDir)}/{layouts,pages,partials}/**/*.ejs`,
		assets: `${path.normalize(srcDir)}/{scripts,styles,data}/**/*`,
	}
};
