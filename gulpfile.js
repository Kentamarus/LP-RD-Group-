var gulp = require('gulp'),
    watch = require('gulp-watch'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    prefixer = require('gulp-autoprefixer'),   
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),   
    cleanCSS = require('gulp-clean-css'),
    browserSync = require("browser-sync"),   
    gutil = require('gulp-util'),
    concat = require('gulp-concat');
    reload = browserSync.reload,
 	fontmin = require('gulp-fontmin');
    gulpSequence = require('gulp-sequence');

var concatConfig = {
    file: 'bundle.css'
}

var file ={
    js: [
        './bower_components/jquery/dist/jquery.min.js',              
        './bower_components/bootstrap/dist/js/bootstrap.min.js'
    ],
    css: [
            './.create/css/normalize.css',
            './.create/css/bootstrap.min.css',
            './.create/css/fonts.css',
            './.create/css/template.css',
            './.create/css/slick.css',
            './.create/css/pop-up.css',
            './.create/css/style.css',
            './.create/css/media.css']    
} 

var path = {
	source:{
		fonts: "./source/fonts/"	
	},	
    production: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: '.production/',
        js: '.production/scripts/',
        css: '.production/css/',
        img: '.production/images/',
        uploads: '.production/uploads/',
        style: '.production/style/',
        libs: '.production/libraries/',
        fonts: '.production/fonts/'        
    },
    create: { //Пути откуда брать исходники
        html: './.create/*.html',
        js: './.create/scripts/scripts.js',//В стилях и скриптах нам понадобятся только main файлы        
        css: './.create/css/**/*.css',
        style: './.create/style/**/*.css',
        libs: './.create/libraries/**/*.*',
        img: './.create/images/**/*.*',      
        uploads: './.create/uploads/**/*.*',      
        outLib: './.create/libraries/',
        fonts: './.create/fonts/**/*.*',
        tmp: './.create/tmp/**/*.css',
		dirFonts: './.create/fonts/',
		dirStyle: './.create/style/'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: './.create/**/*.html',
        js: './.create/js/**/*.js',
        css: './.create/css/**/*.css',
        style: './.create/style/**/*.css',
        image: './.create/images/**/*.*',
        uploads: './.create/uploads/**/*.*',      
        libs: './.create/libraries/**/*.*',
        fonts: './.create/fonts/**/*.*'       
    },
    clean: './.production'
};

var config = {
    server: {
        server: {
            baseDir: "./.production"
        },
        // tunnel: true,
        host: 'localhost',
        port: 9000,
        logPrefix: "Bar"
    },
    client:{
        server: {
            baseDir: "./.create"
        },
        // tunnel: true,
        host: 'localhost',
        port: 3000,
        logPrefix: "Bar"
    }
};

// html
gulp.task('html:build', function () {
    gulp.src(path.create.html) //Выберем файлы по нужному пути       
        .pipe(gulp.dest(path.production.html)) //Выплюнем их в папку build
        .pipe(reload({stream: true})); //И перезагрузим наш сервер для обновлений
});


gulp.task('js:build', function () {
    gulp.src(path.create.js) //Найдем наш main файл        
        //.pipe(uglify().on('error', gutil.log))        
        .pipe(gulp.dest(path.production.js)) //Выплюнем готовый файл в production 
        .pipe(reload({stream: true}));     
});

gulp.task('image:build', function () {
    gulp.src(path.create.img) //Выберем наши картинки
        .pipe(imagemin({ 
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true //Сожмем их
        }))
        .pipe(gulp.dest(path.production.img)) //И бросим в production       
});

gulp.task('js:set', function () {    
    gulp.src([ file.js[0], file.js[1] ])    
        .pipe(gulp.dest(path.create.outLib))
        .pipe(gulp.dest(path.production.libs)) 
        .pipe(reload({stream: true})); //И перезагрузим наш сервер для обновлений
});

gulp.task('css-concat', function () {         
    return gulp.src([file.css[0], file.css[1], file.css[2], file.css[3], file.css[4], file.css[5], file.css[6], file.css[7] ])
        .pipe(concat(concatConfig.file))        
        .pipe(gulp.dest('.create/tmp'))
});
                     
gulp.task('css-build', function () {
  return gulp.src(path.create.tmp)    
        .pipe(gulp.dest(path.create.dirStyle))
        .pipe(gulp.dest(path.production.style))
        .pipe(reload({stream: true}));  
});

gulp.task('css',function(callback){
    gulpSequence('css-concat','css-build', callback);
})


gulp.task('uploads:build', function () {
    gulp.src(path.create.uploads) //Выберем наши картинки
        .pipe(imagemin({ //Сожмем их
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.production.uploads)) //И бросим в production       
});

gulp.task('libs:build', function () {
    gulp.src(path.create.libs) //Выберем наши библиотеки        
        .pipe(gulp.dest(path.production.libs)) //И бросим в production 
		.pipe(reload({stream: true}));  
});

gulp.task('fonts:build', function () {
    gulp.src(path.create.fonts) //Выберем наши шрифты        
        .pipe(gulp.dest(path.production.fonts)) //И бросим в production 
});

gulp.task('build', [
    'html:build',         
    'uploads:build',
    'js:build',
    'fonts:build',    
    'libs:build'
]);

gulp.task('build-clean', function() {
    // Return the Promise from del()
    return del([BUILD_DIRECTORY]); //   This is the key here, to make sure asynchronous tasks are done!
});

gulp.task('css:build',function(callback){
    gulpSequence('css-concat','css-build', callback);
})

gulp.task('webserver', function () {
    browserSync(config.server);
    //browserSync(config.client);
});

gulp.task('watch', function(){  
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });   
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.libs], function(event, cb) {
        gulp.start('libs:build');
    });
    watch([path.watch.image], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.uploads], function(event, cb) {
        gulp.start('uploads:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
    watch([path.watch.css], function(event, cb) {
        gulp.start('css:build');
    });   
});

gulp.task('default', ['build','watch', 'webserver', 'image:build','css', 'js:set' ]);
    
console.log("Gulpfile is updated");