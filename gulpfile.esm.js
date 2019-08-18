/* eslint-disable */

import gulp from 'gulp';
import del from 'del';
import browserSync from 'browser-sync';

import { config } from './gulpconfig';

// default task
export default function defaultTask(done) {
	done();
}

// Clean build directories
export const clean = () => del([config.dirs.dist, config.dist.build]);

export function build(done) {

}

// build EJS templates into site
export function renderEJS(done) {

}

// main copy task
export function copy() {
	return series(copyCSS, copyJS, copyData, copyAssets);
}

// copy css assets
function copyCSS() {
	return gulp.src(config.assets.css)
		.pipe(config.dirs.dist);
}

// copy js assets
function copyJS() {
	return gulp.src(config.assets.js)
		.pipe(config.dirs.dist);
}

// copy data assets
function copyData() {
	return gulp.src(config.assets.data)
		.pipe(config.dirs.dist);
}

// copy remaining assets
function copyAssets() {
	return gulp.src(config.assets.assets)
		.pipe(config.dirs.dist);
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
const watchTemplate = () => gulp.watch(config.watch.template, gulp.series(build, bs_reload));
const watchAssets = () => gulp.watch(config.watch.assets, gulp.series(copyCSS, copyJS, copyData, bs_reload));

export function watch() {
	gulp.parallel(watchTemplate, watchAssets);
}
