'use strict';
let gulp = require('gulp');
let webpack = require('gulp-webpack');
let less = require('gulp-less');
let concat = require('gulp-concat');
let _watch = false;

gulp.task('watch', ['_setWatch', 'build']);

gulp.task('_setWatch', () => _watch = true);

gulp.task('build', ['index', 'fonts', 'less', 'js']);

gulp.task('js', () => {
	return gulp.src('client/app/initialize.js')
		.pipe(webpack({
			watch: _watch,
			module: {
				loaders: [{
					test: /\.jsx?$/,
					exclude: /(node_modules)/,
					loader: 'babel-loader',
					query: {
						presets: ['es2015', 'react', 'stage-0']
					}
				}]
			},
			output: {
				filename: 'app.js'
			},
			resolve: {
				extensions: ['', '.js', '.jsx']
			}
		}))
		.pipe(gulp.dest('server/public/js/'));
		_watch = false;
});

gulp.task('less', () => {
	return gulp.src([
			'node_modules/font-awesome/css/font-awesome.min.css',
			'client/app/**/*.less'
		])
		.pipe(less())
		.pipe(concat('app.css'))
		.pipe(gulp.dest('server/public/css/'));
});

gulp.task('index', () => {
	gulp.src('client/app/index.html')
		.pipe(gulp.dest('server/public/'));
});

gulp.task('fonts', () => {
	gulp.src('client/app/fonts/**.*')
		.pipe(gulp.dest('server/public/fonts/'));
});