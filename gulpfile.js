var gulp = require('gulp'),
  less = require('gulp-less'),
  cssmin = require('gulp-cssmin'),
  rename = require('gulp-rename'),
  browser = require('browser-sync'),
  csscomb = require('gulp-csscomb'),
  autoprefixer = require('gulp-autoprefixer'),
  uglify = require('gulp-uglify');

// run: run "npm compress" manually for now
gulp.task('compress', function() {
  gulp.src(['js/**/*.js', '!js/**/*.min.js'])
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('js'))
});

gulp.task('watch-less', function() {
  gulp.watch('./**/*.less', ['generate-css']);
});

gulp.task('live-server', function() {
  browser.init({
    server: {
      baseDir: "./",
      browser: ["firefox", "google-chrome"]
    }
  });
  gulp.watch(['./css/*.css', './*.html']).on("change", browser.reload);
});

gulp.task('generate-css', function() {
  return gulp.src('./less/main.less')
    .pipe(less().on('error', function(err) {
      console.log(err);
      this.emit('end'); // to keep going if I made a syntax mistake in a less file
    }))
    .pipe(autoprefixer({
      browsers: ['last 5 versions'],
      cascade: false
    }))
    .pipe(csscomb())
    .pipe(rename({
      basename: 'style'
    }))
    .pipe(gulp.dest('./css/'))
    .pipe(cssmin().on('error', function(err) {
      console.log(err);
    }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./css/'));
});

gulp.task('default', ['watch-less', 'generate-css', 'live-server']);
