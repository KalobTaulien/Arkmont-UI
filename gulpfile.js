/* eslint-disable */

// For anyone who is learning Gulp, this file doe sthe following:
// 1. Requires the npm packages we have installed.
// 2. Sets up "serve" as a default task, which executes "cssmin"
// 3. "cssmin" executes, but depends on "sass" to run first (['sass'])
// 4. The 'sass' task will compile your sass into css.
// 5. The 'cssmin' task will take the new .css file and minify it to .min.css
// 6. BrowserSync reloads your page for you.

var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');
var cssmin      = require('gulp-cssmin');
var rename      = require('gulp-rename');
var sassOptions = {
  src: "css/scss/**/*.scss",
  dest: "css/",
  settings: {
    errLogToConsole: false,
    includePaths: [
        './node_modules/'
    ],
    outputStyle: 'expanded',
  }
}

// Static Server + watching scss/html files
gulp.task('serve', ['cssmin'], function() {

    browserSync.init({
        server: {
            baseDir: './'
        }
    });

    // Watch the base sass files
    gulp.watch('css/scss/*.scss', ['cssmin']);
    // Watch any sass imports for changes. We do this so we don't get the "import error" seen on some machines
    gulp.watch('css/scss/**/*.scss', ['sassimports']);
    // Watch all .html files for changes
    gulp.watch('*.html').on('change', browserSync.reload);
    // Watch all js files for changes
    gulp.watch('js/*.js').on('change', browserSync.reload);
});

gulp.task('sassimports', ['cssmin'], function() {
    console.log('-- sassimports --');
});

gulp.task('cssmin', ['sass'], function () {
    console.log('-- gulp-cssmin --');
    return gulp.src('css/main.css')
        .pipe(cssmin())
        .pipe(rename({ suffix: '.min' } ))
        .pipe(gulp.dest('css/'))
        .pipe(browserSync.reload({ stream: true }));
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    console.log('-- gulp-sass --');

    return gulp.src(sassOptions.src)
        .pipe(sass(sassOptions.settings))
        .pipe(gulp.dest(sassOptions.dest))
        .pipe(browserSync.reload({ stream: true }));

});

gulp.task('default', ['serve']);
