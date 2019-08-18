/* eslint-disable */

import gulp from 'gulp';
import del from 'del';
import ejs from 'gulp-ejs-monster';
import rename from 'gulp-rename';
import browserSync from 'browser-sync';

import { config, distDir } from './gulpconfig';
import * as siteconfig from './siteconfig.json';

// default task
export default function defaultTask(done) {
	done();
}

export function conf(done) {
	console.log(config);
	console.log(siteconfig.config);
	done();
}

// Clean build directories
export const clean = () => del([distDir]);

export function build(done) {
	return gulp.series(clean, renderEJS, copy)(done);
}

// build EJS templates into site
export function renderEJS() {
	return gulp.src(config.build.pages)
		.pipe(
			ejs({
				showHistory: false,
				showHistoryOnCrash: true,
				locals: siteconfig,
				layouts: config.build.layouts,
			})
		)
		// .pipe(rename({ extname: '.html'}))
		.pipe(gulp.dest(config.dirs.dist));
}

// main copy task
export function copy(done) {
	return gulp.series(copyCSS, copyJS, copyData, copyAssets)(done);
}

// copy css assets
function copyCSS() {
	return gulp.src(config.assets.css)
		.pipe(gulp.dest(config.dirs.styles));
}

// copy js assets
function copyJS() {
	return gulp.src(config.assets.js)
		.pipe(gulp.dest(config.dirs.scripts));
}

// copy data assets
function copyData() {
	return gulp.src(config.assets.data)
		.pipe(gulp.dest(config.dirs.data));
}

// copy remaining assets
function copyAssets() {
	return gulp.src(config.assets.assets)
		.pipe(gulp.dest(config.dirs.assets));
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
const watchAssets = () => gulp.watch(config.watch.assets, gulp.series(copyCSS, copyJS, copyData, bs_reload));

export function watch(done) {
	return gulp.parallel(bs_serve, watchTemplate, watchAssets)(done);
}
