# **Static Site Generator Boilerplate**

This project is a boilerplate for creating static websites using Gulp 4. It includes tools like Babel, SASS, Webpack, Autoprefixer, Nunjucks templating, jQuery, and more. This setup is designed to streamline development and ensure a smooth build process for modern static websites.

## **Features**

- **Gulp 4:** Task automation for building, watching, and serving files.
- **Babel:** Transpiling ES6+ JavaScript for broader browser compatibility.
- **SASS:** Preprocessing CSS with support for variables, nesting, and more.
- **Webpack:** Bundling JavaScript files and handling modules.
- **Autoprefixer:** Automatically adding vendor prefixes for cross-browser compatibility.
- **Nunjucks:** Templating engine for generating HTML files.
- **jQuery:** Simplifying DOM manipulation and event handling.
- **BrowserSync:** Live-reloading and synchronizing browser testing.
- **PostCSS & CSSNano:** Post-processing and minifying CSS for optimized delivery.
- **SVG Compression & Sprite Generation:** Managing and optimizing SVG assets.
- **Environment Variables:** Easily switch between development and production configurations.

## **Installation**

1. **Clone the repository:**

   ```bash
   git clone https://github.com/danielsjirgensons/gulp-static-boilerplate
   cd your-repo-name
   ```

2. **Install dependencies:**

   Make sure you have Node.js installed, then run:

   ```bash
   npm install
   ```

3. **Environment Setup:**

   Create `.env` and `.env.production` files in the root of your project and add your environment variables.

   Example:

   ```
   URL=https://yourwebsite.com
   ```

## **Usage**

### **Development**

To start the development server with live-reloading:

```bash
gulp
```

This will:

- Watch for changes in your files.
- Compile SASS to CSS.
- Transpile ES6+ JavaScript.
- Serve the site with BrowserSync.

### **Build**

To build the project for production:

```bash
gulp build
```

This will:

- Minify JavaScript and CSS.
- Compress images and SVGs.
- Generate a production-ready `dist` folder.

## **File Structure**

```
├── src/
│   ├── js/
│   │   └── main.js
│   ├── sass/
│   │   └── styles.scss
│   ├── templates/
│   │   └── index.njk
│   ├── images/
│   └── svg/
├── dist/
│   └── (Generated files will be placed here)
├── gulpfile.js
├── package.json
├── .env
├── .env.production
└── README.md
```

- **`src/`**: Contains your source files.
- **`dist/`**: The output directory for the build process.
- **`gulpfile.js`**: Gulp configuration file.

## **Dependencies**

- Gulp 4
- Babel
- Webpack
- SASS
- Nunjucks
- BrowserSync
- Autoprefixer
- CSSNano
- jQuery
- PostCSS
- SVGMin
- And more...

## **Contributing**

Feel free to submit issues or pull requests if you find any bugs or improvements.

## **Contact**

For any inquiries or suggestions, reach out to dev@prof-designs.lv