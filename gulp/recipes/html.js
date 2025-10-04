const gulp = require('gulp');
const nunjucksRender = require('gulp-nunjucks-render');
const htmlmin = require('gulp-htmlmin');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const browserSync = require('browser-sync');

const config = require('../config');

// Process HTML templates with Nunjucks and minify
function html() {
    const {
        options,
        patterns,
        dest
    } = config;

    return gulp.src(patterns.pages)
        .pipe(plumber({
            errorHandler: notify.onError({
                title: 'HTML Template Error',
                message: '<%= error.message %>'
            })
        }))
        .pipe(nunjucksRender(options.nunjucks))
        .pipe(options.isProd ? htmlmin(options.htmlmin) : require('stream')
            .PassThrough({ objectMode: true }))
        .pipe(gulp.dest(dest.root))
        .pipe(browserSync.stream());
}

module.exports = html;
