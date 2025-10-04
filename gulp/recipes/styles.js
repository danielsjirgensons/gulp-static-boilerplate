const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const browserSync = require('browser-sync');

const config = require('../config');

// Compile SCSS to CSS with autoprefixing and minification
function styles() {
    const {
        options,
        patterns,
        dest
    } = config;

    return gulp.src(patterns.scss)
        .pipe(plumber({
            errorHandler: notify.onError({
                title: 'SCSS Compilation Error',
                message: '<%= error.message %>'
            })
        }))
        .pipe(options.isDev ? sourcemaps.init() : require('stream')
            .PassThrough({ objectMode: true }))
        .pipe(sass(options.scss)
            .on('error', sass.logError))
        .pipe(postcss([
            autoprefixer(options.autoprefixer),
            ...(options.isProd ? [cssnano(options.cssnano)] : [])
        ]))
        .pipe(options.isDev ? sourcemaps.write('.') : require('stream')
            .PassThrough({ objectMode: true }))
        .pipe(gulp.dest(dest.css))
        .pipe(browserSync.stream());
}

module.exports = styles;
