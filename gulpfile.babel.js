// generated on 2017-06-09 using generator-chrome-extension 0.6.1
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import del from 'del';
import runSequence from 'run-sequence';
import { stream as wiredep } from 'wiredep';
import { rollup } from 'rollup';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

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


gulp.task('bundle_background', () => {
  return rollup({
    entry: 'app/scripts.babel/background.js',
    sourceMap : false,
    plugins: [
      babel({
        presets: [
          [
            "es2015", {
              "modules": false
            }
          ]
        ],
        babelrc: false,
        exclude: 'node_modules/**'
      }),
      resolve(
        { 
          jsnext: true,
          main: true
        }
      )
    ]
  })
  .then(bundle => {
    return bundle.generate({
      format: 'iife',
      moduleName: 'background'
    })
  })
  .then(gen => {
    return $.file('background.js', gen.code, {src: true})
      .pipe(gulp.dest('app/bundle'))
  });
})

gulp.task('bundle_chromereload', () => {
  return rollup({
    entry: 'app/scripts.babel/chromereload.js',
    sourceMap : false,
    plugins: [
      babel({
        presets: [
          [
            "es2015", {
              "modules": false
            }
          ]
        ],
        babelrc: false,
        exclude: 'node_modules/**'
      }),
      resolve(
        { 
          jsnext: true,
          main: true
        }
      )
    ]
  })
  .then(bundle => {
    return bundle.generate({
      format: 'iife',
      moduleName: 'chromereload'
    })
  })
  .then(gen => {
    return $.file('chromereload.js', gen.code, {src: true})
      .pipe(gulp.dest('app/bundle'))
  });
})

gulp.task('bundle_contentscript', () => {
  return rollup({
    entry: 'app/scripts.babel/contentscript.js',
    sourceMap : false,
    plugins: [
      babel({
        presets: [
          [
            "es2015", {
              "modules": false
            }
          ]
        ],
        babelrc: false,
        exclude: 'node_modules/**'
      }),
      resolve(
        { 
          jsnext: true,
          main: true
        }
      )
    ]
  })
  .then(bundle => {
    return bundle.generate({
      format: 'iife',
      moduleName: 'contentscript'
    })
  })
  .then(gen => {
    return $.file('contentscript.js', gen.code, {src: true})
      .pipe(gulp.dest('app/bundle'))
  });
})

gulp.task('bundle_popup', () => {
  return rollup({
    entry: 'app/scripts.babel/popup.js',
    sourceMap : false,
    plugins: [
      babel({
        presets: [
          [
            "es2015", {
              "modules": false
            }
          ]
        ],
        babelrc: false,
        exclude: 'node_modules/**'
      }),
      resolve(
        { 
          jsnext: true,
          main: true
        }
      )
    ]
  })
  .then(bundle => {
    return bundle.generate({
      format: 'iife',
      moduleName: 'popup'
    })
  })
  .then(gen => {
    return $.file('popup.js', gen.code, {src: true})
      .pipe(gulp.dest('app/bundle'))
  });
})

gulp.task('bundle', ['bundle_background', 'bundle_chromereload', 'bundle_contentscript', 'bundle_popup'], () => {});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('clean_scripts', del.bind(null, ['app/scripts']));

gulp.task('watch', ['lint', 'bundle'], () => {
  $.livereload.listen();

  gulp.watch([
    'app/*.html',
    'app/bundle/**/*.js',
    'app/images/**/*',
    'app/styles/**/*',
    'app/_locales/**/*.json',
  ]).on('change', $.livereload.reload);

  gulp.watch('app/scripts.babel/**/*.js', ['lint', 'bundle']);
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
    'lint', 'bundle','chromeManifest',
    ['html', 'images', 'extras'],
    'size', cb);
});

gulp.task('default', ['clean'], (cb) => {
  runSequence('build', cb);
});
