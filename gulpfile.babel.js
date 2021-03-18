import gulp from 'gulp';
import del from 'del';
import sass from 'gulp-sass';
import cleanCSS from 'gulp-clean-css';
import concat from 'gulp-concat';
import rename from 'gulp-rename';
import svgcss from 'gulp-svg-css';

/*** VARIABLES ***/

const prefix = 'blist';
const paths = {
	src: 'src',
	dest: 'dist',
	temp: 'temp',
	styles: {
		src: [
			'src/scss/variables.scss',
			'src/scss/common.scss',
			'src/scss/font.scss',
			'src/scss/wrapper.scss',
			'src/scss/**/*.scss',
			'!src/scss/adaptive.scss',
			'src/scss/adaptive.scss',
		],
		dest: 'dist/css/',
		srcTemp: [
			'temp/css/**/*.{css,scss}'
		],
		destTemp: 'temp/css/',
	},
	images: {
		svg: 'src/img/svg/**/*.svg',
		svgBorder: 'src/img/border/**/*.svg',
	},
	content: {
		src: 'src/*.html',
		dest: 'dist/',
	},
};

/*** CLEAN ***/

export function clean() {
	return del([paths.dest, paths.temp]);
}

/*** STYLES ***/

function concatStyles() {
	return gulp.src(paths.styles.src)
		.pipe(concat('index.scss'))
		.pipe(gulp.dest(paths.styles.destTemp));
}

function concatSvg() {
	return gulp.src(paths.images.svg)
		.pipe(svgcss({
			fileName: 'icons',
			cssPrefix: `${prefix}__svg--`,
			cssProperty: 'background-image',
			addSize: false
		}))
		.pipe(gulp.dest(paths.styles.destTemp));
}

function concatSvgBorder() {
	return gulp.src(paths.images.svgBorder)
		.pipe(svgcss({
			fileName: 'borders',
			cssPrefix: `${prefix}__svg-border--`,
			cssProperty: 'border-image-source',
			addSize: false
		}))
		.pipe(gulp.dest(paths.styles.destTemp));
}

function concatStylesTemp() {
	return gulp.src(paths.styles.srcTemp)
		.pipe(concat('index.scss'))
		.pipe(sass())
		.pipe(gulp.dest(paths.styles.dest))
		.pipe(cleanCSS())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest(paths.styles.dest));
}

export const styles = gulp.series(concatStyles, concatSvg, concatSvgBorder, concatStylesTemp);

/*** CONTENT ***/

export function content() {
	return gulp.src(paths.content.src)
		.pipe(gulp.dest(paths.content.dest));
}

/*** WATCHERS ***/

export function watch() {
	gulp.watch(paths.content.src, content);
	gulp.watch(paths.images.svg, styles);
	gulp.watch(paths.styles.src, styles);
}

/*** BUILD ***/

const build = gulp.series(clean, gulp.parallel(content), gulp.parallel(styles));

export default build;
