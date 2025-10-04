const gulp = require('gulp');
const svgmin = require('gulp-svgmin');
const svgSprite = require('gulp-svg-sprite');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const browserSync = require('browser-sync');

const config = require('../config');

// Optimize SVG files
function svg() {
    const {
        options,
        patterns,
        dest
    } = config;

    return gulp.src(patterns.svg)
        .pipe(plumber({
            errorHandler: notify.onError({
                title: 'SVG Optimization Error',
                message: '<%= error.message %>'
            })
        }))
        .pipe(svgmin(options.svg.svgmin))
        .pipe(gulp.dest(dest.svg))
        .pipe(browserSync.stream());
}

// Create SVG sprite from icons
function sprite() {
    const {
        options,
        patterns,
        dest
    } = config;

    return gulp.src(patterns.svgIcons)
        .pipe(plumber({
            errorHandler: notify.onError({
                title: 'SVG Sprite Error',
                message: '<%= error.message %>'
            })
        }))
        .pipe(svgSprite(options.svg.sprite))
        .pipe(gulp.dest(dest.svg))
        .pipe(browserSync.stream());
}

module.exports = {
    svg,
    sprite
};
