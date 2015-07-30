var gulp          = require('gulp'),
    sass          = require('gulp-sass'),
    concat        = require('gulp-concat'),
    watch         = require('gulp-watch'),
    plumber       = require('gulp-plumber'),
    uglify        = require('gulp-uglify'),
    prefix        = require('gulp-autoprefixer'),
    sourcemaps    = require('gulp-sourcemaps'),
    imagemin      = require('gulp-imagemin'),
    pngquant      = require('imagemin-pngquant'),
    notify        = require('gulp-notify'),
    browserSync   = require('browser-sync'),
    jshint        = require('gulp-jshint')
    jade          = require('gulp-jade');

/* ====================================================== */

var src = {
  sass: "development/sassfiles/**/*.scss",
  jade: "development/jadefiles/*.jade",
  img: "development/images/*",
  js: "development/javascript/**/*.js",
}

var dest = {
  css: "release/assets/stylesheet",
  html: "release",
  img: "release/assets/images",
  js: "release/assets/javascript",
}

var onError = function(err) {
  console.log(err);
  this.emit('end');
}

/* ====================================================== */

gulp.task('compile-sass', function() {
  return gulp.src(src.sass)
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(prefix('last 2 versions'))
    .pipe(concat('global.min.css'))
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dest.css))
    .pipe(notify("SCSS Compiled successfully"))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('javascript', function() {
  return gulp.src(src.js)
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(uglify())
    .pipe(concat('app.min.js'))
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dest.js))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('compile-jade', function() {
  gulp.src(src.jade)
    .pipe(jade())
    .pipe(gulp.dest(dest.html))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('image', function() {
  return gulp.src(src.img)
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))
    .pipe(gulp.dest(dest.img))
});

gulp.task('watch', function() {
  browserSync.init({
    server: './release'
  })
  gulp.watch(src.js, ['javascript']);
  gulp.watch(src.sass, ['compile-sass']);
  gulp.watch(src.jade, ['compile-jade']);
});

gulp.task('default', ['watch', 'compile-sass', 'javascript', 'compile-jade']);
