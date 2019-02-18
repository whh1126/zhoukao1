/*
 * @Author: vk 
 * @Date: 2019-02-18 08:49:48 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-02-18 09:42:38
 */
var gulp = require('gulp'); //引入gulp
var minCss = require("gulp-clean-css"); //压缩css
var sass = require("gulp-sass"); //编译sass
var webserver = require("gulp-webserver"); //起服务
var concat = require('gulp-concat'); //合并文件
var uglify = require("gulp-uglify"); //压缩js
var babel = require('gulp-babel'); //编译js
var url = require("url");
var path = require("path");
var fs = require("fs");
//编译sass
gulp.task("sass", function() {
        return gulp.src("./src/scss/*.scss")
            .pipe(sass())
            .pipe(minCss()) //压缩css
            .pipe(gulp.dest('./src/css'))

    })
    //监听事件
gulp.task("watch", function() {
        return gulp.watch('./src/scss/*.scss', gulp.series('sass'))
    })
    //压缩js 合并
gulp.task('uglify', function() {
    return gulp.src('./src/js/*.js')
        .pipe(uglify())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat('all.js')) //合并
        .pipe(gulp.dest('./src/dist/js'))
})

//起服务
gulp.task("webserver", function() {
        return gulp.src("src")
            .pipe(webserver({
                port: 9090,
                open: true,
                livereload: true,
                middleware: function(req, res, next) {
                    var pathname = url.parse(req.url).pathname;
                    if (pathname === "/favicon.ico") {
                        return res.end();
                    }
                    if (pathname == "/api/list") {
                        res.end(JSON.stringify({
                            code: 1,
                            data: data,
                            msg: "数据请求成功"
                        }))

                    } else {
                        pathname = pathname == "/" ? "index.html" : pathname;
                        res.end(fs.readFileSync(path.join(__dirname, 'src', pathname)));
                    }
                }
            }))
    })
    //默认任务
gulp.task('default', gulp.series('sass', 'webserver', 'uglify', 'watch'));
//bulid任务
gulp.task("bCss", function() {
    return gulp.src("./src/css/*.css")
        .pipe(gulp.dest('dist/css'))
})
gulp.task("bJs", function() {
        return gulp.src("./src/js/*.js")
            .pipe(gulp.dest('dist/js'))
    })
    //管理开发任务
gulp.task("dev", gulp.series("sass", 'webserver', 'watch'));
//管理线上任务
gulp.task("bulid", gulp.parallel('sass', 'uglify', 'bCss', 'bJs', 'webserver', 'watch'));