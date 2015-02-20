// Load plugins
var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    browserSync = require('browser-sync'),
    paths = {
        src: {
            js: [
                'src/js/*.js'
            ],
            less: 'src/less/*.less',
            css: 'dist/css/*.css'
        },
        dist: {
            js: 'dist/js/',
            css: 'dist/css/'
        }
    };

gulp.task('js', function() {
    gulp.src(paths.src.js)
        // use plumber to don't crash watch
        .pipe($.plumber())

        // lint
        .pipe($.jshint('.jshintrc'))
        .pipe($.jshint.reporter())
        .pipe($.jshint.reporter('fail'))

        // minify
        .pipe($.uglify())
        .pipe($.rename('signature-generator.min.js'))
        .pipe(gulp.dest(paths.dist.js));
});

gulp.task('less', function() {
    gulp.src(paths.src.less)
        // use plumber to don't crash watch
        .pipe($.plumber())

        // compile less
        .pipe($.less())

        // minify
        .pipe($.minifyCss())
        .pipe($.rename('style.min.css'))
        .pipe(gulp.dest(paths.dist.css));
});

gulp.task('watch', function() {
    browserSync({
        open: false,
        server: {
            baseDir: "./"
        }
    });

    // browserSync.reload will reload all browsers after tasks are complete
    gulp.watch(paths.src.less, ['less', browserSync.reload]);
    gulp.watch(paths.src.js, ['js', browserSync.reload]);
});