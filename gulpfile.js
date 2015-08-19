/**
 * Created by surgeon on 18.08.2015.
 */

var gulp = require('gulp');
var ts = require('gulp-typescript');

gulp.task('default', function () {
    var tsResult = gulp.src('**.ts')
        .pipe(ts({
            noImplicitAny: true,
            target:"ES5",
            module:"commonjs",
            out: 'app.js',
            noEmitOnError:false

        }));

    return tsResult.js.pipe(gulp.dest('/'));
});

