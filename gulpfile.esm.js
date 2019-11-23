/* eslint-disable */
import gulp from 'gulp';
import del from 'del';
import ejs from 'gulp-ejs-monster';
import browserSync from 'browser-sync';
import beautify from 'gulp-jsbeautifier';
import terser from 'gulp-terser';
import gutil from 'gulp-util';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import through from 'through2';
import path from 'path';

import { config, distDir } from './gulpconfig';
import * as siteConfig from './siteconfig.json';

const isProd = gutil.env.env === 'prod';

// if running watch task, overwrite base tag to always be '/' for localhost
const siteWatchBase = { base: gutil.env.env === 'watch' ? '/' : siteConfig.site.base };
Object.assign(siteConfig.site, siteWatchBase);

// Clean build directories
export const clean = () => del([distDir]);

// get list of scripts
export function getScriptList() {
	const fileArray = [];

	return gulp.src(config.assets.js.app)
		.pipe(through.obj( (file, enc, cb) => {
			fileArray.push(path.basename(file.path));
			cb();
		}))
		.on('end', () => {
			siteConfig.site.appScripts = fileArray;
		});
}

// build task
export default function build(done) {
	if (isProd) {
		siteConfig.site.appScripts = ['app.es5.min.js'];
		return gulp.series(clean, renderEJS, copyProd)(done);
	} else {
		return gulp.series(clean, getScriptList, renderEJS, copyDev)(done);
	}
}

// build EJS templates into site
export function renderEJS() {
	return gulp.src(config.build.pages)
		.pipe(
			ejs({
				showHistory: false,
				showHistoryOnCrash: true,
				locals: siteConfig,
				layouts: config.build.layouts,
			})
		)
		.pipe(beautify())
		.pipe(gulp.dest(config.dirs.dist));
}

// main copy task
export function copyProd(done) {
	return gulp.parallel(copyCSS, compileJS, copyVendorJS, copyData, copyAssets, copyImages, copyCname)(done);
}

// main copy task
export function copyDev(done) {
	return gulp.parallel(copyCSS, copyAppJS, copyVendorJS, copyData, copyAssets, copyImages, copyCname)(done);
}

// copy css assets
function copyCSS() {
	return gulp.src(config.assets.css, { since: gulp.lastRun(copyCSS) })
		.pipe(gulp.dest(config.dirs.styles));
}

// Compile and minify JS
function compileJS() {
	return gulp.src(config.compile.js)
		.pipe(babel())
		.pipe(terser())
		.pipe(concat('app.es5.min.js'))
		.pipe(gulp.dest(config.dirs.scripts));
}

// copy js assets
function copyAppJS() {
	return gulp.src(config.assets.js.app, { since: gulp.lastRun(copyAppJS) })
		.pipe(gulp.dest(config.dirs.scripts));
}

function copyVendorJS() {
	return gulp.src(config.assets.js.vendor, { since: gulp.lastRun(copyVendorJS) })
		.pipe(gulp.dest(config.dirs.scripts));
}

// copy data assets
function copyData() {
	return gulp.src(config.assets.data, { since: gulp.lastRun(copyData) })
		.pipe(gulp.dest(config.dirs.data));
}

// copy images
function copyImages() {
	return gulp.src(config.assets.images, { since: gulp.lastRun(copyImages) })
		.pipe(gulp.dest(config.dirs.images));
}

// copy remaining assets
function copyAssets() {
	return gulp.src(config.assets.assets, { since: gulp.lastRun(copyAssets) })
		.pipe(gulp.dest(config.dirs.assets));
}

// copy CNAME file into dist
function copyCname() {
	return gulp.src('CNAME')
		.pipe(gulp.dest(config.dirs.dist))
}

// browsersync setup
const server = browserSync.create();

function bs_reload(done) {
	server.reload();
	done();
}

function bs_serve(done) {
	server.init({
		server: {
			baseDir: config.dirs.dist
		}
	});

	done();
}

// watch task
const watchTemplate = () => gulp.watch(config.watch.template, gulp.series(renderEJS, bs_reload));
const watchAssets = () => gulp.watch(config.watch.assets, gulp.series(copyCSS, copyAppJS, copyData, bs_reload));

export function watch(done) {
	return gulp.parallel(build, bs_serve, watchTemplate, watchAssets)(done);
}
