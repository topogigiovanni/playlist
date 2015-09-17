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
	src.localCSS = [".app/src/css/*.css"];
	src.localVendor = [".app/src/vendor/**/*.*"];
	src.localSCSS = [".app/src/scss/*.scss","!.app/src/scss/_*.scss"];
	src.localJS = [".app/src/script/*.js"];

gulp.task("concat",function(){
	gulp.src([
		'.app/src/script/jq.js',
		'.app/src/script/fastclick.js',
		'.app/src/script/foundation.js',
		'.app/src/script/hammer.js',
		'.app/src/script/_*.js'
		])
		.pipe(concat('main.js'))
		.pipe(gulp.dest("js"));
});

gulp.task("validate",["validate-uglify"],function(){
	gulp.src(['.app/src/script/validate.min.js','.app/src/script/validate.custom.js'])
		.pipe(concat('validate.js'))
		.pipe(gulp.dest("js"));
});

gulp.task("validate-uglify",function(){
	gulp.src(['.app/src/script/validate.custom.js'])
		.pipe(uglify())
		.pipe(rename({suffix:".min"}))
		.pipe(gulp.dest(".app/src/js"));
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
	gulp.watch(['.app/src/script/validate.js','.app/src/script/validate.custom.js'], ["validate"]);
	gulp.watch([".app/src/scss/*.scss"], ["css"]);
});

//
gulp.task("default",['concat','css','vendor','validate']);
