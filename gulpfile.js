const gulp = require('gulp');
const clean = require('gulp-clean');

require('./tools/build');
const config = require('./tools/config');

gulp.task('clean', gulp.series(() => gulp.src(config.distPath, { read: false, allowEmpty: true })
  .pipe(clean()), (done) => {
  if (config.isDev) {
    return gulp.src(config.demoDist, {
      read: false, allowEmpty: true,
    }).pipe(clean());
  }
  return done();
}));

gulp.task('default', gulp.series('build'));
