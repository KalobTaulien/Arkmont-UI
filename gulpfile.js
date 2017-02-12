var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');
var sassOptions = {
    errLogToConsole: true,
    outputStyle: 'expanded',
    includePaths: ['./css/scss', './css/scss/imports']
};	

// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {

    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    gulp.watch("css/scss/*.scss", ['sass']);
    gulp.watch("*.html").on('change', browserSync.reload);
    gulp.watch("js/*.js").on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {

    return gulp.src("css/scss/*.scss")
        .pipe(sass(sassOptions))
        .pipe(gulp.dest("css/"))
        .pipe(browserSync.stream());
});

gulp.task('default', ['serve']);