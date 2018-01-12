'use strict';

const gulp = require('gulp');
const ts = require('gulp-typescript');
const clear = require('gulp-clean');
const sequence = require('gulp-run-sequence');

const tsProject = ts.createProject('./tsconfig.json');

gulp.task('tsCompile', () => {
    return tsProject.src()
        .pipe(tsProject())
        .pipe(gulp.dest('dist'));
})



gulp.task('clear-files', () => {
    return gulp.src('./dist/**/*')
    .pipe(clear())
})

gulp.task('clear', function(cb) {  
    sequence('clear-files', 'tsCompile', cb);
});


gulp.task('server', () => {
    gulp.watch('./app/**/*.ts', ['tsCompile']);
})
