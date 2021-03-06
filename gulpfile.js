// Gulp Files for Wordpress / PHP Sites
// See README.MD for required file structure and comands

'use strict';

// Settings
var mampUrl = "localhost:8888/rudge";
var siteName = "rudge";
var masterCssFile = "main"; // don't use style.css as this will clash with Wordpress
var masterJsFile = "functions";

var gulp = require('gulp');
var browserSync = require ('browser-sync');
var plugins = require("gulp-load-plugins")({
	pattern: ['gulp-*', 'gulp.*', 'main-bower-files'],
	replaceString: /\bgulp[\-.]/
});

// Grab CSS Files from Bower Components
gulp.task('vendorCSS', function(){
	return gulp.src(plugins.mainBowerFiles())
		.pipe (plugins.filter('**/*.css'))
		.pipe(gulp.dest('scss/vendor'));
});

gulp.task('vendorJS', function () {
	//console.log(plugins.mainBowerFiles());
	return gulp.src(plugins.mainBowerFiles())
		.pipe(plugins.filter('**/*.js'))
		.pipe(gulp.dest('js/vendor'));
});
	
// Compile SCSS files, master file must be called main.scss - Get's minified in the build process
gulp.task('compileSCSS', function(){
	return gulp.src('scss/' + masterCssFile + '.scss')
		.pipe (plugins.sourcemaps.init())
		.pipe (plugins.sass())
		.pipe (plugins.autoprefixer())
		.pipe (plugins.sourcemaps.write('./'))
		.pipe (gulp.dest('css'))
		.pipe (browserSync.reload({
			stream: true
		}));
});

// Combine JS files, master file will be called functions.js, make sure no files are called functions.js - Gets minified in the build process
gulp.task('concatJS', function(){
	return gulp.src(['js/modules/*.js', '!js/' + masterJsFile + '.js', 'js/vendor/*.js'])
		.pipe (plugins.sourcemaps.init())
		.pipe (plugins.concat(masterJsFile + '.js'))
		.pipe (plugins.sourcemaps.write('./'))
		.pipe (gulp.dest('js'))
		.pipe (browserSync.reload({
			stream: true
		}));
});

gulp.task('watch-js', ['concatJS'], function(done){
	browserSync().reload();
	done();
})

// Minify JS
gulp.task('minifyJS', function(){
	return gulp.src('js/' + masterJsFile + '.js')
		.pipe (plugins.uglify())
		.pipe (plugins.rename(masterJsFile + '.min.js'))
		.pipe (gulp.dest('js'));
});

// Minify CSS
gulp.task('minifyCSS', function(){
	return gulp.src('css/*.css')
		.pipe (plugins.sourcemaps.init())
		.pipe (plugins.cssnano())
		.pipe (plugins.sourcemaps.write('./'))
		.pipe (plugins.rename(function(path){gulp 
			path.basename += ".min";
		}))
		.pipe (gulp.dest('css'));
});

// Clean up Gulp created files - work in progress
gulp.task('clean', function(){
	plugins.del(['dist', 'css/mainnpm.css*', 'js/app*.js*']);
});

// Browser sync init
gulp.task('browserSync', function(){
	browserSync.init({
		proxy: mampUrl,
		open: false
	})
});

// Defaut 'main' task
gulp.task('default', ['browserSync'], function(){
	gulp.watch('scss/**/*.scss', ['compileSCSS']);
	gulp.watch('js/**/*.js', ['concatJS']);
	gulp.watch('*.php').on('change', browserSync.reload);
});
