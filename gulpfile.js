var gulp = require('gulp');
var browserify = require('browserify');
var hbsfy = require('hbsfy');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var runSequence = require('run-sequence');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');

gulp.task('browserify', function () {
  var b = browserify('./src/js/activity.js', {debug: true});
  return b.transform(hbsfy)
    .bundle()
    .pipe(source('activity.js'))
    .pipe(gulp.dest('./dist/js/'));
});

gulp.task('uglify', ['browserify'], function() {
  return gulp.src('./dist/js/activity.js')
    .pipe(uglify({
    	mangle: true,
        compress: {
          sequences: true,
          dead_code: true,
          conditionals: true,
          booleans: true,
          unused: true,
          if_return: true,
          join_vars: true,
          drop_console: false
        }
    }))
    .pipe(rename('activity.min.js'))
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('less', function() {
  return gulp.src('./src/less/activity.less')
    .pipe(less())
    .pipe(rename('activity.css'))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('minify', ['less'], function() {
  return gulp.src('./dist/css/activity.css')
    .pipe(minifyCSS())
    .pipe(rename('activity.min.css'))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('build', function(done) {
  return runSequence('uglify', 'minify', done);
});

gulp.task('watch', function(done){
  return runSequence('build', function() {
    gulp.watch('./src/js/*.js', ['build']);
    gulp.watch('./src/templates/*.hbs', ['build']);
    gulp.watch('./src/less/*.less', ['build']);
    done();
  });
});
