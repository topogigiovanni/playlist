//Importa os pacotes
var gulp = require("gulp");
var concat = require("gulp-concat");
var plumber = require("gulp-plumber");
var uglify = require("gulp-uglify");
var sass = require("gulp-sass");
var rename = require("gulp-rename");
var debug = require("gulp-debug");
var minifyCss = require('gulp-minify-css');
var concat = require('gulp-concat-util');

//tarefa para minificar os js existentes
//não mudamos os nomes pois a mudança serve para alterar arquivos existentes em produção
var src = {};
	src.localCSS = ["./Assets/css/*.css"];
	src.localVendor = ["./Assets/vendor/**/*.*"];
	src.localSCSS = ["./Assets/scss/*.scss","!./Assets/scss/_*.scss"];
	src.localJS = ["./Assets/js/*.js"];

gulp.task("concat",function(){
	gulp.src([
		'./Assets/js/jq.js',
		'./Assets/js/fastclick.js',
		'./Assets/js/foundation.js',
		'./Assets/js/hammer.js',
		'./Assets/js/_*.js'
		])
		.pipe(concat('main.js'))
		.pipe(gulp.dest("js"));
});

gulp.task("validate",["validate-uglify"],function(){
	gulp.src(['./Assets/js/validate.min.js','./Assets/js/validate.custom.js'])
		.pipe(concat('validate.js'))
		.pipe(gulp.dest("js"));
});

gulp.task("validate-uglify",function(){
	gulp.src(['./Assets/js/validate.custom.js'])
		.pipe(uglify())
		.pipe(rename({suffix:".min"}))
		.pipe(gulp.dest("./Assets/js"));
});

gulp.task("vendor",function(){
	gulp.src(src.localVendor)
		.pipe(minifyCss())
		.pipe(gulp.dest("vendor"));
});

//tarefa para minificar os css existentes
//não mudamos os nomes pois a mudança serve para alterar arquivos existentes em produção
gulp.task("css",function(){
	gulp.src(src.localSCSS)
		.pipe(plumber())
		.pipe(sass())
		.pipe(gulp.dest("css"));
});

gulp.task('watch',['default'],function () {
	gulp.watch(src.localJS, ["concat"]);
	gulp.watch(['./Assets/js/validate.js','./Assets/js/validate.custom.js'], ["validate"]);
	gulp.watch(["./Assets/scss/*.scss"], ["css"]);
});

//
gulp.task("default",['concat','css','vendor','validate']);
