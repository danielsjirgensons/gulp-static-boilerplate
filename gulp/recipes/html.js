const gulp = require('gulp');
const nunjucksRender = require('gulp-nunjucks-render');
const htmlmin = require('gulp-htmlmin');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const browserSync = require('browser-sync');
const data = require('gulp-data');
const fs = require('fs');
const path = require('path');

const config = require('../config');

// Process HTML templates with Nunjucks and minify
function html() {
    const { options, patterns, dest, src } = config;

    return gulp.src(patterns.pages)
        .pipe(plumber({
            errorHandler: notify.onError({
                title: 'HTML Template Error',
                message: '<%= error.message %>'
            })
        }))
        .pipe(data(function() {
            const dataDir = src.data;
            let templateData = {};

            // Check if data directory exists
            if (fs.existsSync(dataDir)) {
                // Read all JSON files in the directory
                fs.readdirSync(dataDir).forEach(file => {
                    if (path.extname(file) === '.json') {
                        try {
                            const fileName = path.basename(file, '.json'); // Get filename without extension
                            const filePath = path.join(dataDir, file);
                            templateData[fileName] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                        } catch (error) {
                            console.warn(`Warning: Could not parse JSON file ${file}:`, error.message);
                        }
                    }
                });
            }

            return templateData; // Return all data, keyed by filename
        }))
        .pipe(nunjucksRender(options.nunjucks))
        .pipe(options.isProd ? htmlmin(options.htmlmin) : require('stream').PassThrough({ objectMode: true }))
        .pipe(gulp.dest(dest.root))
        .pipe(browserSync.stream());
}

module.exports = html;
