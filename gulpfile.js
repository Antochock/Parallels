let project_folder = require('path').basename(__dirname)  // Compiled folder = Project name
let source_folder = "src"  // Folder for developer
let {src, dest} = require('gulp'),
    gulp = require('gulp'),
    fs = require('fs'),
    browsersync = require('browser-sync').create(), //refresh browser
    fileinclude = require('gulp-file-include'), //compile all file in 1
    del = require('del'), //delete
    scss = require('gulp-sass'), //scss plugin
    autoprefixer = require('gulp-autoprefixer'), //add cross-browser prefix in css
    group_media = require('gulp-group-css-media-queries'), // compile all media at the end of css file
    clean_css = require('gulp-clean-css'), // clean css, delete all space
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify-es').default, // clean js, delete all space
    imagemin = require('gulp-imagemin'), // compress image => faster web site
    webp = require('gulp-webp'), // convert other img format => webp format
    webphtml = require('gulp-webp-html'), // adding html for webp and img for different browser
    webpcss = require('gulp-webpcss'), // adding css for webp and img for different browser
    svgSprite = require('gulp-svg-sprite'), // convert svg files to sprite
    ttf2woff = require('gulp-ttf2woff'), // convert fonts 2 woff
    ttf2woff2 = require('gulp-ttf2woff2'), // convert fonts 2 woff2
    fonter = require('gulp-fonter'); // convert otf 2 woff

//Variable for all project path

let path={
	build:{  // Where build result
		html: project_folder + "/",
		css: project_folder + "/style/",
		js: project_folder + "/scripts/",
		images: project_folder + "/images/",
		fonts: project_folder + "/fonts/",
	},
	src: {  // What build
		html: [source_folder + "/**/*.html", "!" + source_folder + "/**/_*.html" ],
		css: source_folder + "/scss/style.scss",
		js: source_folder + "/scripts/script.js",
		images: source_folder + "/images/**/*.{jpg,png,ico,svg,gif,webp}",
		fonts: source_folder + "/fonts/*.ttf",
	},
	watch: { //What changes translate
		html: source_folder + "/**/*.html",
		css: source_folder + "/scss/**/*.scss",
		js: source_folder + "/scripts/**/*.js",
		images: source_folder + "/images/**/*.{jpg,png,ico,svg,gif,webp}",
		fonts: source_folder + "/fonts/*.ttf",
	},
	clean: "./" + project_folder + "/", // delete old build folder
}


function browserSync(){  //refreshing browser
	browsersync.init({
		server:{baseDir: "./" + project_folder + "/"},
		port: 3000,
		notify: false,
	})
}


function html(){ 
	return src(path.src.html)
	.pipe(fileinclude()) //Collects all files into one
	.pipe(webphtml()) // Adds code for webp
	.pipe(dest(path.build.html)) //Build HTML
	.pipe(browsersync.stream())
}

function css(){
	return src(path.src.css)
	.pipe( //sass plugin
		scss({
			outputStyle: "expanded"
		}))
	.pipe(group_media()) //group madia queries at the end
	.pipe(
		autoprefixer({  // add cross-browser prefixes
			overrideBrowserslist: ["last 5 versions"],
			cascade: true,
		}))
	.pipe(webpcss()) // Adds code for webp
	.pipe(dest(path.build.css)) //Build css
	.pipe(clean_css()) // compress css code
	.pipe(rename({  // rename compress css file
		extname: ".min.css"
	}))
	.pipe(dest(path.build.css)) // build compress css file 
	.pipe(browsersync.stream())
}

function script(){
	return src(path.src.js)
	.pipe(fileinclude()) //Collects all files into one
	.pipe(dest(path.build.js)) //Build JS
	.pipe(uglify()) // compress JS code
	.pipe(rename({  // rename compress JS file
		extname: ".min.js"
	}))
	.pipe(dest(path.build.js)) // build compress JS file 
	.pipe(browsersync.stream())
}

function img(){
	return src(path.src.images)
	.pipe(webp({ //convert img to webp
		quality: 70,
	}))
	.pipe(dest(path.build.images)) //build img
	.pipe(src(path.src.images))
	.pipe(imagemin({  //compress image
		progressive: true,
		svgoPlugins: [{removeViewBox: false}],
		interlaced: true,
		optimizationLevel: 3,
	}))
	.pipe(dest(path.build.images)) //build compressed img
	.pipe(browsersync.stream())
}

function fonts(){
	src(path.src.fonts)
	.pipe(ttf2woff()) //convert to woff
	.pipe(dest(path.build.fonts)); //build converted fonts
	return src(path.src.fonts)
	.pipe(ttf2woff2()) //convert to woff2
	.pipe(dest(path.build.fonts)); //build converted fonts
}


//task for converting *.otf to *.ttf.  USE  "gulp otf2ttf" in console

gulp.task('otf2ttf', function(){ 
	return gulp.src([source_folder + "/fonts/*.otf"])
	.pipe(fonter({
		formats: ['ttf']
	}))
	.pipe(dest(source_folder + "/fonts/"));
})



//task for converting *.svg to one *.svg  sprite.  USE  "gulp svgSprite" in console


gulp.task('svgSprite', function(){ 
	return gulp.src([source_folder + "/iconsprite/*.svg"])
	.pipe(svgSprite({
		mode: {
			stack: {
				sprite: "../icons/icons.svg",
				example: true,
			}
		},
	}))
	.pipe(dest(path.build.images))
})



//Import all fonts in fonts.scss

function cb(){

}

function fontsStyle() {

	let file_content = fs.readFileSync(source_folder + '/scss/fonts.scss');
	if (file_content == '') {
		fs.writeFile(source_folder + '/scss/fonts.scss', '', cb);
		return fs.readdir(path.build.fonts, function (err, items) {
		if (items) {
		let c_fontname;
	for (var i = 0; i < items.length; i++) {
		let fontname = items[i].split('.');
		fontname = fontname[0];
		if (c_fontname != fontname) {
		fs.appendFile(source_folder + '/scss/fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
	}
	c_fontname = fontname;
	}}})}}

function cb() { }



// Function for watching changes in files online

function watchFiles(){
	gulp.watch([path.watch.html], html);
	gulp.watch([path.watch.css], css);
	gulp.watch([path.watch.js], script);
	gulp.watch([path.watch.images], img);
}


// delete folder with older build

function clean(){
	return del(path.clean);
}



// start of gulp
let build = gulp.series(clean, gulp.parallel(css, html, script, img, fonts), fontsStyle);
let watch = gulp.parallel(build, watchFiles, browserSync);


// exports variable for gulp works

exports.fontsStyle= fontsStyle;
exports.fonts = fonts;
exports.img = img;
exports.script = script;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;
