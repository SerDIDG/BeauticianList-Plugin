import gulp from 'gulp';
import del from 'del';
import sass from 'gulp-sass';
import cleanCSS from 'gulp-clean-css';
import concat from 'gulp-concat';
import rename from 'gulp-rename';

const paths = {
	src: 'src',
	dest: 'dist',
	styles: {
		src: [
			'src/scss/variables.scss',
			'src/scss/common.scss',
			'src/scss/**/*.scss',
		],
		dest: 'dist/css/'
	},
	content: {
		src: 'src/*.html',
		dest: 'dist/'
	}
};

/*** CLEAN ***/

export function clean() {
	return del([paths.dest]);
}

/*** STYLES ***/

export function styles() {
	return gulp.src(paths.styles.src)
		.pipe(sass())
		.pipe(concat('index.css'))
		.pipe(gulp.dest(paths.styles.dest))
		.pipe(cleanCSS())
		.pipe(rename({
			basename: 'index',
			suffix: '.min'
		}))
		.pipe(gulp.dest(paths.styles.dest));
}

/*** CONTENT ***/

export function content() {
	return gulp.src(paths.content.src)
		.pipe(gulp.dest(paths.content.dest));
}

/*** WATCHERS ***/

export function watch() {
	gulp.watch(paths.content.src, content);
	gulp.watch(paths.styles.src, styles);
}

/*** BUILD ***/

const build = gulp.series(clean, gulp.parallel(content), gulp.parallel(styles));

export default build;
