/* eslint-disable */
import gulp from 'gulp';
import del from 'del';
import ejs from 'gulp-ejs-monster';
import beautify from 'gulp-jsbeautifier';
import filter from 'gulp-filter';
import terser from 'gulp-terser';
import gutil from 'gulp-util';

import {config, distDir} from './gulpconfig.js';
import siteConfig from './siteconfig.json' with { type: 'json' }
import * as fs from 'fs';

// if running watch task, overwrite base tag to always be '/' for localhost
const siteWatchBase = {base: gutil.env.env === 'watch' ? '/' : siteConfig.site.base};
Object.assign(siteConfig.site, siteWatchBase);

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
				locals: siteConfig,
				layouts: config.build.layouts,
			})
		)
		.pipe(beautify())
		.pipe(gulp.dest(config.dirs.dist));
}

// main copy task
export function copy(done) {
	return gulp.parallel(copyCSS,
		copyJS,
		copyData,
		copyAssets,
		copyImages,
		copyCname,
		copyManifest,
		copySW,
	)
	(done);
}

// copy css assets
function copyCSS() {
	return gulp.src(config.assets.css, {since: gulp.lastRun(copyCSS)})
		.pipe(gulp.dest(config.dirs.styles));
}

// copy js assets
function copyJS() {
	const f = filter(['**', '!*node_modules/**/*'], {restore: true});

	return gutil.env.env === 'watch'
		? gulp.src(config.assets.js, {since: gulp.lastRun(copyJS)})
			.pipe(gulp.dest(config.dirs.scripts))
		: gulp.src(config.assets.js, {since: gulp.lastRun(copyJS)})
			.pipe(f)
			.pipe(terser())
			.pipe(f.restore)
			.pipe(gulp.dest(config.dirs.scripts));
}

// copy data assets
function copyData() {
	return gulp.src(config.assets.data, {since: gulp.lastRun(copyData)})
		.pipe(gulp.dest(config.dirs.data));
}

// copy images
function copyImages() {
	return gulp.src(config.assets.images, {since: gulp.lastRun(copyImages)})
		.pipe(gulp.dest(config.dirs.images));
}

// copy remaining assets
function copyAssets() {
	return gulp.src(config.assets.assets, {since: gulp.lastRun(copyAssets)})
		.pipe(gulp.dest(config.dirs.assets));
}

// copy CNAME file into dist
function copyCname() {
	return gulp.src('CNAME')
		.pipe(gulp.dest(config.dirs.dist));
}

// copy manifest.json
function copyManifest() {
	return gulp.src('manifest.json')
		.pipe(gulp.dest(config.dirs.dist));
}

function copySW() {
	const files = fs.readdirSync(config.dirs.dist)
	const filesArray = JSON.stringify(files.filter(s => s.endsWith(".html")))
	fs.writeFileSync("docs/assets.json", filesArray)

	return gulp.src('src/scripts/sw.js')
		.pipe(gulp.dest(config.dirs.dist));
}

// watch task
const watchTemplate = () => gulp.watch(config.watch.template, gulp.series(renderEJS));
const watchAssets = () => gulp.watch(config.watch.assets, gulp.series(copyCSS, copyJS, copyData));

export function watch(done) {
	return gulp.parallel(build, watchTemplate, watchAssets)(done);
}
