const gulp = require('gulp');
const rename = require('gulp-rename');
const gulpIf = require('gulp-if');

const packForChrome = () => {
  return gulp.src([
    'index.html',
    'manifest.json',
    './public/**'
  ], {'base': '.'})
  .pipe(gulp.dest('./mcmc/'));
}

const packForFirefox = () => {
  return gulp.src([
    'index.html',
    'manifestff.json',
    './public/**'
  ], {'base': '.'})
  .pipe(gulpIf(file => file.path.match('manifestff.json'), rename('manifest.json')))
  .pipe(gulp.dest('./mcmf/'));
}

gulp.task('pack', () => {
  packForChrome();
  packForFirefox();
});