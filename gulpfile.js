var gulp = require('gulp');
var minifyHtml = require('gulp-minify-html');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');

var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var log = require('gulplog');
var es = require('event-stream');

var clean = require('gulp-clean');

gulp.task('clean', async() => {
    return gulp.src('dist', { read: false }).pipe(clean());
})

gulp.task('html', async () => {
    console.log('gulp_starting...html');
    gulp.src('src/html/*.html')
        .pipe(minifyHtml())
        .pipe(gulp.dest('dist/html'));
});

gulp.task('js', async () => {
    console.log('gulp_starting...js');
    // gulp.src('src/js/*.js')
    // .pipe(uglify())
    // .pipe(gulp.dest('dist/js'));
    // return browserify('src/js/*.js')
    //     .bundle()
    //     .pipe(source('main.js'))
    //     .pipe(gulp.dest('dist/js'));
    var filesList = [
        {
            fpath: 'src/js/index.js',
            fname: 'index.js',
        },
        {
            fpath: 'src/js/main.js',
            fname: 'main.js',
        }
    ];

    var tasks = filesList.map(function(entry) {
        return browserify({ entries: [entry.fpath] })
            .bundle()
            .pipe(source(entry.fname))
            .pipe(buffer())
            .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(uglify())
            .on('error', log.error)
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('dist/js/'));
    });

    return es.merge.apply(null, tasks);

    // var b = browserify({
    //     entries: ['src/js/index.js', 'src/js/main.js'],
    //     debug: true
    // });

    // return b.bundle()
    //     .pipe(source('index.js'))
    //     .pipe(buffer())
    //     .pipe(sourcemaps.init({ loadMaps: true }))
    //     // Add transformation tasks to the pipeline here.
    //     .pipe(uglify())
    //     .on('error', log.error)
    //     .pipe(sourcemaps.write('./'))
    //     .pipe(gulp.dest('dist/js/'));
});

gulp.task('scss', async () => {
    console.log('gulp_starting...scss');
    gulp.src('src/css/*.scss')
        .pipe(sass())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 3 versions'],
            cascade: true,
            remove: true,
        }))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('css', async () => {
    console.log('gulp_starting...css');
    gulp.src('src/css/*.css')
        .pipe(minifyCss())
        .pipe(gulp.dest('dist/css'));
});

// 最终执行default
gulp.task('build', gulp.parallel('html', 'js', 'scss', async() => {
    console.log('buiding...');
}))

// gulp.task('default', gulp.series('clean', gulp.parallel('build')))