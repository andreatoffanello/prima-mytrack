var gulp        = require('gulp'),
    sass        = require('gulp-sass'),
    rename      = require('gulp-rename'),
    cleanCSS    = require('gulp-clean-css'),
    prefix      = require('gulp-autoprefixer'),
    plumber     = require('gulp-plumber'),
    notify      = require('gulp-notify'),
    sassLint    = require('gulp-sass-lint'),
    sourcemaps  = require('gulp-sourcemaps');
    // Temporary solution until gulp 4
    // https://github.com/gulpjs/gulp/issues/355
    runSequence = require('run-sequence');

var browserSync = require('browser-sync').create();

var displayError = function(error) {
  // Initial building up of the error
  var errorString = '[' + error.plugin.error.bold + ']';
  errorString += ' ' + error.message.replace("\n",''); // Removes new line at the end

  // If the error contains the filename or line number add it to the string
  if(error.fileName)
      errorString += ' in ' + error.fileName;

  if(error.lineNumber)
      errorString += ' on line ' + error.lineNumber.bold;

  // This will output an error like the following:
  // [gulp-sass] error message in file_name on line 1
  console.error(errorString);
};

var onError = function(err) {
  notify.onError({
    title:    "Gulp",
    subtitle: "Failure!",
    message:  "Error: <%= error.message %>",
    sound:    "Basso"
  })(err);
  this.emit('end');
};

var sassOptions = {
  outputStyle: 'expanded'
};

var prefixerOptions = {
  // browsers: ['last 2 versions'],

  overrideBrowserslist: [
    'last 100 version',
    '> 1%',
    'IE 6-8'
  ]
};

// BUILD SUBTASKS
// ---------------


gulp.task('browser-sync', function() {

    var files = [
                "./*",
                "./**/*"
                ];

    browserSync.init(files, {

        server: true,
    });
});


gulp.task('styles', function() {
  return gulp.src('sass/style.sass')
    .pipe(plumber({errorHandler: onError}))
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions))
    .pipe(prefix(prefixerOptions))
    .pipe(rename('style.css'))
    .pipe(gulp.dest('css'))
    .pipe(cleanCSS({
      level: {
          1: {
              specialComments: 0,
          },
      },
    }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('css'))
});

gulp.task('sass-lint', function() {
  gulp.src('sass/*.scss')
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError());
});

gulp.task('watch', function() {
  gulp.watch('sass/*.sass', gulp.series('styles'));
  gulp.watch('sass/*/*.sass', gulp.series('styles'));
});



// BUILD TASKS
// ------------

gulp.task('sass', gulp.series('styles', 'watch', function (done) {
    done();
}));


gulp.task('default', gulp.parallel('sass', 'browser-sync'));
