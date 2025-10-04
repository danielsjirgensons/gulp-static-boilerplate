const path = require('path');

// Base paths
const basePaths = {
    src: 'src',
    dist: 'dist',
    assets: 'assets'
};

// Source paths
const src = {
    root: basePaths.src,
    scss: path.join(basePaths.src, 'scss'),
    js: path.join(basePaths.src, 'js'),
    images: path.join(basePaths.src, 'images'),
    svg: path.join(basePaths.src, 'svg'),
    svgIcons: path.join(basePaths.src, 'svg', 'icons'),
    fonts: path.join(basePaths.src, 'fonts'),
    pages: path.join(basePaths.src, 'pages'),
    layouts: path.join(basePaths.src, 'layout'),
    data: path.join(basePaths.src, 'data')
};

// Destination paths
const dest = {
    root: basePaths.dist,
    css: path.join(basePaths.dist, basePaths.assets, 'css'),
    js: path.join(basePaths.dist, basePaths.assets, 'js'),
    images: path.join(basePaths.dist, basePaths.assets, 'images'),
    svg: path.join(basePaths.dist, basePaths.assets, 'svg'),
    fonts: path.join(basePaths.dist, basePaths.assets, 'fonts')
};

// Watch paths
const watch = {
    scss: path.join(src.scss, '**', '*.scss'),
    js: path.join(src.js, '**', '*.js'),
    images: path.join(src.images, '**', '*'),
    svg: path.join(src.svg, '**', '*.svg'),
    svgIcons: path.join(src.svgIcons, '**', '*.svg'),
    pages: path.join(src.pages, '**', '*.html'),
    layouts: path.join(src.layouts, '**', '*.html'),
    fonts: path.join(src.fonts, '**', '*.{eot,otf,ttf,woff,woff2,svg}'),
    data: path.join(src.data, '**', '*.json')
};

// File patterns
const patterns = {
    scss: path.join(src.scss, '**', '*.scss'),
    js: path.join(src.js, '*.js'), // Only root level JS files
    images: path.join(src.images, '**', '*'),
    svg: path.join(src.svg, '**', '*.svg'),
    svgIcons: path.join(src.svgIcons, '**', '*.svg'),
    pages: path.join(src.pages, '**', '*.html'),
    fonts: path.join(src.fonts, '**', '*.{eot,otf,ttf,woff,woff2,svg}')
};

// Build options
const options = {
    // Environment
    isDev: process.env.ENV !== 'production',
    isProd: process.env.ENV === 'production',

    // SCSS options
    scss: {
        outputStyle: 'expanded',
        includePaths: ['node_modules']
    },

    // Autoprefixer options
    autoprefixer: {
        overrideBrowserslist: [
            '> 1%',
            'last 2 versions',
            'not dead',
            'not ie <= 11'
        ]
    },

    // CSSnano options
    cssnano: {
        preset: [
            'default',
            {
                discardComments: { removeAll: true }
            }
        ]
    },

    // Image optimization options
    images: {
        sharp: {
            // JPEGs > JPEG + WebP
            jpg_to_jpg: {
                quality: 90,
                mozjpeg: true
            },
            webp: {
                quality: 80,
                alsoProcessOriginal: true
            },
            // PNGs > PNG + WebP
            png_to_png: {
                compressionLevel: 9,
                adaptiveFiltering: true
            },
            // AVIF output
            avif: {
                quality: 90
            }
        }
    },

    // SVG optimization options
    svg: {
        svgmin: {
            multipass: true,
            full: true,
            plugins: [
                {
                    name: 'cleanupIDs',
                    active: false
                },
                { name: 'removeXMLProcInst' },
                { name: 'removeXMLNS' },
                {
                    name: 'inlineStyles',
                    param: { onlyMatchedOnce: true }
                },
                {
                    name: 'removeAttrs',
                    params: { attrs: 'fill' }
                }
            ]
        },
        sprite: {
            shape: {
                id: { generator: 'icon-%s' },
                dimension: {
                    maxWidth: 32,
                    maxHeight: 32
                }
            },
            mode: {
                symbol: {
                    inline: true,
                    sprite: '../sprite.svg'
                }
            }
        }
    },

    // HTML minification options
    htmlmin: {
        collapseWhitespace: true,
        removeComments: true
    },

    // BrowserSync options
    browserSync: {
        server: { baseDir: dest.root },
        open: false,
        notify: false
    },

    // Nunjucks options
    nunjucks: {
        path: [src.layouts],
        data: {
            ENV: process.env.ENV,
            URL: process.env.URL,
            VERSION: Date.now()
        }
    }
};

module.exports = {
    src,
    dest,
    watch,
    patterns,
    options
};
