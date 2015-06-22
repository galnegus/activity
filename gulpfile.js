var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var runSequence = require('run-sequence');

gulp.task('browserify', function () {
  var b = browserify('./src/js/activity.js', {debug: true});
  return b.bundle()
    .pipe(source('activity.js'))
    .pipe(gulp.dest('./dist/js/'));
});

gulp.task('uglify', function() {
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
          drop_console: true
        }
    }))
    .pipe(rename('activity.min.js'))
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('build', function(done) {
  return runSequence('browserify', 'uglify', done);
});
