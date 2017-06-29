'use strict';

var gulp = require('gulp');
var browserSync = require ('browser-sync');
var plugins = require("gulp-load-plugins")({
	pattern: ['gulp-*', 'gulp.*', 'main-bower-files'],
	replaceString: /\bgulp[\-.]/
});

gulp.task('moveSASS', function(){
	gulp.src(plugins.mainBowerFiles())
		.pipe (plugins.filter('.css'))
		.pipe(gulp.dest('scss/vendor'));
});
	
gulp.task('compileSASS', function(){
	return gulp.src('scss/main.scss')
		.pipe (plugins.sourcemaps.init())
		.pipe (plugins.sass())
		.pipe (plugins.sourcemaps.write('./'))
		.pipe (gulp.dest('css'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('concatJS', function(){
	return gulp.src(['js/*.js', '!js/functions.js'])
		.pipe (plugins.sourcemaps.init())
		.pipe (plugins.concat('functions.js'))
		.pipe (plugins.sourcemaps.write('./'))
		.pipe (gulp.dest('js'));
});

gulp.task('minifyJS', function(){
	return gulp.src('js/functions.js')
		.pipe (plugins.uglify())
		.pipe (plugins.rename('functions.min.js'))
		.pipe (gulp.dest('js'));
});

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

gulp.task('clean', function(){
	plugins.del(['dist', 'css/mainnpm.css*', 'js/app*.js*']);
});

gulp.task('lintSASS', function(){
	return gulp.src('scss/*.scss')
		.pipe (plugins.sassLint())
		.pipe (plugins.sassLint.format())
		.pipe (plugins.sassLintfailOnError());
});

gulp.task('lintPHP', function(){
	return gulp.src('*.php')
		.pipe (plugins.phplint());
});

gulp.task('lintJS',  function(){
	return gulp.src('js/*.js')
		.pipe (plugins.jshint())
		.pipe (plugins.jshint.reporter('default'));
});

gulp.task('build', function(){
	gulp.src('**/*.php')
		.pipe (gulp.dest('../jnrudge-dist'));
});

gulp.task('browserSync', function(){
	browserSync.init({
		proxy: 'localhost:8888/jnrudge'
	})
});

gulp.task('default', ['browserSync'], function(){
	gulp.watch('scss/**/*.scss', ['compileSASS']);
	gulp.watch('*.php').on('change', browserSync.reload);
	gulp.watch('js/**/*.js').on('change', browserSync.reload);
});
