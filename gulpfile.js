const gulp = require('gulp');
const babel = require('gulp-babel');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const uglify = require('gulp-uglify');
const plumber = require('gulp-plumber');
const nunjucksRender = require('gulp-nunjucks-render');
const htmlmin = require('gulp-htmlmin');
const del = require('del');
const browserSync = require('browser-sync').create();
const webpack = require('webpack-stream');
const squoosh = require('gulp-squoosh');
const svgmin = require('gulp-svgmin');
const svgSprite = require('gulp-svg-sprite');

// TODO: asset paths

// Clean dist directory
gulp.task('clean', function () {
    return del(['dist']);
});

// Compile SCSS to CSS with autoprefixing and minification
gulp.task('styles', function () {
    return gulp.src('src/scss/**/*.scss')
        .pipe(plumber())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream());
});

// Compile and minify JS with Babel and Webpack
gulp.task('scripts', function () {
    return gulp.src('src/js/main.js')
        .pipe(plumber())
        .pipe(babel({ presets: ['@babel/env'] }))
        .pipe(webpack({
            mode: 'production',
            output: {
                filename: 'bundle.js',
            },
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        loader: 'babel-loader',
                    },
                ],
            },
            optimization: {
                minimizer: [
                    new (require('terser-webpack-plugin'))(),
                ],
            },
        }))
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.stream());
});

// Minify HTML
gulp.task('html', function () {
    return gulp.src('src/pages/**/*.html')
        .pipe(nunjucksRender({ path: ['src/layout/'] }))
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream());
});

// Optimize images
gulp.task('images', function () {
    return gulp.src('src/images/**/*')
        // TODO: output formats
        .pipe(squoosh())
        .pipe(gulp.dest('dist/images'));
});

// Optimize and create SVG sprites
gulp.task('svg', function () {
    return gulp.src('src/svg/**/*.svg')
        .pipe(svgmin())
        // TODO: fix output
        .pipe(svgSprite({ mode: { symbol: true } }))
        .pipe(gulp.dest('dist/svg'));
});

// Watch files for changes
gulp.task('watch', function () {
    browserSync.init({
        server: { baseDir: './dist' }
    });
    gulp.watch('src/scss/**/*.scss', gulp.series('styles'));
    gulp.watch('src/js/**/*.js', gulp.series('scripts'));
    gulp.watch('src/pages/**/*.html', gulp.series('html'));
    gulp.watch('src/images/**/*', gulp.series('images'));
    gulp.watch('src/svg/**/*.svg', gulp.series('svg'));
});

// Default task
gulp.task('default', gulp.series('clean', 'styles', 'scripts', 'html', 'images', 'svg', 'watch'));

// Build task for production
gulp.task('build', gulp.series('clean', 'styles', 'scripts', 'html', 'images', 'svg'));
