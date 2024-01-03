// Includes

const gulp = require('gulp');

const fileInclude = require('gulp-file-include');
const htmlClean = require('gulp-htmlclean');
const htmlWebp = require('gulp-webp-html');

const sass = require('gulp-sass')(require('sass'));
const sassGlob = require('gulp-sass-glob');
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');
const cssWebp = require('gulp-webp-css')

const server = require('gulp-server-livereload');
const clean = require('gulp-clean');
const fs = require('fs');
const sourceMaps = require('gulp-sourcemaps');
const groupMedia = require('gulp-group-css-media-queries');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const babel = require('gulp-babel');
const webpack = require('webpack-stream');

const imageMin = require('gulp-imagemin');
const webp = require('gulp-webp');

const changed = require('gulp-changed');

// Settings

const fileIncludeSettings = {
    prefix: '@@',
    basepath: '@file',
};

const serverSettings = {
    livereload: true,
    open: true,
};

const plumberNotify = (title) => {
    return {
        errorHandler: notify.onError({
            title: title,
            message: 'Error <%= error.message %>',
            sound: false,
        }),
    };
}

// Tasks

gulp.task('js:docs', function(){
    return gulp
        .src('./src/js/*.js')
        .pipe(changed('./docs/js'))
        .pipe(plumber(plumberNotify('JS')))
        .pipe(babel())
        .pipe(webpack(require('./../webpack.config.js')))
        .pipe(gulp.dest('./docs/js'))
});

gulp.task('html:docs', function(){
    return gulp
        .src('./src/*.html')
        .pipe(changed('./docs/'))
        .pipe(plumber(plumberNotify('HTML')))
        .pipe(fileInclude(fileIncludeSettings))
        .pipe(htmlWebp())
        .pipe(htmlClean())
        .pipe(gulp.dest('./docs/'));
});

gulp.task('sass:docs', function(){
    return gulp
        .src('./src/scss/*.scss')
        .pipe(changed('./docs/css/'))
        .pipe(plumber(plumberNotify('SASS')))
        .pipe(sourceMaps.init())
        .pipe(autoprefixer())
        .pipe(sassGlob())
        .pipe(cssWebp())
        .pipe(groupMedia())
        .pipe(sass())
        .pipe(csso())
        .pipe(sourceMaps.write())
        .pipe(gulp.dest('./docs/css/'));
});

gulp.task('images:docs', function(){
    return gulp
        .src('./src/images/**/*')
        .pipe(changed('./docs/images/'))
        .pipe(webp())
        .pipe(gulp.dest('./docs/images/'))

        .pipe(gulp.src('./src/images/**/*'))
        .pipe(changed('./docs/images/'))
        .pipe(imageMin({ verbose: true }))
        .pipe(gulp.dest('./docs/images/'))
});

gulp.task('server:docs', function(){
    return gulp.src('./docs/')
        .pipe(server(serverSettings))
});

gulp.task('clean:docs', function(done){
    if (fs.existsSync('./docs/')) {
        return gulp.src('./docs/', { read: false })
            .pipe(clean({ force: true }));
    }
    done();
});


