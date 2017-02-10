// 导入gulp
const gulp = require('gulp');
// 导入browser-sync实现热加载
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
// 导入less
const less = require('gulp-less');
// 导入js压缩
const jsUglify = require('gulp-uglify');
// 获取gulp-rename 重命名模块
const rename = require('gulp-rename');
// 获取CSS压缩模块
const minifyCss = require('gulp-clean-css');

// 开启browser-sync插件
gulp.task('serve', ['less'], function() {
    browserSync.init({
        server: {
            // 该项目的入口
            baseDir: './'
        },
        port: 80
    });

    gulp.watch('./*.html').on('change', reload);
    // 添加 browserSync.reload 到任务队列里
    // 所有的浏览器重载后任务完成。
    gulp.watch('./less/*.less', ['less']);
    gulp.watch("js/*.js", ['js-watch']);
    gulp.watch("css/*.css", ['css-watch']);
});

// 创建一个任务确保JS任务完成之前能够继续响应
// 浏览器重载
gulp.task('js-watch', ['js'], reload);
gulp.task('css-watch', ['css'], reload);

// 开启less插件
gulp.task('less', function() {
    // 1. 找到 less 文件
    gulp.src('./less/*.less')
        // 2. 编译为css
        .pipe(less())
        // 3. 另存文件
        .pipe(gulp.dest('./css'))
        .pipe(reload({
            stream: true
        }));
});

// 开启JS压缩
gulp.task('js', function() {
    return gulp.src('./js/*.js')
        .pipe(jsUglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./dist'));
});

// 开启CSS压缩
gulp.task('css', function() {
    gulp.src('./css/*.css')
        .pipe(minifyCss({
            compatibility: 'ie8',
            advanced: false,
            keepSpecialComments: '1'
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['serve']);
