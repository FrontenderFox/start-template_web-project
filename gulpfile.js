var gulp             = require('gulp'), // Подключаем gulp
	browserSync      = require('browser-sync'), // Подключаем browser-sync обновляющий страницу
	sass             = require('gulp-sass'), // Подключаем sass препроцессор
	autoprefixer     = require('gulp-autoprefixer'), // Подключаем авто-префиксы к css
	csso             = require('gulp-csso'), // Подключаем плагин минифицирующий css
	rename           = require('gulp-rename'), // Подключаем плагин изменяющий названия файлов
	concat           = require('gulp-concat'), // Подключаем плагин скеливающий файлы
	uglify           = require('gulp-uglify'), // Подключаем плагин сжимающий js файлы
	includer         = require('gulp-x-includer'); // Подключаем плагин вставляющий шаблоны

gulp.task('browser-sync', ['styles', 'stylesMod', 'scripts', 'html'], function() {
		browserSync.init({
				server: {
						baseDir: "./app"
				},
				notify: false
		});
});

gulp.task('html', function(){
 return gulp.src('app/templates/*.html')
   .pipe(includer())
   .pipe(gulp.dest('app'))
   .pipe(browserSync.reload({stream: true}));
});

gulp.task('styles', function () {
	return gulp.src('app/sass/*.sass')
	.pipe(sass().on('error', sass.logError))
	.pipe(rename({suffix: '.min', prefix : ''}))
	.pipe(autoprefixer({browsers: ['last 15 versions'], cascade: false}))
	.pipe(csso({
	            restructure: false,
	            sourceMap: true,
	            debug: true
    		}))
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.stream());
});

gulp.task('stylesMod', function () {
	return gulp.src('app/sass/modules/*.sass')
	.pipe(sass().on('error', sass.logError))
	.pipe(rename({suffix: '.min', prefix : ''}))
	.pipe(autoprefixer({browsers: ['last 15 versions'], cascade: false}))
	.pipe(csso({
	            restructure: false,
	            sourceMap: true,
	            debug: true
    		}))
	.pipe(gulp.dest('app/css/modules'))
	.pipe(browserSync.stream());
});

gulp.task('jsmin', function () {
	return gulp.src('app/JSWorks/*.js')
	.pipe(uglify())
	.pipe(gulp.dest('./app/js/'));
});

gulp.task('scripts', function() {
	return gulp.src([
		'./app/libs/modernizr/modernizr.js',
		'./app/libs/jquery/jquery-1.11.2.min.js',
		'./app/libs/owl.carousel/owl.carousel.min.js',
		])
		.pipe(concat('plugins.js'))
		.pipe(gulp.dest('./app/js/'));
});

gulp.task('watch', function () {
	gulp.watch('app/sass/**/*.sass', ['styles'], ['stylesMod']);
	gulp.watch('app/plugins/**/*.js', ['scripts']);
	gulp.watch('app/JSWorks/*.js', ['jsmin']).on("change", browserSync.reload);
	gulp.watch('app/templates/**/*.html', ['html']);
});

gulp.task('run', ['browser-sync', 'watch']);
