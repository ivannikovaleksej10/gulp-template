const gulp = require('gulp');

// Tasks
require('./gulp/dev.js');
require('./gulp/docs.js');

gulp.task('default', gulp.series('clean:dev', gulp.parallel('sass:dev', 'html:dev', 'images:dev', 'js:dev'), gulp.parallel('server:dev', 'watch:dev')));

gulp.task('docs', gulp.series('clean:docs', gulp.parallel('sass:docs', 'html:docs', 'images:docs', 'js:docs'), gulp.parallel('server:docs')));