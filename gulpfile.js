require('dotenv').config();

const { parallel, series, src, dest, watch } = require("gulp");
const bs = require("browser-sync").create();
const posthtml = require("gulp-posthtml");
const sass = require("gulp-dart-sass");
const autoprefixer = require("gulp-autoprefixer");


const html = () => {
	// const config = (file) => ({
	//   plugins: [
	//     require('posthtml-extend')({ root: './source' }),
	//     require('posthtml-include')({ root: './source/pages' }),
	//     require('posthtml-inline-svg')({ cwd: './source/pages', tag: 'inline-svg' }),
	//   ],
	// })

	return src([
		"source/pages/**/*.html",
		"!source/pages/**/partials/**/*.html",
	])
		.pipe(posthtml({url: process.env.URL_PROXY}))
		.pipe(dest("dist"));
};

const styles = () => {
	return src("source/pages/**/*.scss")
		.pipe(
			sass({
				outputStyle: "compressed",
			}).on("error", sass.logError)
		)
		.pipe(autoprefixer({ cascade: false }))
		.pipe(dest("dist"))
		.pipe(bs.reload({ stream: true }));
};

const server = () => {
	bs.init({
		proxy: process.env.URL_PROXY,
		https: true,
		open: false,
		serveStatic: ["dist"],
	});
};

const reload = (cb) => {
	bs.reload();
	cb();
};

const assets = (cb) => {
	return src([
		"source/pages/**/assets/images/**",
		"source/pages/**/assets/videos/**",
		"source/pages/**/assets/*.js",
	]).pipe(dest("dist"));
};

const watcher = () => {
	watch(
		["source/layouts/**/*.html", "source/pages/**/*.html"],
		series(html, reload)
	);
	watch("source/pages/**/*.scss", styles);
	watch(
		[
			"source/pages/**/assets/images/**",
			"source/pages/**/assets/videos/**",
			"source/pages/**/assets/*.js",
		],
		series(assets, reload)
	);
};

exports.default = parallel(html, styles, assets, server, watcher);
exports.build = parallel(html, styles, assets);
