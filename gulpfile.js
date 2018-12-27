var gulp = require('gulp');
var pug = require('gulp-pug');
var sass = require('gulp-sass');
var imagemin = require('gulp-imagemin');
var browserSync = require('browser-sync').create();
//var minifyCSS = require('gulp-csso');
var  autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var minify = require('gulp-minify');
var sourcemaps = require('gulp-sourcemaps');


// Compile pug files into HTML
gulp.task('pug', function () {
  return gulp.src('src/pug/*.pug')
    .pipe(pug())
    .pipe(gulp.dest('dist'));
});

// Compile sass files into CSS
gulp.task('sass', function () {
  return gulp.src('src/sass/main.sass')
    .pipe(plumber())
    .pipe(sass({
      includePaths: ['src/sass'],
      errLogToConsole: true,
      outputStyle: 'compressed',
      onError: browserSync.notify,
    }))
    .pipe(autoprefixer({ browsers: ['IE 6','Chrome 9', 'Firefox 14']}))
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(browserSync.stream());
});

// Compile all javascript files 
gulp.task('js', function () {
    return gulp.src('src/js/*.js')
       .pipe(plumber())
       .pipe(sourcemaps.init())
       .pipe(concat('app.js'))
       .pipe(sourcemaps.write())
       .pipe(minify())
       .pipe(gulp.dest('dist/assets/js'))
});


// vendors javascripts
gulp.task('vendors', function() {
    gulp.src(
            [
                'src/js/vendors/*.js'
            ])
        .pipe(plumber())
        .pipe(concat('vendors.js'))
        .pipe(minify())
        .pipe(gulp.dest('dist/assets/js'));
});


// images compile 
gulp.task('images', function () {
    gulp.src('src/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/assets/images'))
});

// Serve and watch sass/pug files for changes
gulp.task('watch', ['pug', 'sass', 'images', 'js', 'vendors'], function () {
  browserSync.init({
      server: 'dist'
  }),

  gulp.watch('src/pug/*.pug', ['pug']);
  gulp.watch('src/sass/**/*.sass', ['sass']);
  gulp.watch('src/js/*.js', ['js']);
  gulp.watch('src/js/vendors/*.js', ['vendors']);
  gulp.watch('src/images/*', ['images']);
  gulp.watch('dist/*.html').on('change', browserSync.reload);
});

gulp.task('default', ['watch']);