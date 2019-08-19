/* eslint-disable */
import gulp from 'gulp';
import del from 'del';
import ejs from 'gulp-ejs-monster';
import browserSync from 'browser-sync';
import beautify from 'gulp-jsbeautifier';
import filter from 'gulp-filter';
import terser from 'gulp-terser';

import { config, distDir } from './gulpconfig';
import * as siteconfig from './siteconfig.json';

// Clean build directories
export const clean = () => del([distDir]);

export default function build(done) {
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
		.pipe(beautify())
		.pipe(gulp.dest(config.dirs.dist));
}

// main copy task
export function copy(done) {
	return gulp.parallel(copyCSS, copyJS, copyData, copyAssets, copyImages)(done);
}

// copy css assets
function copyCSS() {
	return gulp.src(config.assets.css, { since: gulp.lastRun(copyCSS) })
		.pipe(gulp.dest(config.dirs.styles));
}

// copy js assets
function copyJS() {
	const f = filter(['**', '!*node_modules/**/*'], { restore: true });

	return gulp.src(config.assets.js, { since: gulp.lastRun(copyJS) })
		.pipe(f)
		.pipe(terser())
		.pipe(f.restore)
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
	return gulp.parallel(build, bs_serve, watchTemplate, watchAssets)(done);
}
