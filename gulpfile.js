const { src, dest, parallel, series, watch } = require('gulp');

const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const svgstore = require('gulp-svgstore');
const svgmin = require('gulp-svgmin');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');

const files = {
  scssPath: 'scss/**/*.scss',
  jsPath: '',
  htmlPath: './index.html',
  images: {
    svg: 'images/icons/*.svg',
    pic: '',
  }
}
function browsersync() {
  browserSync.init({
    server: {
      baseDir: '.',
      serveStaticOptions: {
        extensions: ['html'],
      },
    },
    port: 8080,
    browser: 'chrome',
    ui: { port: 8081 },
    open: true,
  })
}
function styles() {
  return src(files.scssPath)
  .pipe(sass().on('error', sass.logError))
  .pipe(
    autoprefixer({
      overrideBrowserlist: ["last 5 versions"],
      cascade: true,
  }))
  .pipe(dest('styles/'))
  .pipe(browserSync.stream())
}
function watch_dev() {
  watch(files.scssPath, styles).on(
    'change',
    browserSync.reload
  );
  watch(files.htmlPath).on(
    'change',
    browserSync.reload
  );

}
function sprite() {
  return src(files.images.svg)
    .pipe(svgmin())
    .pipe(svgstore({
        inlineSvg: true,
    }))
    .pipe(rename('sprite.svg'))
    .pipe(dest('images'));
}
function image_min() {
  return src('images/**/*.{jpg, png}')
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true})
    ]))
    .pipe(dest('images'));
}
exports.default = parallel(
  styles,
  browsersync,
  watch_dev,
  );
exports.svg = sprite;
exports.imgmin = image_min;
