//adapted from https://github.com/touchstonejs/touchstonejs-tasks

var babelify = require('babelify');
var brfs = require('brfs');
var browserify = require('browserify');
var bytes = require('bytes');
var chalk = require('chalk');
var connect = require('gulp-connect');
var del = require('del');
var gutil = require('gulp-util');
var less = require('gulp-less');
var merge = require('merge-stream');
var plumber = require('gulp-plumber');
var shell = require('gulp-shell');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var watchify = require('watchify');
var xtend = require('xtend');
var nodemon = require('gulp-nodemon');
var reactify = require('reactify');
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');
var shrinkwrap = require('gulp-shrinkwrap');
var jsonfile = require('jsonfile');

var LessPluginCleanCSS = require('less-plugin-clean-css'),
  LessPluginAutoPrefix = require('less-plugin-autoprefix'),
  LessPluginNPMImport = require('less-plugin-npm-import');
var npmimportless = new LessPluginNPMImport({
    prefix: 'npm://'
  }),
  cleancss = new LessPluginCleanCSS({
    advanced: true
  }),
  autoprefix = new LessPluginAutoPrefix({
    browsers: ['last 2 versions']
  });


var client_entrypoint = 'index.jsx';

module.exports = function(gulp) {
  function doBundle(target, name, dest) {
    return target.bundle()
      .on('error', function(err) {
        var parts = err.message.split('.js: ');
        var br = '\n           ';
        var msg = parts.length === 2 ? chalk.red('Browserify Error in ') + chalk.red.underline(parts[0] + '.js') + br + parts[1] : chalk.red('Browserify Error:') + br + err.message;
        gutil.log(msg);
      })
      .pipe(source(name))
      .pipe(buffer())
      .pipe(gulpif(process.env.NODE_ENV === 'production', uglify()))
      .pipe(gulp.dest(dest))
      .pipe(connect.reload());
  }

  function watchBundle(bundle, name, dest) {
    return watchify(bundle)
      .on('log', function(message) {
        message = message.replace(/(\d+) bytes/, function() {
          return bytes.format(Number(arguments[1]));
        });
        gutil.log(chalk.grey(message));
      })
      .on('time', function(time) {
        gutil.log(chalk.green('Application built in ' + (Math.round(time / 10) / 100) + 's'));
      })
      .on('update', function(ids) {
        var changed = ids.map(function(x) {
          return chalk.blue(x.replace(__dirname, ''));
        });

        if (changed.length > 1) {
          gutil.log(changed.length + ' scripts updated:\n* ' + changed.join('\n* ') + '\nrebuilding...');
        } else {
          gutil.log(changed[0] + ' updated, rebuilding...');
        }

        doBundle(bundle, name, dest);
      });
  }

  function buildApp(entries, transforms, dest, watch) {
    var opts = xtend(watch && watchify.args, {
      entries: entries,
      debug: process.env.NODE_ENV !== 'production',
      extensions: ['.jsx'] //allow .jsx files to be recognised as JS modules
    });

    var app = browserify(opts);
    var react = browserify();

    ['react', 'react/addons'].forEach(function(pkg) {
      app.exclude(pkg);
      react.require(pkg);
    });

    if (watch) {
      app = watchBundle(app, 'app.js', dest);
    }

    transforms.forEach(function(target) {
      app.transform(target);
    });

    return merge(doBundle(react, 'react.js', dest), doBundle(app, 'app.js', dest));
  }

  //helper function
  function plumb(src, transforms, dest) {
    var stream = gulp.src(src);
    transforms.forEach(function(transform) {
      stream = stream.pipe(transform());
    });
    return stream.pipe(gulp.dest(dest)).pipe(connect.reload());
  }

  //less task helper
  function lessTasks(isProd){
    var src = 'client/css/app.less';
    var dest = 'dist/public/css';

    var stream = gulp.src(src);
    if(!isProd){
      stream.pipe(less({
        plugins: [autoprefix, npmimportless]
      }).on('error', gutil.log))
      .pipe(gulp.dest(dest))
      .pipe(connect.reload());
    }else{
      //minify
      stream.pipe(less({
        plugins: [autoprefix, npmimportless, cleancss]
      }))
      .pipe(gulp.dest(dest))
      .pipe(connect.reload());
    }
  }

  //helper to extract production-only properties from package.json
  function prodOnlyJson() {
    jsonfile.readFile('./package.json', function(err, jsonObj) {
      if (err) {
        console.error(err);
        return;
      }
      var prodJsonObj = {};
      //optional
      var optProps = ["name", "version", "description", "author"];
      optProps.forEach(function(p) {
        if (jsonObj[p]) {
          prodJsonObj[p] = jsonObj[p];
        }
      });
      //required
      var reqProps = ["dependencies", "engines"];
      reqProps.forEach(function(p) {
        if (jsonObj[p]) {
          prodJsonObj[p] = jsonObj[p];
        } else {
          console.err("The " + p + " definition is missing from package.json");
        }
      });
      //production script
      prodJsonObj.scripts = {
        start: "node server/app.js"
      };
      //write out
      jsonfile.writeFile('./dist/package.json', prodJsonObj, function(err) {
        if (err) {
          return console.error(err);
        }
        console.log('server-prod-json: production-only package.json written to dist folder');
      })
    })
  };

  var babelifyTransform = babelify.configure({
    plugins: [require('babel-plugin-object-assign')],
    optional: 'es7.objectRestSpread'
  });

  // Build
  gulp.task('fonts', plumb.bind(null, 'client/fonts/**', [], 'dist/public/fonts'));
  gulp.task('html', plumb.bind(null, ['client/index.html', 'client/.htaccess', 'client/favicon.ico', 'client/robots.txt'], [], 'dist/public'));
  gulp.task('images', plumb.bind(null, 'client/img/**', [], 'dist/public/img'));
  gulp.task('static-data', plumb.bind(null, 'client/data/static/**', [], 'dist/public/data'));
  gulp.task('less', lessTasks.bind(null, false));
  gulp.task('less-prod', lessTasks.bind(null, true));
  gulp.task('scripts', buildApp.bind(null, ['./client/js/' + client_entrypoint], [babelifyTransform, reactify, brfs], './dist/public/js'));
  gulp.task('scripts-watch', buildApp.bind(null, ['./client/js/' + client_entrypoint], [babelifyTransform, reactify, brfs], './dist/public/js', true));
  gulp.task('server-prod', plumb.bind(null, ['server/**'], [], 'dist/server'));
  gulp.task('server-prod-json', prodOnlyJson)

  //Shrink-wrap package json
  gulp.task('server-prod-shrinkwrap', function() {
    return gulp.src('package.json')
      .pipe(shrinkwrap()) // just like running `npm shrinkwrap`
      .pipe(gulp.dest('./dist')); // writes newly created `npm-shrinkwrap.json` to the location of your choice
  });

  gulp.task('clean', function() {
    return del(['./dist/*']);
  });
  gulp.task('build-assets', ['html', 'images', 'fonts', 'static-data', 'less']);
  gulp.task('build-assets-prod', ['html', 'images', 'fonts', 'static-data', 'less-prod']);
  gulp.task('build', ['build-assets', 'scripts']);
  gulp.task('build-prod', ['build-assets-prod', 'scripts', 'server-prod', 'server-prod-json', 'server-prod-shrinkwrap']);
  gulp.task('watch', ['build-assets', 'scripts-watch'], function() {
    gulp.watch(['client/index.html'], ['html']);
    gulp.watch(['client/css/**/*.less'], ['less']);
    gulp.watch(['client/img/**/*.*'], ['images']);
    gulp.watch(['client/fonts/**/*.*'], ['fonts']);
  });

  // Development
  // fullstack serve task that we use for development
  gulp.task('serve', ['watch'], function() {
    nodemon({
        script: 'server/app.js', // the app script
        watch: ['server/**/*.js'], // file to watch for reloading
        env: { // any environment variables
          'PORT': 8080,
          'DOMAIN': 'http://localhost:8080',
          'SESSION_SECRET': 'my-secret'
        }
      })
      .on('restart', function() {
        setTimeout(function() {
          connect.reload();
        }, 1000);
        console.log('server restarted!');
      });
  });

  gulp.task('dev', ['serve', 'watch']);
};
