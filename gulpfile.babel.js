// generated on 2017-06-09 using generator-chrome-extension 0.6.1
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import del from 'del';
import runSequence from 'run-sequence';
import { stream as wiredep } from 'wiredep';

const $ = gulpLoadPlugins();

gulp.task('extras', () => gulp.src([
  'app/*.*',
  'app/_locales/**',
  '!app/scripts.babel',

  '!app/*.json',
  '!app/*.html',
], {
  base: 'app',
  dot: true,
}).pipe(gulp.dest('dist')));

function lint(files, options) {
  return () => gulp.src(files)
    .pipe($.eslint(options))
    .pipe($.eslint.format());
}

gulp.task('lint', lint('app/scripts.babel/**/*.js', {
  env: {
    es6: true,
  },
}));

gulp.task('images', () => gulp.src('app/images/**/*')
  .pipe($.if($.if.isFile, $.cache($.imagemin({
    progressive: true,
    interlaced: true,
    // don't remove IDs from SVGs, they are often used
    // as hooks for embedding and styling
    svgoPlugins: [{ cleanupIDs: false }],
  }))
    .on('error', function (err) {
      console.log(err);
      this.end();
    })))
  .pipe(gulp.dest('dist/images')));

gulp.task('html', () => gulp.src('app/*.html')
  .pipe($.useref({ searchPath: ['.tmp', 'app', '.'] }))
  .pipe($.sourcemaps.init())
  .pipe($.if('*.js', $.uglify()))
  .pipe($.if('*.css', $.cleanCss({ compatibility: '*' })))
  .pipe($.sourcemaps.write())
  .pipe($.if('*.html', $.htmlmin({ removeComments: true, collapseWhitespace: true })))
  .pipe(gulp.dest('dist')));

gulp.task('chromeManifest', () => gulp.src('app/manifest.json')
  .pipe($.chromeManifest({
    buildnumber: true,
    background: {
      target: 'bundle/background.js',
    },
  }))
  .pipe($.if('*.css', $.cleanCss({ compatibility: '*' })))
  .pipe($.if('*.js', $.sourcemaps.init()))
  .pipe($.if('*.js', $.uglify()))
  .pipe($.if('*.js', $.sourcemaps.write('.')))
  .pipe(gulp.dest('dist')));

gulp.task('babel', () => gulp.src('app/scripts.babel/**/*.js')
  .pipe($.babel({
    presets: ['es2015'],
  }))
  .pipe(gulp.dest('app/scripts')));

gulp.task('bundle_background', () => gulp.src('app/scripts/background.js')
  .pipe($.rollup({
    entry: 'app/scripts/background.js',
    format: 'umd',
  }))
  .pipe(gulp.dest('app/bundle')));

gulp.task('bundle_chromereload', () => gulp.src('app/scripts/chromereload.js')
  .pipe($.rollup({
    entry: 'app/scripts/chromereload.js',
    format: 'umd',
  }))
  .pipe(gulp.dest('app/bundle')));

gulp.task('bundle_contentscript', () => gulp.src('app/scripts/contentscript.js')
  .pipe($.rollup({
    entry: 'app/scripts/contentscript.js',
    format: 'umd',
  }))
  .pipe(gulp.dest('app/bundle')));

gulp.task('bundle_popup', () => gulp.src('app/scripts/popup.js')
  .pipe($.rollup({
    entry: 'app/scripts/popup.js',
    format: 'umd',
  }))
  .pipe(gulp.dest('app/bundle')));

gulp.task('bundle', ['bundle_background', 'bundle_chromereload', 'bundle_contentscript', 'bundle_popup'], () => {
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('clean_scripts', del.bind(null, ['app/scripts']));

gulp.task('watch', ['lint', 'babel'], () => {
  $.livereload.listen();

  gulp.watch([
    'app/*.html',
    'app/bundle/**/*.js',
    'app/images/**/*',
    'app/styles/**/*',
    'app/_locales/**/*.json',
  ]).on('change', $.livereload.reload);

  gulp.watch('app/scripts.babel/**/*.js', ['lint', 'babel', 'bundle']);
  gulp.watch('bower.json', ['wiredep']);
});

gulp.task('size', () => gulp.src('dist/**/*').pipe($.size({ title: 'build', gzip: true })));

gulp.task('wiredep', () => {
  gulp.src('app/*.html')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)*\.\./,
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('package', () => {
  const manifest = require('./dist/manifest.json');
  return gulp.src('dist/**')
    .pipe($.zip(`RaboChecker-${manifest.version}.zip`))
    .pipe(gulp.dest('package'));
});

gulp.task('build', (cb) => {
  runSequence(
    'lint', 'babel', 'bundle', 'clean_scripts', 'chromeManifest',
    ['html', 'images', 'extras'],
    'size', cb);
});

gulp.task('default', ['clean'], (cb) => {
  runSequence('build', cb);
});
