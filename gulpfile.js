const gulp = require('gulp');
const dotenv = require('dotenv');

// Load environment variables from .env or .env.production
dotenv.config({ path: process.env.ENV === 'production' ? '.env.production' : '.env' });

// Import recipes
const styles = require('./gulp/recipes/styles');
const scripts = require('./gulp/recipes/scripts');
const html = require('./gulp/recipes/html');
const images = require('./gulp/recipes/images');
const {
    svg,
    sprite
} = require('./gulp/recipes/svg');
const {
    clean,
    fonts,
    serve,
    watchFiles
} = require('./gulp/recipes/utils');

// Register tasks
gulp.task('clean', clean);
gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('html', html);
gulp.task('images', images);
gulp.task('svg', svg);
gulp.task('sprite', sprite);
gulp.task('fonts', fonts);
gulp.task('serve', serve);
gulp.task('watchFiles', watchFiles);

// Composite tasks
gulp.task('watch', gulp.series('serve', 'watchFiles'));

// Default task - Development mode
gulp.task('default', gulp.series(
    'clean',
    gulp.parallel('styles', 'scripts', 'html', 'images', 'svg', 'sprite', 'fonts'),
    'watch'
));

// Build task - Production mode
gulp.task('build', gulp.series(
    'clean',
    gulp.parallel('styles', 'scripts', 'html', 'images', 'svg', 'sprite', 'fonts')
));
