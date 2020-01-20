const gulp = require('gulp');
const connect = require('gulp-connect');
const del = require('del');

const scriptsPath = './scripts/**/*.js';
const entryScriptPath = './scripts/index.js';

// Preprocess script files
gulp.task('scripts', ['clean:scripts'], async () => {
  const rollup = require('rollup');
  const config = require('./rollup.config');

  const bundle = await rollup.rollup(config);
  await bundle.write(config.output);

  gulp.src(scriptsPath)
    .pipe(connect.reload());
});

const stylesPath = './styles/**/*.scss';

// Preprocess style files
gulp.task('styles', ['clean:styles'], async () => {
  const sourcemaps = require('gulp-sourcemaps');
  const sass = require('gulp-sass');
  const postcss = require('gulp-postcss');
  const fontVariantPlugin = require('postcss-font-variant');
  const importPlugin = require('postcss-import');
  const cssnanoPlugin = require('cssnano');
  const autoprefixerPlugin = require('autoprefixer');

  return gulp.src(stylesPath)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      importPlugin(),
      cssnanoPlugin(),
      fontVariantPlugin(),
      autoprefixerPlugin(),
    ]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/styles'))
    .pipe(connect.reload());
});

// Preprocess fonts files
const fontsPath = './fonts/**/*';

// Copy font files
gulp.task('fonts', ['clean:fonts'], () => {
  return gulp.src(fontsPath)
    .pipe(gulp.dest('./dist/fonts'))
    .pipe(connect.reload());
});


// Preprocess assets files
const assetsPath = './assets/**/*';

// Copy asset files
gulp.task('assets', ['clean:assets'], () => {
  return gulp.src(assetsPath)
    .pipe(gulp.dest('./dist/assets'))
    .pipe(connect.reload());
});

const htmlPath = './*.html'; // take html from root folder.

// Copy index file
gulp.task('html', ['clean:html'], () => {
  return gulp.src(htmlPath)
    .pipe(gulp.dest('./dist'))
    .pipe(connect.reload());
});

// Remove script files from the distribution folder
gulp.task('clean:scripts', () => {
  return del(['./dist/scripts/**/*.js', './dist/scripts/**/*.js.map']);
});

// Remove style files from the distribution folder
gulp.task('clean:styles', () => {
  return del(['./dist/styles/**/*.css', './dist/scripts/**/*.css.map']);
});

// Remove fonts files from the distribution folder
gulp.task('clean:fonts', () => {
  return del(['./dist/fonts/**/*']);
});

// Remove assets files from the distribution folder
gulp.task('clean:assets', () => {
  return del(['./dist/assets/**/*']);
});

// Remove index file from the distribution folder
gulp.task('clean:html', () => {
  return del(['./dist/*.html']);
});

// Start dev server
gulp.task('connect', () => {
  connect.server({
    root: './dist',
    port: 3000,
    livereload: true,
    fallback: 'index.html',
  });
});

// Rerun the task when a file changes
gulp.task('watch', () => {
  gulp.watch(scriptsPath, ['scripts']);
  gulp.watch(stylesPath, ['styles']);
  gulp.watch(assetsPath, ['fonts']);
  gulp.watch(assetsPath, ['assets']);
  gulp.watch(htmlPath, ['html']);
});

// Build distributable version of the project
gulp.task('build', ['scripts', 'styles', 'assets', 'fonts', 'html']);

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['watch', 'build', 'connect']);

