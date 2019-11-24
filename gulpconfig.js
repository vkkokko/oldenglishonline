/* eslint-disable */
import path from 'path';

export const distDir = './dist';
export const srcDir = './src';

export const config = {
	build: {
		layouts: path.normalize(path.join(srcDir, 'layouts')),
		pages: path.normalize(path.join(srcDir, 'pages')) + '/*.ejs',
		partials: path.normalize(path.join(srcDir, 'partials')),
	},
	assets: {
		js: {
			vendor: [
				'./node_modules/jquery/dist/jquery.min.js',
				'./node_modules/bootstrap/dist/js/bootstrap.min.js',
			],
			app: [
				`${path.normalize(srcDir)}/scripts/**/*.js`,
			]
		},
		css: {
			vendor: [
				'./node_modules/bootstrap/dist/css/bootstrap.min.css',
			],
			app: [
				`${path.normalize(srcDir)}/styles/**/*.css`,
				`!${path.normalize(srcDir)}/styles/**/test_*.*`
			]
		},
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
	compile: {
		js: [
			`${path.normalize(srcDir)}/scripts/**/*.js`
		],
		prodJsFilename: 'app.es5.min.js'
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
