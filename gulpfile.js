'use strict';

var gulp = require('gulp');
var util = require('gulp-util');
var del = require('del');
var runSequence = require('run-sequence');
var $ = require('gulp-load-plugins')();

function onError(err) {
    util.log(util.colors.red(err.message));
}


gulp.task('copy-html', function () {
    util.log(util.colors.bgGreen.bold('Copy'));

    return gulp.src([
        './src/**/*.html'
        ])
        .pipe($.plumber({
            errorHandler: onError
        }))
        .pipe(gulp.dest('dev/'))
        .pipe($.size({title: 'Copy HTML'}));
});

gulp.task('copy-js', function () {
    util.log(util.colors.bgGreen.bold('Copy JS'));

    return gulp.src([
        './src/js/vendor/modernizr.js',
        './src/js/vendor/jquery.js'
    ])
        .pipe($.plumber({
            errorHandler: onError
        }))
        .pipe(gulp.dest('dev/js/'))
        .pipe($.size({title: 'Copy JS'}));
});


gulp.task('styles-libs', function () {
    util.log(util.colors.bgGreen.bold('Compiling Libs'));

    return gulp.src([
        './src/scss/libs/normalize.scss',
        './src/scss/libs/foundation.scss'
        ])
        .pipe($.plumber({
            errorHandler: onError
        }))
        .pipe($.sourcemaps.init())
        .pipe($.sass({
            style: 'expanded',
            sourceComments: 'normal'
        }))
        .pipe($.autoprefixer({
            browsers: [
                'ie >= 9',
                'ie_mob >= 9',
                'chrome >= 39',
                'and_chr >= 39',
                'safari >= 6.1',
                'ff >= 34',
                'ios >= 6.1',
                'android >= 4'
            ]
        }))
        .pipe($.minifyCss())
        .pipe($.concat('libs.css'))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('dev/css'));
});

gulp.task('styles', ['styles-libs'], function () {
    util.log(util.colors.bgGreen.bold('Compiling SASS --> CSS'));

    return gulp.src([
        './src/scss/custom/**/*.scss'
        ], { base: './src/' })
        .pipe($.plumber({
            errorHandler: onError
        }))
        .pipe($.sourcemaps.init())
        .pipe($.sass({
            style: 'expanded',
            sourceComments: 'normal'
        }))
        .pipe($.autoprefixer({
            browsers: [
                'ie >= 9',
                'ie_mob >= 9',
                'chrome >= 39',
                'and_chr >= 39',
                'safari >= 6.1',
                'ff >= 34',
                'ios >= 6.1',
                'android >= 4'
            ]
        }))
        .pipe($.concat('style.css'))
        .pipe($.minifyCss())
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('dev/css'));
});

gulp.task('scripts-libs', function () {
    util.log(util.colors.bgGreen.bold('Concatenate & minify vendor JavaScript'));

    return gulp.src([

        './src/js/vendor/foundation/foundation.js',
        './src/js/vendor/foundation/foundation.dropdown.js',
        './src/js/vendor/foundation/foundation.topbar.js',

        './node_modules/underscore/underscore.js',
        './node_modules/backbone/backbone.js',



        ], { base: './dev' })
        .pipe($.plumber({
            errorHandler: onError
        }))
        .pipe($.sourcemaps.init())
        .pipe($.concat('vendor.js'))
        //.pipe($.uglify({
        //    mangle: true,
        //    compress: {
        //        sequences: true,
        //        dead_code: true,
        //        conditionals: true,
        //        booleans: true,
        //        unused: true,
        //        if_return: true,
        //        join_vars: true
        //    }
        //}).on('error', util.log))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('dev/js'))
        .pipe($.size({title: 'Library Scripts'}));
});

gulp.task('scripts', ['jshint'], function () {
    util.log(util.colors.bgGreen.bold('Concatenate & minify JavaScript'));

    return gulp.src([
        './src/js//helpers/globals.js',
        './src/js/helpers/utils.js',
        './src/js/custom/**/*.js',
        './src/js/helpers/loader.js'
        ], { base: './dev' })
        .pipe($.plumber({
            errorHandler: onError
        }))
        .pipe($.sourcemaps.init())
        .pipe($.concat('script.js'))
        // .pipe($.uglify({
        //     preserveComments: 'some',
        //     mangle: false,
        //     compress: {
        //         sequences: true,
        //         dead_code: true,
        //         conditionals: true,
        //         booleans: true,
        //         unused: false,
        //         if_return: true,
        //         join_vars: true,
        //         drop_debugger: false,
        //         drop_console: false
        //     }
        // }).on('error', util.log))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('dev/js'))
        .pipe($.size({title: 'scripts'}))
        //.pipe($.notify({
        //    title: 'Script Police',
        //    message: 'JSHint & JSCS passed. Let it fly!',
        //    sound: 'Hero'
        //}));
});

gulp.task('jshint', function () {
    util.log(util.colors.bgGreen.bold('Listing our source code'));

    return gulp.src([
        './src/js/helpers/**/*.js',
        './src/js/custom/**/*.js'
        ])
        .pipe($.plumber({
            errorHandler: onError
        }))
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        //.pipe($.notify(function (file) {
        //    if (!file.jshint) {
        //        return;
        //    }
        //    return file.jshint.success ? false : {
        //        title: 'JSHint is not happy!',
        //        message: 'Check your terminal console',
        //        sound: 'Funk'
        //    }
        //}))
        .pipe($.jshint.reporter('fail'));
});

gulp.task('development', function (cb) {
    runSequence(['copy-html', 'copy-js', 'scripts-libs', 'scripts', 'styles'], cb)
});

gulp.task('build', function (cb) {
    runSequence(['copy-html', 'copy-js', 'scripts-libs', 'scripts', 'styles'], cb)
});

gulp.task('watch', ['development'], function () {
    util.log(util.colors.bgGreen.bold('Gulp is now watching for changes!'));

    gulp.watch('./src/**/*.html', ['copy-html']);
    gulp.watch('./src/**/*.scss', ['styles']);
    gulp.watch('./src/foundation/**/*.scss', ['styles']);
    gulp.watch('./src/**/*.js', ['scripts']);
});

gulp.task('default', ['watch']);