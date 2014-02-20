var gulp = require('gulp'),
    watch = require('gulp-watch'),
    less = require('gulp-less'),
    minifyCSS = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    path = require('path');

// Default paths
var paths = {
  html: './src/**/*.html',
  fonts: './src/fonts/**/*',
  js: './src/js/**/*.js',
  less: './src/less/**/*.less',
  lessMain: './src/less/style.less',
  img: './src/img/**/*'
};

gulp.task('html', function() {
  gulp.src(paths.html)
      .pipe(gulp.dest('./dist'));
});

gulp.task('fonts', function() {
  gulp.src(paths.fonts)
      .pipe(gulp.dest('./dist/fonts'));
});

gulp.task('js', function() {
  gulp.src(paths.js)
      .pipe(gulp.dest('./dist/js'));
});

// Compile & minify less files
gulp.task('less', function() {
  gulp.src(paths.lessMain)
      .pipe(less())
      .pipe(minifyCSS())
      .pipe(gulp.dest('./dist/css'));
});

// Image min
gulp.task('img', function() {
  gulp.src(paths.img)
      // .pipe(imagemin())
      .pipe(gulp.dest('./dist/img'));
});

// Rerun the task when a file changes
gulp.task('watch', function () {
  gulp.watch(paths.html, ['html']);
  gulp.watch(paths.js, ['js']);
  gulp.watch(paths.less, ['less']);
  gulp.watch(paths.img, ['img']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['html', 'fonts', 'js', 'less', 'img', 'watch']);