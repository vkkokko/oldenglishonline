/* eslint-disable */
import { normalize, join } from 'path';

export const distDir = './dist';
export const srcDir = './src';

export const config = {
	build: {
		layouts: normalize(join(srcDir, 'layouts')),
		pages: normalize(join(srcDir, 'pages')) + '/*.ejs',
		partials: normalize(join(srcDir, 'partials')),
	},
	assets: {
		js: {
			vendor: [
				'./node_modules/jquery/dist/jquery.min.js',
				'./node_modules/bootstrap/dist/js/bootstrap.min.js',
			],
			app: [
				`${normalize(srcDir)}/scripts/**/*.js`,
			]
		},
		css: {
			vendor: [
				'./node_modules/bootstrap/dist/css/bootstrap.min.css',
			],
			app: [
				`${normalize(srcDir)}/styles/**/*.css`,
				`!${normalize(srcDir)}/styles/**/test_*.*`
			]
		},
		data: [
			`${normalize(srcDir)}/data/**/*`
		],
		images: [
			`${normalize(srcDir)}/images/**/*`
		],
		assets: [
			`${normalize(srcDir)}/assets/**/*`
		]
	},
	compile: {
		js: [
			`${normalize(srcDir)}/scripts/**/*.js`
		],
		prodJsFilename: 'app.es5.min.js'
	},
	dirs: {
		src: normalize(srcDir),
		dist: normalize(distDir),

		scripts: normalize(join(distDir, 'scripts')),
		styles: normalize(join(distDir, 'styles')),
		data: normalize(join(distDir, 'data')),
		images: normalize(join(distDir, 'images')),
		assets: normalize(join(distDir, 'assets'))
	},
	watch: {
		template: `${normalize(srcDir)}/{layouts,pages,partials}/**/*.ejs`,
		assets: `${normalize(srcDir)}/{scripts,styles,data}/**/*`,
	}
};
