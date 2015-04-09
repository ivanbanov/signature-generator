/*
 * DEFAULTS
 */
var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    browserSync = require('browser-sync'),
    paths = {
        src: {
            js: 'assets/src/js/*.js',
            jsDependencies: [
                'bower_components/jquery/dist/jquery.js',           // jquery
                'bower_components/html2canvas/build/html2canvas.js', // html2canvas
                'bower_components/mustache/mustache.js' // mustache
            ],
            less: 'assets/src/less/*.less',
            css: 'assets/dist/css/style.css',
            html: 'index.html'
        },
        dist: {
            js: 'assets/dist/js/',
            css: 'assets/dist/css/'
        }
    };

/*
 * JS
 */
gulp.task('script', function() {
    gulp.src(paths.src.js)
        // use plumber to don't crash watch
        .pipe($.plumber())

        // lint
        .pipe($.jshint('.jshintrc'))
        .pipe($.jshint.reporter())
        .pipe($.jshint.reporter('fail'))
        .pipe($.concat('email-signature.min.js'))
        .pipe($.uglify())
        .pipe(gulp.dest(paths.dist.js))

        // add and concat all dependencies
        .pipe($.addSrc(paths.src.jsDependencies))
        .pipe($.sourcemaps.init())
        .pipe($.concat('script.min.js'))

        // minify
        .pipe($.uglify())

        // build
        .pipe($.sourcemaps.write('./map'))
        .pipe(gulp.dest(paths.dist.js))
});

/*
 * STYLE
 */
gulp.task('style', function() {
    gulp.src(paths.src.less)
        // use plumber to don't crash watch
        .pipe($.plumber())
        .pipe($.sourcemaps.init())

        // filter only the main file to compile
        // it's necessary because the watch file
        .pipe($.filter('style.less'))

        // compile less
        .pipe($.less())

        // minify
        .pipe($.minifyCss({
            keepSpecialComments: 0
        }))
        .pipe($.rename('style.min.css'))

        // build
        .pipe($.sourcemaps.write('./map'))
        .pipe(gulp.dest(paths.dist.css));
});

/*
 * SERVER
 */
gulp.task('server', function() {
    browserSync({
        open: false,
        server: {
            baseDir: "./"
        }
    });

    // browserSync.reload will reload all browsers after tasks are complete
    gulp.watch(paths.src.less, ['style', browserSync.reload]);
    gulp.watch(paths.src.js, ['script', browserSync.reload]);
    gulp.watch(paths.src.html, browserSync.reload);
});

/*
 * BUILD
 */
gulp.task('build', ['script', 'style']);