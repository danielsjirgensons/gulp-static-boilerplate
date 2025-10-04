const gulp = require('gulp');
const del = require('del');
const browserSync = require('browser-sync');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');

const config = require('../config');

// Clean dist directory
function clean() {
    return del([config.dest.root]);
}

// Copy fonts to destination
function fonts() {
    const {
        patterns,
        dest
    } = config;

    return gulp.src(patterns.fonts, { encoding: false })
        .pipe(plumber({
            errorHandler: notify.onError({
                title: 'Font Copy Error',
                message: '<%= error.message %>'
            })
        }))
        .pipe(gulp.dest(dest.fonts))
        .pipe(browserSync.stream());
}

// Initialize BrowserSync and watch files for changes
function serve(done) {
    const { options } = config;

    browserSync.init(options.browserSync);
    done();
}

// Watch files for changes
function watchFiles() {
    const { watch } = config;

    gulp.watch(watch.scss, gulp.series('styles'));
    gulp.watch(watch.js, gulp.series('scripts'));
    gulp.watch([watch.pages, watch.layouts], gulp.series('html'));
    gulp.watch(watch.images, gulp.series('images'));
    gulp.watch(watch.svg, gulp.series('svg'));
    gulp.watch(watch.svgIcons, gulp.series('sprite'));
    gulp.watch(watch.fonts, gulp.series('fonts'));
}

module.exports = {
    clean,
    fonts,
    serve,
    watchFiles
};
