"use strict";

var gulp = require("gulp");    

var PATHS = {
    clientFiles: "client/**/*.*",
    dist: "server/public"
};

gulp.task("build", function () {
    return gulp
        .src(PATHS.clientFiles)
        .pipe(gulp.dest(PATHS.dist));    
});

gulp.task("default", ["build"], function () {
});
