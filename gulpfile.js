const gulp = require('gulp');
const babel = require('gulp-babel');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const uglify = require('gulp-uglify');
const plumber = require('gulp-plumber');
const named = require('vinyl-named');
const TerserPlugin = require('terser-webpack-plugin');
const nunjucksRender = require('gulp-nunjucks-render');
const htmlmin = require('gulp-htmlmin');
const del = require('del');
const browserSync = require('browser-sync').create();
const webpack = require('webpack-stream');
const path = require('path');
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
        .pipe(postcss(
            [
                autoprefixer({
                    overrideBrowserslist: [
                        '> 0.1%, last 10 versions',
                        'ie >= 11',
                        'IOS >= 7'
                    ]
                }),
                cssnano({
                    preset: [
                        'default',
                        {
                            discardComments: { removeAll: true }
                        }
                    ]
                })]
        ))
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(browserSync.stream());
});

// Compile and minify JS with Babel and Webpack
gulp.task('scripts', function () {
    return gulp.src('src/js/*.js')
        .pipe(plumber())
        .pipe(named())
        .pipe(babel({ presets: ['@babel/env'] }))
        .pipe(webpack({
            mode: 'production',
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
                    new TerserPlugin({
                        terserOptions: {
                            format: {
                                comments: false, // Disable comments extraction
                            },
                        },
                        extractComments: false, // Prevent the creation of .LICENSE files
                    }),
                ],
            },
        }))
        .pipe(gulp.dest('dist/assets/js'))
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
        .pipe(plumber())
        .pipe(
            squoosh(({ width, height, size, filePath }) => {
                let options = {
                    encodeOptions: { mozjpeg: {} }
                };

                if (path.extname(filePath) === '.jpg') {
                    options = {
                        encodeOptions: {
                            webp: {},
                            mozjpeg: {},
                        },
                    };
                }

                if (path.extname(filePath) === '.png') {
                    options = {
                        encodeOptions: {
                            oxipng: {},
                        },
                        preprocessOptions: {
                            quant: {
                                enabled: true,
                                numColors: 16,
                            },
                        },
                    };
                }

                return options;
            })
        )
        .pipe(gulp.dest('dist/assets/images'));
});

// Optimize and create SVGs
gulp.task('svg', function () {
    return gulp.src('src/svg/**/*.svg')
        .pipe(plumber())
        .pipe(svgmin({
            multipass: true,
            full: true,
            plugins: [
                {
                    name: 'cleanupIDs',
                    active: false
                },
                {
                    name: 'removeXMLProcInst',
                },
                {
                    name: 'removeXMLNS',
                },
                {
                    name: 'inlineStyles',
                    param: {
                        onlyMatchedOnce: true
                    }
                },
                {
                    name: 'removeAttrs',
                    params: {
                        attrs: 'fill'
                    }
                }
            ]
        }))
        .pipe(gulp.dest('dist/assets/svg'))
        .pipe(browserSync.stream());
});

// Optimize and create SVG sprite
gulp.task('sprite', function () {
    return gulp.src('src/svg/icons/**/*.svg')
        .pipe(plumber())
        .pipe(svgSprite({
            shape: {
                id: {
                    generator: 'icon-%s'
                },
                dimension: { // Set maximum dimensions
                    maxWidth: 32,
                    maxHeight: 32
                },
            },
            mode: {
                symbol: {
                    inline: true,
                    sprite: "../sprite.svg"
                }
            }
        }))
        .pipe(gulp.dest('dist/assets/svg'))
        .pipe(browserSync.stream());
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
    gulp.watch('src/svg/icons/**/*.svg', gulp.series('sprite'));
});

// Default task
gulp.task('default', gulp.series('clean', 'styles', 'scripts', 'html', 'images', 'svg', 'sprite', 'watch'));

// Build task for production
gulp.task('build', gulp.series('clean', 'styles', 'scripts', 'html', 'images', 'svg', 'sprite'));
