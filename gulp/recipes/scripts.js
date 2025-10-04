const gulp = require('gulp');
const babel = require('gulp-babel');
const webpack = require('webpack-stream');
const named = require('vinyl-named');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const browserSync = require('browser-sync');
const TerserPlugin = require('terser-webpack-plugin');

const config = require('../config');

// Compile and minify JS with Babel and Webpack
function scripts() {
    const {
        options,
        patterns,
        dest
    } = config;

    return gulp.src(patterns.js)
        .pipe(plumber({
            errorHandler: notify.onError({
                title: 'JavaScript Compilation Error',
                message: '<%= error.message %>'
            })
        }))
        .pipe(named())
        .pipe(babel({ presets: ['@babel/env'] }))
        .pipe(webpack({
            mode: options.isProd ? 'production' : 'development',
            devtool: options.isDev ? 'inline-source-map' : false,
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        loader: 'babel-loader',
                    },
                ],
            },
            plugins: [
                new (require('webpack')).DefinePlugin({
                    'process.env.ENV': JSON.stringify(process.env.ENV),
                    'process.env.URL': JSON.stringify(process.env.URL),
                }),
            ],
            optimization: {
                minimize: options.isProd,
                minimizer: options.isProd ? [
                    new TerserPlugin({
                        terserOptions: {
                            format: { comments: false },
                        },
                        extractComments: false,
                    }),
                ] : [],
            },
        }))
        .pipe(gulp.dest(dest.js))
        .pipe(browserSync.stream());
}

module.exports = scripts;
