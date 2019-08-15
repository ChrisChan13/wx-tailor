const gulp = require('gulp');
const less = require('gulp-less');
const rename = require('gulp-rename');

const config = require('./config');

const {
  srcPath, distPath, demoSrc, demoDist,
} = config;

const swallowError = function swallowError(err) {
  console.error(err.toString());
  this.emit('end');
};

const lessToWxss = filePath => gulp.src(filePath, { cwd: srcPath })
  .pipe(less())
  .on('error', swallowError)
  .pipe(rename({ extname: '.wxss' }))
  .pipe(gulp.dest(distPath));

const copy = (filePath, src, dist) => gulp.src(filePath, { cwd: src })
  .pipe(gulp.dest(dist));

gulp.task('build-component-wxss', () => lessToWxss('**/*.less'));
gulp.task('build-component-rest', () => copy(['**/*.wxml', '**/*.json', '**/*.js'], srcPath, distPath));
gulp.task('build-component', gulp.parallel('build-component-wxss', 'build-component-rest'));
gulp.task('build-demo', () => copy('**/*', demoSrc, demoDist));
gulp.task('watch-component', () => {
  const watchCallback = (filePath) => {
    const isLess = filePath.indexOf('.less') > 0;
    return isLess
      ? lessToWxss(filePath)
      : copy(filePath, srcPath, distPath);
  };
  return gulp.watch('**/*', { cwd: srcPath })
    .on('change', watchCallback)
    .on('add', watchCallback)
    .on('unlink', watchCallback);
});
gulp.task('watch-demo', () => {
  const watchCallback = filePath => copy(filePath, demoSrc, demoDist);
  return gulp.watch('**/*', { cwd: demoSrc })
    .on('change', watchCallback)
    .on('add', watchCallback)
    .on('unlink', watchCallback);
});

(() => {
  gulp.task('build', gulp.series('build-component'));
  gulp.task('dev', gulp.parallel('build-component', 'build-demo'));
  gulp.task('watch', gulp.series('dev', gulp.parallel('watch-component', 'watch-demo')));
})();
