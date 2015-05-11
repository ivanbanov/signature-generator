/*
 * DEFAULTS
 */
var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    browserSync = require('browser-sync'),
    paths = {
        src: {
            html: [
                'index.html',
                'templates/**/*.*'
            ],

            less: 'assets/src/less/*.less',
            css: 'assets/dist/css/*.css',

            js: 'assets/src/js/*.js',
            jsDist: 'assets/dist/js/*.js',
            jsDependencies: [
                'bower_components/jquery/dist/jquery.js',            // jquery
                'bower_components/html2canvas/build/html2canvas.js', // html2canvas
                'bower_components/mustache/mustache.js'              // mustache
            ]
        },
        dist: {
            js: 'assets/dist/js/',
            css: 'assets/dist/css/'
        }
    };

/*
 * CLEAN-UP
 */
gulp.task('clean', ['clean:script', 'clean:style']);

gulp.task('clean:script', function() {
    return gulp.src(paths.dist.js)
        .pipe($.clean({read: false}));
});

gulp.task('clean:style', function() {
    return gulp.src(paths.dist.css)
        .pipe($.clean({read: false}));
});

/*
 * JS
 */
 // dev
gulp.task('script:dev', ['clean:script'], function() {
    // compile dev script
    return gulp.src(paths.src.js)
        // use plumber to don't crash watch
        .pipe($.plumber())

        // lint
        .pipe($.jshint('.jshintrc'))
        .pipe($.jshint.reporter())
        .pipe($.jshint.reporter('fail'))

        // add dependencies
        .pipe($.addSrc(paths.src.jsDependencies))

        .pipe($.sourcemaps.init())
        .pipe($.concat('script.js'))
        .pipe($.sourcemaps.write('./map/'))
        .pipe(gulp.dest(paths.dist.js));
});

// prod
gulp.task('script', ['script:dev'], function() {
    // add dependencies
    gulp.src(paths.src.jsDist)
        .pipe($.clean())
        .pipe($.uglify())
        .pipe($.rename('script.min.js'))
        .pipe(gulp.dest(paths.dist.js));
});

/*
 * STYLE
 */
 // dev
gulp.task('style:dev', ['clean:style'], function() {
    return gulp.src(paths.src.less)
        // use plumber to don't crash watch
        .pipe($.plumber())
        .pipe($.sourcemaps.init())

        // filter only the main file to compile
        // it's necessary because the watch file
        .pipe($.filter('style.less'))

        // compile less
        .pipe($.less())
        .pipe($.sourcemaps.write('./map/'))
        .pipe(gulp.dest(paths.dist.css));
});

// prod
gulp.task('style', ['clean:style', 'style:dev'], function() {
    gulp.src(paths.src.css)
        .pipe($.clean())
        .pipe($.minifyCss({
            keepSpecialComments: 0
        }))
        .pipe($.rename('style.min.css'))
        .pipe(gulp.dest(paths.dist.css));
});

/*
 * SERVER
 */
gulp.task('server', ['build:dev'], function() {
    browserSync({
        open: false,
        server: {
            baseDir: "./"
        }
    });

    // browserSync.reload will reload all browsers after tasks are complete
    gulp.watch(paths.src.less, ['style:dev', browserSync.reload]);
    gulp.watch(paths.src.js, ['script:dev', browserSync.reload]);
    gulp.watch(paths.src.html, browserSync.reload);
});

/*
 * BUILD
 */
//dev
gulp.task('build:dev', ['clean', 'script:dev', 'style:dev']);

// prod
gulp.task('build', ['clean', 'script', 'style']);
gulp.task('default', ['build']);