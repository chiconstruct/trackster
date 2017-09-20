var gulp = require('gulp');
// Requries the gulp-sass plugin
var sass = require('gulp-sass');
var autoprefixer = require('autoprefixer');
var browserSync = require('browser-sync').create();
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var postcss = require('gulp-postcss');
var twig = require('gulp-twig');

/*** Variables ***/
var htmlDir = 'app/html';
var allHTMLFiles = htmlDir + '/**/*.html';

/* destination */
var distributeDir = 'dist/';
var destCssVendorFile = 'vendor.css';

/** css config **/
var cssConfig = {
  sourceFiles: './app/css/**/*.css',
  destinationDir: distributeDir + "/css"
}

/** scss config **/
var scssConfig = {
  sourceFiles: './app/scss/**/*.scss',
  allFile: './app/scss/all.scss',
  destinationDir: distributeDir + "/css",
  destinationFiles: "all.css"
}

/* vendor scss */
var vendorRootDir = 'node_modules/';
var vendorCSSDirs = [
  vendorRootDir + 'html5-reset/assets/css/reset.css',
  vendorRootDir + 'lity/dist/lity.css',
  vendorRootDir + 'slick-carousel/slick/slick.scss'
];

/** images **/
var imagesConfig = {
  sourceFiles: './app/images/**/*',
  destinationDir: distributeDir + '/images'
}

/** fonts **/
var fontsConfig = {
  sourceFiles: './app/fonts/**/*',
  destinationDir: distributeDir + '/fonts'
}

/*** javascript config ***/
/* internal js */
var jsFolder = 'app/js';
var javascriptConfig = {
  sourceFiles: jsFolder + '/*.js',
  destinationDir: distributeDir + "/js",
  compiledFileName: 'all.js',
  destinationFiles: distributeDir + '/js/all.js'
}

/* Twig */
var twigConfig = {
  source:  htmlDir + '/*.html',
  destination: distributeDir
};


var compiledHTMLPages = distributeDir + '/*.html';


/* Settings */
var siteProxy = "match-game.dev"

/****** GR-Tasks ***/
// for build
gulp.task('default', ['css', 'sass', 'sass-vendor', 'js', 'images', 'fonts', 'templates'])

// for developement
gulp.task('watch', ['default'], function() {
  browserSync.init(null, {
    proxy: 'http://' + siteProxy,
    host: siteProxy,
    browser: process.platform === 'linux' ? 'google-chrome' : 'google chrome',
    open: 'external'
  });
  gulp.watch(cssConfig.sourceFiles, ['css']);
  gulp.watch(scssConfig.sourceFiles, ['sass']);
  gulp.watch(javascriptConfig.sourceFiles, ['js']);
  // rebuild templates
  gulp.watch(allHTMLFiles).on('change', function() {
    gulp.watch(allHTMLFiles, ['templates']);
  });
  // then reload browserSync
  gulp.watch(compiledHTMLPages).on('change', browserSync.reload);
});

/*** Function ***/
gulp.task('css', function() {
  return gulp.src(cssConfig.sourceFiles)
  .pipe(gulp.dest(cssConfig.destinationDir))
  .pipe(browserSync.stream({match: '**/*.css'}));
});

gulp.task('sass', function() {
  return gulp.src(scssConfig.allFile)
    .pipe(concat(scssConfig.destinationFiles))
    .pipe(postcss([ autoprefixer() ]))
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError)) // Using gulp-sass
    .pipe(gulp.dest(scssConfig.destinationDir))
    .pipe(browserSync.stream({match: '**/*.css'}));
});

gulp.task('sass-vendor', function(){
  return gulp.src(vendorCSSDirs)
    .pipe(concat(destCssVendorFile))
    .pipe(postcss([ autoprefixer() ]))
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest(scssConfig.destinationDir))
    .pipe(browserSync.stream({ match: '**/*.css' }))
});

gulp.task('js', function() {
  return gulp.src(javascriptConfig.sourceFiles)
    .pipe(gulp.dest(javascriptConfig.destinationDir))
    .pipe(browserSync.stream({match: '**/*.js' }));
});

gulp.task('images', function() {
  return gulp.src(imagesConfig.sourceFiles)
      .pipe(gulp.dest(imagesConfig.destinationDir));
});

gulp.task('fonts', function() {
  return gulp.src(fontsConfig.sourceFiles)
    .pipe(gulp.dest(fontsConfig.destinationDir));
});

// Compile Twig templates to HTML
gulp.task('templates', function() {
    return gulp.src(twigConfig.source) // run the Twig template parser on all .html files in the "src" directory
        .pipe(twig())
        .pipe(gulp.dest(twigConfig.destination)); // output the rendered HTML files to the "dist" directory
});
