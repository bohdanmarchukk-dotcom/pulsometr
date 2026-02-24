const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const rename = require("gulp-rename");

// Завдання для локального сервера (Live Reload)
gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: "src" // Вказуємо папку, де лежить твій index.html
        }
    });

    // Слідкуємо за HTML файлами і оновлюємо сторінку при їх зміні
    gulp.watch("src/*.html").on('change', browserSync.reload);
});

// Завдання для компіляції SASS/SCSS у CSS
gulp.task('styles', function() {
    return gulp.src("src/sass/**/*.+(scss|sass)") // Беремо всі файли sass/scss
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError)) // Компілюємо і стискаємо
        .pipe(rename({suffix: '.min', prefix: ''})) // Додаємо суфікс .min
        .pipe(autoprefixer()) // Додаємо автопрефікси для старих браузерів
        .pipe(cleanCSS({compatibility: 'ie8'})) // Додатково очищаємо CSS
        .pipe(gulp.dest("src/css")) // Кладемо готовий файл у папку css
        .pipe(browserSync.stream()); // Оновлюємо стилі на сторінці без перезавантаження
});

// Завдання для слідкування за змінами у файлах
gulp.task('watch', function() {
    // Якщо змінився будь-який sass/scss файл, автоматично запускаємо завдання 'styles'
    gulp.watch("src/sass/**/*.+(scss|sass)", gulp.parallel('styles'));
});

// Завдання за замовчуванням (запускає все одночасно)
gulp.task('default', gulp.parallel('watch', 'server', 'styles'));