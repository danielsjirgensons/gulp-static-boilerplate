const gulp = require('gulp');
const sharpOptimizeImages = require('gulp-sharp-optimize-images').default;
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');

const config = require('../config');

// Optimize images with Sharp
function images() {
    const {
        options,
        patterns,
        dest
    } = config;

    return gulp.src(patterns.images)
        .pipe(plumber({
            errorHandler: notify.onError({
                title: 'Image Optimization Error',
                message: '<%= error.message %>'
            })
        }))
        .pipe(sharpOptimizeImages(options.images.sharp))
        .pipe(gulp.dest(dest.images));
}

module.exports = images;
