'use strict';
let gulp = require('gulp');
let webpack = require('gulp-webpack');
let less = require('gulp-less');
let concat = require('gulp-concat');
let rename = require('gulp-rename');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let _watch = false;

// Set _watch to true before running the js task so it will "watch"
gulp.task('watch', ['_setWatch', 'webpack', '_unsetWatch']);

gulp.task('_setWatch', () => _watch = true);

gulp.task('_unsetWatch', () => _watch = false);

gulp.task('build', ['index', 'fonts', 'vendorCss', 'webpack']);

gulp.task('webpack', () => {
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
				}, {
					test: /\.less$/,
					exclude: /(node_modules)/,
					loader: ExtractTextPlugin.extract(
						// activate source maps via loader query
						'css-loader?sourceMap!less-loader?sourceMap'
					)
				}]
			},
			plugins: [
				// extract inline css into separate 'styles.css'
				new ExtractTextPlugin('css/app.css')
			],
			output: {
				filename: 'js/app.js'
			},
			resolve: {
				extensions: ['', '.js', '.jsx']
			}
		}))
		.pipe(gulp.dest('server/public/'));
});

gulp.task('vendorCss', () => {
	return gulp.src('node_modules/font-awesome/css/font-awesome.min.css')
		.pipe(rename('vendor.css'))
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